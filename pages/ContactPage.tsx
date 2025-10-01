import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import Container from '../components/ui/Container.tsx';
import { Mail } from 'lucide-react';

const ContactPage: React.FC = () => {
    const { t } = useAppContext();

    return (
        <Container>
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-brand-gray-600 mb-4">{t('contactTitle')}</h1>
                <p className="text-lg text-brand-gray-500 mb-8">
                    {t('contactIntro')}
                </p>
                <div className="bg-white p-8 rounded-lg shadow-md inline-flex items-center space-x-3">
                    <Mail className="w-6 h-6 text-brand-blue"/>
                    <a href={`mailto:${t('contactEmail')}`} className="text-xl font-semibold text-brand-blue hover:underline">
                        {t('contactEmail')}
                    </a>
                </div>
            </div>
        </Container>
    );
};

export default ContactPage;
