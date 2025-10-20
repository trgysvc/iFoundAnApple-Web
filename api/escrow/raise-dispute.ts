import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      device_id,
      payment_id,
      cargo_shipment_id,
      dispute_reason,
      photos,
      notes
    } = req.body;

    // Gerekli alanları kontrol et
    if (!device_id || !payment_id || !dispute_reason || !notes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user from session (you'll need to implement proper auth)
    const userId = req.headers['user-id'] as string; // Mock - implement proper auth
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Update escrow_accounts table - mevcut sistemle uyumlu
    const { data: escrowData, error: escrowError } = await supabase
      .from('escrow_accounts')
      .update({
        dispute_status: 'pending',
        dispute_reason: dispute_reason,
        resolution_notes: notes,
        activity_log: supabase.raw(`
          activity_log || '[{"action": "dispute_raised", "timestamp": "${new Date().toISOString()}", "user_id": "${userId}", "description": "Dispute raised: ${dispute_reason}"}]'::jsonb
        `),
        last_activity_at: new Date().toISOString()
      })
      .eq('device_id', device_id)
      .eq('payment_id', payment_id)
      .select()
      .single();

    if (escrowError) {
      console.error('Error updating escrow with dispute:', escrowError);
      return res.status(500).json({ error: 'Failed to raise dispute' });
    }

    // Create dispute record in payments table
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .update({
        dispute_status: 'pending',
        dispute_reason: dispute_reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment_id)
      .select()
      .single();

    if (paymentError) {
      console.error('Error updating payment with dispute:', paymentError);
      return res.status(500).json({ error: 'Failed to raise dispute' });
    }

    // Create audit log
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'dispute_raised',
        event_category: 'dispute',
        event_action: 'create',
        event_severity: 'medium',
        user_id: userId,
        resource_type: 'dispute',
        resource_id: escrowData.id,
        parent_resource_type: 'escrow_account',
        parent_resource_id: escrowData.id,
        event_description: `Dispute raised for device ${device_id}: ${dispute_reason}`,
        event_data: {
          device_id,
          payment_id,
          cargo_shipment_id,
          dispute_reason,
          photos_count: photos?.length || 0,
          notes_length: notes.length
        }
      });

    return res.status(200).json({
      success: true,
      dispute_id: escrowData.id,
      message: 'Dispute raised successfully'
    });

  } catch (error) {
    console.error('Error in raise dispute API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


