import React, { useRef, useEffect, useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

const AddDishModal = ({ selectedDay, selectedDishType, onClose, dishes, onAddDish }) => {
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDish] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleDropdownClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleDropdownClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleDropdownClickOutside);
    };
  }, [onClose]);

  const handleSelectDish = (dish) => {
    onAddDish(dish.id, selectedDay, selectedDishType);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} 
           className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 min-h-[200px] max-w-lg w-full">
        <div className="flex justify-between items-center mb-4 border-b border-emerald-100 dark:border-gray-700 pb-4">
          <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
            <span className="block xl:hidden">Add Dish</span>
            <span className="hidden xl:block">Add Dish to {selectedDay} - {selectedDishType}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full p-2 text-left border border-emerald-200 dark:border-gray-700 rounded-md
                     flex items-center justify-between
                     bg-white dark:bg-gray-800 
                     text-emerald-800 dark:text-emerald-200
                     hover:border-emerald-300 dark:hover:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <span className={selectedDish ? '' : 'text-emerald-400 dark:text-emerald-600'}>
              {selectedDish ? selectedDish.name : 'Choose a dish...'}
            </span>
            <ChevronDown className={`h-5 w-5 text-emerald-500 transform transition-transform duration-200
                                  ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-emerald-200 
                          dark:border-gray-700 rounded-md shadow-lg max-h-[300px] overflow-y-auto">
              <div className="space-y-1">
                {dishes.map(dish => (
                  <button
                    key={dish.id}
                    onClick={() => handleSelectDish(dish)}
                    className="w-full text-left px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900
                             text-emerald-800 dark:text-emerald-200
                             flex items-center justify-between
                             transition-colors duration-200"
                  >
                    <span>{dish.name}</span>
                    {selectedDish?.id === dish.id && (
                      <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    )}
                  </button>
                ))}

                {dishes.length === 0 && (
                  <div className="px-4 py-2 text-emerald-600 dark:text-emerald-400">
                    No dishes available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDishModal;