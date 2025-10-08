import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import Container from "../components/ui/Container.tsx";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import { ArrowLeft, Save, User, CreditCard, Shield, Phone, MapPin, Hash, Calendar } from "lucide-react";
import { validators, sanitizers, secureLogger } from "../utils/security";

const ProfilePage: React.FC = () => {
  const { currentUser, t, updateUserProfile } = useAppContext();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [tcKimlikNo, setTcKimlikNo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [iban, setIban] = useState("");
  // Legacy bankInfo field removed - using IBAN instead
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Generate day, month, year options
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    { value: '01', label: 'Ocak' },
    { value: '02', label: 'Şubat' },
    { value: '03', label: 'Mart' },
    { value: '04', label: 'Nisan' },
    { value: '05', label: 'Mayıs' },
    { value: '06', label: 'Haziran' },
    { value: '07', label: 'Temmuz' },
    { value: '08', label: 'Ağustos' },
    { value: '09', label: 'Eylül' },
    { value: '10', label: 'Ekim' },
    { value: '11', label: 'Kasım' },
    { value: '12', label: 'Aralık' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    secureLogger.info("ProfilePage: useEffect triggered");

    if (currentUser) {
      secureLogger.userAction("Profile page loaded", currentUser.id);

      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setEmail(currentUser.email || "");
      
      // Parse date of birth if exists (format: YYYY-MM-DD)
      if (currentUser.dateOfBirth) {
        const [year, month, day] = currentUser.dateOfBirth.split('-');
        setBirthYear(year || "");
        setBirthMonth(month || "");
        setBirthDay(day || "");
      }
      
      setTcKimlikNo(currentUser.tcKimlikNo || "");
      setPhoneNumber(currentUser.phoneNumber || "");
      setAddress(currentUser.address || "");
      setIban(currentUser.iban || currentUser.bankInfo || ""); // IBAN yoksa legacy bankInfo'yu kullan

      // Profile data is loaded - we have the user data, so stop loading
      // Note: bankInfo might be undefined if user hasn't set it yet, which is fine
      secureLogger.info("ProfilePage: Stopping loading state");
      setIsLoadingProfile(false);
    } else {
      secureLogger.info("ProfilePage: No currentUser, staying in loading state");
    }
  }, [currentUser]);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoadingProfile) {
        secureLogger.warn("Profile loading timeout - forcing stop");
        setIsLoadingProfile(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [isLoadingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Input validation and sanitization
      const sanitizedFirstName = sanitizers.text(firstName);
      const sanitizedLastName = sanitizers.text(lastName);
      const sanitizedTcKimlik = tcKimlikNo ? sanitizers.tcKimlik(tcKimlikNo) : "";
      const sanitizedPhone = phoneNumber ? sanitizers.phoneNumber(phoneNumber) : "";
      const sanitizedAddress = address ? sanitizers.text(address) : "";
      const sanitizedIban = iban ? sanitizers.iban(iban) : "";

      // Validate required fields
      if (!sanitizedFirstName.trim()) {
        setMessage({
          type: "error",
          text: "First name is required.",
        });
        setIsLoading(false);
        return;
      }

      if (!sanitizedLastName.trim()) {
        setMessage({
          type: "error",
          text: "Last name is required.",
        });
        setIsLoading(false);
        return;
      }

      // Validate and format date of birth
      let dateOfBirth: string | undefined = undefined;
      if (birthDay && birthMonth && birthYear) {
        // Validate date
        const date = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
        if (isNaN(date.getTime())) {
          setMessage({
            type: "error",
            text: "Please enter a valid date of birth.",
          });
          setIsLoading(false);
          return;
        }

        // Check if date is not in the future
        if (date > new Date()) {
          setMessage({
            type: "error",
            text: "Date of birth cannot be in the future.",
          });
          setIsLoading(false);
          return;
        }

        // Check minimum age (13 years old - COPPA compliance)
        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 13);
        if (date > minAgeDate) {
          setMessage({
            type: "error",
            text: "You must be at least 13 years old to use this service.",
          });
          setIsLoading(false);
          return;
        }

        // Check maximum age (reasonable limit - 120 years)
        const maxAgeDate = new Date();
        maxAgeDate.setFullYear(maxAgeDate.getFullYear() - 120);
        if (date < maxAgeDate) {
          setMessage({
            type: "error",
            text: "Please enter a valid date of birth.",
          });
          setIsLoading(false);
          return;
        }

        dateOfBirth = `${birthYear}-${birthMonth}-${birthDay}`;
      } else if (birthDay || birthMonth || birthYear) {
        // If any field is filled, all must be filled
        setMessage({
          type: "error",
          text: "Please complete all date of birth fields (day, month, year).",
        });
        setIsLoading(false);
        return;
      }

      // Validate TC Kimlik if provided
      if (sanitizedTcKimlik && !validators.tcKimlik(sanitizedTcKimlik)) {
        setMessage({
          type: "error",
          text: "Please enter a valid TC Identity Number.",
        });
        setIsLoading(false);
        return;
      }

      // Validate phone number if provided
      if (sanitizedPhone && !validators.phoneNumber(sanitizedPhone)) {
        setMessage({
          type: "error",
          text: "Please enter a valid Turkish phone number.",
        });
        setIsLoading(false);
        return;
      }

      // Validate IBAN if provided
      if (sanitizedIban && !validators.iban(sanitizedIban)) {
        setMessage({
          type: "error",
          text: "Please enter a valid Turkish IBAN (TR + 24 digits).",
        });
        setIsLoading(false);
        return;
      }

      if (updateUserProfile) {
        secureLogger.userAction("Profile update attempt", currentUser?.id);
        const success = await updateUserProfile({
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          dateOfBirth: dateOfBirth,
          tcKimlikNo: sanitizedTcKimlik || undefined,
          phoneNumber: sanitizedPhone || undefined,
          address: sanitizedAddress || undefined,
          iban: sanitizedIban || undefined,
        });

        if (success) {
          setMessage({
            type: "success",
            text: "Profile updated successfully!",
          });
        } else {
          setMessage({
            type: "error",
            text: "Failed to update profile. Please try again.",
          });
        }
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating your profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <Container>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-brand-gray-600 mb-4">
            Authentication Required
          </h2>
          <p className="text-brand-gray-500 mb-6">
            You need to be logged in to view your profile.
          </p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </Container>
    );
  }

  // Show loading state while profile data is being fetched
  if (isLoadingProfile) {
    return (
      <Container>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-brand-gray-600">Loading profile data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="secondary"
          className="inline-flex items-center text-sm font-medium text-brand-blue hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <p className="text-blue-100 mt-1">
                  Manage your personal information
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-brand-blue" />
                  <h3 className="text-lg font-semibold text-brand-gray-700">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name / Ad"
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Ahmet"
                  />

                  <Input
                    label="Last Name / Soyad"
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Yılmaz"
                  />
                </div>

                <Input
                  label={t("email")}
                  id="email"
                  type="email"
                  value={email}
                  disabled
                />
                <p className="text-sm text-brand-gray-500 -mt-2">
                  Email cannot be changed. Contact support if you need to update
                  your email address.
                </p>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-brand-gray-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date of Birth / Doğum Tarihi
                    <span className="text-brand-gray-400 ml-2 text-xs">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <select
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      >
                        <option value="">Day / Gün</option>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      >
                        <option value="">Month / Ay</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      >
                        <option value="">Year / Yıl</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="text-xs text-brand-gray-500 mt-1">
                    🔒 This information is kept private and secure. Minimum age: 13 years.
                  </p>
                </div>

                <Input
                  label={t("tcKimlikNo")}
                  id="tcKimlikNo"
                  type="text"
                  value={tcKimlikNo}
                  onChange={(e) => setTcKimlikNo(e.target.value)}
                  placeholder="12345678901"
                  maxLength={11}
                />

                <Input
                  label={t("phoneNumber")}
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+90 555 123 45 67"
                />

                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-brand-gray-700">
                    {t("address")}
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                    placeholder="Mahalle, Sokak, No, İlçe, İl"
                  />
                </div>
              </div>

              {/* Bank Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="w-5 h-5 text-brand-blue" />
                  <h3 className="text-lg font-semibold text-brand-gray-700">
                    Bank Account Information
                  </h3>
                  <span className="text-sm text-brand-gray-500">
                    (Optional - for reward payouts)
                  </span>
                </div>

                <Input
                  label={t("iban")}
                  id="iban"
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase().replace(/\s/g, ''))}
                  placeholder="TR12 3456 7890 1234 5678 9012 34"
                  maxLength={26}
                />
                <p className="text-sm text-brand-gray-500 mt-1">
                  IBAN numaranızı TR ile başlayarak girin. Bu bilgi ödül ödemeleri için kullanılır.
                </p>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">
                      Security & Privacy
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your personal information is stored securely and is only
                      used for account management and reward payouts. We never
                      share your data with third parties without your explicit
                      consent.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
