import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const AddMealModal = ({ selectedDay, selectedMealType, onClose, meals, onAddMeal }) => {
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
      <div ref={modalRef} className="bg-white rounded-lg p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            <span className="block xl:hidden">Add Meal</span>
            <span className="hidden xl:block">Add Meal to {selectedDay} - {selectedMealType}</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
        <select 
          className="w-full p-2 border rounded"
          onChange={(e) => onAddMeal(e.target.value, selectedDay, selectedMealType)}
        >
          <option value="">Choose a meal...</option>
          {meals.map(meal => (
            <option key={meal.id} value={meal.id}>{meal.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddMealModal;