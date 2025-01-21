import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export const VERSION = '0.0.6'; // Update this with your app version

const VersionChecker = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkForUpdate = async () => {
      if ('serviceWorker' in navigator && navigator.onLine) {
        try {
          // Get all service worker registrations
          const registrations = await navigator.serviceWorker.getRegistrations();
          
          for (const registration of registrations) {
            // Check for updates
            await registration.update();

            // Check if there's a waiting worker
            if (registration.waiting) {
              setUpdateAvailable(true);
            }

            // Listen for new service workers
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            });
          }
        } catch (error) {
          console.error('Error checking for updates:', error);
        }
      }
    };

    // Check for updates immediately and then every 60 minutes
    checkForUpdate();
    const interval = setInterval(checkForUpdate, 60 * 60 * 1000);

    // Also check when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check when the app comes back online
    const handleOnline = () => {
      checkForUpdate();
    };
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleUpdate = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        if (registration.waiting) {
          // Send message to service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
      
      // Clear cache
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }

      // Reload the page
      window.location.reload();
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 
                    bg-emerald-600 text-white p-4 rounded-lg shadow-lg 
                    flex items-center justify-between">
      <span>A new version is available!</span>
      <button
        onClick={handleUpdate}
        className="flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-md
                   hover:bg-emerald-50 transition-colors duration-200"
      >
        <RefreshCw className="h-4 w-4" />
        Update Now
      </button>
    </div>
  );
};

export default VersionChecker;