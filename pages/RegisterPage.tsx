import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { UserRole } from "../types";
import Container from "../components/ui/Container";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";

const RegisterPage: React.FC = () => {
  const { register, t, currentUser, signInWithOAuth } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (currentUser) {
      console.log(
        "RegisterPage: User already logged in, redirecting to dashboard"
      );
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Show loading or redirect if user is already logged in
  if (currentUser) {
    return (
      <Container className="max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-brand-gray-600">Redirecting to dashboard...</p>
        </div>
      </Container>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError(t("consentRequired"));
      return;
    }

    const success = await register(
      {
        email,
        fullName,
      },
      password
    );

    if (success) {
      navigate("/dashboard");
    } else {
      setError(t("userAlreadyExists")); // Use translation for consistency
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setError("");
    await signInWithOAuth(provider);
    // Supabase handles the redirect, so no local navigation needed here
  };

  const termsText = t("agreeToTerms", {
    terms: `<a href="#/terms" target="_blank" class="font-medium text-brand-blue hover:underline">${t(
      "termsLink"
    )}</a>`,
    privacy: `<a href="#/privacy" target="_blank" class="font-medium text-brand-blue hover:underline">${t(
      "privacyLink"
    )}</a>`,
  });

  return (
    <Container className="max-w-md">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-brand-gray-600 mb-6">
          {t("registerTitle")}
        </h2>
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t("fullName")}
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label={t("email")}
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label={t("password")}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="focus:ring-brand-blue h-4 w-4 text-brand-blue border-brand-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                className="text-brand-gray-500"
                dangerouslySetInnerHTML={{ __html: termsText }}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" size="lg">
              {t("register")}
            </Button>
          </div>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-brand-gray-500">
              {t("orContinueWith")}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => handleSocialLogin("google")}
            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
            size="lg"
          >
            <img
              src="/icons/google.svg"
              alt="Google"
              className="h-5 w-5 mr-3"
            />
            {t("loginWithGoogle")}
          </Button>
          <Button
            onClick={() => handleSocialLogin("apple")}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center"
            size="lg"
          >
            <img src="/icons/apple.svg" alt="Apple" className="h-5 w-5 mr-3" />
            {t("loginWithApple")}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-brand-gray-500">
          {t("alreadyHaveAccount")}{" "}
          <Link
            to="/login"
            className="font-medium text-brand-blue hover:underline"
          >
            {t("login")}
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default RegisterPage;
