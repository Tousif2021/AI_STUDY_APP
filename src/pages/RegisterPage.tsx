import React from 'react';
import { Layout } from '../components/layout/Layout';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <RegisterForm />
      </div>
    </Layout>
  );
};