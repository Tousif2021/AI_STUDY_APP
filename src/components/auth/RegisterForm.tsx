import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const { register: registerUser, loginWithGoogle, isLoading, isGoogleLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null); // For email verification message
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setInfo(null);

    // Password match validation (extra safety)
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await registerUser(data.name, data.email, data.password);

      // If the backend returns a special message about email verification, show it instead of redirecting
      if (result && result.requiresVerification) {
        setInfo('Please check your email and verify your account before logging in.');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setInfo(null);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5" />
            <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
          </div>
        )}

        {info && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md flex items-start">
            <span className="text-sm text-green-800 dark:text-green-300">{info}</span>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              label="Full name"
              type="text"
              id="name"
              leftIcon={<User className="h-5 w-5 text-gray-400" />}
              error={errors.name?.message}
              fullWidth
              disabled={isSubmitting}
              {...register('name', { 
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />
          </div>

          <div>
            <Input
              label="Email address"
              type="email"
              id="email"
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              error={errors.email?.message}
              fullWidth
              disabled={isSubmitting}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              id="password"
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.password?.message}
              fullWidth
              disabled={isSubmitting}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
          </div>

          <div>
            <Input
              label="Confirm password"
              type="password"
              id="confirmPassword"
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.confirmPassword?.message}
              fullWidth
              disabled={isSubmitting}
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === watch('password') || 'Passwords do not match'
              })}
            />
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading || isSubmitting}
              disabled={isLoading || isSubmitting || isGoogleLoading}
            >
              Create account
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleGoogleLogin}
              isLoading={isGoogleLoading}
              disabled={isLoading || isSubmitting || isGoogleLoading}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                  fill="currentColor"
                />
              </svg>
              Sign up with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
