import React, { useState } from 'react';
import { ChevronDown, Download, X, Loader, Mail, Package } from 'lucide-react';

const PendingDishesSection = ({ pendingDishes, onImport, onDecline, isImporting, importingId }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (pendingDishes.length === 0) {
    return null;
  }

  return (
    <div className="border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 bg-emerald-50 dark:bg-emerald-900/30 mb-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
            Pending Dishes ({pendingDishes.length})
          </h3>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-emerald-600 dark:text-emerald-400 transform transition-transform duration-200
                    ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {pendingDishes.map(sharing => (
            <div 
              key={sharing.id} 
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-emerald-100 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm mb-1">
                <Mail className="h-4 w-4 mr-1" />
                <span className="font-medium">From: {sharing.senderEmail}</span>
              </div>
              <h4 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">
                {sharing.dish.name}
              </h4>

              {/* Ingredients preview */}
              {sharing.dish.ingredients && sharing.dish.ingredients.length > 0 && (
                <div className="mt-2 mb-3">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {sharing.dish.ingredients.slice(0, 3).map((ing, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full"
                      >
                        {ing.name}
                      </span>
                    ))}
                    {sharing.dish.ingredients.length > 3 && (
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full">
                        +{sharing.dish.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => onDecline(sharing.id)}
                  disabled={isImporting && importingId === sharing.id}
                  className="px-3 py-1.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400
                          hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors duration-200
                          flex items-center gap-1 text-sm
                          disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                  <span>Decline</span>
                </button>
                <button
                  onClick={() => onImport(sharing.id)}
                  disabled={isImporting}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 
                          dark:bg-emerald-600 dark:hover:bg-emerald-700
                          text-white rounded-md transition-colors duration-200
                          flex items-center gap-1 text-sm
                          disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting && importingId === sharing.id ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Import</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingDishesSection;