import React, { useRef, useEffect, useState } from 'react';
import { X, Check, Search, Plus } from 'lucide-react';
import AddNewDishModal from './AddNewDishModal';

const AddDishModal = ({ selectedDay, selectedDishType, onClose, dishes, onAddDish }) => {
  const modalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);
  const [showNewDishModal, setShowNewDishModal] = useState(false);
  const [newDish, setNewDish] = useState({ 
    name: '', 
    ingredients: [{ name: '', amount: '', unit: '' }],
    recipe: ''
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSelectDish = (dish) => {
    setSelectedDish(dish);
    onAddDish(dish.id, selectedDay, selectedDishType);
    onClose();
  };

  const handleNewDishSave = async () => {
    try {
      const savedDish = await onAddDish(newDish, selectedDay, selectedDishType, true);
      setNewDish({ 
        name: '', 
        recipe: '',
        ingredients: [{ name: '', amount: '', unit: '' }]
      });
      setShowNewDishModal(false);
      onClose();
      return savedDish;
    } catch (err) {
      console.error('Failed to save new dish:', err);
      throw err;
    }
  };

  // Filter dishes based on search query
  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showNewDishModal) {
    return (
      <AddNewDishModal
        isOpen={true}
        onClose={() => {
          setShowNewDishModal(false);
          setNewDish({ 
            name: '', 
            recipe: '',
            ingredients: [{ name: '', amount: '', unit: '' }]
          });
        }}
        newDish={newDish}
        setNewDish={setNewDish}
        addDish={handleNewDishSave}
      />
    );
  }

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

        {/* Create New Dish Button */}
        <button
          onClick={() => setShowNewDishModal(true)}
          className="w-full mb-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 
                    dark:bg-emerald-600 dark:hover:bg-emerald-700
                    text-white rounded-lg transition-colors duration-200
                    flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create New Dish
        </button>

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