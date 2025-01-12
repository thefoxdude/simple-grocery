import React, { useState } from 'react';
import { Check, ChevronDown, Plus, CircleUserRound, Trash2 } from 'lucide-react';
import AddManualItemModal from '../forms/AddManualItemModal';

export const GroceryListSection = ({ 
  title, 
  items, 
  checkedItems, 
  onToggleItem,
  onAddManualItem,
  onRemoveItem,
  isNeededSection = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Sort items: unchecked first, then checked
  const sortedItems = [...items].sort((a, b) => {
    const aChecked = checkedItems.has(items.indexOf(a));
    const bChecked = checkedItems.has(items.indexOf(b));
    if (aChecked === bChecked) return 0;
    return aChecked ? 1 : -1;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-left"
        >
          <h3 className="font-semibold text-lg text-emerald-800 dark:text-emerald-200">
            {title} ({items.length})
          </h3>
          <ChevronDown 
            className={`h-5 w-5 ml-2 text-emerald-600 dark:text-emerald-400 
                     transform transition-transform duration-200
                     ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        
        {isNeededSection && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 
                    dark:bg-emerald-600 dark:hover:bg-emerald-700
                    text-white rounded-lg transition-colors duration-200
                    flex items-center gap-1 text-sm shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        )}
      </div>
  
      {isOpen && (
        <div className="space-y-2">
          {sortedItems.map((item, index) => {
            const originalIndex = items.indexOf(item);
            const isChecked = checkedItems.has(originalIndex);
            
            return (
              <div
                key={item.id || index}
                className={`flex items-center p-3 rounded-lg bg-white dark:bg-gray-900
                          border border-emerald-50 dark:border-gray-700
                          transition-colors duration-200
                          ${isChecked ? 'bg-emerald-50 dark:bg-emerald-900/30' : ''}`}
              >
                <button
                  onClick={() => onToggleItem(originalIndex)}
                  className={`w-5 h-5 rounded border mr-3 flex items-center justify-center
                            transition-colors duration-200
                            ${isChecked
                              ? 'bg-emerald-500 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-600'
                              : 'border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500'}`}
                >
                  {isChecked && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
                <div className="flex-1 flex items-center gap-2">
                  <span className={`${isChecked 
                    ? 'line-through text-emerald-600 dark:text-emerald-500' 
                    : 'text-emerald-800 dark:text-emerald-200'}`}>
                    {item.name}
                  </span>
                  {item.isManual && (
                    <div className="relative group">
                      <CircleUserRound 
                        className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 cursor-help" 
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1
                                    bg-gray-900 dark:bg-gray-800 text-white text-xs rounded
                                    whitespace-nowrap opacity-0 pointer-events-none
                                    transition-opacity duration-200 delay-500
                                    group-hover:opacity-100">
                        This item was manually added
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {item.amount} {item.unit}
                  </span>
                  {onRemoveItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(originalIndex);
                      }}
                      className="p-1 text-red-400 dark:text-red-500 
                                hover:bg-red-50 dark:hover:bg-red-900/50 
                                rounded-full transition-colors duration-200"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
          {items.length === 0 && (
            <div className="text-center py-4 text-emerald-600 dark:text-emerald-400">
              No items in this list
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <AddManualItemModal
          onClose={() => setShowAddModal(false)}
          onAdd={onAddManualItem}
        />
      )}
    </div>
  );
};