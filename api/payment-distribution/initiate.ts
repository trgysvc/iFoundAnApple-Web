import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      escrow_account_id,
      distribution_type = 'automatic'
    } = req.body;

    // Gerekli alanları kontrol et
    if (!escrow_account_id) {
      return res.status(400).json({ error: 'Missing escrow_account_id' });
    }

    // Database fonksiyonunu çağır
    const { data, error } = await supabase.rpc('initiate_payment_distribution', {
      p_escrow_account_id: escrow_account_id,
      p_distribution_type: distribution_type
    });

    if (error) {
      console.error('Error initiating payment distribution:', error);
      return res.status(500).json({ error: 'Failed to initiate payment distribution' });
    }

    return res.status(200).json({
      success: true,
      distribution_id: data,
      message: 'Payment distribution initiated successfully'
    });

  } catch (error) {
    console.error('Error in initiate payment distribution API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


