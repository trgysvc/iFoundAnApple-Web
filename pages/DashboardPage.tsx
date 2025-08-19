import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { UserRole } from '../types';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import DeviceCard from '../components/DeviceCard';
import { PlusCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { currentUser, getUserDevices, t } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) {
    return null; // Or a loading spinner
  }

  const userDevices = getUserDevices(currentUser.id);

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-brand-gray-600">{t('myDevices')}</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button onClick={() => navigate('/add-device?type=lost')} className="w-full justify-center">
                <PlusCircle className="w-5 h-5 mr-2"/>
                {t('addLostDevice')}
            </Button>
            <Button onClick={() => navigate('/add-device?type=found')} variant="secondary" className="w-full justify-center">
                <PlusCircle className="w-5 h-5 mr-2"/>
                {t('reportFoundDevice')}
            </Button>
        </div>
      </div>
      
      {userDevices.length > 0 ? (
        <div className="space-y-4">
          {userDevices.sort((a,b) => b.id.localeCompare(a.id)).map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-brand-gray-300 rounded-xl">
            <h3 className="text-xl font-medium text-brand-gray-600">{t('noDevicesReported')}</h3>
            <p className="text-brand-gray-400 mt-2">Click one of the buttons above to get started.</p>
        </div>
      )}
    </Container>
  );
};

export default DashboardPage;