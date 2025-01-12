import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { compareAmounts, convertToBaseUnit } from '../helpers/unitConversions';
import { useMealPlan } from '../hooks/useMealPlan';
import { usePantry } from '../hooks/usePantry';
import { DateRangeSelector } from '../forms/DateRangeSelector';
import { GenerateListButton } from './GenerateListButton';
import { GroceryLists } from './GroceryLists';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const GroceryTab = ({ dishes = [] }) => {
  const { loadUserMealPlan } = useMealPlan();
  const { pantryItems, loadPantryItems } = usePantry();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [neededItems, setNeededItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [checkedNeededItems, setCheckedNeededItems] = useState(new Set());
  const [checkedPantryItems, setCheckedPantryItems] = useState(new Set());

  // Load pantry items when component mounts
  useEffect(() => {
    loadPantryItems();
  }, [loadPantryItems]);

  // Helper function to normalize a date to midnight UTC
  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
  };

  // Helper function to get week ID from a date
  const getWeekId = (date) => {
    const normalized = normalizeDate(date);
    const day = normalized.getUTCDay();
    normalized.setUTCDate(normalized.getUTCDate() - day);
    return normalized.toISOString().split('T')[0];
  };

  // Helper function to check if an ingredient matches a pantry item
  const ingredientMatchesPantryItem = (ingredient, pantryItem) => {
    // First check if names match (case-insensitive)
    if (ingredient.name.toLowerCase() !== pantryItem.name.toLowerCase()) {
      return false;
    }

    // Check if we have enough quantity
    return compareAmounts(
      pantryItem.amount,
      pantryItem.unit,
      ingredient.amount,
      ingredient.unit
    );
  };

  const generateGroceryList = async () => {
    setIsGenerating(true);
    setNeededItems([]);
    setAvailableItems([]);
    
    try {
      const start = normalizeDate(startDate);
      const end = normalizeDate(endDate);
      const ingredientMap = new Map();
      
      // Iterate through each date in the range
      let currentDate = new Date(start);
      while (currentDate <= end) {
        currentDate = normalizeDate(currentDate);
        const weekId = getWeekId(currentDate);
        const dayName = DAYS_OF_WEEK[currentDate.getUTCDay()];
        
        try {
          const weekPlan = await loadUserMealPlan(weekId);
          
          if (weekPlan && weekPlan[dayName]) {
            // Process each meal type
            ['breakfast', 'lunch', 'dinner', 'other'].forEach(mealType => {
              const mealsList = weekPlan[dayName][mealType] || [];
              
              mealsList.forEach(meal => {
                const dish = dishes.find(d => d.id === meal.id);
                if (!dish || !dish.ingredients) return;
                
                dish.ingredients.forEach(ing => {
                  if (!ing.name || !ing.amount || !ing.unit) return;
                  
                  const key = `${ing.name}-${ing.unit}`;
                  if (ingredientMap.has(key)) {
                    const current = ingredientMap.get(key);
                    ingredientMap.set(key, {
                      ...current,
                      amount: (parseFloat(current.amount) + parseFloat(ing.amount))
                    });
                  } else {
                    ingredientMap.set(key, { ...ing });
                  }
                });
              });
            });
          }
        } catch (error) {
          console.error(`Error loading week plan for ${weekId}:`, error);
        }
        
        const nextDate = new Date(currentDate);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        currentDate = nextDate;
      }
      
      // Convert map to array and sort ingredients
      const allIngredients = Array.from(ingredientMap.values())
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(item => ({
          ...item,
          amount: Math.round(item.amount * 100) / 100 // Round to 2 decimal places
        }));

      // Separate ingredients into "needed" and "available" based on pantry
      const needed = [];
      const available = [];

      allIngredients.forEach(ingredient => {
        const matchingPantryItem = pantryItems.find(item => 
          ingredientMatchesPantryItem(ingredient, item)
        );

        if (matchingPantryItem) {
          const hasEnough = compareAmounts(
            matchingPantryItem.amount,
            matchingPantryItem.unit,
            ingredient.amount,
            ingredient.unit
          );

          if (hasEnough) {
            available.push(ingredient);
          } else {
            const baseNeeded = convertToBaseUnit(ingredient.amount, ingredient.unit);
            const baseHave = convertToBaseUnit(matchingPantryItem.amount, matchingPantryItem.unit);
            const neededAmount = Math.max(0, baseNeeded - baseHave);
            needed.push({
              ...ingredient,
              amount: Math.round(neededAmount * 100) / 100
            });
          }
        } else {
          needed.push(ingredient);
        }
      });

      setNeededItems(needed);
      setAvailableItems(available);
      setCheckedNeededItems(new Set());
      // Initialize "Already Have" items as checked
      setCheckedPantryItems(new Set(available.map((_, index) => index)));
    } catch (error) {
      console.error('Error generating grocery list:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleNeededItem = (index) => {
    setCheckedNeededItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const togglePantryItem = (index) => {
    setCheckedPantryItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
          Grocery List
        </h2>
      </div>
  
      <div className="bg-emerald-50 dark:bg-gray-800 rounded-lg p-6 space-y-6
                      border border-emerald-100 dark:border-gray-700">
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(date) => {
            setStartDate(date);
            setNeededItems([]);
            setAvailableItems([]);
          }}
          onEndDateChange={(date) => {
            setEndDate(date);
            setNeededItems([]);
            setAvailableItems([]);
          }}
        />
  
        <GenerateListButton
          onClick={generateGroceryList}
          disabled={!startDate || !endDate}
          isGenerating={isGenerating}
        />
  
        {(neededItems.length > 0 || availableItems.length > 0) && (
          <GroceryLists
            neededItems={neededItems}
            pantryItems={availableItems}
            checkedNeededItems={checkedNeededItems}
            checkedPantryItems={checkedPantryItems}
            onToggleNeededItem={toggleNeededItem}
            onTogglePantryItem={togglePantryItem}
          />
        )}
      </div>
    </div>
  );
};

export default GroceryTab;