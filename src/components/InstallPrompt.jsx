import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallAlert, setShowInstallAlert] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    console.log('InstallPrompt mounted');
    
    // Check if running in standalone mode (already installed)
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
    
    if (isInstalled) {
      console.log('App is already installed');
      return;
    }

    // Check PWA criteria
    const checkPWACriteria = () => {
      // Check HTTPS
      const isHttps = window.location.protocol === 'https:' 
        || window.location.hostname === 'localhost' 
        || window.location.hostname === '127.0.0.1';
      console.log('Is HTTPS or localhost:', isHttps);

      // Check service worker support
      const hasServiceWorkerSupport = 'serviceWorker' in navigator;
      console.log('Has service worker support:', hasServiceWorkerSupport);

      // Check if manifest exists
      const hasManifest = !!document.querySelector('link[rel="manifest"]');
      console.log('Has manifest:', hasManifest);

      // Check if running in a PWA-capable browser
      const isPWACapableBrowser = /chrome/i.test(navigator.userAgent) 
        || /edge/i.test(navigator.userAgent);
      console.log('Is PWA-capable browser:', isPWACapableBrowser);

      return isHttps && hasServiceWorkerSupport && hasManifest && isPWACapableBrowser;
    };

    console.log('PWA installation criteria met:', checkPWACriteria());

    const handler = (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallAlert(true);
      setDebugMode(false); // Turn off debug mode if we get a real prompt
    };

    window.addEventListener('beforeinstallprompt', handler);
    console.log('Added beforeinstallprompt event listener');

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !debugMode) {
      console.log('No deferred prompt available');
      // Show some user feedback about why installation isn't available
      alert('Installation is not available right now. Common reasons include:\n\n' +
            '- The app is already installed\n' +
            '- You\'re not using a supported browser\n' +
            '- You\'ve previously dismissed the install prompt\n\n' +
            'Try opening this site in Chrome or Edge if you\'re using a different browser.');
      return;
    }

    if (debugMode) {
      console.log('Debug mode: Simulating install prompt');
      alert('This is a simulated install prompt for testing.\n\n' +
            'In a real scenario, you would see the browser\'s native install prompt here.');
      setShowInstallAlert(false);
      setDebugMode(false);
      return;
    }

    console.log('Showing install prompt');
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
    } catch (error) {
      console.error('Error during installation:', error);
    }

    setDeferredPrompt(null);
    setShowInstallAlert(false);
  };

  // Force show the prompt for testing
  const debugShowPrompt = () => {
    console.log('Debug: Forcing prompt to show');
    setDebugMode(true);
    setShowInstallAlert(true);
  };

  if (!showInstallAlert) {
    // Show debug button only in non-production
    return process.env.NODE_ENV !== 'production' ? (
      <button 
        onClick={debugShowPrompt}
        className="fixed bottom-4 right-4 bg-gray-200 p-2 rounded"
      >
        Debug: Show Install Prompt
      </button>
    ) : null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Download className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold text-lg">Install App</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-3">
        Install Simple Meals on your device for quick access and offline use.
      </p>
      <button 
        onClick={handleInstallClick}
        className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
      >
        Install Now
      </button>
    </div>
  );
};

export default InstallPrompt;