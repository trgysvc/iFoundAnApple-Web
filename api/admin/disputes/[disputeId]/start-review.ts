import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { disputeId } = req.query;

    if (!disputeId) {
      return res.status(400).json({ error: 'Missing dispute ID' });
    }

    // Get admin user from session (you'll need to implement proper auth)
    const adminUserId = req.headers['user-id'] as string; // Mock - implement proper auth
    if (!adminUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Check if user has admin permissions

    // Update escrow account status to under_review
    const { data: escrowData, error: escrowError } = await supabase
      .from('escrow_accounts')
      .update({
        dispute_status: 'under_review',
        activity_log: supabase.raw(`
          activity_log || '[{"action": "dispute_review_started", "timestamp": "${new Date().toISOString()}", "admin_id": "${adminUserId}", "description": "Dispute review started by admin"}]'::jsonb
        `),
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId)
      .select()
      .single();

    if (escrowError) {
      console.error('Error updating escrow dispute status:', escrowError);
      return res.status(500).json({ error: 'Failed to start dispute review' });
    }

    // Update payment status
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        dispute_status: 'under_review',
        updated_at: new Date().toISOString()
      })
      .eq('id', escrowData.payment_id);

    if (paymentError) {
      console.error('Error updating payment dispute status:', paymentError);
      return res.status(500).json({ error: 'Failed to update payment dispute status' });
    }

    // Create audit log
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'dispute_review_started',
        event_category: 'dispute',
        event_action: 'update',
        event_severity: 'low',
        user_id: adminUserId,
        resource_type: 'dispute',
        resource_id: disputeId as string,
        parent_resource_type: 'escrow_account',
        parent_resource_id: disputeId as string,
        event_description: `Dispute review started by admin`,
        event_data: {
          dispute_id: disputeId,
          previous_status: 'pending',
          new_status: 'under_review'
        }
      });

    return res.status(200).json({
      success: true,
      message: 'Dispute review started successfully'
    });

  } catch (error) {
    console.error('Error in start dispute review API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
