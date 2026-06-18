import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';

const CATEGORIES = [
  'Sports T-Shirts',
  'Jerseys',
  'Team Uniforms',
  'Sports Shorts',
  'Track Pants',
  'Hoodies',
  'Tracksuits',
  'Custom Team Kits',
  'Accessories'
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const STOCK_STATUSES = ['In Stock', 'Limited Stock', 'Out of Stock'];

const ProductFilter = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  maxPriceLimit = 3000,
  onPriceChange,
  selectedSizes,
  onSizesChange,
  selectedStockStatuses,
  onStockStatusesChange,
  onClearFilters,
  productCounts = {}
}) => {
  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter((s) => s !== size));
    } else {
      onSizesChange([...selectedSizes, size]);
    }
  };

  const handleStockToggle = (status) => {
    if (selectedStockStatuses.includes(status)) {
      onStockStatusesChange(selectedStockStatuses.filter((s) => s !== status));
    } else {
      onStockStatusesChange([...selectedStockStatuses, status]);
    }
  };

  const isAnyFilterActive =
    selectedCategory !== 'All' ||
    priceRange < maxPriceLimit ||
    selectedSizes.length > 0 ||
    selectedStockStatuses.length > 0;

  return (
    <div className="bg-[#111] rounded-3xl border border-zinc-800/80 p-6 shadow-sm sticky top-24 font-['Poppins']">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-white font-semibold font-['Montserrat']">
          <Filter className="w-5 h-5 text-[#FF3B30]" />
          <span>Filters</span>
        </div>
        {isAnyFilterActive && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-zinc-400 mb-3 font-['Montserrat'] uppercase tracking-wider">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange('All')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
              selectedCategory === 'All'
                ? 'bg-red-500/10 text-[#FF3B30] font-semibold'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            <span>All Categories</span>
            <span className="text-xs bg-zinc-800 text-zinc-500 py-0.5 px-2 rounded-full font-normal">
              {productCounts['All'] || 0}
            </span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                selectedCategory === cat
                  ? 'bg-red-500/10 text-[#FF3B30] font-semibold'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <span className="truncate">{cat}</span>
              <span className="text-xs bg-zinc-800 text-zinc-500 py-0.5 px-2 rounded-full font-normal">
                {productCounts[cat] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6 pt-5 border-t border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-zinc-400 font-['Montserrat'] uppercase tracking-wider">
            Max Price
          </h4>
          <span className="text-sm font-bold text-[#FF3B30] font-['Poppins']">
            ₹{priceRange}
          </span>
        </div>
        <input
          type="range"
          min="300"
          max={maxPriceLimit}
          step="50"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF3B30]"
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-2 font-['Poppins']">
          <span>₹300</span>
          <span>₹{maxPriceLimit}</span>
        </div>
      </div>

      {/* Sizes Filter */}
      <div className="mb-6 pt-5 border-t border-zinc-800">
        <h4 className="text-xs font-bold text-zinc-400 mb-3 font-['Montserrat'] uppercase tracking-wider">
          Filter by Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`w-10 h-10 flex items-center justify-center text-xs font-bold rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#FF3B30] border-[#FF3B30] text-white shadow-md'
                    : 'bg-transparent border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Status Filter */}
      <div className="pt-5 border-t border-zinc-800">
        <h4 className="text-xs font-bold text-zinc-400 mb-3 font-['Montserrat'] uppercase tracking-wider">
          Stock Status
        </h4>
        <div className="space-y-2">
          {STOCK_STATUSES.map((status) => {
            const isSelected = selectedStockStatuses.includes(status);
            return (
              <label
                key={status}
                onClick={() => handleStockToggle(status)}
                className="flex items-center gap-3 cursor-pointer group text-sm text-zinc-400 hover:text-white font-medium"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#FF3B30] border-[#FF3B30] text-white'
                      : 'border-zinc-700 group-hover:border-zinc-600'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span>{status}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
