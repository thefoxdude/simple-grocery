import { useState, useCallback } from 'react';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useMeals = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveMeal = useCallback(async (mealData) => {
    setIsLoading(true);
    setError(null);
    try {
      const mealsRef = collection(db, 'meals');
      const docRef = await addDoc(mealsRef, mealData);
      setIsLoading(false);
      return { id: docRef.id, ...mealData };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const deleteMeal = useCallback(async (mealId) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'meals', mealId));
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    saveMeal,
    deleteMeal,
    isLoading,
    error
  };
};