import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase/config'
import { ChefHat, ShoppingCart, Calendar } from 'lucide-react'
import MealPlanTab from './components/MealPlanTab'
import GroceryListTab from './components/GroceryListTab'
import MealsTab from './components/MealsTab'

const MealPlanner = () => {
  const [activeTab, setActiveTab] = useState("meal-plan")
  const [meals, setMeals] = useState([])
  const [isLoadingMeals, setIsLoadingMeals] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const mealsRef = collection(db, 'meals');
        const snapshot = await getDocs(mealsRef);
        const loadedMeals = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMeals(loadedMeals);
      } catch (err) {
        console.error('Error loading meals:', err);
        setLoadError(err.message);
      } finally {
        setIsLoadingMeals(false);
      }
    };

    loadMeals();
  }, [])
  const [newMeal, setNewMeal] = useState({ 
    name: '', 
    ingredients: [{ name: '', amount: '', unit: '' }]
  })

  const initialWeekPlan = {
    Sunday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    Monday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    Tuesday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    Wednesday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    Thursday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    Friday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    Saturday: { breakfast: [], lunch: [], dinner: [], snacks: [] }
  }

  const [weekPlan, setWeekPlan] = useState(initialWeekPlan)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Meal Planner Test With Github</h1>
      
      <div className="w-full">
        <div className="grid grid-cols-3 border-b mb-6">
          <button
            className={`flex flex-col items-center justify-center px-4 py-2 ${activeTab === 'meal-plan' ? 'border-b-2 border-blue-500 -mb-px' : ''}`}
            onClick={() => setActiveTab('meal-plan')}
          >
            <Calendar className="h-4 w-4 mb-1" />
            <span>Meal Plan</span>
          </button>
          <button
            className={`flex flex-col items-center justify-center px-4 py-2 ${activeTab === 'grocery-list' ? 'border-b-2 border-blue-500 -mb-px' : ''}`}
            onClick={() => setActiveTab('grocery-list')}
          >
            <ShoppingCart className="h-4 w-4 mb-1" />
            <span>Grocery List</span>
          </button>
          <button
            className={`flex flex-col items-center justify-center px-4 py-2 ${activeTab === 'meals' ? 'border-b-2 border-blue-500 -mb-px' : ''}`}
            onClick={() => setActiveTab('meals')}
          >
            <ChefHat className="h-4 w-4 mb-1" />
            <span>Meals</span>
          </button>
        </div>

        {activeTab === 'meal-plan' && <MealPlanTab weekPlan={weekPlan} setWeekPlan={setWeekPlan} meals={meals} />}
        {activeTab === 'grocery-list' && <GroceryListTab meals={meals} weekPlan={weekPlan} />}
        {activeTab === 'meals' && 
          <MealsTab 
            meals={meals} 
            setMeals={setMeals}
            newMeal={newMeal}
            setNewMeal={setNewMeal}
          />
        }
      </div>
    </div>
  )
}

export default MealPlanner