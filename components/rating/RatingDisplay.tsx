import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { UserRating, UserRatingStats } from '../../types';

interface RatingDisplayProps {
  ratedUserId: string;
  limit?: number;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({ ratedUserId, limit = 5 }) => {
  const [stats, setStats] = useState<UserRatingStats | null>(null);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [{ data: s }, { data: r }] = await Promise.all([
          supabase.from('user_rating_stats').select('*').eq('rated_user_id', ratedUserId).maybeSingle(),
          supabase.from('user_ratings').select('*').eq('rated_user_id', ratedUserId).eq('is_public', true).order('created_at', { ascending: false }).limit(limit)
        ]);
        setStats(s as any || null);
        setRatings((r as any) || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ratedUserId, limit]);

  if (loading) {
    return <div className="text-sm text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="text-yellow-400 text-xl">★</div>
        <div className="text-sm text-gray-900">
          Ortalama: <span className="font-semibold">{stats?.rating_avg ?? '-'} / 5</span>
          <span className="text-gray-500"> · {stats?.rating_count ?? 0} oy</span>
        </div>
      </div>
      <div className="space-y-2">
        {ratings.map((r) => (
          <div key={r.id} className="border rounded p-3">
            <div className="flex items-center text-sm text-gray-700">
              <span className="text-yellow-400 mr-1">{'★'.repeat(r.rating)}</span>
              <span className="text-gray-300">{'★'.repeat(5 - r.rating)}</span>
              <span className="ml-2 text-gray-500">{new Date(r.created_at).toLocaleDateString('tr-TR')}</span>
            </div>
            {r.review && (
              <div className="mt-1 text-sm text-gray-900">{r.review}</div>
            )}
          </div>
        ))}
        {ratings.length === 0 && (
          <div className="text-sm text-gray-500">Henüz değerlendirme yok.</div>
        )}
      </div>
    </div>
  );
};

export default RatingDisplay;


