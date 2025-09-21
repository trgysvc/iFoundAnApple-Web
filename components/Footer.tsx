
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext.tsx';

const Footer: React.FC = () => {
    const { t } = useAppContext();
  return (
    <footer className="bg-white mt-16 border-t border-brand-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-brand-gray-400 tracking-wider uppercase">{t('appName')}</h3>
                <ul className="space-y-2">
                    <li><Link to="/faq" className="text-base text-brand-gray-500 hover:text-brand-blue">{t('faq')}</Link></li>
                    <li><Link to="/contact" className="text-base text-brand-gray-500 hover:text-brand-blue">{t('contact')}</Link></li>
                </ul>
            </div>
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-brand-gray-400 tracking-wider uppercase">Legal</h3>
                <ul className="space-y-2">
                    <li><Link to="/terms" className="text-base text-brand-gray-500 hover:text-brand-blue">{t('terms')}</Link></li>
                    <li><Link to="/privacy" className="text-base text-brand-gray-500 hover:text-brand-blue">{t('privacy')}</Link></li>
                </ul>
            </div>
            <div className="col-span-2 md:col-span-2 flex items-center justify-center md:justify-end">
                <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    {t('downloadOnAppStore')}
                </button>
            </div>
        </div>
        <div className="mt-12 border-t border-brand-gray-200 pt-8 text-center">
            <p className="text-base text-brand-gray-400">&copy; {new Date().getFullYear()} {t('appName')}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;