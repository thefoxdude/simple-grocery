import React, { useState, useEffect } from 'react';
import { ShoppingCart, Calendar, Loader, Salad, Warehouse, Settings, LogOut } from 'lucide-react';
import MealPlanTab from './components/MealPlanTab';
import DishesTab from './components/DishesTab';
import { useDishes } from './hooks/useDishes';
import { TabButton } from './components/TabButton';
import PantryTab from './components/PantryTab';
import GroceryTab from './components/GroceryTab';
import SettingsModal from './forms/SettingsModal';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings'

const MealPlanner = () => {
  const [activeTab, setActiveTab] = useState("meal-plan");
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings, isLoading: settingsLoading } = useSettings();
  
  const { dishes, loadUserDishes, isLoading: dishesLoading, error: dishesError } = useDishes();
  const { logout } = useAuth();

  useEffect(() => {
    loadUserDishes();
    // Initialize dark mode from settings
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [loadUserDishes, settings.darkMode]);

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    await updateSettings(newSettings);
    
    // Apply dark mode changes
    if (key === 'darkMode') {
      document.documentElement.classList.toggle('dark', value);
    }
  };

  if (dishesLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (dishesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <h2 className="text-red-800 font-medium mb-2">Error Loading dishes</h2>
          <p className="text-red-600">{dishesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900">
      <div className="container mx-auto p-6 min-h-screen">
        <div className="flex flex-col gap-6">
          <div className="relative flex justify-center items-center">
            <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-400">Meal Planner</h1>
            <div className="absolute right-0 flex items-center gap-4">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </button>
              <button
                onClick={logout}
                className="p-2 hover:bg-red-800 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          </div>
          
          <div className="w-full">
            <div className="grid grid-cols-4 border-b border-emerald-100 dark:border-gray-700 mb-6">
              <TabButton icon={Calendar} label='Meal Plan' isActive={activeTab === 'meal-plan'} onClick={() => setActiveTab('meal-plan')} />
              <TabButton icon={ShoppingCart} label='Grocery List' isActive={activeTab === 'grocery'} onClick={() => setActiveTab('grocery')} />
              <TabButton icon={Warehouse} label='Pantry' isActive={activeTab === 'pantry'} onClick={() => setActiveTab('pantry')} />
              <TabButton icon={Salad} label='Dishes' isActive={activeTab === 'dishes'} onClick={() => setActiveTab('dishes')} />
            </div>

            {activeTab === 'meal-plan' && (
              <MealPlanTab 
                dishes={dishes} 
                dinnerOnly={settings.dinnerOnly}
                key={settings.dinnerOnly ? 'dinner-only' : 'all-meals'} 
              />
            )}
            {activeTab === 'grocery' && (
              <GroceryTab 
                dishes={dishes} 
                dinnerOnly={settings.dinnerOnly}
                key={settings.dinnerOnly ? 'dinner-only' : 'all-meals'} 
              />
            )}
            {activeTab === 'pantry' && (
              <PantryTab />
            )}
            {activeTab === 'dishes' && (
              <DishesTab />
            )}
          </div>
        </div>

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingChange={handleSettingChange}
        />
      </div>
    </div>
  );
};

export default MealPlanner;