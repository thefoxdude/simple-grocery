import React, { useRef, useEffect } from 'react';
import { X, Plus, Save, Loader } from 'lucide-react';
import IngredientInput from './IngredientInput';

const AddNewDishModal = ({ 
  isOpen, 
  onClose, 
  newDish, 
  setNewDish, 
  addDish, 
  isSaving, 
  operationError,
  isEditing = false
}) => {
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

  const addIngredientField = () => {
    setNewDish(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }));
  };

  const updateIngredient = (index, field, value) => {
    setNewDish(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return { ...prev, ingredients: newIngredients };
    });
  };

  const removeIngredient = (indexToRemove) => {
    setNewDish(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, index) => index !== indexToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="border-b border-emerald-100 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
            {isEditing ? 'Edit Dish' : 'Add New Dish'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Dish name"
            value={newDish.name}
            onChange={(e) => setNewDish(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border border-emerald-200 dark:border-gray-600 rounded-md 
                      bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-200
                      placeholder-emerald-400 dark:placeholder-emerald-500
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 
                      dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
          />
          
          {newDish.ingredients.map((ingredient, idx) => (
            <IngredientInput
              key={idx}
              ingredient={ingredient}
              onChange={(field, value) => updateIngredient(idx, field, value)}
              onRemove={newDish.ingredients.length > 1 ? () => removeIngredient(idx) : undefined}
            />
          ))}
          
          <button 
            onClick={addIngredientField}
            className="px-4 py-2 border-2 border-dashed border-emerald-200 dark:border-emerald-700
                      rounded-lg hover:border-emerald-400 dark:hover:border-emerald-500 
                      hover:bg-emerald-50 dark:hover:bg-gray-800
                      flex items-center text-emerald-600 dark:text-emerald-400 font-medium w-full
                      transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ingredient
          </button>

          {operationError && (
            <div className="text-red-500 dark:text-red-400 text-sm">{operationError}</div>
          )}

          <textarea
            placeholder="Recipe instructions"
            value={newDish.recipe}
            onChange={(e) => setNewDish(prev => ({ ...prev, recipe: e.target.value }))}
            className="w-full p-2 border border-emerald-200 dark:border-gray-600 rounded-md h-32
                      bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-200
                      placeholder-emerald-400 dark:placeholder-emerald-500
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                      dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
          />

          <button 
            onClick={addDish}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600
                      dark:bg-emerald-600 dark:hover:bg-emerald-700
                      text-white rounded-lg transition-colors duration-200
                      flex items-center justify-center gap-2 
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                {isEditing ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                <span>{isEditing ? 'Update Dish' : 'Add Dish'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewDishModal;