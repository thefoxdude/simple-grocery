import { useState, useCallback } from 'react';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const usePantry = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [operationError, setOperationError] = useState(null);

  const loadPantryItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const pantryRef = collection(db, 'pantry');
      const userPantryQuery = query(pantryRef, where('userId', '==', userId));
      const snapshot = await getDocs(userPantryQuery);
      
      const loadedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort items alphabetically by name
      const sortedItems = loadedItems.sort((a, b) => a.name.localeCompare(b.name));
      
      setPantryItems(sortedItems);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePantryItem = useCallback(async (itemData) => {
    setIsSaving(true);
    setOperationError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      // If itemData has an id, update existing item
      if (itemData.id) {
        const itemRef = doc(db, 'pantry', itemData.id);
        const updateData = {
          name: itemData.name,
          amount: itemData.amount,
          unit: itemData.unit,
          updatedAt: new Date().toISOString()
        };
        await updateDoc(itemRef, updateData);
        
        setPantryItems(prevItems => 
          prevItems.map(item => 
            item.id === itemData.id 
              ? { ...item, ...updateData }
              : item
          ).sort((a, b) => a.name.localeCompare(b.name))
        );
        
        return { ...itemData, ...updateData };
      } else {
        // Create new item
        const pantryRef = collection(db, 'pantry');
        const itemWithUser = {
          ...itemData,
          userId,
          createdAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(pantryRef, itemWithUser);
        const newItem = { id: docRef.id, ...itemWithUser };
        setPantryItems(prevItems => 
          [...prevItems, newItem].sort((a, b) => a.name.localeCompare(b.name))
        );
        return newItem;
      }
    } catch (err) {
      setOperationError(err.message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deletePantryItem = useCallback(async (itemId) => {
    setIsDeleting(true);
    setOperationError(null);
    try {
      await deleteDoc(doc(db, 'pantry', itemId));
      setPantryItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (err) {
      setOperationError(err.message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    pantryItems,
    setPantryItems,
    loadPantryItems,
    savePantryItem,
    deletePantryItem,
    isLoading,
    isSaving,
    isDeleting,
    error,
    operationError
  };
};