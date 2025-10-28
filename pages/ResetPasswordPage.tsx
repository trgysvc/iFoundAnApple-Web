import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import { supabase } from "../utils/supabaseClient.ts";
import Container from "../components/ui/Container.tsx";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import { Shield, Check, AlertCircle } from "lucide-react";

const ResetPasswordPage: React.FC = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if there's a valid session from the password reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError(t("invalidResetLink"));
      }
    });
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      setIsLoading(false);

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      setIsLoading(false);
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
              {t("passwordResetSuccess")}
            </h2>
            <p className="text-brand-gray-600 mb-6">
              {t("passwordResetSuccessDesc")}
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
        <div className="text-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-brand-blue" />
          </div>
          <h2 className="text-2xl font-bold text-brand-gray-600 mb-2">
            {t("resetPassword")}
          </h2>
          <p className="text-brand-gray-500">
            {t("resetPasswordDesc")}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t("newPassword")}
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <p className="text-sm text-brand-gray-500 -mt-4">
            {t("passwordMinLength")}
          </p>

          <Input
            label={t("confirmPassword")}
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? t("updating") : t("updatePassword")}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default ResetPasswordPage;

