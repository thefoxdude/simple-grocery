import React from 'react';
import { ChevronDown, Loader, Trash2 } from 'lucide-react';

const DishItem = ({ dish, isExpanded, onToggleExpand, onDelete, isDeleting }) => {
  return (
    <div className="group border border-emerald-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white overflow-hidden">
      <div className="p-4">
        <div 
          className="w-full flex items-center justify-between cursor-pointer"
          onClick={onToggleExpand}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          onKeyDown={(e) => e.key === 'Enter' && onToggleExpand()}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-emerald-800 group-hover:text-emerald-600 transition-colors duration-200">
              {dish.name}
            </h3>
            <ChevronDown 
              className={`h-5 w-5 transform transition-transform duration-200 text-emerald-500
                ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
          <button
            className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            disabled={isDeleting}
            aria-label={isDeleting ? "Deleting dish..." : "Delete dish"}
          >
            {isDeleting ? (
              <Loader className="h-4 w-4 animate-spin text-red-500" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-400" />
            )}
          </button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4 text-emerald-900">
            <div className="space-y-2">
              <h4 className="font-semibold text-emerald-700">Ingredients:</h4>
              <ul className="list-none space-y-2">
                {dish.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center bg-emerald-50 p-2 rounded-md">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                    <span className="text-emerald-800">
                      {ingredient.name} - {ingredient.amount} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {dish.recipe && (
              <div className="space-y-2">
                <h4 className="font-semibold text-emerald-700">Recipe:</h4>
                <p className="whitespace-pre-wrap bg-emerald-50 p-3 rounded-md text-emerald-800">
                  {dish.recipe}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DishItem;