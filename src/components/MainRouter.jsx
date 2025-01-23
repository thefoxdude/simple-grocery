import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import WelcomeScreen from './WelcomeScreen';
import MealPlanner from '../MealPlanner';
import { Loader } from 'lucide-react';
import { AuthProvider } from './AuthProvider';

const MainRouter = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-gray-900">
        <Loader className="h-8 w-8 animate-spin text-emerald-500 dark:text-emerald-400" />
      </div>
    );
  }

  if (user) return <MealPlanner />;
  if (showAuth) return <AuthProvider onBack={() => setShowAuth(false)} />;
  return <WelcomeScreen onAuthClick={() => setShowAuth(true)} />;
};

export default MainRouter;