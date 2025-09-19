import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';
import { sanitizers } from '../utils/security';

const TermsPage: React.FC = () => {
    const { t } = useAppContext();
    const content = t('termsContent');

    return (
        <Container>
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-brand-gray-600 mb-8">{t('termsTitle')}</h1>
                <div 
                    className="prose max-w-none text-brand-gray-600"
                    dangerouslySetInnerHTML={{ __html: sanitizers.html(content) }}
                />
            </div>
        </Container>
    );
};

export default TermsPage;
