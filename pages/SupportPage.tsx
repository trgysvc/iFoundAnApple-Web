import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import Container from '../components/ui/Container.tsx';
import { Mail, ChevronDown, BookOpen, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FaqItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-brand-gray-200 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left text-lg font-medium text-brand-gray-600 focus:outline-none"
            >
                <span>{question}</span>
                <ChevronDown className={`w-5 h-5 text-brand-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-3 text-brand-gray-500 animate-fadeIn">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

const SupportPage: React.FC = () => {
    const { t } = useAppContext();
    
    const supportFaqData = t('supportFAQContent') as unknown as { [key: string]: string };
    const siteFaqData = t('faqContent') as unknown as { [key: string]: string };
    
    const mapFaq = (data: { [key: string]: string }) => 
        Object.keys(data || {}).filter(key => key.startsWith('q')).map(qKey => ({
            question: data[qKey],
            answer: data[qKey.replace('q', 'a')]
        }));

    const questions = [...mapFaq(supportFaqData), ...mapFaq(siteFaqData)];

    const guideSteps = t('supportGuideSteps') as unknown as string[];

    return (
        <Container>
            <div className="max-w-4xl mx-auto space-y-16 py-8">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-brand-gray-600">{t('supportTitle')}</h1>
                    <p className="text-xl text-brand-gray-500 max-w-2xl mx-auto">
                        {t('supportIntro')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-brand-gray-100 space-y-6">
                        <div className="flex items-center space-x-3 text-brand-blue">
                            <Mail className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">{t('supportContactTitle')}</h2>
                        </div>
                        <p className="text-brand-gray-500">
                            {t('supportContactDesc')}
                        </p>
                        <div className="pt-4">
                            <h3 className="text-sm font-semibold text-brand-gray-400 uppercase tracking-wider mb-2">
                                {t('supportEmailLabel')}
                            </h3>
                            <a 
                                href={`mailto:${t('supportEmail')}`} 
                                className="text-2xl font-bold text-brand-blue hover:underline break-all"
                            >
                                {t('supportEmail')}
                            </a>
                        </div>
                    </section>

                    {/* User Guide Section */}
                    <section className="bg-brand-blue-light/30 p-8 rounded-2xl border border-brand-blue/10 space-y-6">
                        <div className="flex items-center space-x-3 text-brand-blue">
                            <BookOpen className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">{t('supportGuideTitle')}</h2>
                        </div>
                        <ul className="space-y-4">
                            {guideSteps?.map((step, index) => (
                                <li key={index} className="flex space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="text-brand-gray-600">{step}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 p-4 bg-white/50 rounded-xl border border-brand-blue/5">
                            <p className="text-sm text-brand-gray-500 italic">
                                {t('supportPrivacyNote')}
                            </p>
                        </div>
                    </section>
                </div>

                {/* FAQ Section */}
                <section className="space-y-8">
                    <div className="flex items-center space-x-3 text-brand-gray-600">
                        <HelpCircle className="w-6 h-6 text-brand-blue" />
                        <h2 className="text-3xl font-bold">{t('supportFAQTitle')}</h2>
                    </div>
                    <div className="bg-white px-8 py-2 rounded-2xl shadow-sm border border-brand-gray-100">
                        {questions.map((item, index) => (
                            <FaqItem key={index} question={item.question} answer={item.answer} />
                        ))}
                    </div>
                </section>

                {/* Legal Links Section */}
                <section className="pt-8 border-t border-brand-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <h2 className="text-xl font-bold text-brand-gray-600">{t('supportLegalLinksTitle')}</h2>
                        <div className="flex space-x-8">
                            <Link to="/terms" className="text-brand-blue hover:underline font-medium">
                                {t('termsLink')}
                            </Link>
                            <Link to="/privacy" className="text-brand-blue hover:underline font-medium">
                                {t('privacyLink')}
                            </Link>
                        </div>
                    </div>
                    <p className="mt-8 text-center text-brand-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} {t('appName')}. {t('footerReserved', { year: new Date().getFullYear().toString() }) || 'All Rights Reserved.'}
                    </p>
                </section>
            </div>
        </Container>
    );
};

export default SupportPage;
