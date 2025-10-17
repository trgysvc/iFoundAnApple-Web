import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { distribution_id } = req.query;

    if (!distribution_id || typeof distribution_id !== 'string') {
      return res.status(400).json({ error: 'Missing distribution_id parameter' });
    }

    // Dağıtım bilgilerini sorgula
    const { data: distributionData, error: distributionError } = await supabase
      .from('final_payment_distributions')
      .select(`
        id,
        device_id,
        payment_id,
        escrow_account_id,
        gross_amount,
        net_amount,
        cargo_fee,
        reward_amount,
        service_fee,
        status,
        distribution_type,
        processed_at,
        failed_reason,
        created_at,
        updated_at
      `)
      .eq('id', distribution_id)
      .single();

    if (distributionError) {
      console.error('Error fetching distribution:', distributionError);
      return res.status(404).json({ error: 'Distribution not found' });
    }

    // Transfer bilgilerini sorgula
    const { data: transfersData, error: transfersError } = await supabase
      .from('payment_transfers')
      .select(`
        id,
        transfer_type,
        recipient_type,
        recipient_name,
        amount,
        transfer_method,
        transfer_reference,
        status,
        processed_at,
        failed_reason,
        notes,
        created_at
      `)
      .eq('distribution_id', distribution_id)
      .order('created_at', { ascending: true });

    if (transfersError) {
      console.error('Error fetching transfers:', transfersError);
    }

    // Device bilgilerini sorgula
    const { data: deviceData, error: deviceError } = await supabase
      .from('devices')
      .select('model, serialNumber, color, status')
      .eq('id', distributionData.device_id)
      .single();

    if (deviceError) {
      console.error('Error fetching device:', deviceError);
    }

    return res.status(200).json({
      success: true,
      distribution: distributionData,
      transfers: transfersData || [],
      device: deviceData || null
    });

  } catch (error) {
    console.error('Error in payment distribution status API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


