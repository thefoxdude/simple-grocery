import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual publishable key from the Stripe dashboard
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51R76iTRLVOhKjmkNKU3qHMpGw6HvBKsClusLHVMvFL9wdnFJNA4bZtdYTmmZZRmWIn4aCa5d6Mw6YgK9MK6HU8Kn00VBguDb4k';

// Price IDs for your subscription plans
export const SUBSCRIPTION_PRICES = {
  MONTHLY: 'price_1XYZ...', // Replace with your actual price ID
  YEARLY: 'price_1XYZ...', // Replace with your actual price ID
};

// Load the Stripe instance
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Trial period in days
export const TRIAL_PERIOD_DAYS = 7;