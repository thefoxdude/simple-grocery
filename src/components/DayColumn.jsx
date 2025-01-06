import React from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

const DayColumn = ({ 
  day, 
  meals, 
  isExpanded, 
  onToggleExpand, 
  onAddMeal, 
  onRemoveMeal, 
  weekPlan 
}) => {
  return (
    <div className="border rounded-lg h-full bg-white">
      <div className="p-3 xl:p-4">
        <button 
          className="w-full flex justify-between items-center mb-2 xl:mb-4 py-2"
          onClick={() => onToggleExpand(day)}
        >
          <span className="font-bold text-sm xl:text-base">{day}</span>
          <ChevronDown 
            className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
        {isExpanded && (
          <div className="space-y-3 xl:space-y-4">
            {['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => (
              <div key={mealType} className="border-t pt-2">
                <h4 className="font-medium capitalize text-sm xl:text-base">{mealType}</h4>
                <div className="mt-1 space-y-1">
                  {weekPlan[day][mealType].map((meal, idx) => (
                    <div key={`${meal.id}-${idx}`} 
                      className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                    >
                      <span className="truncate mr-2">{meal.name}</span>
                      <button 
                        className="p-1 hover:bg-gray-200 rounded shrink-0"
                        onClick={() => onRemoveMeal(day, mealType, idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    className="w-full mt-1 px-2 py-1 text-sm border rounded-md hover:bg-gray-50 flex items-center justify-center"
                    onClick={() => onAddMeal(day, mealType)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DayColumn;