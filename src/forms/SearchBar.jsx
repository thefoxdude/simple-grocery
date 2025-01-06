import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-4 relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pl-10 border rounded bg-white"
        />
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchBar;