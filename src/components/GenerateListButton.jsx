import React from 'react';
import { Loader, RefreshCw } from 'lucide-react';

export const GenerateListButton = ({ onClick, disabled, isGenerating }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className="w-full px-4 py-3 
                bg-emerald-500 hover:bg-emerald-600 
                dark:bg-emerald-600 dark:hover:bg-emerald-700
                text-white rounded-lg transition-colors duration-200
                flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-sm hover:shadow-md dark:shadow-emerald-900/10"
    >
      {isGenerating ? (
        <>
          <Loader className="h-5 w-5 animate-spin" />
          <span className="font-medium">Generating List...</span>
        </>
      ) : (
        <>
          <RefreshCw className="h-5 w-5" />
          <span className="font-medium">Generate Grocery List</span>
        </>
      )}
    </button>
  );
};