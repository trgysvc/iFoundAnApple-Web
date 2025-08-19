
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const { login, t } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.');
    }
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
