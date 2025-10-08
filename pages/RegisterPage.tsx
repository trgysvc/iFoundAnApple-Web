import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import { UserRole } from "../types.ts";
import Container from "../components/ui/Container.tsx";
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import Select from "../components/ui/Select.tsx";

const RegisterPage: React.FC = () => {
  const { register, t, currentUser, signInWithOAuth } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
          <p className="text-brand-gray-600">{t("redirectingToDashboard")}</p>
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
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
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
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t("loginWithGoogle")}
          </Button>
          <Button
            onClick={() => handleSocialLogin("apple")}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center"
            size="lg"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
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
