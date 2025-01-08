import { useState, useCallback } from 'react';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const useDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [operationError, setOperationError] = useState(null);

  const loadUserDishes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const dishesRef = collection(db, 'dishes');
      const userDishesQuery = query(dishesRef, where('userId', '==', userId));
      const snapshot = await getDocs(userDishesQuery);
      
      const loadedDishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort dishes alphabetically by name
      const sortedDishes = loadedDishes.sort((a, b) => a.name.localeCompare(b.name));
      
      setDishes(sortedDishes);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveDish = useCallback(async (dishData) => {
    setIsSaving(true);
    setOperationError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const dishesRef = collection(db, 'dishes');
      const dishWithUser = {
        ...dishData,
        userId,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(dishesRef, dishWithUser);
      const newDish = { id: docRef.id, ...dishWithUser };
      setDishes(prevDishes => [...prevDishes, newDish]);
      return newDish;
    } catch (err) {
      setOperationError(err.message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteDish = useCallback(async (dishId) => {
    setIsDeleting(true);
    setOperationError(null);
    try {
      await deleteDoc(doc(db, 'dishes', dishId));
      setDishes(prevDishes => prevDishes.filter(dish => dish.id !== dishId));
    } catch (err) {
      setOperationError(err.message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    dishes,
    setDishes,
    loadUserDishes,
    saveDish,
    deleteDish,
    isLoading,        // Initial loading state
    isSaving,         // Save operation state
    isDeleting,       // Delete operation state
    error,            // Initial loading error
    operationError    // Save/Delete operation error
  };
};