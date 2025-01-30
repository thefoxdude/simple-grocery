import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { enableIndexedDbPersistence } from 'firebase/firestore';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    // Enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support offline persistence.');
      }
    });

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for sync messages from service worker
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data.type === 'SYNC_COMPLETED') {
        setIsSyncing(false);
        setPendingChanges(0);
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Wrapper for Firestore operations
  const offlineAwareOperation = useCallback(async (operation) => {
    try {
      if (!isOnline) {
        setPendingChanges(prev => prev + 1);
      }
      const result = await operation();
      return result;
    } catch (error) {
      if (!isOnline) {
        // Store operation in IndexedDB for later sync
        await storeOfflineOperation(operation);
      }
      throw error;
    }
  }, [isOnline]);

  // Force sync when back online
  const sync = useCallback(async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    try {
      const offlineOps = await loadOfflineOperations();
      for (const op of offlineOps) {
        await op();
      }
      setPendingChanges(0);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline]);

  return {
    isOnline,
    isSyncing,
    pendingChanges,
    offlineAwareOperation,
    sync
  };
};

// Helper functions for storing/loading offline operations
const OFFLINE_STORE_KEY = 'offline_operations';

async function storeOfflineOperation(operation) {
  const stored = JSON.parse(localStorage.getItem(OFFLINE_STORE_KEY) || '[]');
  stored.push(operation.toString());
  localStorage.setItem(OFFLINE_STORE_KEY, JSON.stringify(stored));
}

async function loadOfflineOperations() {
  const stored = JSON.parse(localStorage.getItem(OFFLINE_STORE_KEY) || '[]');
  localStorage.removeItem(OFFLINE_STORE_KEY);
  return stored.map(op => eval(op));
}