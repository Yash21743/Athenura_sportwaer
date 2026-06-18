import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import SearchBar from '../components/products/SearchBar';
import ProductFilter from '../components/products/ProductFilter';
import ProductSorting from '../components/products/ProductSorting';
import ProductGrid from '../components/products/ProductGrid';
import { mockProducts } from '../services/mockProducts';
import API from '../services/api';

const Products = () => {
  // Products states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(3000);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedStockStatuses, setSelectedStockStatuses] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  
  // Responsive sidebar drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get('/products');
        if (response.data && response.data.length > 0) {
          setProducts(response.data.filter(p => p.isActive !== false));
        } else {
          throw new Error('No products returned from API');
        }
      } catch (err) {
        console.warn('Backend API connection failed, falling back to mock sportswear products.', err);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Compute maximum price dynamically based on products loaded
  const maxPriceLimit = useMemo(() => {
    if (products.length === 0) return 3000;
    const prices = products.map((p) => p.price);
    return Math.max(...prices, 3000);
  }, [products]);

  // Set default price range once products are loaded
  useEffect(() => {
    if (products.length > 0) {
      setPriceRange(maxPriceLimit);
    }
  }, [products, maxPriceLimit]);

  // Dynamic Product Counts per Category
  const productCounts = useMemo(() => {
    const counts = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(term);
          const matchesCode = p.code.toLowerCase().includes(term);
          const matchesTags = p.tags && p.tags.some((t) => t.toLowerCase().includes(term));
          if (!matchesName && !matchesCode && !matchesTags) return false;
        }

        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        if (p.price > priceRange) {
          return false;
        }

        if (selectedSizes.length > 0) {
          const hasMatchingSize = p.sizes.some((size) => selectedSizes.includes(size));
          if (!hasMatchingSize) return false;
        }

        if (selectedStockStatuses.length > 0) {
          if (!selectedStockStatuses.includes(p.stockStatus)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'featured':
          default:
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return 0;
        }
      });
  }, [products, searchTerm, selectedCategory, priceRange, selectedSizes, selectedStockStatuses, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange(maxPriceLimit);
    setSelectedSizes([]);
    setSelectedStockStatuses([]);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white pb-20 font-['Poppins']">
      
      {/* Visual Header Banner (Sporty Red Gradient theme) */}
      <div className="bg-[#0b0b0b] relative py-16 px-4 md:px-8 mb-10 overflow-hidden border-b border-zinc-900">
        {/* Glow overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,59,48,0.25) 0%, transparent 65%)'
          }}
        />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#FF3B30] text-xs md:text-sm font-bold uppercase tracking-widest font-['Montserrat'] mb-2.5 inline-block"
          >
            Athenura Sportswear
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black font-['Montserrat'] tracking-tight mb-4"
          >
            Athletic Performance Catalog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed text-center"
            style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}
          >
            High-performance dry-fit shirts, custom jerseys, matching team uniforms and accessories designed for peak athletic output.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:w-80 shrink-0">
            <ProductFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              maxPriceLimit={maxPriceLimit}
              onPriceChange={setPriceRange}
              selectedSizes={selectedSizes}
              onSizesChange={setSelectedSizes}
              selectedStockStatuses={selectedStockStatuses}
              onStockStatusesChange={setSelectedStockStatuses}
              onClearFilters={handleResetFilters}
              productCounts={productCounts}
            />
          </aside>

          {/* Catalog Content Area */}
          <div className="flex-1 lg:pl-6">
            {/* Search Bar */}
            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            {/* Sorting Controls */}
            <ProductSorting
              totalCount={filteredProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onMobileFilterToggle={() => setIsMobileFilterOpen(true)}
            />

            {/* Loading / Results Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-4 border-[#FF3B30]/30 border-t-[#FF3B30] rounded-full animate-spin"></div>
                <p className="text-zinc-500 text-sm font-semibold">Loading athletic gear...</p>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                viewMode={viewMode}
                onResetFilters={handleResetFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Slide-over Panel for Filters */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 z-40 lg:hidden"
            />

            {/* Drawer body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0d0d0d] border-l border-zinc-800 shadow-2xl z-50 overflow-y-auto p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-3">
                <span className="text-base font-bold text-white font-['Montserrat']">Filter Products</span>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilter
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => {
                  setSelectedCategory(cat);
                  setIsMobileFilterOpen(false); // Auto close
                }}
                priceRange={priceRange}
                maxPriceLimit={maxPriceLimit}
                onPriceChange={setPriceRange}
                selectedSizes={selectedSizes}
                onSizesChange={setSelectedSizes}
                selectedStockStatuses={selectedStockStatuses}
                onStockStatusesChange={setSelectedStockStatuses}
                onClearFilters={handleResetFilters}
                productCounts={productCounts}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
