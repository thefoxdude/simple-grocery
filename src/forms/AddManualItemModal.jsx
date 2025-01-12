import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import { MEASUREMENT_UNITS } from '../helpers/unitConversions';

const AddManualItemModal = ({ onClose, onAdd }) => {
  const modalRef = useRef(null);
  const [item, setItem] = useState({ name: '', amount: '', unit: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item.name || !item.amount || !item.unit) return;

    setIsSubmitting(true);
    try {
      await onAdd(item);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="border-b border-emerald-100 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
            Add Grocery Item
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Item name"
              value={item.name}
              onChange={(e) => setItem(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-emerald-200 dark:border-gray-600 rounded-md 
                        bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-200
                        placeholder-emerald-400 dark:placeholder-emerald-500
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Amount"
              value={item.amount}
              onChange={(e) => setItem(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full p-2 border border-emerald-200 dark:border-gray-600 rounded-md 
                        bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-200
                        placeholder-emerald-400 dark:placeholder-emerald-500
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
            
            <select
              value={item.unit}
              onChange={(e) => setItem(prev => ({ ...prev, unit: e.target.value }))}
              className="w-full p-2 border border-emerald-200 dark:border-gray-600 rounded-md 
                        bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-200
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            >
              <option value="">Select unit</option>
              {Object.entries(MEASUREMENT_UNITS).map(([category, units]) => (
                <optgroup key={category} label={category}>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || !item.name || !item.amount || !item.unit}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600
                      dark:bg-emerald-600 dark:hover:bg-emerald-700
                      text-white rounded-lg transition-colors duration-200
                      flex items-center justify-center gap-2 
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Add Item</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddManualItemModal;