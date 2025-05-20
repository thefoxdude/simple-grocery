import React, { useState } from 'react';
import { useSubscriptionContext } from '../contexts/SubscriptionProvider';
import { createCustomerPortalSession } from '../stripe/services';
import { useAuth } from '../hooks/useAuth';
import { Clock, CreditCard, Settings, Loader } from 'lucide-react';

const SubscriptionBadge = () => {
  const { subscription, getTrialDaysLeft } = useSubscriptionContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const trialDaysLeft = getTrialDaysLeft();
  const isTrialEnded = trialDaysLeft <= 0;
  const isSubscribed = subscription?.status === 'active';
  
  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const portalUrl = await createCustomerPortalSession(user.uid);
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      alert('There was an error opening the subscription management page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!subscription) return null;

  return (
    <div className="flex items-center gap-2">
      {!isSubscribed && !isTrialEnded && (
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 
                      text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
          <Clock className="h-3 w-3" />
          <span>Trial: {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left</span>
        </div>
      )}
      
      {isSubscribed && (
        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 
                      text-emerald-800 dark:text-emerald-200 text-xs rounded-full">
          <CreditCard className="h-3 w-3" />
          <span>Active Subscription</span>
        </div>
      )}
      
      {(isTrialEnded && !isSubscribed) && (
        <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 
                      text-red-800 dark:text-red-200 text-xs rounded-full">
          <CreditCard className="h-3 w-3" />
          <span>Trial Ended</span>
        </div>
      )}
      
      {isSubscribed && (
        <button
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="p-1 text-emerald-600 dark:text-emerald-400 
                  hover:bg-emerald-50 dark:hover:bg-emerald-900/30 
                  rounded-full transition-colors duration-200
                  disabled:opacity-50"
          aria-label="Manage subscription"
        >
          {isLoading ? (
            <Loader className="h-3 w-3 animate-spin" />
          ) : (
            <Settings className="h-3 w-3" />
          )}
        </button>
      )}
    </div>
  );
};

export default SubscriptionBadge;