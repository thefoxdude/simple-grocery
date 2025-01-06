import React from 'react';
import { Trash2, ChevronDown, Loader } from 'lucide-react';

const MealItem = ({ meal, isExpanded, onToggleExpand, onDelete, isDeleting }) => {
  return (
    <div className="border rounded-lg">
      <div className="p-4">
        <div 
          className="w-full flex items-center justify-between cursor-pointer"
          onClick={onToggleExpand}
        >
          <h3 className="font-bold">{meal.name}</h3>
          <div className="flex items-center">
            <button
              className="p-1 hover:bg-gray-100 rounded mr-2"
              onClick={onDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        {isExpanded && (
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
  );
};

export default MealItem;