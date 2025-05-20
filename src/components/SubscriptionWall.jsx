import React, { useState } from 'react';
import { useSubscriptionContext } from '../contexts/SubscriptionProvider';
import { createCheckoutSession } from '../stripe/services';
import { useAuth } from '../hooks/useAuth';
import { stripePromise, SUBSCRIPTION_PRICES } from '../stripe/config';
import { Clock, CreditCard, CheckCircle, Loader } from 'lucide-react';

const SubscriptionWall = () => {
  const { getTrialDaysLeft } = useSubscriptionContext();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  
  const trialDaysLeft = getTrialDaysLeft();
  const isTrialEnded = trialDaysLeft <= 0;
  
  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const priceId = selectedPlan === 'monthly' 
        ? SUBSCRIPTION_PRICES.MONTHLY 
        : SUBSCRIPTION_PRICES.YEARLY;
      
      const sessionId = await createCheckoutSession(user.uid, priceId);
      const stripe = await stripePromise;
      
      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      alert('There was an error redirecting to checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-emerald-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-300 mb-2">
            {isTrialEnded ? 'Trial Ended' : 'Your Trial Period'}
          </h2>
          
          {!isTrialEnded ? (
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" />
              <span className="text-lg text-emerald-600 dark:text-emerald-400">
                {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left
              </span>
            </div>
          ) : (
            <p className="text-emerald-600 dark:text-emerald-400 mb-4">
              Your trial period has ended. Subscribe to continue using Simple Meals.
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 text-center">
            Choose a Plan
          </h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                        ${selectedPlan === 'monthly' 
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Monthly</h4>
                {selectedPlan === 'monthly' && (
                  <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                )}
              </div>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">$4.99 <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400">/month</span></p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                Billed monthly
              </p>
            </div>
            
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                        ${selectedPlan === 'yearly' 
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'}`}
              onClick={() => setSelectedPlan('yearly')}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Yearly</h4>
                {selectedPlan === 'yearly' && (
                  <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                )}
              </div>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">$39.99 <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400">/year</span></p>
                <span className="ml-2 text-xs font-medium bg-emerald-100 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full">
                  Save 33%
                </span>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                Billed annually
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 
                      dark:bg-emerald-600 dark:hover:bg-emerald-700
                      text-white rounded-lg transition-colors duration-200
                      flex items-center justify-center gap-2 
                      disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Subscribe Now</span>
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 space-y-2">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              Subscription includes:
            </h4>
            <ul className="space-y-2 text-emerald-600 dark:text-emerald-400">
              <li className="flex items-start">
                <span className="text-emerald-500 dark:text-emerald-400 mr-2">•</span>
                <span>Unlimited meal planning</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 dark:text-emerald-400 mr-2">•</span>
                <span>Full pantry management</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 dark:text-emerald-400 mr-2">•</span>
                <span>Automatic grocery lists</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-500 dark:text-emerald-400 mr-2">•</span>
                <span>Share recipes with friends</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionWall;