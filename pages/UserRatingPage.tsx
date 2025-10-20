import React from 'react';
import Container from '../components/ui/Container';
import { useAppContext } from '../contexts/AppContext';
import { UserRatingCard } from '../components/rating/UserRatingCard';

const UserRatingPage: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return (
      <Container>
        <div className="py-12 text-center text-gray-600">Lütfen giriş yapın.</div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-4">Kullanıcı Değerlendirme</h1>
        <p className="text-gray-600 mb-6">Diğer kullanıcıları değerlendirin ve aldığınız değerlendirmeleri görün.</p>

        <div className="grid grid-cols-1 gap-6">
          {/* Kendi profiliniz için gelen değerlendirmeler */}
          <UserRatingCard ratedUserId={currentUser.id} />
        </div>
      </div>
    </Container>
  );
};

export default UserRatingPage;


