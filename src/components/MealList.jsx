import React from 'react';
import MealItem from './MealItem';

const MealList = ({ 
  filteredMeals, 
  expandedMeals, 
  toggleMealExpansion, 
  handleDeleteMeal, 
  isDeleting,
  searchQuery 
}) => {
  if (filteredMeals.length === 0 && searchQuery) {
    return (
      <div className="text-center py-8 text-gray-500">
        No meals found matching "{searchQuery}"
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredMeals.map(meal => (
        <MealItem
          key={meal.id}
          meal={meal}
          isExpanded={expandedMeals.has(meal.id)}
          onToggleExpand={() => toggleMealExpansion(meal.id)}
          onDelete={(e) => handleDeleteMeal(meal.id, e)}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default MealList;