// Convert everything to milliliters for volume and grams for weight
const VOLUME_CONVERSIONS = {
    'teaspoon (tsp)': 4.92892,
    'tablespoon (tbsp)': 14.7868,
    'fluid ounce (fl oz)': 29.5735,
    'cup': 236.588,
    'pint (pt)': 473.176,
    'quart (qt)': 946.353,
    'gallon (gal)': 3785.41,
    'milliliter (ml)': 1,
    'liter (l)': 1000
};

const WEIGHT_CONVERSIONS = {
    'ounce (oz)': 28.3495,
    'pound (lb)': 453.592,
    'gram (g)': 1,
    'kilogram (kg)': 1000
};

const COUNT_UNITS = new Set([
    'piece',
    'dozen',
    'pack',
    'can',
    'bottle',
    'box'
]);

// Organize units by category for UI display
export const MEASUREMENT_UNITS = {
    Volume: Object.keys(VOLUME_CONVERSIONS),
    Weight: Object.keys(WEIGHT_CONVERSIONS),
    Count: Array.from(COUNT_UNITS)
};

// Helper to get all units as a flat array
export const ALL_UNITS = Object.values(MEASUREMENT_UNITS).flat();

export const getUnitType = (unit) => {
    if (VOLUME_CONVERSIONS[unit]) return 'volume';
    if (WEIGHT_CONVERSIONS[unit]) return 'weight';
    if (COUNT_UNITS.has(unit)) return 'count';
    return null;
};

export const convertToBaseUnit = (amount, unit) => {
    const unitType = getUnitType(unit);
    if (!unitType) return null;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return null;

    switch (unitType) {
        case 'volume':
            return numericAmount * VOLUME_CONVERSIONS[unit];
        case 'weight':
            return numericAmount * WEIGHT_CONVERSIONS[unit];
        case 'count':
            // Special handling for dozen
            if (unit === 'dozen') return numericAmount * 12;
            return numericAmount;
        default:
            return null;
    }
};

export const canCompareUnits = (unit1, unit2) => {
    const type1 = getUnitType(unit1);
    const type2 = getUnitType(unit2);
    return type1 && type2 && type1 === type2;
};

export const compareAmounts = (amount1, unit1, amount2, unit2) => {
    if (!canCompareUnits(unit1, unit2)) return null;

    const base1 = convertToBaseUnit(amount1, unit1);
    const base2 = convertToBaseUnit(amount2, unit2);

    if (base1 === null || base2 === null) return null;

    return base1 >= base2;
};