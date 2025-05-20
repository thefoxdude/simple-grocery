import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscriptionContext } from '../contexts/SubscriptionProvider';
import { CheckCircle, ArrowRight, Loader } from 'lucide-react';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const { loadSubscription } = useSubscriptionContext();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const verifySession = async () => {
      try {
        if (sessionId && user) {
          // Verify the session and update subscription data
          await fetch('/api/verify-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
              userId: user.uid,
            }),
          });
          
          // Reload subscription data
          await loadSubscription();
        }
      } catch (error) {
        console.error('Error verifying session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifySession();
  }, [sessionId, user, loadSubscription]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-500 dark:text-emerald-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-emerald-800 dark:text-emerald-200">
            Confirming your subscription...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-6 mx-auto">
          <CheckCircle className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">
          Subscription Successful!
        </h1>
        
        <p className="text-emerald-600 dark:text-emerald-400 mb-6">
          Thank you for subscribing to Simple Meals. Your subscription is now active, and you have full access to all features.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 
                  dark:bg-emerald-600 dark:hover:bg-emerald-700
                  text-white rounded-lg transition-colors duration-200"
        >
          <span>Continue to Simple Meals</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;