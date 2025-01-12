import { useState, useCallback } from 'react';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const useGroceryList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadGroceryList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const groceryListRef = doc(db, 'groceryLists', userId);
      const manualItemsRef = doc(db, 'manualGroceryItems', userId);
      
      const [groceryListDoc, manualItemsDoc] = await Promise.all([
        getDoc(groceryListRef),
        getDoc(manualItemsRef)
      ]);
      
      const manualItems = manualItemsDoc.exists() ? manualItemsDoc.data().items || [] : [];
      
      if (groceryListDoc.exists()) {
        const groceryData = groceryListDoc.data();
        return {
          ...groceryData,
          neededItems: [...(groceryData.neededItems || []), ...manualItems]
        };
      }
      
      return {
        startDate: '',
        endDate: '',
        neededItems: manualItems,
        availableItems: [],
        checkedNeededItems: [],
        checkedPantryItems: []
      };
    } catch (err) {
      setError(err.message);
      console.error('Error loading grocery list:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveGroceryList = useCallback(async (groceryData) => {
    setIsSaving(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const groceryListRef = doc(db, 'groceryLists', userId);
      
      await setDoc(groceryListRef, {
        ...groceryData,
        updatedAt: new Date().toISOString()
      });

      return groceryData;
    } catch (err) {
      setError(err.message);
      console.error('Error saving grocery list:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const clearGroceryList = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const groceryListRef = doc(db, 'groceryLists', userId);
      await deleteDoc(groceryListRef);
    } catch (err) {
      setError(err.message);
      console.error('Error clearing grocery list:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const addManualItem = useCallback(async (item) => {
    setIsSaving(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const manualItemsRef = doc(db, 'manualGroceryItems', userId);
      const manualItemsDoc = await getDoc(manualItemsRef);
      
      const existingItems = manualItemsDoc.exists() ? manualItemsDoc.data().items || [] : [];
      const newItem = {
        ...item,
        id: crypto.randomUUID(),
        isManual: true,
        addedAt: new Date().toISOString()
      };
      
      await setDoc(manualItemsRef, {
        items: [...existingItems, newItem],
        updatedAt: new Date().toISOString()
      });

      return newItem;
    } catch (err) {
      setError(err.message);
      console.error('Error adding manual item:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const removeManualItem = useCallback(async (itemId) => {
    setIsSaving(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const manualItemsRef = doc(db, 'manualGroceryItems', userId);
      const manualItemsDoc = await getDoc(manualItemsRef);
      
      if (manualItemsDoc.exists()) {
        const existingItems = manualItemsDoc.data().items || [];
        await setDoc(manualItemsRef, {
          items: existingItems.filter(item => item.id !== itemId),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Error removing manual item:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    loadGroceryList,
    saveGroceryList,
    clearGroceryList,
    addManualItem,
    removeManualItem,
    isLoading,
    isSaving,
    error
  };
};