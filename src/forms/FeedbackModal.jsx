import React, { useRef, useEffect, useState } from 'react';
import { X, MessageSquarePlus, Bug } from 'lucide-react';
import { useFeedback } from '../hooks/useFeedback';

const FeedbackModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [feedback, setFeedback] = useState('');
  const [enjoyment, setEnjoyment] = useState(null);
  const { saveFeedback, isSaving, error: saveError } = useFeedback();
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (!enjoyment) {
      setValidationError('Please select how you feel about the app');
      return;
    }

    setValidationError(null);

    try {
      await saveFeedback({
        enjoyment,
        feedback,
        isBugReport: enjoyment === 'bug'
      });
      
      // Reset form and close modal
      setFeedback('');
      setEnjoyment(null);
      onClose();
    } catch (err) {
      console.error('Failed to save feedback:', err);
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
            Send Feedback
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300">
              How are you enjoying the app?
            </label>
            <div className="flex justify-center gap-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setEnjoyment('bug')}
                  className={`flex flex-col items-center p-3 rounded-lg
                            transition-all duration-200 
                            ${enjoyment === 'bug' 
                              ? 'bg-red-300 dark:bg-red-900 scale-110' 
                              : 'hover:bg-emerald-50 dark:hover:bg-gray-800'}`}
                >
                  <Bug className="h-8 w-8 mb-1 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    Report Bug
                  </span>
                </button>
                <button
                  onClick={() => setEnjoyment('sad')}
                  className={`flex flex-col items-center p-3 rounded-lg
                            transition-all duration-200 
                            ${enjoyment === 'sad' 
                              ? 'bg-emerald-50 dark:bg-emerald-900 scale-110' 
                              : 'hover:bg-emerald-50 dark:hover:bg-gray-800'}`}
                >
                  <span className="text-2xl mb-1">☹️</span>
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    Not great
                  </span>
                </button>
                <button
                  onClick={() => setEnjoyment('neutral')}
                  className={`flex flex-col items-center p-3 rounded-lg
                            transition-all duration-200 
                            ${enjoyment === 'neutral' 
                              ? 'bg-emerald-50 dark:bg-emerald-900 scale-110' 
                              : 'hover:bg-emerald-50 dark:hover:bg-gray-800'}`}
                >
                  <span className="text-2xl mb-1">😐</span>
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    It's okay
                  </span>
                </button>
                <button
                  onClick={() => setEnjoyment('happy')}
                  className={`flex flex-col items-center p-3 rounded-lg
                            transition-all duration-200 
                            ${enjoyment === 'happy' 
                              ? 'bg-emerald-50 dark:bg-emerald-900 scale-110' 
                              : 'hover:bg-emerald-50 dark:hover:bg-gray-800'}`}
                >
                  <span className="text-2xl mb-1">😊</span>
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    Love it!
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300">
              What's on your mind?
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or report issues..."
              className="w-full p-3 border border-emerald-200 dark:border-gray-600 rounded-lg
                        bg-white dark:bg-gray-800 
                        text-emerald-800 dark:text-emerald-200
                        placeholder-emerald-400 dark:placeholder-emerald-500
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                        min-h-[100px]"
            />
          </div>

          {(validationError || saveError) && (
            <div className="text-red-500 dark:text-red-400 text-sm">
              {validationError || saveError}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600
                      dark:bg-emerald-600 dark:hover:bg-emerald-700
                      text-white rounded-lg transition-colors duration-200
                      flex items-center justify-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <MessageSquarePlus className="h-5 w-5" />
                <span>Send Feedback</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;