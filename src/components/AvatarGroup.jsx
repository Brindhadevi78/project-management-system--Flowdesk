import React from 'react';

const AvatarGroup = ({ className }) => (
  <div className={`flex -space-x-2 ${className}`}>
    <div className="w-8 h-8 rounded-full border-2 border-white/40 bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">JD</div>
    <div className="w-8 h-8 rounded-full border-2 border-white/40 bg-pink-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">SM</div>
    <div className="w-8 h-8 rounded-full border-2 border-white/40 bg-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">RK</div>
  </div>
);

export default AvatarGroup;
