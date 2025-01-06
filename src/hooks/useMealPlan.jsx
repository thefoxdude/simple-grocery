import { useState, useCallback } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

// Define a constant array for day order to ensure consistency
const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const createEmptyMealPlan = () => {
  return DAYS_OF_WEEK.reduce((plan, day) => {
    plan[day] = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    return plan;
  }, {});
};

const initialWeekPlan = createEmptyMealPlan();

export const useMealPlan = () => {
  const [weekPlan, setWeekPlan] = useState(initialWeekPlan);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Helper function to ensure meal plan follows day order
  const orderMealPlan = (unorderedPlan) => {
    return DAYS_OF_WEEK.reduce((orderedPlan, day) => {
      orderedPlan[day] = unorderedPlan[day] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
      return orderedPlan;
    }, {});
  };

  const loadUserMealPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const mealPlanRef = doc(db, 'mealPlans', userId);
      const mealPlanDoc = await getDoc(mealPlanRef);
      
      if (mealPlanDoc.exists()) {
        // Order the data before setting it to state
        const orderedPlan = orderMealPlan(mealPlanDoc.data().weekPlan);
        setWeekPlan(orderedPlan);
      } else {
        // If no meal plan exists yet, initialize with empty plan
        setWeekPlan(initialWeekPlan);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading meal plan:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveMealPlan = useCallback(async (unorderedWeekPlan) => {
    setIsSaving(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      // Order the plan before saving
      const orderedWeekPlan = orderMealPlan(unorderedWeekPlan);

      const mealPlanRef = doc(db, 'mealPlans', userId);
      await setDoc(mealPlanRef, {
        weekPlan: orderedWeekPlan,
        updatedAt: new Date().toISOString()
      });
      
      setWeekPlan(orderedWeekPlan);
    } catch (err) {
      setError(err.message);
      console.error('Error saving meal plan:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    weekPlan,
    setWeekPlan: async (newWeekPlan) => {
      await saveMealPlan(newWeekPlan);
    },
    loadUserMealPlan,
    isLoading,
    isSaving,
    error,
    DAYS_OF_WEEK // Export the days array for use in components if needed
  };
};