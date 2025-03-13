import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load all friend connections
  const loadFriends = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) throw new Error('No user logged in');

      // Query friends collection where the current user is either the sender or the recipient
      // and the status is 'accepted'
      const friendsRef = collection(db, 'friends');
      const sentQuery = query(
        friendsRef, 
        where('senderEmail', '==', userEmail),
        where('status', '==', 'accepted')
      );
      const receivedQuery = query(
        friendsRef, 
        where('recipientEmail', '==', userEmail),
        where('status', '==', 'accepted')
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery)
      ]);
      
      // Process friend connections
      const friendsList = [];
      
      // Process friends where user is the sender
      for (const doc of sentSnapshot.docs) {
        const data = doc.data();
        friendsList.push({
          id: doc.id,
          email: data.recipientEmail,
          name: data.recipientName || '',
          since: data.updatedAt
        });
      }
      
      // Process friends where user is the recipient
      for (const doc of receivedSnapshot.docs) {
        const data = doc.data();
        friendsList.push({
          id: doc.id,
          email: data.senderEmail,
          name: data.senderName || '',
          since: data.updatedAt
        });
      }
      
      // Sort friends by name or email
      const sortedFriends = friendsList.sort((a, b) => {
        if (a.name && b.name) return a.name.localeCompare(b.name);
        if (a.name) return -1;
        if (b.name) return 1;
        return a.email.localeCompare(b.email);
      });
      
      setFriends(sortedFriends);
    } catch (err) {
      setError(err.message);
      console.error('Error loading friends:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load friend requests (both incoming and outgoing)
  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) throw new Error('No user logged in');

      // Query for incoming requests (where user is recipient and status is 'pending')
      const incomingQuery = query(
        collection(db, 'friends'),
        where('recipientEmail', '==', userEmail),
        where('status', '==', 'pending')
      );
      
      // Query for outgoing requests (where user is sender and status is 'pending')
      const outgoingQuery = query(
        collection(db, 'friends'),
        where('senderEmail', '==', userEmail),
        where('status', '==', 'pending')
      );

      const [incomingSnapshot, outgoingSnapshot] = await Promise.all([
        getDocs(incomingQuery),
        getDocs(outgoingQuery)
      ]);

      // Process incoming requests
      const incomingRequests = incomingSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.senderEmail,
          name: data.senderName || '',
          createdAt: data.createdAt
        };
      });
      
      // Process outgoing requests
      const outgoingRequests = outgoingSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.recipientEmail,
          createdAt: data.createdAt
        };
      });
      
      setRequests({
        incoming: incomingRequests,
        outgoing: outgoingRequests
      });
    } catch (err) {
      setError(err.message);
      console.error('Error loading friend requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a friend request by email
  const sendFriendRequest = useCallback(async (recipientEmail) => {
    setIsSaving(true);
    setError(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No user logged in');

      // Don't allow sending to your own email
      if (currentUser.email === recipientEmail) {
        throw new Error('You cannot send a friend request to yourself');
      }

      // First check if the request already exists (both directions)
      const friendsRef = collection(db, 'friends');
      
      // Check if I already sent a request to this email
      const sentQuery = query(
        friendsRef,
        where('senderEmail', '==', currentUser.email),
        where('recipientEmail', '==', recipientEmail)
      );
      
      // Check if I received a request from this email
      const receivedQuery = query(
        friendsRef,
        where('senderEmail', '==', recipientEmail),
        where('recipientEmail', '==', currentUser.email)
      );
      
      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery)
      ]);
      
      if (!sentSnapshot.empty) {
        throw new Error('You have already sent a request to this email');
      }
      
      if (!receivedSnapshot.empty) {
        throw new Error('This user has already sent you a friend request');
      }
      
      // Create the friend request
      const newRequest = {
        senderEmail: currentUser.email,
        recipientEmail: recipientEmail,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(friendsRef, newRequest);
      
      // Update local state
      setRequests(prev => ({
        ...prev,
        outgoing: [...prev.outgoing, {
          id: docRef.id,
          email: recipientEmail,
          createdAt: newRequest.createdAt
        }]
      }));
      
      return docRef.id;
    } catch (err) {
      setError(err.message);
      console.error('Error sending friend request:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Accept a friend request
  const acceptFriendRequest = useCallback(async (requestId) => {
    setIsSaving(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      const userEmail = auth.currentUser?.email;
      const userName = auth.currentUser?.displayName || '';
      
      if (!userId) throw new Error('No user logged in');

      // Get the request details
      const requestRef = doc(db, 'friends', requestId);
      const requestDoc = await getDoc(requestRef);
      
      if (!requestDoc.exists()) {
        throw new Error('Friend request not found');
      }
      
      // Update the request status to 'accepted' and add recipient details
      await updateDoc(requestRef, {
        status: 'accepted',
        recipientId: userId,
        recipientEmail: userEmail,
        recipientName: userName,
        updatedAt: new Date().toISOString()
      });
      
      // Find the request in our local state
      const request = requests.incoming.find(req => req.id === requestId);
      if (request) {
        // Add to friends list
        setFriends(prev => [
          ...prev,
          {
            id: requestId,
            userId: request.userId,
            email: request.email,
            name: request.name,
            since: new Date().toISOString()
          }
        ]);
        
        // Remove from incoming requests
        setRequests(prev => ({
          ...prev,
          incoming: prev.incoming.filter(req => req.id !== requestId)
        }));
      }
      
      // Refresh the data
      await Promise.all([loadFriends(), loadRequests()]);
    } catch (err) {
      setError(err.message);
      console.error('Error accepting friend request:', err);
    } finally {
      setIsSaving(false);
    }
  }, [requests.incoming, loadFriends, loadRequests]);

  // Decline or cancel a friend request
  const declineRequest = useCallback(async (requestId, type) => {
    setIsDeleting(true);
    setError(null);
    try {
      // Delete the request
      await deleteDoc(doc(db, 'friends', requestId));
      
      // Update local state based on request type
      if (type === 'incoming') {
        setRequests(prev => ({
          ...prev,
          incoming: prev.incoming.filter(req => req.id !== requestId)
        }));
      } else if (type === 'outgoing') {
        setRequests(prev => ({
          ...prev,
          outgoing: prev.outgoing.filter(req => req.id !== requestId)
        }));
      }
    } catch (err) {
      setError(err.message);
      console.error('Error declining friend request:', err);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Remove a friend
  const removeFriend = useCallback(async (friendId) => {
    setIsDeleting(true);
    setError(null);
    try {
      // Delete the friendship document
      await deleteDoc(doc(db, 'friends', friendId));
      
      // Update local state
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
    } catch (err) {
      setError(err.message);
      console.error('Error removing friend:', err);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    friends,
    requests,
    isLoading,
    error,
    isSaving,
    isDeleting,
    loadFriends,
    loadRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineRequest,
    removeFriend
  };
};