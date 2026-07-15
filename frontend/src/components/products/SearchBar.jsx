import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative group font-['Poppins']">
      {/* Glow backdrop */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#FF3B30]/0 via-[#FF3B30]/0 to-[#FF3B30]/0 group-focus-within:from-[#FF3B30]/20 group-focus-within:via-[#FF3B30]/10 group-focus-within:to-[#FF3B30]/20 blur-xl transition-all duration-500 pointer-events-none" />

      {/* Input wrapper */}
      <div className="relative flex items-center bg-zinc-900/70 border border-zinc-800 rounded-2xl group-focus-within:border-[#FF3B30]/40 group-focus-within:bg-zinc-900/90 transition-all duration-300">
        {/* Icon */}
        <div className="pl-5 pr-3 flex items-center flex-shrink-0">
          <Search className="w-4.5 h-4.5 text-zinc-600 group-focus-within:text-[#FF3B30] transition-colors duration-300" style={{ width: '18px', height: '18px' }} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, SKU, or tags..."
          className="flex-1 bg-transparent text-white text-sm placeholder-zinc-600 focus:outline-none py-3.5 pr-3"
        />

        {/* Clear */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="mr-2 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Kbd hint */}
        <div className="hidden sm:flex items-center gap-1 mr-4 flex-shrink-0">
          <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/80 border border-zinc-700/50 px-2 py-1 rounded-md">⌘K</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
