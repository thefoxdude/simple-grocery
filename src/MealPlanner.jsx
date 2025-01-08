import React, { useState, useEffect } from 'react'
import { ShoppingCart, Calendar, Loader, Salad } from 'lucide-react'
import MealPlanTab from './components/MealPlanTab'
import GroceryListTab from './components/GroceryListTab'
import DishesTab from './components/DishesTab'
import { useDishes } from './hooks/useDishes'
import { useMealPlan } from './hooks/useMealPlan'
import { TabButton } from './components/TabButton'

const MealPlanner = () => {
  const [activeTab, setActiveTab] = useState("meal-plan")
  const { dishes, loadUserDishes, isLoading: dishesLoading, error: dishesError } = useDishes()
  const { weekPlan } = useMealPlan()

  useEffect(() => {
    loadUserDishes();
  }, [loadUserDishes])

  if (dishesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (dishesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <h2 className="text-red-800 font-medium mb-2">Error Loading dishes</h2>
          <p className="text-red-600">{dishesError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Meal Planner</h1>
      
      <div className="w-full">
        <div className="grid grid-cols-3 border-b mb-6">
          <TabButton icon={Calendar} label='Meal Plan' isActive={activeTab === 'meal-plan'} onClick={() => setActiveTab('meal-plan')} />
          <TabButton icon={ShoppingCart} label='Grocery List' isActive={activeTab === 'grocery-list'} onClick={() => setActiveTab('grocery-list')} />
          <TabButton icon={Salad} label='Dishes' isActive={activeTab === 'dishes'} onClick={() => setActiveTab('dishes')} />
        </div>

        {activeTab === 'meal-plan' && (
          <MealPlanTab dishes={dishes} />
        )}
        {activeTab === 'grocery-list' && (
          <GroceryListTab 
            dishes={dishes} 
            weekPlan={weekPlan} 
          />
        )}
        {activeTab === 'dishes' && (
          <DishesTab />
        )}
      </div>
    </div>
  )
}

export default MealPlanner