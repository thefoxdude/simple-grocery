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

  const loadUserMealPlan = useCallback(async (weekId) => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const mealPlanRef = doc(db, 'mealPlans', userId, 'weeks', weekId);
      const mealPlanDoc = await getDoc(mealPlanRef);
      
      if (mealPlanDoc.exists()) {
        const orderedPlan = orderMealPlan(mealPlanDoc.data().weekPlan);
        return orderedPlan;
      }
      return initialWeekPlan;
    } catch (err) {
      setError(err.message);
      console.error('Error loading meal plan:', err);
      return initialWeekPlan;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveMealPlan = useCallback(async (weekPlan, weekId) => {
    setIsSaving(true);
    setError(null);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user logged in');

      const orderedWeekPlan = orderMealPlan(weekPlan);
      const mealPlanRef = doc(db, 'mealPlans', userId, 'weeks', weekId);
      
      await setDoc(mealPlanRef, {
        weekPlan: orderedWeekPlan,
        updatedAt: new Date().toISOString()
      });

      return orderedWeekPlan;
    } catch (err) {
      setError(err.message);
      console.error('Error saving meal plan:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    loadUserMealPlan,
    saveMealPlan,
    isLoading,
    isSaving,
    error,
    DAYS_OF_WEEK,
    initialWeekPlan
  };
};