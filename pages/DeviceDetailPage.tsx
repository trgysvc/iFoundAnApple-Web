import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Device, DeviceStatus, UserRole } from "../types";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import NotFoundPage from "./NotFoundPage";
import { getSecureInvoiceUrl } from "../utils/fileUpload";
import {
  ArrowLeft,
  ShieldCheck,
  Hourglass,
  ArrowRightLeft,
  PartyPopper,
  Wallet,
  Info,
  Paperclip,
  Check,
} from "lucide-react";

// A generic view for displaying status information and actions.
const StatusView: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
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
  const {
    currentUser,
    getDeviceById,
    makePayment,
    confirmExchange,
    t,
    notifications,
    markNotificationAsRead,
  } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [device, setDevice] = useState<Device | undefined | null>(undefined);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [secureInvoiceUrl, setSecureInvoiceUrl] = useState<string | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  console.log("DeviceDetailPage: Component mounted with deviceId:", deviceId);
  console.log("DeviceDetailPage: Current location:", location.pathname);

  const handlePayment = async (deviceId: string) => {
    console.log(
      "DeviceDetailPage: handlePayment called with deviceId:",
      deviceId
    );
    
    if (!device) {
      console.error("DeviceDetailPage: No device found");
      return;
    }
    
    // Navigate to new MatchPaymentPage with device details
    navigate(`/match-payment?deviceId=${deviceId}&deviceModel=${encodeURIComponent(device.model)}`);
  };

  useEffect(() => {
    const fetchDevice = async () => {
      if (deviceId) {
        console.log("DeviceDetailPage: Fetching device with ID:", deviceId);
        const foundDevice = await getDeviceById(deviceId);
        console.log("DeviceDetailPage: Device found:", foundDevice);
        setDevice(foundDevice);
        
        // Generate secure URL for invoice if it exists
        if (foundDevice?.invoice_url) {
          setIsLoadingInvoice(true);
          try {
            const secureUrl = await getSecureInvoiceUrl(foundDevice.invoice_url);
            setSecureInvoiceUrl(secureUrl);
          } catch (error) {
            console.error("Failed to generate secure invoice URL:", error);
          } finally {
            setIsLoadingInvoice(false);
          }
        }
      }
    };

    fetchDevice();
  }, [deviceId, getDeviceById, notifications]); // Rerun if notifications change to update status

  useEffect(() => {
    // Mark notifications for this page as read when the component mounts
    const unreadNotifs = notifications.filter(
      (n) => !n.is_read && n.link === location.pathname
    );
    if (unreadNotifs.length > 0) {
      unreadNotifs.forEach((n) => markNotificationAsRead(n.id));
    }
  }, [location.pathname, notifications, markNotificationAsRead]);

  console.log(
    "DeviceDetailPage: Current state - device:",
    device,
    "currentUser:",
    currentUser
  );

  if (device === undefined) {
    return (
      <Container>
        <div className="text-center">{t("loading")}</div>
      </Container>
    );
  }

  if (device === null || !currentUser || device.userId !== currentUser.id) {
    return <NotFoundPage />;
  }

  // Determine if the perspective is of the original owner (who lost the device)
  // or the finder. This is based on the device's original type.
  // If the device was originally LOST by this user, they are the original owner.
  // If the device was REPORTED by this user, they are the finder.
  // For now, let's use a simpler approach: if the user owns the device AND the status indicates
  // they need to make payment, they are the original owner.
  const isOriginalOwnerPerspective =
    !!device.rewardAmount ||
    device.status === DeviceStatus.LOST ||
    (device.status === DeviceStatus.PAYMENT_PENDING &&
      device.userId === currentUser.id);
  const hasCurrentUserConfirmed = device.exchangeConfirmedBy?.includes(
    currentUser.id
  );

  console.log("DeviceDetailPage: Device status:", device?.status);
  console.log("DeviceDetailPage: Device rewardAmount:", device?.rewardAmount);
  console.log(
    "DeviceDetailPage: isOriginalOwnerPerspective:",
    isOriginalOwnerPerspective
  );
  console.log("DeviceDetailPage: Full device object:", device);
  console.log("DeviceDetailPage: DeviceStatus.LOST value:", DeviceStatus.LOST);
  console.log(
    "DeviceDetailPage: Status comparison:",
    device?.status === DeviceStatus.LOST
  );

  const renderContent = () => {
    console.log(
      "DeviceDetailPage: renderContent called with status:",
      device.status
    );
    console.log("DeviceDetailPage: DeviceStatus values:", {
      PAYMENT_PENDING: DeviceStatus.PAYMENT_PENDING,
      MATCHED: DeviceStatus.MATCHED,
      EXCHANGE_PENDING: DeviceStatus.EXCHANGE_PENDING,
      COMPLETED: DeviceStatus.COMPLETED,
      LOST: DeviceStatus.LOST,
      REPORTED: DeviceStatus.REPORTED,
    });

    // Force display the payment form for testing
    console.log("DeviceDetailPage: FORCING PAYMENT FORM DISPLAY FOR TESTING");
    const statusString = String(device.status).toLowerCase();
    console.log("DeviceDetailPage: Status as string:", statusString);

    if (statusString === "matched") {
      console.log(
        "DeviceDetailPage: Status matches MATCHED - showing payment form"
      );
      return (
        <StatusView
          icon={<Wallet className="w-10 h-10" />}
          title="MATCH FOUND (TEST)"
          description="Payment form is now displaying for testing"
        >
          <div className="mt-6 bg-brand-gray-100 p-6 rounded-lg">
            <p className="text-lg font-medium text-brand-gray-500">
              Reward Amount
            </p>
            <p className="text-4xl font-bold text-brand-blue">
              {device.rewardAmount
                ? `${device.rewardAmount.toLocaleString("tr-TR")} TL`
                : `1,500 TL`}
            </p>
          </div>
          <div className="mt-8">
            <Button
              onClick={() => handlePayment(device.id)}
              size="lg"
              className="w-full max-w-md"
              disabled={isProcessingPayment}
            >
              <ShieldCheck className="w-5 h-5 mr-2" />{" "}
              {isProcessingPayment
                ? "Yönlendiriliyor..."
                : "Make Payment Securely"}
            </Button>
          </div>
        </StatusView>
      );
    }

    switch (device.status) {
      case DeviceStatus.PAYMENT_PENDING:
        console.log("DeviceDetailPage: PAYMENT_PENDING case executed");
        console.log(
          "DeviceDetailPage: isOriginalOwnerPerspective:",
          isOriginalOwnerPerspective
        );

        if (!isOriginalOwnerPerspective) {
          console.log("DeviceDetailPage: User is not owner, showing error");
          return null; // Should not happen for finders
        }

        console.log(
          "DeviceDetailPage: Showing payment form for PAYMENT_PENDING"
        );
        return (
          <StatusView
            icon={<Wallet className="w-10 h-10" />}
            title={t("matchFound")}
            description={t("paymentSecureExchange")}
          >
            <div className="mt-6 bg-brand-gray-100 p-6 rounded-lg">
              <p className="text-lg font-medium text-brand-gray-500">
                {t("reward")}
              </p>
              <p className="text-4xl font-bold text-brand-blue">
                {device.rewardAmount
                  ? `${device.rewardAmount.toLocaleString("tr-TR")} TL`
                  : `1,500 TL`}
              </p>
            </div>
            <div className="mt-8">
              <Button
                onClick={() => handlePayment(device.id)}
                size="lg"
                className="w-full max-w-md"
                disabled={isProcessingPayment}
              >
                <ShieldCheck className="w-5 h-5 mr-2" />{" "}
                {isProcessingPayment
                  ? t("processingPayment")
                  : t("makePaymentSecurely")}
              </Button>
            </div>
          </StatusView>
        );

      case DeviceStatus.MATCHED:
        console.log("DeviceDetailPage: MATCHED case executed");
        console.log(
          "DeviceDetailPage: isOriginalOwnerPerspective:",
          isOriginalOwnerPerspective
        );
        if (isOriginalOwnerPerspective) {
          console.log("DeviceDetailPage: Showing payment form for owner");
          // Original owner (who lost the device) - show payment form
          return (
            <StatusView
              icon={<Wallet className="w-10 h-10" />}
              title={t("matchFound")}
              description={t("paymentSecureExchange")}
            >
              <div className="mt-6 bg-brand-gray-100 p-6 rounded-lg">
                <p className="text-lg font-medium text-brand-gray-500">
                  {t("reward")}
                </p>
                <p className="text-4xl font-bold text-brand-blue">
                  {device.rewardAmount
                    ? `${device.rewardAmount.toLocaleString("tr-TR")} TL`
                    : `1,500 TL`}
                </p>
              </div>
              <div className="mt-8">
                <Button
                  onClick={() => handlePayment(device.id)}
                  size="lg"
                  className="w-full max-w-md"
                  disabled={isProcessingPayment}
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />{" "}
                  {isProcessingPayment
                    ? t("processingPayment")
                    : t("makePaymentSecurely")}
                </Button>
              </div>
            </StatusView>
          );
        } else {
          console.log("DeviceDetailPage: Showing waiting message for finder");
          // Finder (who reported the device) - show waiting message
          return (
            <StatusView
              icon={<Hourglass className="w-10 h-10" />}
              title={t("matchFoundTitle")}
              description={t("waitingForOwnerPayment")}
            />
          );
        }

      case DeviceStatus.EXCHANGE_PENDING:
        return (
          <StatusView
            icon={<ArrowRightLeft className="w-10 h-10" />}
            title={t("paymentReceived")}
            description={
              isOriginalOwnerPerspective
                ? t("paymentSecureExchange")
                : t("finderPaymentSecureExchange")
            }
          >
            <div className="mt-8 text-left max-w-lg mx-auto bg-brand-gray-100 p-6 rounded-lg space-y-4">
              <h4 className="text-lg font-semibold text-brand-gray-600 text-center">
                {t("secureExchangeGuidelines")}
              </h4>
              <p className="text-sm text-brand-gray-500">
                1. {t("guideline1")}
              </p>
              <p className="text-sm text-brand-gray-500">
                2. {t("guideline2")}
              </p>
              <p className="text-sm text-brand-gray-500">
                3. {t("guideline3")}
              </p>
              <p className="text-sm text-brand-gray-500">
                4. {t("guideline4")}
              </p>
            </div>

            <div className="mt-8">
              <Button
                onClick={() => confirmExchange(device.id, currentUser.id)}
                size="lg"
                disabled={hasCurrentUserConfirmed}
              >
                {hasCurrentUserConfirmed ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    {t("waitingForOtherParty")}
                  </>
                ) : (
                  t("confirmExchange")
                )}
              </Button>
            </div>
          </StatusView>
        );

      case DeviceStatus.COMPLETED:
        return (
          <StatusView
            icon={<PartyPopper className="w-10 h-10" />}
            title={t("transactionCompleted")}
            description={t("transactionCompletedDesc")}
          >
            {!isOriginalOwnerPerspective && (
              <p className="mt-4 text-sm text-brand-gray-400">
                {t("serviceFeeNotice")}
              </p>
            )}
            <div className="mt-8">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="secondary"
              >
                {t("backToDashboard")}
              </Button>
            </div>
          </StatusView>
        );

      default: // LOST, REPORTED
        console.log(
          "DeviceDetailPage: Default case executed - status not matched:",
          device.status
        );
        return (
          <StatusView
            icon={<Info className="w-10 h-10" />}
            title={isOriginalOwnerPerspective ? t("Lost") : t("Reported")}
            description="The device is registered in the system. We will notify you when a match is found."
          >
            {isOriginalOwnerPerspective && (device.invoice_url || device.invoiceDataUrl) && (
              <div className="border-t border-brand-gray-200 mt-6 pt-6 w-full max-w-sm">
                {isLoadingInvoice ? (
                  <Button variant="secondary" className="w-full" disabled>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                    Loading invoice...
                  </Button>
                ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                  <a
                    href={secureInvoiceUrl || device.invoiceDataUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="secondary" className="w-full">
                      <Paperclip className="w-4 h-4 mr-2" />
                      {t("viewInvoice")}
                    </Button>
                  </a>
                ) : (
                  <Button variant="secondary" className="w-full" disabled>
                    <Paperclip className="w-4 h-4 mr-2" />
                    Invoice unavailable
                  </Button>
                )}
              </div>
            )}
          </StatusView>
        );
    }
  };

  return (
    <Container>
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-medium text-brand-blue hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("backToDashboard")}
        </Link>
      </div>

      {/* DEBUG DISPLAY - REMOVE AFTER TESTING */}
      <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
        <h3 className="font-bold text-yellow-800 mb-2">DEBUG INFO:</h3>
        <p>
          <strong>Device ID:</strong> {device?.id}
        </p>
        <p>
          <strong>Device Status:</strong> {device?.status}
        </p>
        <p>
          <strong>Status Type:</strong> {typeof device?.status}
        </p>
        <p>
          <strong>User ID:</strong> {device?.userId}
        </p>
        <p>
          <strong>Current User ID:</strong> {currentUser?.id}
        </p>
        <p>
          <strong>Is Owner:</strong>{" "}
          {device?.userId === currentUser?.id ? "YES" : "NO"}
        </p>
        <p>
          <strong>Reward Amount:</strong> {device?.rewardAmount || "None"}
        </p>
        <p>
          <strong>Model:</strong> {device?.model}
        </p>
        <p>
          <strong>Serial Number:</strong> {device?.serialNumber}
        </p>
      </div>

      {renderContent()}
    </Container>
  );
};

export default DeviceDetailPage;
