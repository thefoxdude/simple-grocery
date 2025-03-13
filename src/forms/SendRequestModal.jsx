import React, { useState, useRef, useEffect } from 'react';
import { X, UserPlus, Loader, Mail } from 'lucide-react';
import { useFriends } from '../hooks/useFriends';

const SendRequestModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { sendFriendRequest, isSaving } = useFriends();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    if (!isSaving) {
      setEmail('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    
    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      await sendFriendRequest(email);
      setSuccess(true);
      
      // Close the modal after a short delay
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="border-b border-emerald-100 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
            Send Friend Request
          </h3>
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-full transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-emerald-700 dark:text-emerald-300">
            Enter the email address of the person you want to add as a friend. They'll receive a friend request.
          </p>
          
          <div className="relative">
            <input
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSaving || success}
              className="w-full p-2 pl-10 border border-emerald-200 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-800 
                       text-emerald-800 dark:text-emerald-200
                       placeholder-emerald-400 dark:placeholder-emerald-500
                       focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Mail className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 
                           text-emerald-400 dark:text-emerald-500" />
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="text-emerald-500 dark:text-emerald-400 text-sm">
              Friend request sent successfully!
            </div>
          )}

          <button 
            onClick={handleSubmit}
            disabled={isSaving || !email || success}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600
                      dark:bg-emerald-600 dark:hover:bg-emerald-700
                      text-white rounded-lg transition-colors duration-200
                      flex items-center justify-center gap-2 
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Send Request</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendRequestModal;