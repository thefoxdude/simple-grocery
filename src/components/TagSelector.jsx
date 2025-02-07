import React, { useState, useEffect } from 'react';
import { Plus, X, Loader } from 'lucide-react';
import { useTags } from '../hooks/useTags';

const TagSelector = ({ selectedTags = [], onTagsChange }) => {
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const { customTags, loadCustomTags, saveTag, isLoading } = useTags();
  
  useEffect(() => {
    loadCustomTags();
  }, [loadCustomTags]);

  // Default tags that are always available
  const defaultTags = [
    'Vegetarian',
    'Vegan',
    'Gluten Free',
    'Dairy Free',
    'Low Carb',
    'Keto',
    'Paleo',
    'Pescatarian',
    'Quick Meal',
    'Meal Prep'
  ];

  // Combine default tags with custom tags
  const allTags = [
    ...defaultTags,
    ...customTags.map(tag => tag.name)
  ];

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = async () => {
    const tagName = newTagInput.trim();
    if (tagName && !allTags.includes(tagName)) {
      try {
        await saveTag(tagName);
        onTagsChange([...selectedTags, tagName]);
        setNewTagInput('');
        setShowAddTag(false);
      } catch (error) {
        console.error('Failed to save tag:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader className="h-6 w-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium
                      transition-colors duration-200
                      ${selectedTags.includes(tag)
                        ? 'bg-emerald-500 text-white dark:bg-emerald-600'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'
                      }`}
          >
            {tag}
          </button>
        ))}
        <button
          onClick={() => setShowAddTag(true)}
          className="px-3 py-1.5 rounded-full text-sm font-medium
                    bg-emerald-50 text-emerald-600 hover:bg-emerald-100
                    dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-gray-700
                    transition-colors duration-200 flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Tag
        </button>
      </div>

      {showAddTag && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            placeholder="Enter new tag"
            className="flex-1 p-2 border border-emerald-200 dark:border-gray-600 rounded-md 
                      bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-200
                      placeholder-emerald-400 dark:placeholder-emerald-500
                      focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddNewTag();
              }
            }}
          />
          <button
            onClick={handleAddNewTag}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 
                      dark:bg-emerald-600 dark:hover:bg-emerald-700
                      text-white rounded-md transition-colors duration-200"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAddTag(false);
              setNewTagInput('');
            }}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/50 
                      rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TagSelector;