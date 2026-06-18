import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/products/SearchBar';
import ProductFilter from '../components/products/ProductFilter';
import ProductSorting from '../components/products/ProductSorting';
import ProductGrid from '../components/products/ProductGrid';

export const products = [
  { id: 1, name: 'Pro Vent Mesh T-Shirt', category: 'Sports T-Shirts', price: 1299, oldPrice: 1799, badge: 'NEW', rating: 5, reviews: 120, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Velocity Running Jersey', category: 'Performance Jerseys', price: 1999, oldPrice: 2599, badge: 'BESTSELLER', rating: 5, reviews: 85, image: 'https://images.unsplash.com/photo-1558507652-2d9626c4e67a?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Aero-Flex Shorts', category: 'Sports Shorts', price: 999, oldPrice: 1299, badge: '', rating: 4, reviews: 300, image: 'https://images.unsplash.com/photo-1533681904393-9ab6efa3e43d?auto=format&fit=crop&q=80&w=800' },
  { id: 4, name: 'Thermal Track Pants', category: 'Track Pants', price: 1499, oldPrice: 1999, badge: 'SALE', rating: 4, reviews: 45, image: 'https://images.unsplash.com/photo-1556822284-e58ebdf581f1?auto=format&fit=crop&q=80&w=800' },
  { id: 5, name: 'Winter Sports Hoodie', category: 'Hoodies', price: 2499, oldPrice: 3499, badge: 'NEW', rating: 5, reviews: 210, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800' },
  { id: 6, name: 'Complete Tracksuit', category: 'Tracksuits', price: 3999, oldPrice: 5499, badge: 'HOT', rating: 5, reviews: 56, image: 'https://images.unsplash.com/photo-1539598751515-568ebbc75eeb?auto=format&fit=crop&q=80&w=800' },
  { id: 7, name: 'Youth Soccer Kit', category: 'Team Uniforms', price: 4999, oldPrice: 6499, badge: 'BESTSELLER', rating: 5, reviews: 180, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800' },
  { id: 8, name: 'Pro Gym Bag', category: 'Accessories', price: 899, oldPrice: 1199, badge: '', rating: 4, reviews: 95, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800' },
  { id: 9, name: 'Ultimate Compression Tights', category: 'Track Pants', price: 1299, oldPrice: 1699, badge: 'NEW', rating: 4, reviews: 130, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800' },
  { id: 10, name: 'Pro Vent Mesh T-Shirt', category: 'Sports T-Shirts', price: 1599, oldPrice: 2099, badge: '', rating: 5, reviews: 78, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
  { id: 11, name: 'Custom Team Kits', category: 'Custom Team Kits', price: 5999, oldPrice: 7499, badge: 'HOT', rating: 5, reviews: 200, image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800' },
  { id: 12, name: 'Sport Training Jacket', category: 'Jackets', price: 2999, oldPrice: 3999, badge: 'NEW', rating: 5, reviews: 65, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800' },
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [activeSize, setActiveSize] = useState('');
  const [activeColor, setActiveColor] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter
  let filtered = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products;

  // Search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Top Rated') return b.rating - a.rating;
    if (sortBy === 'Best Selling') return b.reviews - a.reviews;
    return b.id - a.id;
  });

  // Category counts for sidebar
  const productCounts = {};
  products.forEach(p => {
    productCounts[p.category] = (productCounts[p.category] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Montserrat',sans-serif] text-gray-700 relative overflow-hidden selection:bg-[#E63946] selection:text-white pb-32">
      
      {/* --- AMBIENT BACKGROUND GLOWS REMOVED FOR LIGHT THEME --- */}

      {/* ═══════════════════════════ AESTHETIC HEADER ═══════════════════════════ */}
      <div className="w-full pt-24 pb-20 flex flex-col items-center justify-center relative z-10 text-center px-6">
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
          <span className="text-[10px] text-gray-500 font-bold tracking-[0.5em] uppercase">Tactical Arsenal</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-gray-900 italic tracking-tighter uppercase drop-shadow-sm">
          COMPLETE <span className="text-[#E63946]">COLLECTION</span>
        </h2>
        <p className="mt-6 text-gray-500 text-[11px] font-bold tracking-widest uppercase max-w-lg leading-relaxed opacity-90">
          Curated for the relentless. Precision engineered for absolute dominance.
        </p>
      </div>

      {/* ═══════════════════════════ MAIN CONTENT ═══════════════════════════ */}
      <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16 py-16 relative z-10">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* ─────── LIGHT SIDEBAR ─────── */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-full flex items-center justify-between bg-white border border-gray-200 px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900 shadow-sm"
          >
            <span className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#E63946]"></span>
              Filter Collection
            </span>
            <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </button>

          <aside className={`w-full lg:w-[280px] flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden'} lg:block sticky top-28`}>
            
            <div className="mb-10">
              <SearchBar onSearch={setSearchQuery} placeholder="SEARCH GEAR..." />
            </div>
            
            <ProductFilter
              activeCategory={activeCategory}
              activeSize={activeSize}
              activeColor={activeColor}
              onCategoryChange={setActiveCategory}
              onSizeChange={setActiveSize}
              onColorChange={setActiveColor}
              productCounts={productCounts}
            />
          </aside>

          {/* ─────── MAIN AREA ─────── */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            <div className="mb-10 pb-6 border-b border-gray-200">
              <ProductSorting
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalResults={sorted.length}
                showingCount={sorted.length}
              />
            </div>

            {/* Product Grid */}
            <ProductGrid products={sorted} />

            {/* Premium Light Pagination */}
            {sorted.length > 0 && (
              <div className="flex items-center justify-center mt-20 gap-3">
                <button className="w-10 h-10 bg-[#E63946] text-white text-[12px] font-bold flex items-center justify-center shadow-[0_4px_14px_rgba(230,57,70,0.3)] transition-all rounded">1</button>
                <button className="w-10 h-10 bg-white text-gray-600 text-[12px] font-bold flex items-center justify-center border border-gray-200 shadow-sm hover:border-[#E63946] hover:text-[#E63946] transition-all rounded">2</button>
                <button className="w-10 h-10 bg-white text-gray-600 text-[12px] font-bold flex items-center justify-center border border-gray-200 shadow-sm hover:border-[#E63946] hover:text-[#E63946] transition-all rounded">3</button>
                <span className="text-gray-400 text-xs px-2 font-black tracking-widest">...</span>
                <button className="w-10 h-10 bg-white text-gray-600 text-[12px] font-bold flex items-center justify-center border border-gray-200 shadow-sm hover:border-[#E63946] hover:text-[#E63946] transition-all rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}

            {/* Light Empty State */}
            {sorted.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="text-[#E63946] mb-6 opacity-80">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 mb-3">NOTHING FOUND</h3>
                <p className="text-[12px] text-gray-500 font-medium mb-8">No tactical gear matches your current parameters.</p>
                <button
                  onClick={() => { setActiveCategory(''); setActiveSize(''); setActiveColor(''); setSearchQuery(''); }}
                  className="text-[11px] font-bold bg-white border border-gray-300 text-gray-800 px-8 py-3.5 rounded-md hover:bg-[#E63946] hover:text-white hover:border-[#E63946] transition-all uppercase tracking-widest shadow-md"
                >
                  RESET FILTERS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;