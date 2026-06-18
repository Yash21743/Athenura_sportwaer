import { useState } from 'react';

const categories = [
  'Sports T-Shirts',
  'Performance Jerseys',
  'Team Uniforms',
  'Sports Shorts',
  'Track Pants',
  'Hoodies',
  'Tracksuits',
  'Custom Team Kits',
  'Jackets',
  'Accessories',
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const colors = [
  { name: 'Black', hex: '#111' },
  { name: 'White', hex: '#f9fafb' },
  { name: 'Red', hex: '#E63946' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Grey', hex: '#4b5563' },
  { name: 'Olive', hex: '#4d7c0f' },
];

const ProductFilter = ({ 
  activeCategory, 
  activeSize, 
  activeColor, 
  onCategoryChange, 
  onSizeChange, 
  onColorChange,
  productCounts = {} 
}) => {
  return (
    <div className="flex flex-col gap-12">
      
      {/* ── CATEGORIES ── */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 text-gray-900 flex items-center gap-4 opacity-90">
          <span className="w-8 h-px bg-gradient-to-r from-[#E63946] to-transparent"></span>
          CATEGORIES
        </h3>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => onCategoryChange('')}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <div className={`absolute inset-0 rounded-full border transition-all duration-500 ${!activeCategory ? 'border-[#E63946] scale-100 shadow-[0_0_10px_rgba(230,57,70,0.3)]' : 'border-black/10 scale-75 group-hover:scale-100 group-hover:border-black/30'}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full bg-[#E63946] transition-all duration-500 ${!activeCategory ? 'scale-100 opacity-100 shadow-[0_0_8px_rgba(230,57,70,0.8)]' : 'scale-0 opacity-0'}`}></div>
                </div>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-500 ${!activeCategory ? 'text-gray-900 translate-x-1' : 'text-gray-500 group-hover:text-gray-800'}`}>All Gear</span>
              </div>
            </button>
          </li>
          
          {categories.map(cat => (
            <li key={cat}>
              <button
                onClick={() => onCategoryChange(cat)}
                className="w-full flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <div className={`absolute inset-0 rounded-full border transition-all duration-500 ${activeCategory === cat ? 'border-[#E63946] scale-100 shadow-[0_0_10px_rgba(230,57,70,0.3)]' : 'border-black/10 scale-75 group-hover:scale-100 group-hover:border-black/30'}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full bg-[#E63946] transition-all duration-500 ${activeCategory === cat ? 'scale-100 opacity-100 shadow-[0_0_8px_rgba(230,57,70,0.8)]' : 'scale-0 opacity-0'}`}></div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-500 ${activeCategory === cat ? 'text-gray-900 translate-x-1' : 'text-gray-500 group-hover:text-gray-800'}`}>{cat}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 transition-colors duration-500 group-hover:text-gray-600">
                  {String(productCounts[cat] || 0).padStart(2, '0')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── SIZES ── */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 text-gray-900 flex items-center gap-4 opacity-90">
          <span className="w-8 h-px bg-gradient-to-r from-[#E63946] to-transparent"></span>
          SIZE MATRIX
        </h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => onSizeChange(activeSize === size ? '' : size)}
              className={`min-w-[48px] h-11 flex items-center justify-center text-[10px] font-black tracking-wider transition-all duration-500 border backdrop-blur-md rounded-md ${
                activeSize === size 
                  ? 'border-[#E63946] bg-[#E63946]/10 text-[#E63946] shadow-[0_0_20px_rgba(230,57,70,0.1)]' 
                  : 'border-black/[0.05] bg-white/50 text-gray-500 hover:border-black/20 hover:text-gray-900 shadow-sm'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* ── COLORS ── */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 text-gray-900 flex items-center gap-4 opacity-90">
          <span className="w-8 h-px bg-gradient-to-r from-[#E63946] to-transparent"></span>
          COLORS
        </h3>
        <div className="grid grid-cols-6 gap-3">
          {colors.map(color => (
            <button
              key={color.name}
              onClick={() => onColorChange(activeColor === color.name ? '' : color.name)}
              className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 group ${
                activeColor === color.name ? 'scale-110' : 'hover:scale-105'
              }`}
              title={color.name}
            >
              <div 
                className={`absolute inset-0 rounded-full border transition-all duration-500 ${activeColor === color.name ? 'border-[#E63946] opacity-100 shadow-[0_0_15px_rgba(230,57,70,0.4)] scale-110' : 'border-black/10 opacity-0 group-hover:opacity-100 scale-125'}`}
              ></div>
              <div 
                className="w-full h-full rounded-full border border-black/[0.05] shadow-inner z-10"
                style={{ backgroundColor: color.hex, opacity: 1 }}
              ></div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductFilter;
