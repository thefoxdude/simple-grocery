import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export const VERSION = '1.0.0'; // Update this with your app version

const VersionChecker = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      // Add listener for new service worker
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });

      // Check for updates every 5 minutes
      const checkForUpdates = async () => {
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.update();
        } catch (error) {
          console.error('Error checking for updates:', error);
        }
      };

      const interval = setInterval(checkForUpdates, 5 * 60 * 1000);
      
      // Initial check
      checkForUpdates();

      return () => clearInterval(interval);
    }
  }, []);

  const handleUpdate = () => {
    // Clear cache and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    window.location.reload(true);
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