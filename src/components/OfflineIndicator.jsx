import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '../hooks/useOffline';

const OfflineIndicator = () => {
  const { isOnline, isSyncing, pendingChanges, sync } = useOffline();

  if (isOnline && !isSyncing && !pendingChanges) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 
                    bg-white dark:bg-gray-800 rounded-lg shadow-lg border 
                    border-emerald-100 dark:border-gray-700 p-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-emerald-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-amber-500" />
          )}
          <div>
            <p className="font-medium text-emerald-800 dark:text-emerald-200">
              {!isOnline && 'Offline Mode'}
              {isOnline && isSyncing && 'Syncing Changes...'}
              {isOnline && !isSyncing && pendingChanges > 0 && 'Changes Pending'}
            </p>
            {pendingChanges > 0 && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                {pendingChanges} {pendingChanges === 1 ? 'change' : 'changes'} pending
              </p>
            )}
          </div>
        </div>

        {isOnline && pendingChanges > 0 && !isSyncing && (
          <button
            onClick={sync}
            className="flex items-center gap-2 px-3 py-1 bg-emerald-100 
                      dark:bg-emerald-900 rounded-md text-sm font-medium
                      text-emerald-700 dark:text-emerald-300
                      hover:bg-emerald-200 dark:hover:bg-emerald-800
                      transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;