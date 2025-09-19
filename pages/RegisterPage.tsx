import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { UserRole } from "../types";
import Container from "../components/ui/Container";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";

const RegisterPage: React.FC = () => {
  const { register, t, currentUser } = useAppContext();
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
