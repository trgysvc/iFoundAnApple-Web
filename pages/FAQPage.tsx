import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';
import { ChevronDown } from 'lucide-react';

const FaqItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-brand-gray-200 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left text-lg font-medium text-brand-gray-600"
            >
                <span>{question}</span>
                <ChevronDown className={`w-5 h-5 text-brand-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-3 text-brand-gray-500">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

const FAQPage: React.FC = () => {
    const { t } = useAppContext();
    const faqData = t('faqContent') as unknown as { [key: string]: string };

    const questions = Object.keys(faqData).filter(key => key.startsWith('q')).map(qKey => ({
        question: faqData[qKey],
        answer: faqData[qKey.replace('q', 'a')]
    }));

    return (
        <Container>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-brand-gray-600 mb-2">{t('faqTitle')}</h1>
                <p className="text-center text-lg text-brand-gray-500 mb-10">Find answers to common questions about our platform.</p>
                <div className="space-y-2">
                    {questions.map((item, index) => (
                        <FaqItem key={index} question={item.question} answer={item.answer} />
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default FAQPage;
