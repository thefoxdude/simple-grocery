import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative group mb-6">
      <input
        type="text"
        placeholder="Search healthy meals..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 pl-12 border border-emerald-200 rounded-lg shadow-sm 
                 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                 transition-shadow duration-200
                 bg-white placeholder-emerald-300"
        aria-label="Search meals"
      />
      <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 
                        text-emerald-400 group-hover:text-emerald-500 transition-colors duration-200" />
    </div>
  );
};

export default SearchBar;