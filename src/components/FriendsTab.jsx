import React, { useState, useEffect } from 'react';
import { useFriends } from '../hooks/useFriends';
import { Users, UserPlus, Loader, Search, UserX, Clock, Check, X } from 'lucide-react';
import SendRequestModal from '../forms/SendRequestModal';

const FriendsTab = () => {
  const [activeSection, setActiveSection] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const { 
    friends, 
    requests, 
    isLoading, 
    error,
    loadFriends, 
    loadRequests, 
    acceptFriendRequest, 
    declineRequest, 
    removeFriend
  } = useFriends();

  useEffect(() => {
    // Load data when the component mounts
    const loadData = async () => {
      await Promise.all([loadFriends(), loadRequests()]);
    };
    loadData();
  }, [loadFriends, loadRequests]);

  // Filter friends or requests based on search query
  const filteredFriends = friends.filter(friend => 
    friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    friend.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIncomingRequests = requests.incoming.filter(request => 
    request.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    request.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOutgoingRequests = requests.outgoing.filter(request => 
    request.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-emerald-500 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Friends</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 
                    dark:bg-emerald-600 dark:hover:bg-emerald-700
                    text-white rounded-lg transition-colors duration-200
                    flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          Add Friend
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 
                       text-red-800 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="bg-emerald-50 dark:bg-gray-800 rounded-lg p-6 space-y-6">
        {/* Section Tabs */}
        <div className="flex border-b border-emerald-200 dark:border-gray-700">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeSection === 'friends'
                ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'text-emerald-500 dark:text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            onClick={() => setActiveSection('friends')}
          >
            My Friends ({friends.length})
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeSection === 'requests'
                ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'text-emerald-500 dark:text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            onClick={() => setActiveSection('requests')}
          >
            Requests ({requests.incoming.length + requests.outgoing.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border border-emerald-200 dark:border-gray-600 rounded-md
                       bg-white dark:bg-gray-800 
                       text-emerald-800 dark:text-emerald-200
                       placeholder-emerald-400 dark:placeholder-emerald-500
                       focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          />
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 
                           text-emerald-400 dark:text-emerald-500" />
        </div>

        {/* Content based on active section */}
        {activeSection === 'friends' && (
          <div className="space-y-4">
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <div
                  key={friend.id}
                  className="flex justify-between items-center bg-white dark:bg-gray-900 
                            p-4 rounded-lg shadow-sm hover:shadow-md 
                            transition-all duration-200 group
                            border border-emerald-100 dark:border-gray-700"
                >
                  <div>
                    <h3 className="font-medium text-emerald-800 dark:text-emerald-200">
                      {friend.name || friend.email}
                    </h3>
                    {friend.name && (
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                        {friend.email}
                      </p>
                    )}
                    <p className="text-emerald-500 dark:text-emerald-500 text-xs mt-1">
                      Friends since {formatDate(friend.since)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFriend(friend.id)}
                    className="p-2 text-red-400 dark:text-red-500 
                            hover:bg-red-50 dark:hover:bg-red-900/50 
                            rounded-full transition-colors duration-200
                            opacity-0 group-hover:opacity-100"
                    aria-label="Remove friend"
                  >
                    <UserX className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
                {searchQuery 
                  ? `No friends found matching "${searchQuery}"`
                  : "You don't have any friends yet. Send a friend request to get started!"}
              </div>
            )}
          </div>
        )}

        {activeSection === 'requests' && (
          <div className="space-y-6">
            {/* Incoming Requests */}
            <div>
              <h3 className="font-medium text-emerald-800 dark:text-emerald-200 mb-3">
                Incoming Requests
              </h3>
              {filteredIncomingRequests.length > 0 ? (
                <div className="space-y-3">
                  {filteredIncomingRequests.map(request => (
                    <div
                      key={request.id}
                      className="flex justify-between items-center bg-white dark:bg-gray-900 
                                p-4 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-700"
                    >
                      <div>
                        <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                          {request.name || request.email}
                        </h4>
                        {request.name && (
                          <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                            {request.email}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-emerald-500 dark:text-emerald-500" />
                          <p className="text-emerald-500 dark:text-emerald-500 text-xs">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptFriendRequest(request.id)}
                          className="p-2 text-emerald-500 dark:text-emerald-400 
                                    hover:bg-emerald-50 dark:hover:bg-emerald-900/50 
                                    rounded-full transition-colors duration-200"
                          aria-label="Accept request"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => declineRequest(request.id, 'incoming')}
                          className="p-2 text-red-400 dark:text-red-500 
                                    hover:bg-red-50 dark:hover:bg-red-900/50 
                                    rounded-full transition-colors duration-200"
                          aria-label="Decline request"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-900 rounded-lg p-4 border border-emerald-100 dark:border-gray-700">
                  {searchQuery 
                    ? `No incoming requests matching "${searchQuery}"`
                    : "No pending friend requests"}
                </div>
              )}
            </div>

            {/* Outgoing Requests */}
            <div>
              <h3 className="font-medium text-emerald-800 dark:text-emerald-200 mb-3">
                Outgoing Requests
              </h3>
              {filteredOutgoingRequests.length > 0 ? (
                <div className="space-y-3">
                  {filteredOutgoingRequests.map(request => (
                    <div
                      key={request.id}
                      className="flex justify-between items-center bg-white dark:bg-gray-900 
                                p-4 rounded-lg shadow-sm border border-emerald-100 dark:border-gray-700"
                    >
                      <div>
                        <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                          {request.email}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-emerald-500 dark:text-emerald-500" />
                          <p className="text-emerald-500 dark:text-emerald-500 text-xs">
                            Sent {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => declineRequest(request.id, 'outgoing')}
                        className="p-2 text-red-400 dark:text-red-500 
                                hover:bg-red-50 dark:hover:bg-red-900/50 
                                rounded-full transition-colors duration-200"
                        aria-label="Cancel request"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-900 rounded-lg p-4 border border-emerald-100 dark:border-gray-700">
                  {searchQuery 
                    ? `No outgoing requests matching "${searchQuery}"`
                    : "No pending outgoing requests"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <SendRequestModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
};

export default FriendsTab;