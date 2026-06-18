const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling', 'Top Rated'];

const ProductSorting = ({ sortBy = 'Newest', onSortChange, totalResults = 0, showingCount = 0 }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      
      <div className="flex items-center gap-3">
         <span className="w-2 h-2 rounded-full bg-[#E63946] animate-pulse"></span>
         <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
           Showing <span className="text-gray-900">{showingCount}</span> of <span className="text-gray-900">{totalResults}</span> products
         </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">SORT BY</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-900 text-[11px] font-black uppercase tracking-widest pl-4 pr-10 py-3 rounded-md focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] transition-all cursor-pointer shadow-sm hover:border-gray-300"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E63946]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductSorting;
