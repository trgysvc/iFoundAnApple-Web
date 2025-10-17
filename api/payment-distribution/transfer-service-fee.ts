import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      distribution_id,
      transfer_method = 'bank_transfer'
    } = req.body;

    // Gerekli alanları kontrol et
    if (!distribution_id) {
      return res.status(400).json({ error: 'Missing distribution_id' });
    }

    // Database fonksiyonunu çağır
    const { data, error } = await supabase.rpc('transfer_service_fee', {
      p_distribution_id: distribution_id,
      p_transfer_method: transfer_method
    });

    if (error) {
      console.error('Error transferring service fee:', error);
      return res.status(500).json({ error: 'Failed to transfer service fee' });
    }

    return res.status(200).json({
      success: true,
      message: 'Service fee transferred successfully'
    });

  } catch (error) {
    console.error('Error in transfer service fee API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


