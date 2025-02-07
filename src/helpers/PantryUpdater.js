import { convertToBaseUnit, getUnitType, canCompareUnits, VOLUME_CONVERSIONS, WEIGHT_CONVERSIONS } from './unitConversions';

export class PantryUpdater {
  constructor(pantryItems, savePantryItem, loadPantryItems) {
    this.pantryItems = pantryItems;
    this.savePantryItem = savePantryItem;
    this.loadPantryItems = loadPantryItems;
  }

  async updatePantryFromIngredients(ingredients, isAdding = true) {
    await this.loadPantryItems();
    
    for (const ingredient of ingredients) {
      // Group matching pantry items by unit type
      const matchingPantryItems = this.pantryItems
        .filter(item => item.name.toLowerCase() === ingredient.name.toLowerCase())
        .reduce((acc, item) => {
          const unitType = getUnitType(item.unit);
          if (!acc[unitType]) {
            acc[unitType] = [];
          }
          acc[unitType].push(item);
          return acc;
        }, {});
      
      const ingredientType = getUnitType(ingredient.unit);
      const ingredientBaseAmount = convertToBaseUnit(ingredient.amount, ingredient.unit);

      if (!ingredientType || ingredientBaseAmount === null) continue;

      // Get pantry items with compatible units
      const compatibleItems = matchingPantryItems[ingredientType] || [];
      
      if (compatibleItems.length === 0) {
        // Create new pantry item if no compatible matches found
        if (isAdding) {
          await this.savePantryItem({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit
          });
        }
        continue;
      }

      let remainingAmount = isAdding ? ingredientBaseAmount : -ingredientBaseAmount;

      // Sort compatible pantry items by amount in base units
      const sortedPantryItems = compatibleItems.sort((a, b) => {
        const aBase = convertToBaseUnit(a.amount, a.unit) || 0;
        const bBase = convertToBaseUnit(b.amount, b.unit) || 0;
        return bBase - aBase;
      });

      for (const pantryItem of sortedPantryItems) {
        if (remainingAmount === 0) break;
        
        // Skip if units are incompatible
        if (!canCompareUnits(pantryItem.unit, ingredient.unit)) continue;

        const pantryBaseAmount = convertToBaseUnit(pantryItem.amount, pantryItem.unit);
        if (pantryBaseAmount === null) continue;

        const newBaseAmount = pantryBaseAmount + remainingAmount;
        
        if (newBaseAmount >= 0) {
          let bestAmount = newBaseAmount;
          if (ingredientType !== 'count') {
            const conversions = ingredientType === 'volume' ? VOLUME_CONVERSIONS : WEIGHT_CONVERSIONS;
            bestAmount = newBaseAmount / conversions[pantryItem.unit];
          }

          await this.savePantryItem({
            ...pantryItem,
            amount: bestAmount.toFixed(2)
          });
          remainingAmount = 0;
        } else {
          await this.savePantryItem({
            ...pantryItem,
            amount: "0"
          });
          remainingAmount += pantryBaseAmount;
        }
      }

      // If there's still remaining amount after updating existing items, create a new item
      if (remainingAmount > 0 && isAdding) {
        let amount = remainingAmount;
        if (ingredientType !== 'count') {
          const conversions = ingredientType === 'volume' ? VOLUME_CONVERSIONS : WEIGHT_CONVERSIONS;
          amount = remainingAmount / conversions[ingredient.unit];
        }
        
        await this.savePantryItem({
          name: ingredient.name,
          amount: amount.toFixed(2),
          unit: ingredient.unit
        });
      }
    }
  }

  async completeMeal(dish, isCompleting = true) {
    if (!dish?.ingredients) return;
    await this.updatePantryFromIngredients(dish.ingredients, !isCompleting);
  }

  async completeGroceryItems(items) {
    await this.updatePantryFromIngredients(items, true);
  }
}