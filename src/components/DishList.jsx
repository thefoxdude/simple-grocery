import React from 'react';
import DishItem from './DishItem';

const DishList = ({ 
  filteredDishes, 
  expandedDishes, 
  toggleDishExpansion, 
  handleDeleteDish,
  handleEditDish,
  handleCopyDish,
  handleShareDish,
  isDeleting,
  searchQuery 
}) => {
  if (filteredDishes.length === 0 && searchQuery) {
    return (
      <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
        No dishes found matching "{searchQuery}"
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredDishes.map(dish => (
        <DishItem
          key={dish.id}
          dish={dish}
          isExpanded={expandedDishes.has(dish.id)}
          onToggleExpand={() => toggleDishExpansion(dish.id)}
          onDelete={(e) => handleDeleteDish(dish.id, e)}
          onEdit={handleEditDish}
          onCopy={handleCopyDish}
          onShare={handleShareDish}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default DishList;