import React, { useState, useEffect } from 'react';
import { useMeals } from '../hooks/useMeals';
import AddMealForm from '../forms/AddMealForm';
import SearchBar from '../forms/SearchBar';
import MealList from './MealList';

const MealsTab = ({
  newMeal = { name: '', recipe: '', ingredients: [{ name: '', amount: '', unit: '' }] },
  setNewMeal
}) => {
  const [expandedMeals, setExpandedMeals] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    meals, 
    saveMeal, 
    deleteMeal, 
    isSaving, 
    isDeleting, 
    operationError, 
    loadUserMeals 
  } = useMeals();

  useEffect(() => {
    loadUserMeals();
  }, [loadUserMeals]);

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

  const addMeal = async () => {
    
    if (newMeal.name && newMeal.ingredients.some(i => i.name)) {
      const cleanedIngredients = newMeal.ingredients.filter(i => i.name);
      const mealData = {
        name: newMeal.name,
        recipe: newMeal.recipe || '',
        ingredients: cleanedIngredients
      };
      
      try {
        const savedMeal = await saveMeal(mealData);
        console.log('Meal saved successfully:', savedMeal);
        
        setNewMeal({ 
          name: '', 
          recipe: '',
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
      <AddMealForm
        newMeal={newMeal}
        setNewMeal={setNewMeal}
        addMeal={addMeal}
        isSaving={isSaving}
        operationError={operationError}
      />
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <MealList
        filteredMeals={filteredMeals}
        expandedMeals={expandedMeals}
        toggleMealExpansion={toggleMealExpansion}
        handleDeleteMeal={handleDeleteMeal}
        isDeleting={isDeleting}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default MealsTab;