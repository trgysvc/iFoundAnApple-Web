import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { disputeId } = req.query;
    const { status, admin_notes, resolution } = req.body;

    if (!disputeId || !status || !admin_notes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get admin user from session (you'll need to implement proper auth)
    const adminUserId = req.headers['user-id'] as string; // Mock - implement proper auth
    if (!adminUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Check if user has admin permissions

    // Update escrow account with resolution
    const { data: escrowData, error: escrowError } = await supabase
      .from('escrow_accounts')
      .update({
        dispute_status: status,
        admin_notes: admin_notes,
        resolution_method: status === 'resolved' ? resolution : null,
        resolution_notes: resolution || null,
        activity_log: supabase.raw(`
          activity_log || '[{"action": "dispute_resolved", "timestamp": "${new Date().toISOString()}", "admin_id": "${adminUserId}", "status": "${status}", "description": "Dispute resolved by admin"}]'::jsonb
        `),
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId)
      .select()
      .single();

    if (escrowError) {
      console.error('Error updating escrow dispute resolution:', escrowError);
      return res.status(500).json({ error: 'Failed to resolve dispute' });
    }

    // Update payment with resolution
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        dispute_status: status,
        dispute_reason: status === 'resolved' ? null : escrowData.dispute_reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', escrowData.payment_id);

    if (paymentError) {
      console.error('Error updating payment dispute resolution:', paymentError);
      return res.status(500).json({ error: 'Failed to update payment dispute status' });
    }

    // Create audit log
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'dispute_resolved',
        event_category: 'dispute',
        event_action: 'update',
        event_severity: 'medium',
        user_id: adminUserId,
        resource_type: 'dispute',
        resource_id: disputeId as string,
        parent_resource_type: 'escrow_account',
        parent_resource_id: disputeId as string,
        event_description: `Dispute resolved by admin: ${status}`,
        event_data: {
          dispute_id: disputeId,
          resolution_status: status,
          admin_notes: admin_notes,
          resolution: resolution
        }
      });

    // If dispute is resolved, you might want to trigger escrow release
    if (status === 'resolved') {
      // TODO: Implement automatic escrow release logic
      console.log('Dispute resolved - escrow release should be considered');
    }

    return res.status(200).json({
      success: true,
      message: 'Dispute resolved successfully'
    });

  } catch (error) {
    console.error('Error in dispute resolution API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
