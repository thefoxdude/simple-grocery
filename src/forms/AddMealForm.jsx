import React from 'react';
import { Plus, Loader } from 'lucide-react';
import IngredientInput from '../components/IngredientInput';

const AddMealForm = ({ newMeal, setNewMeal, addMeal, isSaving, operationError }) => {
  const addIngredientField = () => {
    setNewMeal(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }));
  };

  const updateIngredient = (index, field, value) => {
    setNewMeal(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return { ...prev, ingredients: newIngredients };
    });
  };

  return (
    <div className="border rounded-lg mb-6">
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4">Add New Meal</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Meal name"
            value={newMeal.name}
            onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
          />
          {newMeal.ingredients.map((ingredient, idx) => (
            <IngredientInput
              key={idx}
              ingredient={ingredient}
              onChange={(field, value) => updateIngredient(idx, field, value)}
            />
          ))}
          <textarea
            placeholder="Recipe instructions"
            value={newMeal.recipe}
            onChange={(e) => setNewMeal(prev => ({ ...prev, recipe: e.target.value }))}
            className="w-full p-2 border rounded h-32"
          />
          <button 
            onClick={addIngredientField}
            className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ingredient
          </button>
          {operationError && (
            <div className="text-red-500 text-sm">{operationError}</div>
          )}
          <button 
            onClick={addMeal}
            disabled={isSaving}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Add Meal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMealForm;