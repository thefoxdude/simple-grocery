import React, { useState, useEffect } from 'react';
import { Warehouse, Plus, Loader, Trash2 } from 'lucide-react';
import { usePantry } from '../hooks/usePantry';
import SearchBar from '../forms/SearchBar';
import AddPantryItemModal from '../forms/AddPantryItemModal';

const PantryTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentItem, setCurrentItem] = useState({ 
    name: '', 
    amount: '',
    unit: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);

  const { 
    pantryItems, 
    loadPantryItems, 
    savePantryItem,
    deletePantryItem,
    isLoading,
    isSaving,
    operationError 
  } = usePantry();

  useEffect(() => {
    loadPantryItems();
  }, [loadPantryItems]);

  const filteredItems = pantryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSavePantryItem = async () => {
    if (currentItem.name && currentItem.amount && currentItem.unit) {
      try {
        await savePantryItem(currentItem);
        setCurrentItem({ name: '', amount: '', unit: '' });
        setIsModalOpen(false);
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to save pantry item:', err);
      }
    }
  };

  const handleAddClick = () => {
    setCurrentItem({ name: '', amount: '', unit: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (itemId, e) => {
    e.stopPropagation();
    setDeletingItemId(itemId);
    try {
      await deletePantryItem(itemId);
    } catch (err) {
      console.error('Failed to delete pantry item:', err);
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentItem({ name: '', amount: '', unit: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-emerald-500 dark:text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Warehouse className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
            Pantry
          </h2>
        </div>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 
                    dark:bg-emerald-600 dark:hover:bg-emerald-700
                    text-white rounded-lg transition-colors duration-200
                    flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Item
        </button>
      </div>

      <div className="bg-emerald-50 dark:bg-gray-800 rounded-lg p-6 space-y-6">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchString='Search Pantry...'
        />
        
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              onClick={() => handleEditClick(item)}
              className="flex justify-between items-center bg-white dark:bg-gray-900 
                        p-4 rounded-lg shadow-sm hover:shadow-md 
                        transition-all duration-200 cursor-pointer group
                        border border-emerald-100 dark:border-gray-700"
            >
              <div>
                <h3 className="font-medium text-emerald-800 dark:text-emerald-200">
                  {item.name}
                </h3>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                  {parseFloat(item.amount).toString()} {item.unit}
                </p>
              </div>
              <button
                onClick={(e) => handleDeleteItem(item.id, e)}
                disabled={deletingItemId === item.id}
                className="p-2 text-red-400 dark:text-red-500 
                          hover:bg-red-50 dark:hover:bg-red-900/50 
                          rounded-full transition-colors duration-200
                          opacity-0 group-hover:opacity-100
                          disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={deletingItemId === item.id ? "Deleting item..." : "Delete item"}
              >
                {deletingItemId === item.id ? (
                  <Loader className="h-4 w-4 animate-spin text-red-500 dark:text-red-400" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}

          {filteredItems.length === 0 && searchQuery && (
            <div className="text-center py-8 text-emerald-600 dark:text-emerald-400">
              No items found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      <AddPantryItemModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        item={currentItem}
        setItem={setCurrentItem}
        onSave={handleSavePantryItem}
        isSaving={isSaving}
        operationError={operationError}
        isEditing={isEditing}
      />
    </div>
  );
};

export default PantryTab;