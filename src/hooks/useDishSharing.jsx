import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const useDishSharing = () => {
  const [pendingDishes, setPendingDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);

  // Load pending dishes that have been shared with the current user
  const loadPendingDishes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) throw new Error('No user logged in');

      const dishSharingRef = collection(db, 'dishSharing');
      const pendingQuery = query(
        dishSharingRef,
        where('recipientEmail', '==', userEmail),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(pendingQuery);
      
      const loadedDishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPendingDishes(loadedDishes);
      return loadedDishes;
    } catch (err) {
      setError(err.message);
      console.error('Error loading pending dishes:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Share a dish with a friend
  const shareDish = useCallback(async (dish, recipientEmail) => {
    setIsSending(true);
    setError(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No user logged in');

      // Don't allow sharing with yourself
      if (currentUser.email === recipientEmail) {
        throw new Error('You cannot share a dish with yourself');
      }

      // Create a copy of the dish without the id field
      const dishToShare = { ...dish };
      delete dishToShare.id;

      // Create the sharing record
      const dishSharingRef = collection(db, 'dishSharing');
      const sharingData = {
        dish: dishToShare,
        senderEmail: currentUser.email,
        recipientEmail: recipientEmail,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await addDoc(dishSharingRef, sharingData);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error sharing dish:', err);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, []);

  // Import a shared dish to your own collection
  const importDish = useCallback(async (sharingId, saveDish) => {
    setIsImporting(true);
    setError(null);
    try {
      // Find the sharing record
      const sharingRecord = pendingDishes.find(dish => dish.id === sharingId);
      if (!sharingRecord) throw new Error('Shared dish not found');

      // Save the dish using the provided saveDish function
      await saveDish(sharingRecord.dish);

      // Update the sharing record status to 'imported'
      const sharingRef = doc(db, 'dishSharing', sharingId);
      await updateDoc(sharingRef, {
        status: 'imported',
        importedAt: new Date().toISOString()
      });

      // Remove from pending dishes list
      setPendingDishes(prev => prev.filter(dish => dish.id !== sharingId));
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error importing dish:', err);
      throw err;
    } finally {
      setIsImporting(false);
    }
  }, [pendingDishes]);

  // Decline a shared dish
  const declineDish = useCallback(async (sharingId) => {
    setIsImporting(true);
    setError(null);
    try {
      // Update the sharing record status to 'declined'
      const sharingRef = doc(db, 'dishSharing', sharingId);
      await updateDoc(sharingRef, {
        status: 'declined',
        declinedAt: new Date().toISOString()
      });

      // Remove from pending dishes list
      setPendingDishes(prev => prev.filter(dish => dish.id !== sharingId));
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error declining dish:', err);
      throw err;
    } finally {
      setIsImporting(false);
    }
  }, []);

  return {
    pendingDishes,
    loadPendingDishes,
    shareDish,
    importDish,
    declineDish,
    isLoading,
    isSending,
    isImporting,
    error
  };
};