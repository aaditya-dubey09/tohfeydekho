import React from 'react';

const BrowseHeader = () => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
        FIND THE BEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">GIFTS</span>
      </h1>
      <p className="text-xl text-gray-600">Explore our curated collection of perfect gifts</p>
    </div>
  );
};

export default BrowseHeader;
