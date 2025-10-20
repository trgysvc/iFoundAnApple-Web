import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { RatingContext } from '../../types';

interface RatingFormProps {
  ratedUserId: string;
  context?: RatingContext;
  deviceId?: string;
  paymentId?: string;
  disputeId?: string;
  onSubmitted?: () => void;
}

const Star: React.FC<{ filled: boolean; onClick: () => void }> = ({ filled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-2xl ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    aria-label={filled ? 'filled' : 'empty'}
  >
    ★
  </button>
);

export const RatingForm: React.FC<RatingFormProps> = ({
  ratedUserId,
  context = 'general',
  deviceId,
  paymentId,
  disputeId,
  onSubmitted
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hover, setHover] = useState<number | null>(null);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // rater_user_id sunucu tarafında RLS ile auth.uid() kontrolü var; client'tan göndermiyoruz
      const { error: insertError } = await supabase
        .from('user_ratings')
        .insert({
          rated_user_id: ratedUserId,
          rating,
          review: review?.trim() || null,
          context,
          device_id: deviceId || null,
          payment_id: paymentId || null,
          dispute_id: disputeId || null,
          is_public: true
        });
      if (insertError) throw insertError;
      setReview('');
      setRating(5);
      onSubmitted?.();
    } catch (err: any) {
      console.error('Failed to submit rating:', err);
      setError(err?.message || 'Değerlendirme gönderilemedi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Puanınız</label>
        <div className="flex items-center space-x-1" onMouseLeave={() => setHover(null)}>
          {[1,2,3,4,5].map((s) => (
            <div key={s} onMouseEnter={() => setHover(s)}>
              <Star filled={(hover ?? rating) >= s} onClick={() => setRating(s)} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Yorum (opsiyonel)</label>
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Deneyiminizi kısaca anlatın"
          rows={3}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Gönderiliyor...' : 'Değerlendir'}
        </Button>
      </div>
    </form>
  );
};

export default RatingForm;


