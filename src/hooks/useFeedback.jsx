import { useState, useCallback } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const useFeedback = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveFeedback = useCallback(async (feedbackData) => {
    setIsSaving(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const feedbackRef = collection(db, 'userFeedback');
      await addDoc(feedbackRef, {
        userId,
        enjoyment: feedbackData.enjoyment,
        feedback: feedbackData.feedback,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    saveFeedback,
    isSaving,
    error
  };
};