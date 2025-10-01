
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/ui/Container.tsx';
import Button from '../components/ui/Button.tsx';

const NotFoundPage: React.FC = () => {
  return (
    <Container className="text-center">
      <h1 className="text-9xl font-bold text-brand-blue">404</h1>
      <h2 className="mt-4 text-3xl font-semibold text-brand-gray-600">Page Not Found</h2>
      <p className="mt-2 text-lg text-brand-gray-500">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-6">
        <Link to="/">
            <Button>Go back home</Button>
        </Link>
      </div>
    </Container>
  );
};

export default NotFoundPage;
