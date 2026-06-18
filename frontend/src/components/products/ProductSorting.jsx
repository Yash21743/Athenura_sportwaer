import React from 'react';
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const ProductSorting = ({
  totalCount,
  sortBy,
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  onMobileFilterToggle
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#111] border border-zinc-800/80 p-4 rounded-2xl mb-6 shadow-sm">
      {/* Product count and mobile filter toggle */}
      <div className="flex items-center justify-between sm:justify-start gap-4">
        <button
          type="button"
          onClick={onMobileFilterToggle}
          className="lg:hidden flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-white text-sm font-semibold transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#FF3B30]" />
          <span>Filters</span>
        </button>
        
        <p className="text-zinc-400 text-sm font-['Poppins']">
          We found <span className="font-bold text-white">{totalCount}</span> {totalCount === 1 ? 'product' : 'products'} for you
        </p>
      </div>

      {/* Sorting options and Grid/List toggles */}
      <div className="flex items-center gap-3 justify-between sm:justify-end">
        {/* Sort Select */}
        <div className="relative flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent border-none text-zinc-300 text-xs sm:text-sm font-semibold focus:outline-hidden cursor-pointer font-['Poppins'] pr-1"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center border border-zinc-800 rounded-xl p-0.5 bg-zinc-900">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-zinc-850 text-[#FF3B30] shadow-xs'
                : 'text-zinc-500 hover:text-zinc-400'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-zinc-850 text-[#FF3B30] shadow-xs'
                : 'text-zinc-500 hover:text-zinc-400'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSorting;
