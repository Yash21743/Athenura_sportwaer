import { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = 'SEARCH GEAR...', className = '' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative group ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <svg className="w-4 h-4 text-gray-500 group-focus-within:text-[#E63946] transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
        type="text"
        className="w-full bg-white border border-gray-200 text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] pl-14 pr-6 py-5 rounded-xl focus:outline-none focus:border-[#E63946]/50 focus:shadow-[0_4px_25px_rgba(230,57,70,0.15)] transition-all duration-500 placeholder-gray-400 shadow-sm"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (onSearch) onSearch(e.target.value);
        }}
      />
      
      {/* Abstract technical accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gray-50 border-l border-gray-200 rounded-r-xl flex flex-col items-center justify-center gap-[2px] transition-opacity duration-500">
        <div className="w-[2px] h-[3px] bg-gray-300"></div>
        <div className="w-[2px] h-[3px] bg-gray-300"></div>
        <div className="w-[2px] h-[6px] bg-[#E63946] shadow-[0_0_8px_rgba(230,57,70,0.8)]"></div>
      </div>
    </form>
  );
};

export default SearchBar;
