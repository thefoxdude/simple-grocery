import React, { useState, useRef, useEffect } from 'react';
import { X, Share2, Loader, Search, UserCircle } from 'lucide-react';
import { useFriends } from '../hooks/useFriends';
import { useDishSharing } from '../hooks/useDishSharing';

const ShareDishModal = ({ isOpen, onClose, dish }) => {
  const modalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const { friends, loadFriends, isLoading: friendsLoading } = useFriends();
  const { shareDish, isSending, error: sharingError } = useDishSharing();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      loadFriends();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, loadFriends]);

  const handleClose = () => {
    if (!isSending) {
      setSearchQuery('');
      setSelectedFriend(null);
      setSuccess(false);
      setError(null);
      onClose();
    }
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    (friend.name && friend.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = async () => {
    if (!selectedFriend) {
      setError('Please select a friend to share with');
      return;
    }
    
    setError(null);
    try {
      await shareDish(dish, selectedFriend.email);
      setSuccess(true);
      
      // Reset and close after success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message || sharingError);
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
            Share Dish with a Friend
          </h3>
          <button
            onClick={handleClose}
            disabled={isSending}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-full transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!success ? (
            <>
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4">
                <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                  You are sharing <strong>{dish?.name}</strong> with a friend. They'll receive a notification and can import it into their collection.
                </p>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedFriend(null);
                  }}
                  disabled={isSending || friendsLoading}
                  className="w-full p-2 pl-10 border border-emerald-200 dark:border-gray-600 rounded-md
                          bg-white dark:bg-gray-800 
                          text-emerald-800 dark:text-emerald-200
                          placeholder-emerald-400 dark:placeholder-emerald-500
                          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                          disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 
                               text-emerald-400 dark:text-emerald-500" />
              </div>

              <div className="max-h-60 overflow-y-auto">
                {friendsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader className="h-6 w-6 animate-spin text-emerald-500 dark:text-emerald-400" />
                  </div>
                ) : filteredFriends.length > 0 ? (
                  <div className="space-y-2">
                    {filteredFriends.map(friend => (
                      <div
                        key={friend.id}
                        onClick={() => setSelectedFriend(friend)}
                        className={`p-3 rounded-lg cursor-pointer flex items-center
                                  ${selectedFriend?.id === friend.id 
                                    ? 'bg-emerald-100 dark:bg-emerald-900' 
                                    : 'hover:bg-emerald-50 dark:hover:bg-gray-800'}
                                  transition-colors duration-200`}
                      >
                        <UserCircle className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mr-3" />
                        <div>
                          <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                            {friend.name || friend.email}
                          </h4>
                          {friend.name && (
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                              {friend.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-emerald-600 dark:text-emerald-400">
                    {friends.length === 0 
                      ? "You don't have any friends yet. Add friends to share dishes." 
                      : `No friends found matching "${searchQuery}"`}
                  </div>
                )}
              </div>

              {error && (
                <div className="text-red-500 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button 
                onClick={handleShare}
                disabled={isSending || !selectedFriend}
                className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600
                        dark:bg-emerald-600 dark:hover:bg-emerald-700
                        text-white rounded-lg transition-colors duration-200
                        flex items-center justify-center gap-2 
                        disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Sharing...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-5 w-5" />
                    <span>Share Dish</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-4">
                <Share2 className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h4 className="text-xl font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                Dish Shared Successfully!
              </h4>
              <p className="text-emerald-600 dark:text-emerald-400">
                {selectedFriend?.name || selectedFriend?.email} will now be able to import this dish.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareDishModal;