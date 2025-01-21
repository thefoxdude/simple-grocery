import React, { useRef, useEffect, useState } from 'react';
import { X, ChevronDown, Check, Search } from 'lucide-react';

const AddDishModal = ({ selectedDay, selectedDishType, onClose, dishes, onAddDish }) => {
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter dishes based on search query
  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Search Input */}
        <div className="mb-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border border-emerald-200 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 
                       text-emerald-800 dark:text-emerald-200
                       placeholder-emerald-400 dark:placeholder-emerald-500
                       focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 
                           text-emerald-400" />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {filteredDishes.length > 0 ? (
            <div className="space-y-1">
              {filteredDishes.map(dish => (
                <button
                  key={dish.id}
                  onClick={() => handleSelectDish(dish)}
                  className="w-full text-left px-4 py-3 hover:bg-emerald-50 dark:hover:bg-emerald-900
                           text-emerald-800 dark:text-emerald-200
                           flex items-center justify-between
                           transition-colors duration-200 rounded-md"
                >
                  <span>{dish.name}</span>
                  {selectedDish?.id === dish.id && (
                    <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
              {searchQuery ? (
                <>No dishes found matching "{searchQuery}"</>
              ) : (
                <>No dishes available</>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDishModal;