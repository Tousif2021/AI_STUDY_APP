import React from 'react';
import { Layout } from '../components/layout/Layout';
import { SignIn1 } from '../components/ui/modern-stunning-sign-in';

export const SignInPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <SignIn1 />
      </div>
    </Layout>
  );
};