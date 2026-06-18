import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 font-['Poppins'] group">
      {/* Background glow overlay */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3B30] to-red-600 rounded-3xl opacity-5 group-focus-within:opacity-15 blur-lg transition duration-500"></div>

      {/* Main glassmorphic search input block */}
      <div className="relative flex items-center bg-[#111]/90 backdrop-blur-xl border border-zinc-800/85 rounded-2xl p-1.5 focus-within:border-[#FF3B30] focus-within:shadow-[0_0_20px_rgba(255,59,48,0.18)] transition-all duration-300">

        {/* Neon Search Icon */}
        <div className="pl-4 pr-3 text-[#FF3B30] flex items-center justify-center">
          <Search className="w-5 h-5 drop-shadow-[0_0_5px_rgba(255,59,48,0.4)]" />
        </div>

        {/* Input Text Box */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search products by title, SKU, or tags..."
          className="flex-1 bg-transparent border-none text-white text-sm sm:text-base placeholder-zinc-500 focus:outline-hidden font-light py-2.5 pr-2"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-zinc-500 hover:text-white p-1.5 rounded-xl hover:bg-zinc-850 transition-all mr-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Premium console tag badge */}
        <div className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-3.5 py-2 rounded-xl text-[10px] font-mono font-bold tracking-widest uppercase hidden sm:block shadow-inner select-none">
          go
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
