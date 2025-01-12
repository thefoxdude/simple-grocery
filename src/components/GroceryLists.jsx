import React from 'react';
import { GroceryListSection } from './GroceryListSection';

export const GroceryLists = ({ 
  neededItems, 
  pantryItems, 
  checkedNeededItems, 
  checkedPantryItems,
  onToggleNeededItem,
  onTogglePantryItem,
  onAddManualItem,
  onRemoveNeededItem,
  onRemovePantryItem
}) => {
  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-6">
        <GroceryListSection
          title="Items Needed"
          items={neededItems}
          checkedItems={checkedNeededItems}
          onToggleItem={onToggleNeededItem}
          onAddManualItem={onAddManualItem}
          onRemoveItem={onRemoveNeededItem}
          isNeededSection={true}
        />
        <GroceryListSection
          title="Already Have"
          items={pantryItems}
          checkedItems={checkedPantryItems}
          onToggleItem={onTogglePantryItem}
          onRemoveItem={onRemovePantryItem}
          isNeededSection={false}
        />
      </div>
  
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm 
                      border border-emerald-100 dark:border-gray-700">
          <GroceryListSection
            title="Items Needed"
            items={neededItems}
            checkedItems={checkedNeededItems}
            onToggleItem={onToggleNeededItem}
            onAddManualItem={onAddManualItem}
            onRemoveItem={onRemoveNeededItem}
            isNeededSection={true}
          />
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm 
                      border border-emerald-100 dark:border-gray-700">
          <GroceryListSection
            title="Already Have"
            items={pantryItems}
            checkedItems={checkedPantryItems}
            onToggleItem={onTogglePantryItem}
            onRemoveItem={onRemovePantryItem}
            isNeededSection={false}
          />
        </div>
      </div>
    </>
  );
};