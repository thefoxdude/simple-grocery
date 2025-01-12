import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loader } from 'lucide-react';

export const AuthProvider = ({ children }) => {
  const { user, loading, login, signup, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center 
                    bg-emerald-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
        <Loader className="h-8 w-8 animate-spin text-emerald-500 dark:text-emerald-400" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center 
                    bg-emerald-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold 
                        text-emerald-900 dark:text-emerald-100">
              {isSignUp ? 'Create an account' : 'Sign in to your account'}
            </h2>
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-800 
                         text-red-700 dark:text-red-200 px-4 py-3 rounded relative" 
                 role="alert">
              <span className="block sm:inline">{error}</span>
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
                         focus:z-10 sm:text-sm
                         transition-colors duration-200"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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
                         focus:z-10 sm:text-sm
                         transition-colors duration-200"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 
                        border border-transparent text-sm font-medium rounded-md 
                        text-white bg-emerald-600 hover:bg-emerald-700 
                        dark:bg-emerald-600 dark:hover:bg-emerald-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-emerald-500 dark:focus:ring-offset-gray-900
                        transition-colors duration-200"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-emerald-600 hover:text-emerald-500 
                      dark:text-emerald-400 dark:hover:text-emerald-300
                      transition-colors duration-200"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {user && (
            <div className="mt-4">
              <button
                onClick={logout}
                className="w-full flex justify-center py-2 px-4 
                        border border-transparent text-sm font-medium rounded-md 
                        text-white bg-red-600 hover:bg-red-700
                        dark:bg-red-600 dark:hover:bg-red-700
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        focus:ring-red-500 dark:focus:ring-offset-gray-900
                        transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;