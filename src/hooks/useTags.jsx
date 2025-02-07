import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const useTags = () => {
  const [customTags, setCustomTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCustomTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const tagsRef = collection(db, 'tags');
      const userTagsQuery = query(tagsRef, where('userId', '==', userId));
      const snapshot = await getDocs(userTagsQuery);
      
      const loadedTags = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort tags alphabetically
      const sortedTags = loadedTags.sort((a, b) => a.name.localeCompare(b.name));
      setCustomTags(sortedTags);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveTag = useCallback(async (tagName) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      // Check if tag already exists for this user
      const tagsRef = collection(db, 'tags');
      const existingTagQuery = query(
        tagsRef, 
        where('userId', '==', userId),
        where('name', '==', tagName)
      );
      const existingTags = await getDocs(existingTagQuery);

      if (!existingTags.empty) {
        // Tag already exists, return existing tag
        const existingTag = {
          id: existingTags.docs[0].id,
          ...existingTags.docs[0].data()
        };
        return existingTag;
      }

      // Create new tag
      const newTagData = {
        name: tagName,
        userId,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(tagsRef, newTagData);
      const newTag = { id: docRef.id, ...newTagData };
      
      setCustomTags(prev => 
        [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name))
      );
      
      return newTag;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTag = useCallback(async (tagId) => {
    try {
      await deleteDoc(doc(db, 'tags', tagId));
      setCustomTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    customTags,
    loadCustomTags,
    saveTag,
    deleteTag,
    isLoading,
    error
  };
};