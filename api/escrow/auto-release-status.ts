import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Otomatik serbest bırakma fonksiyonunu çalıştır
    const { data: releasedCount, error: releaseError } = await supabase.rpc('auto_release_escrow');

    if (releaseError) {
      console.error('Error running auto release:', releaseError);
      return res.status(500).json({ error: 'Failed to run auto release' });
    }

    // Emanet istatistiklerini sorgula
    const { data: statsData, error: statsError } = await supabase
      .from('escrow_accounts')
      .select('status, held_at, released_at')
      .eq('status', 'held');

    if (statsError) {
      console.error('Error fetching escrow stats:', statsError);
      return res.status(500).json({ error: 'Failed to fetch escrow stats' });
    }

    // İstatistikleri hesapla
    const total_held = statsData.length;
    const auto_release_pending = statsData.filter(escrow => 
      escrow.release_conditions?.device_received === true
    ).length;

    // En yakın otomatik serbest bırakma zamanını bul
    let next_auto_release = null;
    if (auto_release_pending > 0) {
      const nextReleaseTimes = statsData
        .filter(escrow => escrow.release_conditions?.device_received === true)
        .map(escrow => {
          const heldAt = new Date(escrow.held_at);
          const autoReleaseHours = escrow.release_conditions?.auto_release_hours || 48;
          return new Date(heldAt.getTime() + (autoReleaseHours * 60 * 60 * 1000));
        })
        .filter(time => time > new Date())
        .sort((a, b) => a.getTime() - b.getTime());

      if (nextReleaseTimes.length > 0) {
        next_auto_release = nextReleaseTimes[0];
      }
    }

    // Son otomatik serbest bırakma zamanını bul
    const { data: lastReleaseData, error: lastReleaseError } = await supabase
      .from('escrow_accounts')
      .select('released_at')
      .eq('status', 'released')
      .eq('release_reason', 'auto_release_48_hours')
      .order('released_at', { ascending: false })
      .limit(1)
      .single();

    const last_auto_release = lastReleaseData?.released_at || null;

    return res.status(200).json({
      success: true,
      auto_release_status: {
        total_held,
        auto_release_pending,
        next_auto_release: next_auto_release,
        last_auto_release,
        released_count: releasedCount || 0
      }
    });

  } catch (error) {
    console.error('Error in auto release status API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


