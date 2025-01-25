import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

const VIEW = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  FORGOT_PASSWORD: 'forgot_password',
  RESET_PASSWORD: 'reset_password'
};

const AuthComponent = ({ onBack, initialView }) => {
  const { login, signup, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentView, setCurrentView] = useState(initialView);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (currentView === VIEW.SIGNUP) {
        await signup(email, password);
      } else if (currentView === VIEW.LOGIN) {
        await login(email, password);
      } else if (currentView === VIEW.FORGOT_PASSWORD) {
        await resetPassword(email);
        setResetSuccess(true);
        setTimeout(() => {
          setCurrentView(VIEW.LOGIN);
          setResetSuccess(false);
          setEmail('');
        }, 3000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                  bg-emerald-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-500 
                    dark:text-emerald-400 dark:hover:text-emerald-300
                    transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Welcome
        </button>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold 
                      text-emerald-900 dark:text-emerald-100">
            {currentView === VIEW.SIGNUP && 'Create an account'}
            {currentView === VIEW.LOGIN && 'Sign in to your account'}
            {currentView === VIEW.FORGOT_PASSWORD && 'Reset your password'}
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-800 
                       text-red-700 dark:text-red-200 px-4 py-3 rounded relative" 
               role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-800 
                       text-green-700 dark:text-green-200 px-4 py-3 rounded relative" 
               role="alert">
            <span className="block sm:inline">Password reset email sent! Redirecting to login...</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 
                       border border-emerald-300 dark:border-gray-600
                       placeholder-emerald-400 dark:placeholder-emerald-500
                       text-emerald-900 dark:text-emerald-100
                       bg-white dark:bg-gray-800
                       focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                       dark:focus:ring-emerald-500 dark:focus:border-emerald-500
                       focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {currentView !== VIEW.FORGOT_PASSWORD && (
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-b-md relative block w-full px-3 py-2 
                         border border-emerald-300 dark:border-gray-600
                         placeholder-emerald-400 dark:placeholder-emerald-500
                         text-emerald-900 dark:text-emerald-100
                         bg-white dark:bg-gray-800
                         focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 
                         dark:focus:ring-emerald-500 dark:focus:border-emerald-500
                         focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 
                      border border-transparent text-sm font-medium rounded-md 
                      text-white bg-emerald-600 hover:bg-emerald-700 
                      dark:bg-emerald-600 dark:hover:bg-emerald-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-emerald-500"
            >
              {currentView === VIEW.SIGNUP && 'Sign Up'}
              {currentView === VIEW.LOGIN && 'Sign In'}
              {currentView === VIEW.FORGOT_PASSWORD && 'Reset Password'}
            </button>
          </div>
        </form>

        <div className="text-center space-y-2">
          {currentView === VIEW.LOGIN && (
            <>
              <button
                onClick={() => setCurrentView(VIEW.SIGNUP)}
                className="block w-full text-sm text-emerald-600 hover:text-emerald-500 
                        dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Don't have an account? Sign up
              </button>
              <button
                onClick={() => setCurrentView(VIEW.FORGOT_PASSWORD)}
                className="block w-full text-sm text-emerald-600 hover:text-emerald-500 
                        dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Forgot your password?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;