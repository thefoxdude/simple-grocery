import { 
    VOLUME_CONVERSIONS, 
    WEIGHT_CONVERSIONS, 
    getUnitType, 
    convertToBaseUnit 
} from './unitConversions';

/**
 * Finds the most appropriate display unit for a base amount
 * @param {number} baseAmount - The amount in base units (ml or g)
 * @param {string} unitType - 'volume' or 'weight'
 * @param {string[]} preferredUnits - Units to prefer when converting back (original recipe unit, pantry unit)
 * @returns {{amount: number, unit: string}} Converted amount and appropriate unit
 */
export const findBestDisplayUnit = (baseAmount, unitType, preferredUnits = []) => {
    if (unitType === 'count') {
        // For count units, always use the first preferred unit or default to 'piece'
        const unit = preferredUnits.find(u => u) || 'piece';
        // For dozen, convert the amount
        const amount = unit === 'dozen' ? baseAmount / 12 : baseAmount;
        return { amount, unit };
    }

    const conversions = unitType === 'volume' ? VOLUME_CONVERSIONS : WEIGHT_CONVERSIONS;

    // First try preferred units
    for (const unit of preferredUnits) {
        if (!unit) continue;
        const conversionFactor = conversions[unit];
        if (conversionFactor) {
        const amount = baseAmount / conversionFactor;
        // If amount is between 0.1 and 1000 in this unit, use it
        if (amount >= 0.1 && amount < 1000) {
            return { amount, unit };
        }
        }
    }

    // Find the most appropriate unit
    let bestUnit = Object.keys(conversions)[0];
    let bestAmount = baseAmount / conversions[bestUnit];

    for (const [unit, factor] of Object.entries(conversions)) {
        const amount = baseAmount / factor;
        // Prefer units that give numbers between 0.1 and 100
        if (amount >= 0.1 && amount < 100) {
        bestUnit = unit;
        bestAmount = amount;
        break;
        }
        // Otherwise pick the unit that gives the most reasonable number
        if (Math.abs(1 - amount) < Math.abs(1 - bestAmount)) {
        bestUnit = unit;
        bestAmount = amount;
        }
    }

    return { amount: bestAmount, unit: bestUnit };
};

/**
 * Generates a grocery list by comparing needed ingredients with pantry items
 * @param {Map<string, Object>} ingredientMap - Map of all ingredients needed from recipes
 * @param {Array<Object>} pantryItems - Array of items in pantry
 * @returns {{needed: Array, available: Array}} Lists of needed and available items
 */
export const generateGroceryList = (ingredientMap, pantryItems) => {
    // First pass: Convert all ingredients to base units and aggregate
    const totalNeeded = new Map();

    Array.from(ingredientMap.values()).forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        const baseAmount = convertToBaseUnit(ingredient.amount, ingredient.unit);
        const unitType = getUnitType(ingredient.unit);
        
        if (baseAmount !== null && unitType) {
        if (totalNeeded.has(key)) {
            const existing = totalNeeded.get(key);
            if (existing.unitType === unitType) {
            existing.baseAmount += baseAmount;
            } else {
            // If unit types don't match, keep them as separate entries
            const newKey = `${key}-${unitType}`;
            totalNeeded.set(newKey, {
                name: ingredient.name,
                baseAmount,
                unitType,
                originalUnit: ingredient.unit
            });
            }
        } else {
            totalNeeded.set(key, {
            name: ingredient.name,
            baseAmount,
            unitType,
            originalUnit: ingredient.unit
            });
        }
        }
    });

    const needed = [];
    const available = [];

    // Second pass: Compare with pantry items
    totalNeeded.forEach((neededItem, itemKey) => {
        const matchingPantryItem = pantryItems.find(item => {
        const itemUnitType = getUnitType(item.unit);
        const sameType = itemUnitType === neededItem.unitType;
        const sameName = item.name.toLowerCase() === itemKey.split('-')[0];
        return sameName && sameType;
        });

        if (matchingPantryItem) {
        const pantryBaseAmount = convertToBaseUnit(matchingPantryItem.amount, matchingPantryItem.unit);
        
        if (pantryBaseAmount !== null) {
            if (pantryBaseAmount >= neededItem.baseAmount) {
            // We have enough - show the amount needed rather than pantry amount
            const { amount: displayAmount, unit: displayUnit } = findBestDisplayUnit(
                neededItem.baseAmount,
                neededItem.unitType,
                [neededItem.originalUnit, matchingPantryItem.unit]
            );
            available.push({
                name: neededItem.name,
                amount: Math.round(displayAmount * 100) / 100,
                unit: displayUnit
            });
            } else {
            // We need more
            const remainingBaseAmount = neededItem.baseAmount - pantryBaseAmount;
            const { amount: displayAmount, unit: displayUnit } = findBestDisplayUnit(
                remainingBaseAmount,
                neededItem.unitType,
                [neededItem.originalUnit, matchingPantryItem.unit]
            );

            needed.push({
                name: neededItem.name,
                amount: Math.round(displayAmount * 100) / 100,
                unit: displayUnit
            });
            
            // Add what we're using from pantry to available
            const { amount: availableAmount, unit: availableUnit } = findBestDisplayUnit(
                pantryBaseAmount,
                neededItem.unitType,
                [neededItem.originalUnit, matchingPantryItem.unit]
            );
            available.push({
                name: neededItem.name,
                amount: Math.round(availableAmount * 100) / 100,
                unit: availableUnit
            });
            }
        }
        } else {
        // Don't have any matching pantry items
        const { amount: displayAmount, unit: displayUnit } = findBestDisplayUnit(
            neededItem.baseAmount,
            neededItem.unitType,
            [neededItem.originalUnit]
        );

        needed.push({
            name: neededItem.name,
            amount: Math.round(displayAmount * 100) / 100,
            unit: displayUnit
        });
        }
    });

    return { needed, available };
};