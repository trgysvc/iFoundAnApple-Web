import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Otomatik ödeme dağıtımı fonksiyonunu çalıştır
    const { data: processedCount, error: processError } = await supabase.rpc('auto_distribute_payments');

    if (processError) {
      console.error('Error running auto distribute payments:', processError);
      return res.status(500).json({ error: 'Failed to run auto distribute payments' });
    }

    // Dağıtım istatistiklerini sorgula
    const { data: statsData, error: statsError } = await supabase
      .from('final_payment_distributions')
      .select('status, distribution_type, created_at, processed_at');

    if (statsError) {
      console.error('Error fetching distribution stats:', statsError);
      return res.status(500).json({ error: 'Failed to fetch distribution stats' });
    }

    // İstatistikleri hesapla
    const total_distributions = statsData.length;
    const pending_distributions = statsData.filter(d => d.status === 'pending').length;
    const completed_distributions = statsData.filter(d => d.status === 'completed').length;
    const failed_distributions = statsData.filter(d => d.status === 'failed').length;
    const automatic_distributions = statsData.filter(d => d.distribution_type === 'automatic').length;
    const manual_distributions = statsData.filter(d => d.distribution_type === 'manual').length;

    // Son işlem tarihlerini bul
    const lastProcessed = statsData
      .filter(d => d.processed_at)
      .sort((a, b) => new Date(b.processed_at).getTime() - new Date(a.processed_at).getTime())[0];

    return res.status(200).json({
      success: true,
      auto_distribution_status: {
        processed_count: processedCount || 0,
        total_distributions,
        pending_distributions,
        completed_distributions,
        failed_distributions,
        automatic_distributions,
        manual_distributions,
        last_processed: lastProcessed?.processed_at || null
      }
    });

  } catch (error) {
    console.error('Error in auto distribution status API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


