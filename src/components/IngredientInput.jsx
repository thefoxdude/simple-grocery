import React from 'react';

const IngredientInput = ({ ingredient, onChange }) => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Ingredient"
        value={ingredient.name}
        onChange={(e) => onChange('name', e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Amount"
        value={ingredient.amount}
        onChange={(e) => onChange('amount', e.target.value)}
        className="w-24 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Unit"
        value={ingredient.unit}
        onChange={(e) => onChange('unit', e.target.value)}
        className="w-24 p-2 border rounded"
      />
    </div>
  );
};

export default IngredientInput;