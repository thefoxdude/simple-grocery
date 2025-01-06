import React from 'react';
import { Plus, Trash2, Loader } from 'lucide-react';
import { useMeals } from '../hooks/useMeals';

const MealsTab = ({ 
  meals = [], 
  setMeals,
  newMeal = { name: '', ingredients: [{ name: '', amount: '', unit: '' }] },
  setNewMeal
}) => {
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

  const { saveMeal, deleteMeal, isLoading, error } = useMeals();

  const addMeal = async () => {
    if (newMeal.name && newMeal.ingredients.some(i => i.name)) {
      const cleanedIngredients = newMeal.ingredients.filter(i => i.name);
      const mealData = {
        name: newMeal.name,
        ingredients: cleanedIngredients
      };
      
      try {
        const savedMeal = await saveMeal(mealData);
        setMeals([...meals, savedMeal]);
        setNewMeal({ 
          name: '', 
          ingredients: [{ name: '', amount: '', unit: '' }]
        });
      } catch (err) {
        // Error is handled by the hook
        console.error('Failed to save meal:', err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ingredient"
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                  className="w-24 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(idx, 'unit', e.target.value)}
                  className="w-24 p-2 border rounded"
                />
              </div>
            ))}
            <button 
              onClick={addIngredientField}
              className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Ingredient
            </button>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <button 
              onClick={addMeal}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Saving...' : 'Add Meal'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {meals.map(meal => (
          <div key={meal.id} className="border rounded-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{meal.name}</h3>
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={async () => {
                    try {
                      await deleteMeal(meal.id);
                      setMeals(meals.filter(m => m.id !== meal.id));
                    } catch (err) {
                      console.error('Failed to delete meal:', err);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Ingredients:</strong>
                <ul className="list-none mt-2 space-y-1">
                  {meal.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="mr-2">•</span>
                      {ingredient.name} - {ingredient.amount} {ingredient.unit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealsTab;