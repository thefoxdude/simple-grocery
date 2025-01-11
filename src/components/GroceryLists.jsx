import React from 'react';
import { GroceryListSection } from './GroceryListSection';

export const GroceryLists = ({ 
  neededItems, 
  pantryItems, 
  checkedNeededItems, 
  checkedPantryItems,
  onToggleNeededItem,
  onTogglePantryItem
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
          defaultOpen={true}
          isMobile={true}
        />
        <GroceryListSection
          title="Already Have"
          items={pantryItems}
          checkedItems={checkedPantryItems}
          onToggleItem={onTogglePantryItem}
          defaultOpen={false}
          isMobile={true}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        <GroceryListSection
          title="Items Needed"
          items={neededItems}
          checkedItems={checkedNeededItems}
          onToggleItem={onToggleNeededItem}
        />
        <GroceryListSection
          title="Already Have"
          items={pantryItems}
          checkedItems={checkedPantryItems}
          onToggleItem={onTogglePantryItem}
        />
      </div>
    </>
  );
};