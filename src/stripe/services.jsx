import { SUBSCRIPTION_PRICES } from './config';

// Function to create a checkout session for subscription
export const createCheckoutSession = async (userId, priceId = SUBSCRIPTION_PRICES.MONTHLY) => {
  try {
    // Call your serverless function or backend endpoint
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        priceId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error creating checkout session');
    }

    const data = await response.json();
    return data.sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Function to create a customer portal session for managing subscriptions
export const createCustomerPortalSession = async (userId) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error creating portal session');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Function to cancel a subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error canceling subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};