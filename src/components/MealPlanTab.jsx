import React, { useState, useEffect } from 'react';
import AddMealModal from '../forms/AddMealModal';
import DayColumn from './DayColumn';

const MealPlanTab = ({ meals, weekPlan, setWeekPlan }) => {
  const [expandedDays, setExpandedDays] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [expandState, setExpandState] = useState('none'); // 'all' or 'none'

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

  const addMealToDay = (mealId, day, mealType) => {
    const selectedMeal = meals.find(m => m.id === mealId);
    if (selectedMeal) {
      setWeekPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [mealType]: [...prev[day][mealType], selectedMeal]
        }
      }));
      setShowModal(false);
    }
  };

  const removeMealFromDay = (day, mealType, index) => {
    setWeekPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: prev[day][mealType].filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddMealClick = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Control buttons */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md border p-1 bg-white">
          <label className="inline-flex items-center px-3 py-1.5 cursor-pointer">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-blue-600"
              name="expand-state"
              value="all"
              checked={expandState === 'all'}
              onChange={() => handleExpandStateChange('all')}
            />
            <span className="ml-2 text-sm">Expand All</span>
          </label>
          <label className="inline-flex items-center px-3 py-1.5 cursor-pointer">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-blue-600"
              name="expand-state"
              value="none"
              checked={expandState === 'none'}
              onChange={() => handleExpandStateChange('none')}
            />
            <span className="ml-2 text-sm">Collapse All</span>
          </label>
        </div>
      </div>

      {/* Mobile view */}
      <div className="block xl:hidden space-y-4">
        {Object.entries(weekPlan).map(([day, meals]) => (
          <DayColumn
            key={day}
            day={day}
            meals={meals}
            isExpanded={expandedDays[day]}
            onToggleExpand={toggleDayExpansion}
            onAddMeal={handleAddMealClick}
            onRemoveMeal={removeMealFromDay}
            weekPlan={weekPlan}
          />
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden xl:grid grid-cols-7 gap-4">
        {Object.entries(weekPlan).map(([day, meals]) => (
          <DayColumn
            key={day}
            day={day}
            meals={meals}
            isExpanded={expandedDays[day]}
            onToggleExpand={toggleDayExpansion}
            onAddMeal={handleAddMealClick}
            onRemoveMeal={removeMealFromDay}
            weekPlan={weekPlan}
          />
        ))}
      </div>

      {showModal && (
        <AddMealModal
          selectedDay={selectedDay}
          selectedMealType={selectedMealType}
          onClose={() => setShowModal(false)}
          meals={meals}
          onAddMeal={addMealToDay}
        />
      )}
    </div>
  );
};

export default MealPlanTab;