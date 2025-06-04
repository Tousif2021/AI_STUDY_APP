import React from 'react';
import { Layout } from '../components/layout/Layout';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <LoginForm />
      </div>
    </Layout>
  );
};