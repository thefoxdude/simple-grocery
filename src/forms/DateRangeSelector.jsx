import React from 'react';

export const DateRangeSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <style>
        {`
          .dark input[type="date"] {
            color-scheme: dark;
          }
        `}
      </style>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300">
          Start Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full p-2 border border-emerald-200 dark:border-gray-600 rounded-md
                    bg-white dark:bg-gray-800
                    text-emerald-800 dark:text-emerald-200
                    focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 
                    focus:border-emerald-400 dark:focus:border-emerald-500 
                    placeholder-emerald-400 dark:placeholder-emerald-500
                    hover:border-emerald-300 dark:hover:border-gray-500
                    transition-colors duration-200"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300">
          End Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full p-2 border border-emerald-200 dark:border-gray-600 rounded-md
                    bg-white dark:bg-gray-800
                    text-emerald-800 dark:text-emerald-200
                    focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 
                    focus:border-emerald-400 dark:focus:border-emerald-500 
                    placeholder-emerald-400 dark:placeholder-emerald-500
                    hover:border-emerald-300 dark:hover:border-gray-500
                    transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
};