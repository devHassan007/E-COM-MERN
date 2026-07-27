import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
        
        {/* Spinning Ring */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
        
        {/* Inner Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-amber-500/20 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default Loader;
