import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Device, UserRole } from "../types";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import DeviceCard from "../components/DeviceCard";
import { PlusCircle } from "lucide-react";

const DashboardPage: React.FC = () => {
  const { currentUser, getUserDevices, t } = useAppContext();
  const navigate = useNavigate();

  const [userDevices, setUserDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      console.log("DashboardPage: fetchDevices called");
      console.log("DashboardPage: currentUser:", currentUser);

      if (currentUser) {
        console.log(
          "DashboardPage: Fetching devices for user:",
          currentUser.id
        );
        setIsLoading(true);
        try {
          const devices = await getUserDevices(currentUser.id);
          console.log("DashboardPage: Devices fetched:", devices);
          setUserDevices(devices);
        } catch (error) {
          console.error("DashboardPage: Error fetching devices:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("DashboardPage: No currentUser, cannot fetch devices");
      }
    };
    fetchDevices();
  }, [currentUser, getUserDevices]);

  if (!currentUser) {
    console.log("DashboardPage: currentUser is null");
    return (
      <Container>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-brand-gray-600 mb-4">
            Authentication Required
          </h2>
          <p className="text-brand-gray-500 mb-6">
            You need to be logged in to view your devices.
          </p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </Container>
    );
  }

  console.log("DashboardPage: currentUser", currentUser);
  console.log("DashboardPage: userDevices", userDevices);

  return (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-brand-gray-600">
          {t("myDevices")}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            onClick={() => navigate("/add-device?type=lost")}
            className="w-full justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {t("addLostDevice")}
          </Button>
          <Button
            onClick={() => navigate("/add-device?type=found")}
            variant="secondary"
            className="w-full justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {t("reportFoundDevice")}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center py-16 text-brand-gray-500">{t("loading")}</p>
      ) : userDevices.length > 0 ? (
        <div className="space-y-4">
          {userDevices
            .sort((a, b) => b.id.localeCompare(a.id))
            .map((device) => {
              console.log(
                "DashboardPage: Rendering DeviceCard for device:",
                device.id,
                "Status:",
                device.status,
                "Full Device Object:",
                device
              );
              return <DeviceCard key={device.id} device={device} />;
            })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-brand-gray-300 rounded-xl">
          <h3 className="text-xl font-medium text-brand-gray-600">
            {t("noDevicesReported")}
          </h3>
          <p className="text-brand-gray-400 mt-2">
            Click one of the buttons above to get started.
          </p>
        </div>
      )}
    </Container>
  );
};

export default DashboardPage;
