import { useState, useCallback } from 'react';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const useMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [operationError, setOperationError] = useState(null);

  const loadUserMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const mealsRef = collection(db, 'meals');
      const userMealsQuery = query(mealsRef, where('userId', '==', userId));
      const snapshot = await getDocs(userMealsQuery);
      
      const loadedMeals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort meals alphabetically by name
      const sortedMeals = loadedMeals.sort((a, b) => a.name.localeCompare(b.name));
      
      setMeals(sortedMeals);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveMeal = useCallback(async (mealData) => {
    setIsSaving(true);
    setOperationError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const mealsRef = collection(db, 'meals');
      const mealWithUser = {
        ...mealData,
        userId,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(mealsRef, mealWithUser);
      const newMeal = { id: docRef.id, ...mealWithUser };
      setMeals(prevMeals => [...prevMeals, newMeal]);
      return newMeal;
    } catch (err) {
      setOperationError(err.message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteMeal = useCallback(async (mealId) => {
    setIsDeleting(true);
    setOperationError(null);
    try {
      await deleteDoc(doc(db, 'meals', mealId));
      setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
    } catch (err) {
      setOperationError(err.message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    meals,
    setMeals,
    loadUserMeals,
    saveMeal,
    deleteMeal,
    isLoading,        // Initial loading state
    isSaving,         // Save operation state
    isDeleting,       // Delete operation state
    error,            // Initial loading error
    operationError    // Save/Delete operation error
  };
};