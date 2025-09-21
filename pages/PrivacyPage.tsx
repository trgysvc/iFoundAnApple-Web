import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import Container from '../components/ui/Container.tsx';
import { sanitizers } from '../utils/security';
import DOMPurify from 'dompurify';

const PrivacyPage: React.FC = () => {
    const { t } = useAppContext();
    const content = t('privacyContent');

    return (
        <Container>
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-brand-gray-600 mb-8">{t('privacyTitle')}</h1>
                <div 
                    className="prose max-w-none text-brand-gray-600"
                    dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(content, {
                            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'div'],
                            ALLOWED_ATTR: ['href', 'class', 'target', 'mailto'],
                            ALLOW_DATA_ATTR: false
                        })
                    }}
                />
            </div>
        </Container>
    );
};

export default PrivacyPage;
