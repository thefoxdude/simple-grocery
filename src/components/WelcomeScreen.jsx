import React from 'react';
import { Calendar, ShoppingCart, Warehouse, ChevronRight } from 'lucide-react';

const WelcomeScreen = ({ onAuthClick }) => {
  
  const features = [
    {
      icon: Calendar,
      title: "Meal Planning Made Simple",
      description: "Plan your meals for the week with an intuitive calendar interface. Organize breakfast, lunch, dinner, and snacks all in one place.",
      imagePosition: "right",
      url: "/images/mealplanscreenshot.jpg"
    },
    {
      icon: ShoppingCart,
      title: "Smart Grocery Lists",
      description: "Automatically generate shopping lists based on your meal plan. The app tracks what's in your pantry and only shows what you need to buy.",
      imagePosition: "left",
      url: "/images/grocerylistscreenshot.jpg"
    },
    {
      icon: Warehouse,
      title: "Pantry Management",
      description: "Keep track of what you have at home. Never buy duplicates or run out of essentials again.",
      imagePosition: "right",
      url: "/images/pantryscreenshot.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-800 dark:text-emerald-400 mb-6">
            Simple Meals
          </h1>
          <p className="text-xl md:text-2xl text-emerald-600 dark:text-emerald-300 mb-8">
            Your all-in-one solution for meal planning, grocery shopping, and pantry management
          </p>
          
          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => onAuthClick('signup')}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg 
                       text-lg font-medium transition-colors duration-200
                       flex items-center justify-center gap-2"
            >
              Get Started
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => onAuthClick('login')}
              className="px-8 py-3 border-2 border-emerald-600 hover:bg-emerald-50 
                       dark:border-emerald-400 dark:hover:bg-emerald-900/30
                       text-emerald-600 dark:text-emerald-400 rounded-lg 
                       text-lg font-medium transition-colors duration-200"
            >
              Sign In
            </button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-4 mb-20">
            <div className="aspect-video bg-emerald-200 dark:bg-emerald-800 rounded-lg flex items-center justify-center">
              <p className="text-emerald-600 dark:text-emerald-400">
                <img src="/images/heroscreenshot.jpg" alt="homescreen screenshot" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`flex flex-col ${feature.imagePosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} 
                         gap-12 items-center`}
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <feature.icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                    {feature.title}
                  </h2>
                </div>
                <p className="text-lg text-emerald-600 dark:text-emerald-400">
                  {feature.description}
                </p>
              </div>
              
              {/* Feature Image Placeholder */}
              <div className="flex-1 w-full">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-4">
                  <div className="aspect-video bg-emerald-200 dark:bg-emerald-800 rounded-lg flex items-center justify-center">
                    <img src={feature.url} alt="homescreen screenshot" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-emerald-300">
            Ready to simplify your meal planning?
          </h2>
          <p className="text-xl text-emerald-600 dark:text-emerald-400">
            Join thousands of users who have made their meal planning and grocery shopping easier.
          </p>
          <button
            onClick={() => onAuthClick('signup')}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg 
                     text-lg font-medium transition-colors duration-200
                     flex items-center justify-center gap-2 mx-auto"
          >
            Get Started Now
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;