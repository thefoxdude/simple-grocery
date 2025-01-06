import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

const MealPlanTab = ({ meals, weekPlan, setWeekPlan }) => {
  const [expandedDays, setExpandedDays] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const modalRef = useRef(null);
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

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

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

  const Modal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            <span className="block xl:hidden">Add Meal</span>
            <span className="hidden xl:block">Add Meal to {selectedDay} - {selectedMealType}</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
        <select 
          className="w-full p-2 border rounded"
          onChange={(e) => addMealToDay(e.target.value, selectedDay, selectedMealType)}
        >
          <option value="">Choose a meal...</option>
          {meals.map(meal => (
            <option key={meal.id} value={meal.id}>{meal.name}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const DayColumn = ({ day, meals }) => (
    <div className="border rounded-lg h-full bg-white">
      <div className="p-3 xl:p-4">
        <button 
          className="w-full flex justify-between items-center mb-2 xl:mb-4 py-2"
          onClick={() => toggleDayExpansion(day)}
        >
          <span className="font-bold text-sm xl:text-base">{day}</span>
          <ChevronDown 
            className={`h-4 w-4 transform transition-transform ${expandedDays[day] ? 'rotate-180' : ''}`} 
          />
        </button>
        {expandedDays[day] && (
          <div className="space-y-3 xl:space-y-4">
            {['breakfast', 'lunch', 'dinner', 'snacks'].map(mealType => (
              <div key={mealType} className="border-t pt-2">
                <h4 className="font-medium capitalize text-sm xl:text-base">{mealType}</h4>
                <div className="mt-1 space-y-1">
                  {weekPlan[day][mealType].map((meal, idx) => (
                    <div key={`${meal.id}-${idx}`} 
                      className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm"
                    >
                      <span className="truncate mr-2">{meal.name}</span>
                      <button 
                        className="p-1 hover:bg-gray-200 rounded shrink-0"
                        onClick={() => removeMealFromDay(day, mealType, idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button 
                    className="w-full mt-1 px-2 py-1 text-sm border rounded-md hover:bg-gray-50 flex items-center justify-center"
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedMealType(mealType);
                      setShowModal(true);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
          <DayColumn key={day} day={day} meals={meals} />
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden xl:grid grid-cols-7 gap-4">
        {Object.entries(weekPlan).map(([day, meals]) => (
          <DayColumn key={day} day={day} meals={meals} />
        ))}
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default MealPlanTab;