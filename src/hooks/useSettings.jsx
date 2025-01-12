import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const DEFAULT_SETTINGS = {
  darkMode: false,
  dinnerOnly: false
};

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const settingsRef = doc(db, 'userSettings', userId);
        const settingsDoc = await getDoc(settingsRef);
        
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data());
        } else {
          // Initialize default settings in the database
          await setDoc(settingsRef, DEFAULT_SETTINGS);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const settingsRef = doc(db, 'userSettings', userId);
      await setDoc(settingsRef, newSettings);
      setSettings(newSettings);
    } catch (err) {
      setError(err.message);
      console.error('Error saving settings:', err);
      throw err;
    }
  };

  return {
    settings,
    updateSettings,
    isLoading,
    error
  };
};