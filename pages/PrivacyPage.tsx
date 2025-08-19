import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';

const PrivacyPage: React.FC = () => {
    const { t } = useAppContext();
    const content = t('privacyContent');

    return (
        <Container>
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-brand-gray-600 mb-8">{t('privacyTitle')}</h1>
                <div 
                    className="prose max-w-none text-brand-gray-600"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </Container>
    );
};

export default PrivacyPage;
