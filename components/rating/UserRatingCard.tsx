import React from 'react';
import { RatingDisplay } from './RatingDisplay';
import { RatingForm } from './RatingForm';

interface UserRatingCardProps {
  ratedUserId: string;
}

export const UserRatingCard: React.FC<UserRatingCardProps> = ({ ratedUserId }) => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Kullanıcı Değerlendirmeleri</h3>
      <div className="mb-4">
        <RatingDisplay key={`display-${refreshKey}`} ratedUserId={ratedUserId} />
      </div>
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Değerlendir</h4>
        <RatingForm ratedUserId={ratedUserId} onSubmitted={() => setRefreshKey(k => k + 1)} />
      </div>
    </div>
  );
};

export default UserRatingCard;


