import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      escrow_account_id,
      release_reason
    } = req.body;

    // Gerekli alanları kontrol et
    if (!escrow_account_id) {
      return res.status(400).json({ error: 'Missing escrow_account_id' });
    }

    // Admin kontrolü (isteğe bağlı)
    // if (!req.user?.role === 'admin') {
    //   return res.status(403).json({ error: 'Admin access required' });
    // }

    // Database fonksiyonunu çağır
    const { data, error } = await supabase.rpc('manual_release_escrow', {
      p_escrow_account_id: escrow_account_id,
      p_release_reason: release_reason || 'manual_release'
    });

    if (error) {
      console.error('Error manually releasing escrow:', error);
      return res.status(500).json({ error: 'Failed to manually release escrow' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Escrow account not found or already released' });
    }

    return res.status(200).json({
      success: true,
      message: 'Escrow released successfully'
    });

  } catch (error) {
    console.error('Error in manual release API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


