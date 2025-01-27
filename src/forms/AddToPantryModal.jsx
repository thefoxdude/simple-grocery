import React, { useState, useRef, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import IngredientInput from './IngredientInput';

const AddToPantryModal = ({ 
  isOpen, 
  onClose, 
  checkedItems,
  onSave,
  isSaving 
}) => {
  const modalRef = useRef(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(checkedItems.map(item => ({
      name: item.name,
      amount: item.amount,
      unit: item.unit
    })));
  }, [checkedItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const updateItem = (index, field, value) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="border-b border-emerald-100 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
            Add Items to Pantry
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {items.map((item, idx) => (
            <IngredientInput
              key={idx}
              ingredient={item}
              onChange={(field, value) => updateItem(idx, field, value)}
            />
          ))}

          <button 
            onClick={() => onSave(items)}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600
                      dark:bg-emerald-600 dark:hover:bg-emerald-700
                      text-white rounded-lg transition-colors duration-200
                      flex items-center justify-center gap-2 
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Add to Pantry</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPantryModal;