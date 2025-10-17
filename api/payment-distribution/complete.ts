import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { distribution_id } = req.body;

    // Gerekli alanları kontrol et
    if (!distribution_id) {
      return res.status(400).json({ error: 'Missing distribution_id' });
    }

    // Database fonksiyonunu çağır
    const { data, error } = await supabase.rpc('complete_payment_distribution', {
      p_distribution_id: distribution_id
    });

    if (error) {
      console.error('Error completing payment distribution:', error);
      return res.status(500).json({ error: 'Failed to complete payment distribution' });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment distribution completed successfully'
    });

  } catch (error) {
    console.error('Error in complete payment distribution API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


