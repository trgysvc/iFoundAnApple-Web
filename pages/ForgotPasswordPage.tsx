import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import Container from "../components/ui/Container.tsx";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import { ArrowLeft, Mail, Check } from "lucide-react";

const ForgotPasswordPage: React.FC = () => {
  const { resetPassword, t } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await resetPassword(email);
    setIsLoading(false);

    if (result) {
      setSuccess(true);
    } else {
      setError(t("resetPasswordError"));
    }
  };

  if (success) {
    return (
      <Container className="max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-brand-gray-600 mb-4">
              {t("emailSent")}
            </h2>
            <p className="text-brand-gray-600 mb-6">
              {t("resetPasswordEmailSent")}
            </p>
            <Button onClick={() => navigate("/login")} className="w-full" size="lg">
              {t("backToLogin")}
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-md">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <button
          onClick={() => navigate("/login")}
          className="mb-6 inline-flex items-center text-sm font-medium text-brand-blue hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("backToLogin")}
        </button>

        <div className="text-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-brand-blue" />
          </div>
          <h2 className="text-2xl font-bold text-brand-gray-600 mb-2">
            {t("forgotPassword")}
          </h2>
          <p className="text-brand-gray-500">
            {t("forgotPasswordDesc")}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t("email")}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? t("sending") : t("sendResetLink")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-gray-500">
          {t("rememberPassword")}{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-brand-blue hover:underline"
          >
            {t("backToLogin")}
          </button>
        </p>
      </div>
    </Container>
  );
};

export default ForgotPasswordPage;

