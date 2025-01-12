import React, { useRef, useEffect, useState } from 'react';
import { X, Plus, Save, Loader, ChevronDown, Check } from 'lucide-react';
import { MEASUREMENT_UNITS, ALL_UNITS } from '../helpers/unitConversions';

const AddPantryItemModal = ({ 
  isOpen, 
  onClose, 
  item, 
  setItem, 
  onSave, 
  isSaving, 
  operationError,
  isEditing = false
}) => {
  const modalRef = useRef(null);
  const [isUnitsOpen, setIsUnitsOpen] = useState(false);
  const [unitSearch, setUnitSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredUnits = ALL_UNITS.filter(unit =>
    unit.toLowerCase().includes(unitSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Set unitSearch when editing
      if (isEditing && item.unit) {
        setUnitSearch(item.unit);
      }
    } else {
      resetUnitSearch();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isEditing, item.unit]);

  const resetUnitSearch = () => {
    setUnitSearch('');
    setIsUnitsOpen(false);
    setActiveIndex(0);
  };

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
          setItem(prev => ({ ...prev, unit: filteredUnits[activeIndex] }));
          setIsUnitsOpen(false);
          setUnitSearch(filteredUnits[activeIndex]);
        }
        break;
      case 'Escape':
        resetUnitSearch();
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="border-b border-emerald-100 dark:border-gray-700 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
            {isEditing ? 'Edit Pantry Item' : 'Add Pantry Item'}
          </h3>
          <button
            onClick={() => {
              resetUnitSearch();
              onClose();
            }}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
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
            
            <div className="relative">
              <div
                onClick={() => setIsUnitsOpen(true)}
                className="w-full p-2 border border-emerald-200 dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-800 cursor-pointer
                          flex items-center justify-between"
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
                  className="w-full focus:outline-none bg-transparent
                           text-emerald-800 dark:text-emerald-200
                           placeholder-emerald-400 dark:placeholder-emerald-500"
                />
                <ChevronDown className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
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
                              setItem(prev => ({ ...prev, unit }));
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
                            {item.unit === unit && (
                              <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                            )}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {operationError && (
            <div className="text-red-500 dark:text-red-400 text-sm">{operationError}</div>
          )}

          <button 
            onClick={onSave}
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
                {isEditing ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                <span>{isEditing ? 'Save Changes' : 'Add Item'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPantryItemModal;