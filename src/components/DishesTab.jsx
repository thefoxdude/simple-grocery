import React, { useState, useEffect } from 'react';
import { useDishes } from '../hooks/useDishes';
import SearchBar from '../forms/SearchBar';
import DishList from './DishList';
import AddNewDishModal from '../forms/AddNewDishModal';
import { Plus, Loader, Salad } from 'lucide-react';

const DishesTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDish, setNewDish] = useState({ 
    name: '', 
    ingredients: [{ name: '', amount: '', unit: '' }],
    recipe: ''
  });
  const [expandedDishes, setExpandedDishes] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDish, setEditingDish] = useState(null);
  
  const { 
    dishes, 
    saveDish, 
    deleteDish, 
    isSaving, 
    isDeleting,
    isLoading,
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
    setExpandedDishes(prev => {
      const next = new Set(prev);
      if (next.has(dishId)) {
        next.delete(dishId);
      } else {
        next.add(dishId);
      }
      return next;
    });
  };

  const handleEditDish = (dish) => {
    setEditingDish(dish);
    setNewDish({
      ...dish,
      ingredients: [...dish.ingredients]
    });
    setIsModalOpen(true);
  };

  const addDish = async () => {
    if (newDish.name && newDish.ingredients.some(i => i.name)) {
      const cleanedIngredients = newDish.ingredients.filter(i => i.name);
      const dishData = {
        name: newDish.name,
        recipe: newDish.recipe || '',
        ingredients: cleanedIngredients
      };
      
      if (editingDish) {
        dishData.id = editingDish.id;
      }
      
      try {
        const savedDish = await saveDish(dishData);
        console.log('Dish saved successfully:', savedDish);
        
        setNewDish({ 
          name: '', 
          recipe: '',
          ingredients: [{ name: '', amount: '', unit: '' }]
        });
        setIsModalOpen(false);
        setEditingDish(null);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-emerald-500 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Salad className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Dishes</h2>
        </div>
        <button
          onClick={() => {
            setEditingDish(null);
            setNewDish({ 
              name: '', 
              recipe: '',
              ingredients: [{ name: '', amount: '', unit: '' }]
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 
                    text-white rounded-lg transition-colors duration-200
                    flex items-center gap-2
                    dark:bg-emerald-600 dark:hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          Add New Dish
        </button>
      </div>

      <div className="bg-emerald-50 dark:bg-gray-800 rounded-lg p-6 space-y-6">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchString='Search Dishes...'
        />
        <DishList
          filteredDishes={filteredDishes}
          expandedDishes={expandedDishes}
          toggleDishExpansion={toggleDishExpansion}
          handleDeleteDish={handleDeleteDish}
          handleEditDish={handleEditDish}
          isDeleting={isDeleting}
          searchQuery={searchQuery}
        />
      </div>

      <AddNewDishModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDish(null);
          setNewDish({ 
            name: '', 
            recipe: '',
            ingredients: [{ name: '', amount: '', unit: '' }]
          });
        }}
        newDish={newDish}
        setNewDish={setNewDish}
        addDish={addDish}
        isSaving={isSaving}
        operationError={operationError}
        isEditing={!!editingDish}
      />
    </div>
  );
};

export default DishesTab;