import React, { useState } from 'react';
import { Calendar, ShoppingCart, Loader, Check, RefreshCw } from 'lucide-react';
import { useMealPlan } from '../hooks/useMealPlan';

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [groceryList, setGroceryList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());

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

  const generateGroceryList = async () => {
    setIsGenerating(true);
    setGroceryList([]);
    
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
            ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
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
      
      // Convert map to sorted array
      const sortedList = Array.from(ingredientMap.values())
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(item => ({
          ...item,
          amount: Math.round(item.amount * 100) / 100 // Round to 2 decimal places
        }));
      
      setGroceryList(sortedList);
      setCheckedItems(new Set());
    } catch (error) {
      console.error('Error generating grocery list:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleItem = (index) => {
    setCheckedItems(prev => {
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-6 w-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-emerald-800">Grocery List</h2>
      </div>

      <div className="bg-emerald-50 rounded-lg p-6 space-y-6">
        {/* Date Range Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-emerald-700">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setGroceryList([]);
                }}
                className="w-full p-2 pr-8 border border-emerald-200 rounded-md
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
              <Calendar className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-emerald-700">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setGroceryList([]);
                }}
                className="w-full p-2 pr-8 border border-emerald-200 rounded-md
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
              <Calendar className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateGroceryList}
          disabled={!startDate || !endDate || isGenerating}
          className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600
                    text-white rounded-lg transition-colors duration-200
                    flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Generating List...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              <span>Generate Grocery List</span>
            </>
          )}
        </button>

        {/* Grocery List */}
        {groceryList.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-emerald-800">
              Items Needed ({groceryList.length})
            </h3>
            <div className="space-y-2">
              {groceryList.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg bg-white
                            transition-colors duration-200
                            ${checkedItems.has(index) ? 'bg-emerald-50' : ''}`}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className={`w-5 h-5 rounded border mr-3 flex items-center justify-center
                              transition-colors duration-200
                              ${checkedItems.has(index)
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-emerald-300 hover:border-emerald-400'}`}
                  >
                    {checkedItems.has(index) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </button>
                  <span className={`flex-1 ${checkedItems.has(index) ? 'line-through text-emerald-600' : 'text-emerald-800'}`}>
                    {item.name}
                  </span>
                  <span className="text-emerald-600 font-medium">
                    {item.amount} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryTab;