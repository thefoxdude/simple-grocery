import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';

const SubscriptionCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mb-6 mx-auto">
          <X className="h-8 w-8 text-red-500 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">
          Subscription Cancelled
        </h1>
        
        <p className="text-emerald-600 dark:text-emerald-400 mb-6">
          Your subscription was not completed. You can still use your trial period or subscribe again when you're ready.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 
                  dark:bg-emerald-600 dark:hover:bg-emerald-700
                  text-white rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Simple Meals</span>
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionCancel;