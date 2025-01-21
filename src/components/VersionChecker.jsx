import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export const VERSION = '0.0.4'; // Update this with your app version

const VersionChecker = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
  
    useEffect(() => {
      const checkForUpdate = async () => {
        // Only proceed if service worker is supported and we're online
        if ('serviceWorker' in navigator && navigator.onLine) {
          try {
            // Get the current registration
            const registration = await navigator.serviceWorker.ready;
            
            // Trigger an update check
            await registration.update();
            
            // Listen for the controlling service worker changing
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              setUpdateAvailable(true);
            });
          } catch (error) {
            console.error('Error checking for updates:', error);
          }
        }
      };
  
      // Check for updates when component mounts (page loads/refreshes)
      checkForUpdate();
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