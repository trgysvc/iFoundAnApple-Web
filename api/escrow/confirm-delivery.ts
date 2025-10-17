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
      photos,
      notes
    } = req.body;

    // Gerekli alanları kontrol et
    if (!device_id || !payment_id || !cargo_shipment_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Database fonksiyonunu çağır
    const { data, error } = await supabase.rpc('confirm_device_delivery', {
      p_device_id: device_id,
      p_payment_id: payment_id,
      p_cargo_shipment_id: cargo_shipment_id,
      p_confirmed_by: req.user?.id, // Auth'dan gelen user ID
      p_photos: photos || [],
      p_notes: notes || null
    });

    if (error) {
      console.error('Error confirming device delivery:', error);
      return res.status(500).json({ error: 'Failed to confirm device delivery' });
    }

    return res.status(200).json({
      success: true,
      confirmation_id: data,
      message: 'Device delivery confirmed successfully'
    });

  } catch (error) {
    console.error('Error in confirm delivery API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


