import React, { useRef, useEffect } from 'react';
import { X, Moon, Sun, UtensilsCrossed } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, settings, onSettingChange }) => {
  const modalRef = useRef(null);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="border-b border-emerald-100 dark:border-gray-700 p-4 
                        flex justify-between items-center">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">Settings</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.darkMode ? (
                <Moon className="h-5 w-5 text-emerald-400" />
              ) : (
                <Sun className="h-5 w-5 text-emerald-600" />
              )}
              <span className="font-medium text-emerald-800 dark:text-emerald-400">
                Dark Mode
              </span>
            </div>
            <button
              onClick={() => onSettingChange('darkMode', !settings.darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                         ${settings.darkMode ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                           ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-emerald-800 dark:text-emerald-400">Dinner Only Mode</span>
            </div>
            <button
              onClick={() => onSettingChange('dinnerOnly', !settings.dinnerOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                         ${settings.dinnerOnly ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                           ${settings.dinnerOnly ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;