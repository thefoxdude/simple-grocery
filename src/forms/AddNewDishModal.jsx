import React, { useRef, useEffect } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import IngredientInput from '../components/IngredientInput';

const AddNewDishModal = ({ 
  isOpen, 
  onClose, 
  newDish, 
  setNewDish, 
  addDish, 
  isSaving, 
  operationError 
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
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="border-b border-emerald-100 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-emerald-800">Add New Dish</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Dish name"
            value={newDish.name}
            onChange={(e) => setNewDish(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border border-emerald-200 rounded-md 
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
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
            className="px-4 py-2 border-2 border-dashed border-emerald-200 
                      rounded-lg hover:border-emerald-400 hover:bg-emerald-50 
                      flex items-center text-emerald-600 font-medium w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ingredient
          </button>

          {operationError && (
            <div className="text-red-500 text-sm">{operationError}</div>
          )}

          <textarea
            placeholder="Recipe instructions"
            value={newDish.recipe}
            onChange={(e) => setNewDish(prev => ({ ...prev, recipe: e.target.value }))}
            className="w-full p-2 border border-emerald-200 rounded-md h-32
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          />

          <button 
            onClick={addDish}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600
                      text-white rounded-lg transition-colors duration-200
                      flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Add Dish</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewDishModal;