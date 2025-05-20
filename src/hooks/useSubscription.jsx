import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { TRIAL_PERIOD_DAYS } from '../stripe/config';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user's subscription data
  const loadSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      // Get the user's subscription document
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (subscriptionDoc.exists()) {
        setSubscription(subscriptionDoc.data());
      } else {
        // Create a new subscription record with trial period
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + TRIAL_PERIOD_DAYS);
        
        const newSubscription = {
          userId,
          status: 'trialing',
          trialEnd: trialEndDate.toISOString(),
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        
        await setDoc(subscriptionRef, newSubscription);
        setSubscription(newSubscription);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading subscription:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update subscription with Stripe data
  const updateSubscription = useCallback(async (stripeSubscription) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const subscriptionRef = doc(db, 'subscriptions', userId);
      
      await updateDoc(subscriptionRef, {
        stripeSubscriptionId: stripeSubscription.id,
        status: stripeSubscription.status,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        priceId: stripeSubscription.items.data[0].price.id,
        isActive: ['active', 'trialing'].includes(stripeSubscription.status),
        updatedAt: new Date().toISOString(),
      });
      
      // Refresh the subscription data
      await loadSubscription();
      
    } catch (err) {
      setError(err.message);
      console.error('Error updating subscription:', err);
      throw err;
    }
  }, [loadSubscription]);

  // Listen for subscription changes (e.g., when webhooks update the status)
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const subscriptionRef = doc(db, 'subscriptions', userId);
    const unsubscribe = onSnapshot(subscriptionRef, (doc) => {
      if (doc.exists()) {
        setSubscription(doc.data());
      }
    }, (error) => {
      console.error('Error listening to subscription changes:', error);
    });

    return () => unsubscribe();
  }, []);

  // Check if user's subscription is active
  const isSubscriptionActive = useCallback(() => {
    if (!subscription) return false;
    
    // In trial period
    if (subscription.status === 'trialing') {
      const trialEnd = new Date(subscription.trialEnd);
      return trialEnd > new Date();
    }
    
    // Active subscription
    return subscription.isActive;
  }, [subscription]);

  // Calculate days left in trial
  const getTrialDaysLeft = useCallback(() => {
    if (!subscription || subscription.status !== 'trialing') return 0;
    
    const trialEnd = new Date(subscription.trialEnd);
    const today = new Date();
    const diffTime = trialEnd - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }, [subscription]);

  return {
    subscription,
    loadSubscription,
    updateSubscription,
    isSubscriptionActive,
    getTrialDaysLeft,
    isLoading,
    error
  };
};