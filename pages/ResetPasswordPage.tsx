import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import Container from "../components/ui/Container.tsx";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import { supabase } from "../utils/supabaseClient.ts";

const ResetPasswordPage: React.FC = () => {
  const { t, currentUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    if (currentUser) {
      navigate("/dashboard");
      return;
    }

    // Check for recovery token in URL hash
    const checkRecoveryToken = async () => {
      // Parse hash fragment (HashRouter uses # for routing, so we need to check both)
      const hash = window.location.hash;
      
      // Check if there's a recovery token in the hash
      // Format: #access_token=...&type=recovery or #/reset-password#access_token=...&type=recovery
      let hashParams: URLSearchParams;
      
      // Try to get params from hash fragment
      if (hash.includes("access_token")) {
        // Extract the part after the last # that contains access_token
        const hashPart = hash.split("#").find(part => part.includes("access_token")) || "";
        hashParams = new URLSearchParams(hashPart);
      } else {
        hashParams = new URLSearchParams(hash.substring(1));
      }
      
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type");
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");

      if (error) {
        setError(
          errorDescription || 
          t("passwordResetLinkExpired") || 
          "Password reset link is invalid or has expired."
        );
        setIsValidToken(false);
        return;
      }

      if (type === "recovery" && accessToken) {
        // Token exists, verify session
        try {
          // Supabase should automatically handle this, but let's verify
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !session) {
            // Try to set the session from the URL
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get("refresh_token") || "",
            });
            
            if (setSessionError) {
              setError(setSessionError.message || t("passwordResetLinkExpired") || "Invalid or expired token.");
              setIsValidToken(false);
              return;
            }
          }
          
          setIsValidToken(true);
        } catch (err) {
          setError(t("passwordResetLinkExpired") || "Invalid or expired token.");
          setIsValidToken(false);
        }
      } else {
        // No token, check if we're on the reset-password route without token
        // This might be a direct navigation, show error
        setError(t("passwordResetLinkInvalid") || "Invalid password reset link.");
        setIsValidToken(false);
      }
    };

    checkRecoveryToken();
  }, [currentUser, navigate, location, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 6) {
      setError(t("passwordTooShort") || "Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch") || "Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Update password using Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || t("passwordResetError") || "Error updating password.");
        setIsLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      setIsLoading(false);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(t("passwordResetError") || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  // Show loading while checking token
  if (isValidToken === null) {
    return (
      <Container className="max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-brand-gray-600">{t("checkingResetLink") || "Checking reset link..."}</p>
        </div>
      </Container>
    );
  }

  // Show error if token is invalid
  if (isValidToken === false) {
    return (
      <Container className="max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-brand-gray-600 mb-6">
            {t("passwordResetTitle") || "Password Reset"}
          </h2>
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">
              {error}
            </p>
          )}
          <div className="text-center">
            <p className="text-brand-gray-600 mb-4">
              {t("passwordResetLinkExpiredMessage") || 
               "The password reset link is invalid or has expired. Please request a new one."}
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full"
              size="lg"
            >
              {t("backToLogin") || "Back to Login"}
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // Show success message
  if (success) {
    return (
      <Container className="max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-gray-600 mb-4">
            {t("passwordResetSuccess") || "Password Reset Successful!"}
          </h2>
          <p className="text-brand-gray-600 mb-6">
            {t("passwordResetSuccessMessage") || 
             "Your password has been successfully reset. Redirecting to login..."}
          </p>
        </div>
      </Container>
    );
  }

  // Show password reset form
  return (
    <Container className="max-w-md">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-brand-gray-600 mb-6">
          {t("passwordResetTitle") || "Reset Your Password"}
        </h2>
        <p className="text-sm text-brand-gray-500 mb-6 text-center">
          {t("passwordResetDescription") || 
           "Please enter your new password below."}
        </p>
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t("newPassword") || "New Password"}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <Input
            label={t("confirmPassword") || "Confirm Password"}
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading
              ? t("resetting") || "Resetting..."
              : t("resetPassword") || "Reset Password"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-brand-blue hover:underline"
          >
            {t("backToLogin") || "Back to Login"}
          </button>
        </div>
      </div>
    </Container>
  );
};

export default ResetPasswordPage;

