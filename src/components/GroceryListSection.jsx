import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export const GroceryListSection = ({ 
  title, 
  items, 
  checkedItems, 
  onToggleItem,
  defaultOpen = true,
  isMobile = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`space-y-4 ${isMobile ? 'w-full' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="font-semibold text-lg text-emerald-800 dark:text-emerald-200">
          {title} ({items.length})
        </h3>
        <ChevronDown 
          className={`h-5 w-5 text-emerald-600 dark:text-emerald-400 
                     transform transition-transform duration-200
                     ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
  
      {isOpen && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg bg-white dark:bg-gray-900
                        border border-emerald-50 dark:border-gray-700
                        transition-colors duration-200
                        ${checkedItems.has(index) 
                          ? 'bg-emerald-50 dark:bg-emerald-900/30' 
                          : ''}`}
            >
              <button
                onClick={() => onToggleItem(index)}
                className={`w-5 h-5 rounded border mr-3 flex items-center justify-center
                          transition-colors duration-200
                          ${checkedItems.has(index)
                            ? 'bg-emerald-500 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-600'
                            : 'border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500'}`}
              >
                {checkedItems.has(index) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </button>
              <span className={`flex-1 ${checkedItems.has(index) 
                ? 'line-through text-emerald-600 dark:text-emerald-500' 
                : 'text-emerald-800 dark:text-emerald-200'}`}>
                {item.name}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {item.amount} {item.unit}
              </span>
            </div>
          ))}
          
          {items.length === 0 && (
            <div className="text-center py-4 text-emerald-600 dark:text-emerald-400">
              No items in this list
            </div>
          )}
        </div>
      )}
    </div>
  );
};