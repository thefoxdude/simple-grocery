import React from 'react';
import { ShoppingCart } from 'lucide-react';

const GroceryListTab = ({ meals = [], weekPlan = {} }) => {
  const getAllIngredients = () => {
    const ingredients = new Map();
    
    Object.values(weekPlan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(mealType => {
        mealType.forEach(meal => {
          const foundMeal = meals.find(m => m.id === meal.id);
          if (foundMeal) {
            foundMeal.ingredients.forEach(ing => {
              const key = `${ing.name}-${ing.unit}`;
              if (ingredients.has(key)) {
                const current = ingredients.get(key);
                ingredients.set(key, {
                  ...current,
                  amount: (parseFloat(current.amount) + parseFloat(ing.amount)).toString()
                });
              } else {
                ingredients.set(key, ing);
              }
            });
          }
        });
      });
    });
    
    return Array.from(ingredients.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div className="max-w-md mx-auto border rounded-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <ShoppingCart className="mr-2" />
          Grocery List
        </h2>
        <div className="space-y-2">
          {getAllIngredients().map((item, index) => (
            <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
              <input type="checkbox" className="mr-2" />
              <span>
                {item.name} - {item.amount} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroceryListTab;