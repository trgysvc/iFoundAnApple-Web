
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { Lock, Shuffle, Award, CheckCircle } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-3">
            <div className="bg-brand-blue-light text-brand-blue p-3 rounded-full">{icon}</div>
            <h3 className="text-lg font-semibold text-brand-gray-600">{title}</h3>
        </div>
        <p className="text-brand-gray-500">{children}</p>
    </div>
);

const HomePage: React.FC = () => {
    const { t, currentUser } = useAppContext();
    const navigate = useNavigate();

    return (
        <>
            <Container className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-brand-gray-600 leading-tight">
                    {t('heroTitle')}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-500">
                    {t('heroSubtitle')}
                </p>
                <div className="mt-8">
                    <Button onClick={() => navigate(currentUser ? '/dashboard' : '/register')} size="lg">
                        {t('getStarted')}
                    </Button>
                </div>
            </Container>

            <div className="bg-white">
                <Container>
                    <h2 className="text-3xl font-bold text-center text-brand-gray-600 mb-12">
                        {t('howItWorks')}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon={<Lock className="w-6 h-6"/>} title={t('step1Title')}>
                            {t('step1Desc')}
                        </FeatureCard>
                        <FeatureCard icon={<Shuffle className="w-6 h-6"/>} title={t('step2Title')}>
                            {t('step2Desc')}
                        </FeatureCard>
                        <FeatureCard icon={<Award className="w-6 h-6"/>} title={t('step3Title')}>
                            {t('step3Desc')}
                        </FeatureCard>
                        <FeatureCard icon={<CheckCircle className="w-6 h-6"/>} title={t('step4Title')}>
                            {t('step4Desc')}
                        </FeatureCard>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default HomePage;
