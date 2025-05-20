import React, { createContext, useContext, useEffect } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';
import { Loader } from 'lucide-react';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const {
    subscription,
    loadSubscription,
    updateSubscription,
    isSubscriptionActive,
    getTrialDaysLeft,
    isLoading,
    error
  } = useSubscription();

  // Load subscription data when user is authenticated
  useEffect(() => {
    if (user) {
      loadSubscription();
    }
  }, [user, loadSubscription]);

  // Show loader while subscription data is loading
  if (isLoading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-gray-900">
        <Loader className="h-8 w-8 animate-spin text-emerald-500 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        updateSubscription,
        isSubscriptionActive,
        getTrialDaysLeft,
        isLoading,
        error
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};