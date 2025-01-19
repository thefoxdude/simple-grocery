import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

const CustomInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check if user has previously dismissed the banner
    const hasUserDismissed = localStorage.getItem('installBannerDismissed');
    
    // Show banner if not installed and not dismissed
    if (!isInstalled && !hasUserDismissed) {
      // Wait 30 seconds before showing the banner
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 30000);

      return () => clearTimeout(timer);
    }

    // Listen for the beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        if (outcome === 'accepted') {
          setShowBanner(false);
          localStorage.setItem('installBannerDismissed', 'true');
        }
      } catch (error) {
        console.error('Error during installation:', error);
      }
      setDeferredPrompt(null);
    } else {
      // If no deferred prompt, provide instructions
      alert('To install this app:\n\n' +
            '1. Open this site in Chrome or Edge\n' +
            '2. Click the browser menu (three dots)\n' +
            '3. Look for "Install Meal Planner" or "Add to Home screen"');
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Download className="h-6 w-6 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Install Meal Planner
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Add to your device for quick access and offline use
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors text-sm"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomInstallBanner;