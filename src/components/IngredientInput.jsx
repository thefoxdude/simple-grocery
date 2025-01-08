import { X } from 'lucide-react';
import React from 'react';

const IngredientInput = ({ ingredient, onChange, onRemove }) => {
  return (
    <div className="flex gap-2 items-center animate-fadeIn">
      <input
        type="text"
        placeholder="Ingredient name"
        value={ingredient.name}
        onChange={(e) => onChange('name', e.target.value)}
        className="flex-1 p-2 border border-emerald-200 rounded-md 
                    focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 
                    transition-all duration-200 placeholder-emerald-300"
        aria-label="Ingredient name"
      />
      <input
        type="text"
        placeholder="Amount"
        value={ingredient.amount}
        onChange={(e) => onChange('amount', e.target.value)}
        className="w-24 p-2 border border-emerald-200 rounded-md 
                    focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 
                    transition-all duration-200 placeholder-emerald-300"
        aria-label="Ingredient amount"
      />
      <input
        type="text"
        placeholder="Unit"
        value={ingredient.unit}
        onChange={(e) => onChange('unit', e.target.value)}
        className="w-24 p-2 border border-emerald-200 rounded-md 
                    focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 
                    transition-all duration-200 placeholder-emerald-300"
        aria-label="Ingredient unit"
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-2 text-red-400 hover:bg-red-50 rounded-full 
                      transition-colors duration-200"
          aria-label="Remove ingredient"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
};

export default IngredientInput;