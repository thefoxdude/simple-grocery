import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import DayColumn from './DayColumn';
import { useMealPlan } from '../hooks/useMealPlan';
import AddDishModal from '../forms/AddDishModal';

const MealPlanTab = ({ dishes }) => {
  const { 
    weekPlan, 
    setWeekPlan, 
    loadUserMealPlan, 
    isLoading, 
    isSaving, 
    error,
    DAYS_OF_WEEK
  } = useMealPlan();

  const [expandedDays, setExpandedDays] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDishType, setselectedDishType] = useState('');
  const [expandState, setExpandState] = useState('');

  useEffect(() => {
    loadUserMealPlan();
  }, [loadUserMealPlan]);

  // Set tomorrow's column to be expanded by default
  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDay = days[tomorrow.getDay()];
    
    setExpandedDays(prev => ({
      ...prev,
      [tomorrowDay]: true
    }));
  }, []);

  const toggleDayExpansion = (day) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleExpandStateChange = (newState) => {
    setExpandState(newState);
    const newExpandedState = {};
    Object.keys(weekPlan).forEach(day => {
      newExpandedState[day] = newState === 'all';
    });
    setExpandedDays(newExpandedState);
  };

  const addDishToDay = async (dishId, day, dishType) => {
    const selectedDish = dishes.find(m => m.id === dishId);
    if (selectedDish) {
      const updatedWeekPlan = {
        ...weekPlan,
        [day]: {
          ...weekPlan[day],
          [dishType]: [...weekPlan[day][dishType], selectedDish]
        }
      };
      
      try {
        await setWeekPlan(updatedWeekPlan);
        setShowModal(false);
      } catch (err) {
        console.error('Failed to add meal:', err);
      }
    }
  };

  const removeDishFromDay = async (day, dishType, index) => {
    const updatedWeekPlan = {
      ...weekPlan,
      [day]: {
        ...weekPlan[day],
        [dishType]: weekPlan[day][dishType].filter((_, i) => i !== index)
      }
    };
    
    try {
      await setWeekPlan(updatedWeekPlan);
    } catch (err) {
      console.error('Failed to remove meal:', err);
    }
  };

  const handleAddDishClick = (day, dishType) => {
    setSelectedDay(day);
    setselectedDishType(dishType);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error loading meal plan: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md 
                      shadow-lg flex items-center">
          <Loader className="h-4 w-4 animate-spin mr-2" />
          Saving changes...
        </div>
      )}

      {/* Control buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => handleExpandStateChange('all')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200
                    flex items-center gap-2 
                    ${expandState === 'all' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
        >
          Expand All
        </button>
        <button
          onClick={() => handleExpandStateChange('none')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200
                    flex items-center gap-2
                    ${expandState === 'none' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
        >
          Collapse All
        </button>
      </div>

      {/* Mobile view */}
      <div className="block xl:hidden space-y-4">
        {DAYS_OF_WEEK.map(day => (
          <DayColumn
            key={day}
            day={day}
            dishes={weekPlan[day]}
            isExpanded={expandedDays[day]}
            onToggleExpand={toggleDayExpansion}
            onAddDish={handleAddDishClick}
            onRemoveDish={removeDishFromDay}
            weekPlan={weekPlan}
          />
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden xl:grid grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map(day => (
          <DayColumn
            key={day}
            day={day}
            dishes={dishes}
            isExpanded={expandedDays[day]}
            onToggleExpand={toggleDayExpansion}
            onAddDish={handleAddDishClick}
            onRemoveDish={removeDishFromDay}
            weekPlan={weekPlan}
          />
        ))}
      </div>

      {showModal && (
        <AddDishModal
          selectedDay={selectedDay}
          selectedDishType={selectedDishType}
          onClose={() => setShowModal(false)}
          dishes={dishes}
          onAddDish={addDishToDay}
        />
      )}
    </div>
  );
};

export default MealPlanTab;