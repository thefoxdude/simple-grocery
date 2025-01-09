import React, { useRef, useEffect } from 'react';
import { X, Plus, Save, Loader } from 'lucide-react';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef} 
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="border-b border-emerald-100 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-emerald-800">
            {isEditing ? 'Edit Pantry Item' : 'Add Pantry Item'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-emerald-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Item name"
              value={item.name}
              onChange={(e) => setItem(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-emerald-200 rounded-md 
                        focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) => setItem(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full p-2 border border-emerald-200 rounded-md 
                          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
              
              <input
                type="text"
                placeholder="Unit"
                value={item.unit}
                onChange={(e) => setItem(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full p-2 border border-emerald-200 rounded-md 
                          focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
            </div>
          </div>

          {operationError && (
            <div className="text-red-500 text-sm">{operationError}</div>
          )}

          <button 
            onClick={onSave}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600
                      text-white rounded-lg transition-colors duration-200
                      flex items-center justify-center gap-2 disabled:opacity-50"
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