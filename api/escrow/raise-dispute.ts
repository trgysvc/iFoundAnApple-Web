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
    if (!device_id || !payment_id || !cargo_shipment_id || !dispute_reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Database fonksiyonunu çağır
    const { data, error } = await supabase.rpc('raise_dispute', {
      p_device_id: device_id,
      p_payment_id: payment_id,
      p_cargo_shipment_id: cargo_shipment_id,
      p_confirmed_by: req.user?.id, // Auth'dan gelen user ID
      p_dispute_reason: dispute_reason,
      p_photos: photos || [],
      p_notes: notes || null
    });

    if (error) {
      console.error('Error raising dispute:', error);
      return res.status(500).json({ error: 'Failed to raise dispute' });
    }

    return res.status(200).json({
      success: true,
      confirmation_id: data,
      message: 'Dispute raised successfully'
    });

  } catch (error) {
    console.error('Error in raise dispute API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


