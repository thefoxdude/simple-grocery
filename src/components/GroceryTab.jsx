import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useMealPlan } from '../hooks/useMealPlan';
import { usePantry } from '../hooks/usePantry';
import { useGroceryList } from '../hooks/useGroceryList';
import { DateRangeSelector } from '../forms/DateRangeSelector';
import { GenerateListButton } from './GenerateListButton';
import { GroceryLists } from './GroceryLists';
import { generateGroceryList } from '../helpers/groceryListHelper';

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const GroceryTab = ({ dishes = [] }) => {
  const { loadUserMealPlan } = useMealPlan();
  const { pantryItems, loadPantryItems } = usePantry();
  const { 
    loadGroceryList, 
    saveGroceryList, 
    clearGroceryList,
    addManualItem,
    removeManualItem 
  } = useGroceryList();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [neededItems, setNeededItems] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [checkedNeededItems, setCheckedNeededItems] = useState(new Set());
  const [checkedPantryItems, setCheckedPantryItems] = useState(new Set());

  useEffect(() => {
    const loadInitialData = async () => {
      await loadPantryItems();
      const savedList = await loadGroceryList();
      if (savedList) {
        setStartDate(savedList.startDate || '');
        setEndDate(savedList.endDate || '');
        setNeededItems(savedList.neededItems || []);
        setAvailableItems(savedList.availableItems || []);
        setCheckedNeededItems(new Set(savedList.checkedNeededItems || []));
        setCheckedPantryItems(new Set(savedList.checkedPantryItems || []));
      }
    };
    loadInitialData();
  }, [loadPantryItems, loadGroceryList]);

  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
  };

  const getWeekId = (date) => {
    const normalized = normalizeDate(date);
    const day = normalized.getUTCDay();
    normalized.setUTCDate(normalized.getUTCDate() - day);
    return normalized.toISOString().split('T')[0];
  };

  const handleClearList = async () => {
    await clearGroceryList();
    setNeededItems([]);
    setAvailableItems([]);
    setCheckedNeededItems(new Set());
    setCheckedPantryItems(new Set());
    setStartDate('');
    setEndDate('');
  };

  const handleAddManualItem = async (itemData) => {
    try {
      const newItem = await addManualItem(itemData);
      const updatedNeededItems = [...neededItems, newItem];
      setNeededItems(updatedNeededItems);
      
      await saveGroceryList({
        startDate,
        endDate,
        neededItems: updatedNeededItems,
        availableItems,
        checkedNeededItems: Array.from(checkedNeededItems),
        checkedPantryItems: Array.from(checkedPantryItems)
      });
    } catch (error) {
      console.error('Error adding manual item:', error);
    }
  };

  const handleRemoveNeededItem = async (index) => {
    try {
      const itemToRemove = neededItems[index];
      const updatedItems = neededItems.filter((_, i) => i !== index);
      setNeededItems(updatedItems);

      if (itemToRemove.isManual) {
        await removeManualItem(itemToRemove.id);
      }

      const newCheckedItems = new Set(
        Array.from(checkedNeededItems)
          .filter(i => i !== index)
          .map(i => i > index ? i - 1 : i)
      );
      setCheckedNeededItems(newCheckedItems);

      await saveGroceryList({
        startDate,
        endDate,
        neededItems: updatedItems,
        availableItems,
        checkedNeededItems: Array.from(newCheckedItems),
        checkedPantryItems: Array.from(checkedPantryItems)
      });
    } catch (error) {
      console.error('Error removing needed item:', error);
    }
  };

  const generateList = async () => {
    setIsGenerating(true);
    
    try {
      const start = normalizeDate(startDate);
      const end = normalizeDate(endDate);
      const ingredientMap = new Map();
      
      let currentDate = new Date(start);
      while (currentDate <= end) {
        currentDate = normalizeDate(currentDate);
        const weekId = getWeekId(currentDate);
        const dayName = DAYS_OF_WEEK[currentDate.getUTCDay()];
        
        try {
          const weekPlan = await loadUserMealPlan(weekId);
          
          if (weekPlan && weekPlan[dayName]) {
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

      // Generate the grocery list using the helper function
      const { needed, available } = generateGroceryList(ingredientMap, pantryItems);

      // Get current manual items
      const savedList = await loadGroceryList();
      const manualItems = savedList?.neededItems?.filter(item => item.isManual) || [];

      // Combine generated items with manual items
      const allNeededItems = [...needed, ...manualItems];

      await saveGroceryList({
        startDate,
        endDate,
        neededItems: allNeededItems,
        availableItems: available,
        checkedNeededItems: [],
        checkedPantryItems: Array.from(new Set(available.map((_, index) => index))),
        generatedAt: new Date().toISOString()
      });

      setNeededItems(allNeededItems);
      setAvailableItems(available);
      setCheckedNeededItems(new Set());
      setCheckedPantryItems(new Set(available.map((_, index) => index)));
    } catch (error) {
      console.error('Error generating grocery list:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleNeededItem = async (index) => {
    const newCheckedItems = new Set(checkedNeededItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedNeededItems(newCheckedItems);

    await saveGroceryList({
      startDate,
      endDate,
      neededItems,
      availableItems,
      checkedNeededItems: Array.from(newCheckedItems),
      checkedPantryItems: Array.from(checkedPantryItems)
    });
  };

  const togglePantryItem = async (index) => {
    const newCheckedItems = new Set(checkedPantryItems);
    if (newCheckedItems.has(index)) {
      newCheckedItems.delete(index);
    } else {
      newCheckedItems.add(index);
    }
    setCheckedPantryItems(newCheckedItems);

    await saveGroceryList({
      startDate,
      endDate,
      neededItems,
      availableItems,
      checkedNeededItems: Array.from(checkedNeededItems),
      checkedPantryItems: Array.from(newCheckedItems)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
            Grocery List
          </h2>
        </div>
        
        {(neededItems.length > 0 || availableItems.length > 0) && (
          <button
            onClick={handleClearList}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 
                      dark:bg-red-600 dark:hover:bg-red-700
                      text-white rounded-lg transition-colors duration-200
                      flex items-center gap-2"
          >
            <Trash2 className="h-5 w-5" />
            Clear List
          </button>
        )}
      </div>
  
      <div className="bg-emerald-50 dark:bg-gray-800 rounded-lg p-6 space-y-6
                      border border-emerald-100 dark:border-gray-700">
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
  
        <GenerateListButton
          onClick={generateList}
          disabled={!startDate || !endDate}
          isGenerating={isGenerating}
        />
  
        <GroceryLists
          neededItems={neededItems}
          pantryItems={availableItems}
          checkedNeededItems={checkedNeededItems}
          checkedPantryItems={checkedPantryItems}
          onToggleNeededItem={toggleNeededItem}
          onTogglePantryItem={togglePantryItem}
          onAddManualItem={handleAddManualItem}
          onRemoveNeededItem={handleRemoveNeededItem}
        />
      </div>
    </div>
  );
};

export default GroceryTab;