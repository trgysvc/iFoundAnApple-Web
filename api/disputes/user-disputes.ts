import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from session (you'll need to implement proper auth)
    const userId = req.headers['user-id'] as string; // Mock - implement proper auth
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's disputes from escrow_accounts
    const { data: disputes, error } = await supabase
      .from('escrow_accounts')
      .select(`
        id,
        device_id,
        payment_id,
        dispute_status,
        dispute_reason,
        resolution_notes,
        admin_notes,
        resolution_method,
        created_at,
        updated_at,
        last_activity_at,
        devices!inner(
          model,
          serialNumber,
          status
        ),
        payments!inner(
          total_amount,
          reward_amount,
          payment_status
        )
      `)
      .or(`holder_user_id.eq.${userId},beneficiary_user_id.eq.${userId}`)
      .not('dispute_status', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user disputes:', error);
      return res.status(500).json({ error: 'Failed to fetch disputes' });
    }

    // Transform data for frontend
    const transformedDisputes = disputes.map(dispute => ({
      id: dispute.id,
      device_id: dispute.device_id,
      payment_id: dispute.payment_id,
      dispute_reason: dispute.dispute_reason,
      status: dispute.dispute_status,
      created_at: dispute.created_at,
      updated_at: dispute.updated_at,
      admin_notes: dispute.admin_notes,
      resolution: dispute.resolution_method,
      photos: [], // TODO: Implement photo storage
      notes: dispute.resolution_notes,
      device_model: dispute.devices?.model,
      device_serial: dispute.devices?.serialNumber
    }));

    return res.status(200).json({
      success: true,
      disputes: transformedDisputes
    });

  } catch (error) {
    console.error('Error in user disputes API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
