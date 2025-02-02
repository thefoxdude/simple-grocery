import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { MEASUREMENT_UNITS, ALL_UNITS } from '../helpers/unitConversions';

const IngredientInput = ({ ingredient, onChange, onRemove }) => {
  const [isUnitsOpen, setIsUnitsOpen] = useState(false);
  const [unitSearch, setUnitSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputClasses = `border border-emerald-200 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-200
                       placeholder-emerald-400 dark:placeholder-emerald-500
                       focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 
                       dark:focus:ring-emerald-500 dark:focus:border-emerald-500
                       transition-all duration-200 p-2`;

  const filteredUnits = ALL_UNITS.filter(unit =>
    unit.toLowerCase().includes(unitSearch.toLowerCase())
  );

  useEffect(() => {
    if (ingredient.unit) {
      setUnitSearch(ingredient.unit);
    }
  }, [ingredient.unit]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredUnits.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredUnits.length) % filteredUnits.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredUnits[activeIndex]) {
          onChange('unit', filteredUnits[activeIndex]);
          setUnitSearch(filteredUnits[activeIndex]);
          setIsUnitsOpen(false);
        }
        break;
      case 'Escape':
        setIsUnitsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 animate-fadeIn">
      <input
        type="text"
        placeholder="Ingredient name"
        value={ingredient.name}
        onChange={(e) => onChange('name', e.target.value)}
        className={`flex-1 ${inputClasses}`}
        aria-label="Ingredient name"
      />
      
      <div className="flex flex-row gap-2 sm:flex-none">
        <input
          type="text"
          placeholder="Amount"
          value={ingredient.amount}
          onChange={(e) => onChange('amount', e.target.value)}
          className={`w-full sm:w-24 ${inputClasses}`}
          aria-label="Ingredient amount"
        />
        
        <div className="relative w-full sm:w-40">
          <div
            onClick={() => setIsUnitsOpen(true)}
            className={`w-full cursor-pointer ${inputClasses} flex items-center justify-between`}
          >
            <input
              type="text"
              placeholder="Unit"
              value={unitSearch}
              onChange={(e) => {
                setUnitSearch(e.target.value);
                setIsUnitsOpen(true);
                setActiveIndex(0);
              }}
              onFocus={() => setIsUnitsOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full focus:outline-none bg-transparent dark:bg-transparent"
            />
            <ChevronDown className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
          </div>

          {isUnitsOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 
                         border border-emerald-200 dark:border-gray-600
                         rounded-md shadow-lg max-h-60 overflow-auto">
              {Object.entries(MEASUREMENT_UNITS).map(([category, units]) => (
                <div key={category}>
                  <div className="px-3 py-1 text-sm font-semibold text-emerald-800 
                              dark:text-emerald-200 bg-emerald-50 dark:bg-gray-700">
                    {category}
                  </div>
                  {units
                    .filter(unit => unit.toLowerCase().includes(unitSearch.toLowerCase()))
                    .map((unit) => (
                      <div
                        key={unit}
                        onClick={() => {
                          onChange('unit', unit);
                          setUnitSearch(unit);
                          setIsUnitsOpen(false);
                        }}
                        className={`px-3 py-2 cursor-pointer flex items-center justify-between
                                ${filteredUnits[activeIndex] === unit 
                                  ? 'bg-emerald-100 dark:bg-emerald-900' 
                                  : 'hover:bg-emerald-50 dark:hover:bg-gray-700'}
                                text-emerald-800 dark:text-emerald-200`}
                      >
                        {unit}
                        {ingredient.unit === unit && (
                          <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="p-2 text-red-400 dark:text-red-500 
                    hover:bg-red-50 dark:hover:bg-red-900/50 
                    rounded-full transition-colors duration-200
                    flex-shrink-0"
            aria-label="Remove ingredient"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default IngredientInput;