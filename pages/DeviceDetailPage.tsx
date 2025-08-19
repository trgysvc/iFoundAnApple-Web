import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Device, DeviceStatus, UserRole } from '../types';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import NotFoundPage from './NotFoundPage';
import { ArrowLeft, ShieldCheck, Hourglass, ArrowRightLeft, PartyPopper, Wallet, Info, Paperclip, Check } from 'lucide-react';

// A generic view for displaying status information and actions.
const StatusView: React.FC<{
    icon: React.ReactNode,
    title: string,
    description: string,
    children?: React.ReactNode
}> = ({ icon, title, description, children }) => (
    <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg text-center flex flex-col items-center">
        <div className="bg-brand-blue-light text-brand-blue p-4 rounded-full mb-6">
            {icon}
        </div>
        <h2 className="text-3xl font-bold text-brand-gray-600">{title}</h2>
        <p className="mt-2 text-brand-gray-500 max-w-lg">{description}</p>
        {children && <div className="mt-6 w-full">{children}</div>}
    </div>
);

const DeviceDetailPage: React.FC = () => {
    const { deviceId } = useParams<{ deviceId: string }>();
    const { currentUser, getDeviceById, makePayment, confirmExchange, t, notifications, markNotificationAsRead } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [device, setDevice] = useState<Device | undefined | null>(undefined);

    useEffect(() => {
        if (deviceId) {
            const foundDevice = getDeviceById(deviceId);
            setDevice(foundDevice);
        }
    }, [deviceId, getDeviceById, notifications]); // Rerun if notifications change to update status
    
    useEffect(() => {
        // Mark notifications for this page as read when the component mounts
        const unreadNotifs = notifications.filter(n => !n.isRead && n.link === location.pathname);
        if (unreadNotifs.length > 0) {
            unreadNotifs.forEach(n => markNotificationAsRead(n.id));
        }
    }, [location.pathname, notifications, markNotificationAsRead]);

    if (device === undefined) {
        return <Container><div className="text-center">{t('loading')}</div></Container>;
    }

    if (device === null || !currentUser || device.userId !== currentUser.id) {
        return <NotFoundPage />;
    }
    
    // Determine if the perspective is of the original owner (who lost the device)
    // or the finder. This is based on whether a reward was set, which only owners can do.
    const isOriginalOwnerPerspective = !!device.rewardAmount;
    const hasCurrentUserConfirmed = device.exchangeConfirmedBy?.includes(currentUser.id);


    const renderContent = () => {
        switch (device.status) {
            case DeviceStatus.PAYMENT_PENDING:
                if (!isOriginalOwnerPerspective) return null; // Should not happen for finders
                return (
                    <StatusView
                        icon={<Wallet className="w-10 h-10" />}
                        title={t('matchFound')}
                        description={t('paymentSecureExchange')}
                    >
                         <div className="mt-6 bg-brand-gray-100 p-6 rounded-lg">
                            <p className="text-lg font-medium text-brand-gray-500">{t('reward')}</p>
                            <p className="text-4xl font-bold text-brand-blue">
                                {device.rewardAmount ? `${device.rewardAmount.toLocaleString('tr-TR')} TL` : `1,500 TL`}
                            </p>
                        </div>
                        <div className="mt-8">
                            <Button onClick={() => makePayment(device.id)} size="lg" className="w-full max-w-md">
                                <ShieldCheck className="w-5 h-5 mr-2" /> {t('makePaymentSecurely')}
                            </Button>
                        </div>
                    </StatusView>
                );
            
            case DeviceStatus.MATCHED:
                 if (isOriginalOwnerPerspective) return null; // Should not happen for owners
                 return (
                    <StatusView
                        icon={<Hourglass className="w-10 h-10" />}
                        title={t('matchFoundTitle')}
                        description={t('waitingForOwnerPayment')}
                    />
                 );

            case DeviceStatus.EXCHANGE_PENDING:
                return (
                     <StatusView
                        icon={<ArrowRightLeft className="w-10 h-10" />}
                        title={t('paymentReceived')}
                        description={isOriginalOwnerPerspective ? t('paymentSecureExchange') : t('finderPaymentSecureExchange')}
                    >
                        <div className="mt-8 text-left max-w-lg mx-auto bg-brand-gray-100 p-6 rounded-lg space-y-4">
                           <h4 className="text-lg font-semibold text-brand-gray-600 text-center">{t('secureExchangeGuidelines')}</h4>
                           <p className="text-sm text-brand-gray-500">1. {t('guideline1')}</p>
                           <p className="text-sm text-brand-gray-500">2. {t('guideline2')}</p>
                           <p className="text-sm text-brand-gray-500">3. {t('guideline3')}</p>
                           <p className="text-sm text-brand-gray-500">4. {t('guideline4')}</p>
                        </div>

                        <div className="mt-8">
                            <Button onClick={() => confirmExchange(device.id, currentUser.id)} size="lg" disabled={hasCurrentUserConfirmed}>
                                {hasCurrentUserConfirmed ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2" />
                                        {t('waitingForOtherParty')}
                                    </>
                                ) : t('confirmExchange')}
                            </Button>
                        </div>
                    </StatusView>
                );

            case DeviceStatus.COMPLETED:
                 return (
                     <StatusView
                        icon={<PartyPopper className="w-10 h-10" />}
                        title={t('transactionCompleted')}
                        description={t('transactionCompletedDesc')}
                    >
                        {!isOriginalOwnerPerspective && <p className="mt-4 text-sm text-brand-gray-400">{t('serviceFeeNotice')}</p>}
                        <div className="mt-8">
                            <Button onClick={() => navigate('/dashboard')} variant="secondary">
                                {t('backToDashboard')}
                            </Button>
                        </div>
                    </StatusView>
                 );

            default: // LOST, REPORTED
                 return (
                     <StatusView
                        icon={<Info className="w-10 h-10" />}
                        title={isOriginalOwnerPerspective ? t('Lost') : t('Reported')}
                        description="The device is registered in the system. We will notify you when a match is found."
                    >
                        {isOriginalOwnerPerspective && device.invoiceDataUrl && (
                           <div className="border-t border-brand-gray-200 mt-6 pt-6 w-full max-w-sm">
                                <a 
                                    href={device.invoiceDataUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                   <Button variant="secondary" className="w-full">
                                       <Paperclip className="w-4 h-4 mr-2" />
                                       {t('viewInvoice')}
                                   </Button>
                                </a>
                           </div>
                       )}
                    </StatusView>
                 );
        }
    };
    
    return (
        <Container>
            <div className="mb-6">
                <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-brand-blue hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('backToDashboard')}
                </Link>
            </div>
            {renderContent()}
        </Container>
    );
};

export default DeviceDetailPage;