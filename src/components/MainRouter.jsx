import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import WelcomeScreen from './WelcomeScreen';
import MealPlanner from '../MealPlanner';
import { Loader } from 'lucide-react';
import AuthComponent from './AuthComponent';

const MainRouter = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState('login');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-gray-900">
        <Loader className="h-8 w-8 animate-spin text-emerald-500 dark:text-emerald-400" />
      </div>
    );
  }

  if (user) return <MealPlanner />;
  if (showAuth) return <AuthComponent onBack={() => setShowAuth(false)} initialView={currentView} />;
  return <WelcomeScreen onAuthClick={(view) => {
    setShowAuth(true);
    setCurrentView(view);
  }} />;
};

export default MainRouter;