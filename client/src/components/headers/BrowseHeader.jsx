import React from 'react';
import { Search } from 'lucide-react';

const BrowseHeader = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-black">Browse All Gifts</h1>
      <form onSubmit={onSearchSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black outline-none font-medium"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:scale-105 transition-transform"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default BrowseHeader;
