import React from 'react';
import { Settings, LogOut } from 'lucide-react';

const Footer = ({ onOpenSettings, onLogout }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-emerald-100 dark:border-gray-700 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-sm text-emerald-600 dark:text-emerald-400">
          © {new Date().getFullYear()} Meal Planner
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </button>
          
          <button
            onClick={onLogout}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors duration-200"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;