import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get admin user from session (you'll need to implement proper auth)
    const adminUserId = req.headers['user-id'] as string; // Mock - implement proper auth
    if (!adminUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // TODO: Check if user has admin permissions
    // const { data: adminPermission } = await supabase
    //   .from('admin_permissions')
    //   .select('role')
    //   .eq('user_id', adminUserId)
    //   .eq('is_active', true)
    //   .single();

    // Get all disputes from escrow_accounts
    const { data: disputes, error } = await supabase
      .from('escrow_accounts')
      .select(`
        id,
        device_id,
        payment_id,
        holder_user_id,
        beneficiary_user_id,
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
      .not('dispute_status', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin disputes:', error);
      return res.status(500).json({ error: 'Failed to fetch disputes' });
    }

    // Get user information for disputes
    const userIds = [...new Set([
      ...disputes.map(d => d.holder_user_id),
      ...disputes.map(d => d.beneficiary_user_id)
    ])];

    const { data: users } = await supabase
      .from('userprofile')
      .select('user_id, first_name, last_name')
      .in('user_id', userIds);

    const userMap = users?.reduce((acc, user) => {
      acc[user.user_id] = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      return acc;
    }, {} as Record<string, string>) || {};

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
      device_serial: dispute.devices?.serialNumber,
      user_email: '', // TODO: Get from auth.users
      user_name: userMap[dispute.holder_user_id] || 'Bilinmeyen Kullanıcı'
    }));

    return res.status(200).json({
      success: true,
      disputes: transformedDisputes
    });

  } catch (error) {
    console.error('Error in admin disputes API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
