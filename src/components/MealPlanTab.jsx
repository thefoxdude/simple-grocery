import React, { useState, useEffect } from 'react';
import { Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DayColumn from './DayColumn';
import { useMealPlan } from '../hooks/useMealPlan';
import { usePantry } from '../hooks/usePantry';
import AddDishModal from '../forms/AddDishModal';
import { PantryUpdater } from '../helpers/PantryUpdater';
import { useDishes } from '../hooks/useDishes';

const ANIMATION_DURATION = 0.3;

const getWeekRange = (date) => {
  const inputDate = new Date(date);
  const dayOfWeek = inputDate.getDay();
  const start = new Date(inputDate);
  if (dayOfWeek !== 0) {
    start.setDate(inputDate.getDate() - dayOfWeek);
  }
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return {
    start,
    end,
    id: start.toISOString().split('T')[0],
    display: `${start.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric',
      year: '2-digit'
    })} - ${end.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: '2-digit'
    })}`
  };
};

const MealPlanTab = ({ dishes, dinnerOnly }) => {
  const { 
    loadUserMealPlan, 
    saveMealPlan, 
    isLoading,
    DAYS_OF_WEEK,
    initialWeekPlan
  } = useMealPlan();

  const {
      saveDish
    } = useDishes();

  const { pantryItems, savePantryItem, loadPantryItems } = usePantry();

  const [weekPlans, setWeekPlans] = useState({});
  const [currentWeek, setCurrentWeek] = useState(getWeekRange(new Date()));
  const [animationDirection, setAnimationDirection] = useState(0);
  const [expandedDays, setExpandedDays] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDishType, setSelectedDishType] = useState('');
  const [expandState, setExpandState] = useState('partial');

  // Load week data when changing weeks
  useEffect(() => {
    const loadWeekData = async () => {
      if (!weekPlans[currentWeek.id]) {
        const data = await loadUserMealPlan(currentWeek.id);
        setWeekPlans(prev => ({ ...prev, [currentWeek.id]: data }));
      }
    };
    loadWeekData();

    if (animationDirection !== 0) {
      const newExpandedState = {};
      DAYS_OF_WEEK.forEach(day => {
        newExpandedState[day] = true;
      });
      setExpandedDays(newExpandedState);
      setExpandState('all');
    }
  }, [currentWeek.id, loadUserMealPlan, weekPlans, DAYS_OF_WEEK, animationDirection]);

  // Set initial expanded state based on viewport
  useEffect(() => {
    const today = new Date();
    const currentDayName = DAYS_OF_WEEK[today.getDay()];
    const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
    
    if (isDesktop) {
      const allExpanded = DAYS_OF_WEEK.reduce((acc, day) => {
        acc[day] = true;
        return acc;
      }, {});
      setExpandedDays(allExpanded);
      setExpandState('all');
    } else {
      setExpandedDays({
        [currentDayName]: true
      });
      setExpandState('partial');
    }

    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleViewportChange = (e) => {
      if (e.matches) {
        const allExpanded = DAYS_OF_WEEK.reduce((acc, day) => {
          acc[day] = true;
          return acc;
        }, {});
        setExpandedDays(allExpanded);
        setExpandState('all');
      }
    };

    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, [DAYS_OF_WEEK]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDirection(0);
    }, ANIMATION_DURATION * 1000);
    
    return () => clearTimeout(timer);
  }, [currentWeek.id]);

  useEffect(() => {
    loadPantryItems();
  }, [loadPantryItems]);

  const toggleMealCompletion = async (day, dishType, index) => {
    const meal = currentWeekPlan[day][dishType][index];
    const isCompleted = !meal.completed || false;
    
    try {
      // First update the meal plan
      const updatedWeekPlan = {
        ...currentWeekPlan,
        [day]: {
          ...currentWeekPlan[day],
          [dishType]: currentWeekPlan[day][dishType].map((m, i) => 
            i === index ? { ...m, completed: isCompleted } : m
          )
        }
      };
  
      await saveMealPlan(updatedWeekPlan, currentWeek.id);
      setWeekPlans(prev => ({ ...prev, [currentWeek.id]: updatedWeekPlan }));
      
      // Then handle pantry updates using PantryUpdater
      const dish = dishes.find(d => d.id === meal.id);
      if (dish) {
        console.log('Updating pantry for dish:', dish); // Debug log
        const pantryUpdater = new PantryUpdater(pantryItems, savePantryItem, loadPantryItems);
        await pantryUpdater.completeMeal(dish, isCompleted);
      }
    } catch (err) {
      console.error('Failed to toggle meal completion:', err);
    }
  };

  const changeWeek = (direction) => {
    setAnimationDirection(direction);
    setTimeout(() => {
      const newDate = new Date(currentWeek.start);
      newDate.setDate(newDate.getDate() + (direction * 7));
      setCurrentWeek(getWeekRange(newDate));
    }, 0);
  };

  const isCurrentDay = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayIndex = DAYS_OF_WEEK.indexOf(day);
    const dayDate = new Date(currentWeek.start);
    dayDate.setDate(dayDate.getDate() + dayIndex);
    dayDate.setHours(0, 0, 0, 0);
    
    return dayDate.getTime() === today.getTime();
  };

  const isPastDay = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayIndex = DAYS_OF_WEEK.indexOf(day);
    const dayDate = new Date(currentWeek.start);
    dayDate.setDate(dayDate.getDate() + dayIndex);
    dayDate.setHours(0, 0, 0, 0);
    
    return dayDate.getTime() < today.getTime();
  };

  const addDishToDay = async (dishIdOrData, day, dishType, isNewDish = false) => {
    try {
      let selectedDish;
      
      if (isNewDish) {
        // For new dishes, first save to dishes collection
        const savedDish = await saveDish(dishIdOrData);
        selectedDish = savedDish;
      } else {
        // For existing dishes, find in current dishes array
        selectedDish = dishes.find(m => m.id === dishIdOrData);
      }

      if (selectedDish) {
        const updatedWeekPlan = {
          ...currentWeekPlan,
          [day]: {
            ...currentWeekPlan[day],
            [dishType]: [...currentWeekPlan[day][dishType], selectedDish]
          }
        };
        
        await saveMealPlan(updatedWeekPlan, currentWeek.id);
        setWeekPlans(prev => ({ ...prev, [currentWeek.id]: updatedWeekPlan }));
        setShowModal(false);
        return selectedDish;
      }
    } catch (err) {
      console.error('Failed to add meal:', err);
      throw err;
    }
  };

  const removeDishFromDay = async (day, dishType, index) => {
    const updatedWeekPlan = {
      ...currentWeekPlan,
      [day]: {
        ...currentWeekPlan[day],
        [dishType]: currentWeekPlan[day][dishType].filter((_, i) => i !== index)
      }
    };
    
    try {
      await saveMealPlan(updatedWeekPlan, currentWeek.id);
      setWeekPlans(prev => ({ ...prev, [currentWeek.id]: updatedWeekPlan }));
    } catch (err) {
      console.error('Failed to remove meal:', err);
    }
  };

  const handleExpandStateChange = (newState) => {
    setExpandState(newState);
    const newExpandedState = {};
    DAYS_OF_WEEK.forEach(day => {
      newExpandedState[day] = newState === 'all';
    });
    setExpandedDays(newExpandedState);
  };

  const toggleDayExpansion = (day) => {
    setExpandedDays(prev => {
      const newState = { ...prev, [day]: !prev[day] };
      // Update expandState based on whether all days are expanded or not
      const allExpanded = DAYS_OF_WEEK.every(d => newState[d]);
      const allCollapsed = DAYS_OF_WEEK.every(d => !newState[d]);
      setExpandState(allExpanded ? 'all' : allCollapsed ? 'none' : 'partial');
      return newState;
    });
  };

  const handleAddDishClick = (day, dishType) => {
    setSelectedDay(day);
    setSelectedDishType(dishType);
    setShowModal(true);
  };

  const currentWeekPlan = weekPlans[currentWeek.id] || initialWeekPlan;

  if (isLoading && Object.keys(weekPlans).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        {/* Week Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeWeek(-1)}
            className="p-1 hover:bg-emerald-50 dark:hover:bg-gray-800 
                      rounded-full transition-colors duration-200"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          <span className="px-2 py-1 text-sm font-medium text-emerald-800 dark:text-emerald-200">
            {currentWeek.display}
          </span>

          <button
            onClick={() => changeWeek(1)}
            className="p-1 hover:bg-emerald-50 dark:hover:bg-gray-800 
                      rounded-full transition-colors duration-200"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>

        {/* Expand/Collapse Controls - Mobile Only */}
        <div className="block xl:hidden flex space-x-2">
          <button
            onClick={() => handleExpandStateChange('all')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200
                      ${expandState === 'all' 
                        ? 'bg-emerald-600 dark:bg-emerald-700 text-white' 
                        : 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white'}`}
          >
            Expand All
          </button>
          <button
            onClick={() => handleExpandStateChange('none')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200
                      ${expandState === 'none' 
                        ? 'bg-emerald-600 dark:bg-emerald-700 text-white' 
                        : 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white'}`}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Mobile view */}
      <div className="block xl:hidden space-y-4">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentWeek.id}
            initial={{ x: `${animationDirection * 100}%`, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: `${animationDirection * -100}%`, opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            className="space-y-4"
          >
            {DAYS_OF_WEEK.map(day => (
              <DayColumn
                key={day}
                day={day}
                dishes={dishes}
                isExpanded={expandedDays[day]}
                onToggleExpand={toggleDayExpansion}
                onAddDish={handleAddDishClick}
                onRemoveDish={removeDishFromDay}
                onToggleCompletion={toggleMealCompletion}
                weekPlan={currentWeekPlan}
                isCurrentDay={isCurrentDay(day)}
                isPastDay={isPastDay(day)}
                dinnerOnly={dinnerOnly}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop view */}
      <div className="hidden xl:block relative overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentWeek.id}
            initial={{ x: `${animationDirection * 100}%`, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: `${animationDirection * -100}%`, opacity: 0 }}
            transition={{ duration: ANIMATION_DURATION }}
            className="grid grid-cols-7 gap-4"
          >
            {DAYS_OF_WEEK.map(day => (
              <DayColumn
                key={day}
                day={day}
                dishes={dishes}
                isExpanded={expandedDays[day]}
                onToggleExpand={toggleDayExpansion}
                onAddDish={handleAddDishClick}
                onRemoveDish={removeDishFromDay}
                onToggleCompletion={toggleMealCompletion}
                weekPlan={currentWeekPlan}
                isCurrentDay={isCurrentDay(day)}
                isPastDay={isPastDay(day)}
                dinnerOnly={dinnerOnly}
              />
            ))}
          </motion.div>
        </AnimatePresence>
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