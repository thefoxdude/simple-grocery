import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader, ChevronDown, Search } from 'lucide-react';
import { useMeals } from '../hooks/useMeals';

const MealsTab = ({
  newMeal = { name: '', ingredients: [{ name: '', amount: '', unit: '' }] },
  setNewMeal
}) => {
  const [expandedMeals, setExpandedMeals] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const { meals, saveMeal, deleteMeal, isSaving, isDeleting, operationError, loadUserMeals } = useMeals();

  useEffect(() => {
    loadUserMeals();
  }, [loadUserMeals]);

  // Filter meals based on search query
  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMealExpansion = (mealId) => {
    setExpandedMeals(prev => {
      const next = new Set(prev);
      if (next.has(mealId)) {
        next.delete(mealId);
      } else {
        next.add(mealId);
      }
      return next;
    });
  };

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

  const addMeal = async () => {
    if (newMeal.name && newMeal.ingredients.some(i => i.name)) {
      const cleanedIngredients = newMeal.ingredients.filter(i => i.name);
      const mealData = {
        name: newMeal.name,
        ingredients: cleanedIngredients
      };
      
      try {
        await saveMeal(mealData);
        setNewMeal({ 
          name: '', 
          ingredients: [{ name: '', amount: '', unit: '' }]
        });
      } catch (err) {
        console.error('Failed to save meal:', err);
      }
    }
  };

  const handleDeleteMeal = async (mealId, e) => {
    e.stopPropagation();
    try {
      await deleteMeal(mealId);
    } catch (err) {
      console.error('Failed to delete meal:', err);
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

      {/* Search Bar */}
      <div className="mb-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border rounded bg-white"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredMeals.map(meal => (
          <div key={meal.id} className="border rounded-lg">
            <div className="p-4">
              <div 
                className="w-full flex items-center justify-between cursor-pointer"
                onClick={() => toggleMealExpansion(meal.id)}
              >
                <h3 className="font-bold">{meal.name}</h3>
                <div className="flex items-center">
                  <button
                    className="p-1 hover:bg-gray-100 rounded mr-2"
                    onClick={(e) => handleDeleteMeal(meal.id, e)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                  <ChevronDown 
                    className={`h-4 w-4 transform transition-transform ${
                      expandedMeals.has(meal.id) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
              
              {expandedMeals.has(meal.id) && (
                <div className="mt-4 text-sm text-gray-600">
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
              )}
            </div>
          </div>
        ))}

        {/* No results message */}
        {filteredMeals.length === 0 && searchQuery && (
          <div className="text-center py-8 text-gray-500">
            No meals found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default MealsTab;