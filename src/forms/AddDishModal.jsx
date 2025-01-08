import React, { useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

const AddDishModal = ({ selectedDay, selectedDishType, onClose, dishes, onAddDish }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} 
           className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-emerald-100 pb-4">
          <h2 className="text-lg font-bold text-emerald-800">
            <span className="block xl:hidden">Add Dish</span>
            <span className="hidden xl:block">Add Dish to {selectedDay} - {selectedDishType}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500" />
          </button>
        </div>
        <select 
          className="w-full p-2 border border-emerald-200 rounded-md text-emerald-800
                   focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                   bg-white transition-all duration-200"
          onChange={(e) => onAddDish(e.target.value, selectedDay, selectedDishType)}
        >
          <option value="" className="text-emerald-400">Choose a dish...</option>
          {dishes.map(dish => (
            <option key={dish.id} value={dish.id}>{dish.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddDishModal;