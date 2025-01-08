import React from 'react';
import { Plus, Loader } from 'lucide-react';
import IngredientInput from '../components/IngredientInput';

const AddDishForm = ({ newDish, setnewDish, addDish, isSaving, operationError }) => {
  const addIngredientField = () => {
    setnewDish(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }));
  };

  const updateIngredient = (index, field, value) => {
    setnewDish(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return { ...prev, ingredients: newIngredients };
    });
  };

  const removeIngredient = (indexToRemove) => {
    setnewDish(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <div className="border rounded-lg mb-6">
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4">Add New Dish</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Dish name"
            value={newDish.name}
            onChange={(e) => setnewDish(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
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
            className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ingredient
          </button>
          {operationError && (
            <div className="text-red-500 text-sm">{operationError}</div>
          )}
          <textarea
            placeholder="Recipe instructions"
            value={newDish.recipe}
            onChange={(e) => setnewDish(prev => ({ ...prev, recipe: e.target.value }))}
            className="w-full p-2 border rounded h-32"
          />
          <button 
            onClick={addDish}
            disabled={isSaving}
            className="w-full px-4 py-3 border-2 border-dashed border-emerald-200 
                 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 
                 transition-all duration-200
                 flex items-center justify-center gap-2
                 text-emerald-600 hover:text-emerald-700"
            aria-label="Add dish"
          >
            {isSaving ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            {isSaving ? <span className="font-medium">Saving...</span> : <span className="font-medium">Add Dish</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDishForm;