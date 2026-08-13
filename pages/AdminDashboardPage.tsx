import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import Container from '../components/ui/Container.tsx';
import CargoOpsPanel from '../components/admin/CargoOpsPanel.tsx';

const AdminDashboardPage: React.FC = () => {
    const { t } = useAppContext();

    return (
        <Container>
            <h1 className="text-3xl font-bold text-brand-gray-600 mb-8">{t('adminDashboard')}</h1>

            <CargoOpsPanel />
        </Container>
    );
};

export default AdminDashboardPage;
