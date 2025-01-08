import React from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

const DayColumn = ({ 
  day, 
  dishes, 
  isExpanded, 
  onToggleExpand, 
  onAddDish, 
  onRemoveDish, 
  weekPlan,
  isCurrentDay,
  isPastDay
}) => {
  // Get background color based on day status
  const getBackgroundColor = () => {
    if (isPastDay) return 'bg-gray-50';
    if (isCurrentDay) return 'bg-emerald-50';
    return 'bg-white';
  };

  // Get meal item background color
  const getMealItemBg = () => {
    if (isCurrentDay) return 'bg-emerald-100';
    if (!isPastDay) return 'bg-emerald-50';
    return 'bg-gray-100';
  };

  return (
    <div className={`border border-emerald-100 rounded-lg h-full shadow-sm 
                    hover:shadow-md transition-shadow duration-200 
                    ${getBackgroundColor()}`}>
      <div className="p-3 xl:p-4">
        <button 
          className={`w-full flex justify-between items-center mb-2 xl:mb-4 py-2
                     ${isCurrentDay ? 'text-emerald-700' : 'text-emerald-800'} 
                     hover:text-emerald-600 transition-colors duration-200`}
          onClick={() => onToggleExpand(day)}
        >
          <span className="font-bold text-sm xl:text-base">{day}</span>
          <ChevronDown 
            className={`h-4 w-4 transform transition-transform duration-200 text-emerald-500
                       ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
        {isExpanded && (
          <div className="space-y-3 xl:space-y-4">
            {['breakfast', 'lunch', 'dinner', 'snacks'].map(dishType => (
              <div key={dishType} className="border-t border-emerald-100 pt-2">
                <h4 className="font-medium capitalize text-sm xl:text-base text-emerald-700">{dishType}</h4>
                <div className="mt-1 space-y-1">
                  {weekPlan[day][dishType].map((dish, idx) => (
                    <div key={`${dish.id}-${idx}`} 
                      className={`flex items-center justify-between p-2 rounded-md
                               text-sm text-emerald-800 group
                               ${getMealItemBg()}`}
                    >
                      <span className="truncate mr-2">{dish.name}</span>
                      <button 
                        className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200
                                 opacity-0 group-hover:opacity-100"
                        onClick={() => onRemoveDish(day, dishType, idx)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                  <button 
                    className={`w-full mt-1 px-2 py-1.5 text-sm border border-emerald-200
                             rounded-md hover:bg-emerald-50 hover:border-emerald-300
                             flex items-center justify-center text-emerald-600
                             transition-all duration-200 ${isPastDay ? 'opacity-50' : ''}`}
                    onClick={() => onAddDish(day, dishType)}
                    disabled={isPastDay}
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