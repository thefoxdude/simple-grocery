import React, { useState, useEffect } from 'react';
import { useDishes } from '../hooks/useDishes';
import SearchBar from '../forms/SearchBar';
import DishList from './DishList';
import AddDishForm from '../forms/AddDishForm';

const DishesTab = () => {
  const [newDish, setnewDish] = useState({ 
    name: '', 
    ingredients: [{ name: '', amount: '', unit: '' }]
  })
  const [expandedDishes, setexpandedDishes] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    dishes, 
    saveDish, 
    deleteDish, 
    isSaving, 
    isDeleting, 
    operationError, 
    loadUserDishes 
  } = useDishes();

  useEffect(() => {
    loadUserDishes();
  }, [loadUserDishes]);

  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDishExpansion = (dishId) => {
    setexpandedDishes(prev => {
      const next = new Set(prev);
      if (next.has(dishId)) {
        next.delete(dishId);
      } else {
        next.add(dishId);
      }
      return next;
    });
  };

  const addDish = async () => {
    if (newDish.name && newDish.ingredients.some(i => i.name)) {
      const cleanedIngredients = newDish.ingredients.filter(i => i.name);
      const dishData = {
        name: newDish.name,
        recipe: newDish.recipe || '',
        ingredients: cleanedIngredients
      };
      
      try {
        const savedDish = await saveDish(dishData);
        console.log('Dish saved successfully:', savedDish);
        
        setnewDish({ 
          name: '', 
          recipe: '',
          ingredients: [{ name: '', amount: '', unit: '' }]
        });
      } catch (err) {
        console.error('Failed to save dish:', err);
      }
    }
  };

  const handleDeleteDish = async (dishId, e) => {
    e.stopPropagation();
    try {
      await deleteDish(dishId);
    } catch (err) {
      console.error('Failed to delete dish:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <AddDishForm
        newDish={newDish}
        setnewDish={setnewDish}
        addDish={addDish}
        isSaving={isSaving}
        operationError={operationError}
      />
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <DishList
        filteredDishes={filteredDishes}
        expandedDishes={expandedDishes}
        toggleDishExpansion={toggleDishExpansion}
        handleDeleteDish={handleDeleteDish}
        isDeleting={isDeleting}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default DishesTab;