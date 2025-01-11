import React from 'react';
import { Calendar } from 'lucide-react';

export const DateRangeSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-emerald-700">
          Start Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full p-2 pr-8 border border-emerald-200 rounded-md
                    focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          />
          <Calendar className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-500" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-emerald-700">
          End Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full p-2 pr-8 border border-emerald-200 rounded-md
                    focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          />
          <Calendar className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-500" />
        </div>
      </div>
    </div>
  );
};