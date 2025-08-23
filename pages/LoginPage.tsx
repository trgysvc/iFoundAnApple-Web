
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const { login, t, signInWithOAuth } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('invalidEmailOrPassword')); // Use translation for consistency
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setError('');
    await signInWithOAuth(provider);
    // Supabase handles the redirect, so no local navigation needed here
  };

  return (
    <Container className="max-w-md">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-brand-gray-600 mb-6">{t('loginTitle')}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label={t('email')} 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label={t('password')} 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit" className="w-full" size="lg">
            {t('login')}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-brand-gray-500">{t('orContinueWith')}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => handleSocialLogin('google')} 
            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center" 
            size="lg"
          >
            <img src="/icons/google.svg" alt="Google" className="h-5 w-5 mr-3" />
            {t('loginWithGoogle')}
          </Button>
          <Button 
            onClick={() => handleSocialLogin('apple')} 
            className="w-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center" 
            size="lg"
          >
            <img src="/icons/apple.svg" alt="Apple" className="h-5 w-5 mr-3" />
            {t('loginWithApple')}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-brand-gray-500">
          {t('dontHaveAccount')}{' '}
          <Link to="/register" className="font-medium text-brand-blue hover:underline">
            {t('register')}
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default LoginPage;
