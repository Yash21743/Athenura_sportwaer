import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductFilter from '../components/products/ProductFilter';
import ProductSorting from '../components/products/ProductSorting';
import ProductGrid from '../components/products/ProductGrid';
import { mockProducts } from '../services/mockProducts';
import API from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(3000);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedStockStatuses, setSelectedStockStatuses] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get('/products');
        if (response.data && response.data.length > 0) {
          setProducts(response.data.filter((p) => p.isActive !== false));
        } else throw new Error('Empty');
      } catch {
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const maxPriceLimit = useMemo(() => {
    if (!products.length) return 3000;
    return Math.max(...products.map((p) => p.price), 3000);
  }, [products]);

  useEffect(() => {
    if (products.length > 0) setPriceRange(maxPriceLimit);
  }, [products, maxPriceLimit]);

  const productCounts = useMemo(() => {
    const counts = { All: products.length };
    products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          if (!p.name.toLowerCase().includes(term) && !p.code.toLowerCase().includes(term) &&
            !(p.tags && p.tags.some((t) => t.toLowerCase().includes(term)))) return false;
        }
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (p.price > priceRange) return false;
        if (selectedSizes.length > 0 && !p.sizes.some((s) => selectedSizes.includes(s))) return false;
        if (selectedStockStatuses.length > 0 && !selectedStockStatuses.includes(p.stockStatus)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, searchTerm, selectedCategory, priceRange, selectedSizes, selectedStockStatuses, sortBy]);

  useEffect(() => {
    setVisibleCount(8);
  }, [searchTerm, selectedCategory, priceRange, selectedSizes, selectedStockStatuses, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange(maxPriceLimit);
    setSelectedSizes([]);
    setSelectedStockStatuses([]);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen font-['Poppins']" style={{ background: '#ffffff', color: '#111111' }}>

      {/* ══════════════════════════════
          HERO BANNER
      ══════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: '340px' }}>

        {/* Sports bg image */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/sporty-tshirts-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* Black overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.68) 50%, rgba(0,0,0,0.92) 100%)',
        }} />

        {/* Red radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,59,48,0.12) 0%, transparent 70%)',
        }} />

        {/* Decorative red lines – left */}
        <svg className="absolute top-0 left-0 w-40 h-40 opacity-40" viewBox="0 0 200 200" fill="none">
          <line x1="0" y1="50" x2="150" y2="0" stroke="#FF3B30" strokeWidth="1" />
          <line x1="0" y1="80" x2="120" y2="0" stroke="#FF3B30" strokeWidth="0.6" />
          <line x1="0" y1="110" x2="90" y2="0" stroke="#FF3B30" strokeWidth="0.3" />
        </svg>
        {/* Decorative red lines – right */}
        <svg className="absolute top-0 right-0 w-40 h-40 opacity-40" viewBox="0 0 200 200" fill="none">
          <line x1="200" y1="50" x2="50" y2="0" stroke="#FF3B30" strokeWidth="1" />
          <line x1="200" y1="80" x2="80" y2="0" stroke="#FF3B30" strokeWidth="0.6" />
          <line x1="200" y1="110" x2="110" y2="0" stroke="#FF3B30" strokeWidth="0.3" />
        </svg>

        {/* Bottom border */}
        <div className="absolute bottom-0 inset-x-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent, #FF3B30 30%, #FF3B30 70%, transparent)',
        }} />

        {/* Content */}
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '52px 48px 36px', position: 'relative', zIndex: 10, textAlign: 'center' }}>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1, marginBottom: '8px', fontSize: 'clamp(30px, 5vw, 60px)', color: '#FFFFFF', textShadow: '0 0 60px rgba(255,59,48,0.2)' }}
          >
            Comfy sportswear
            <br />
            <span style={{ color: '#FF3B30' }}>Collection</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: 'clamp(12px, 2vw, 18px)', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}
          >
            Athletic Performance Catalog
          </motion.p>

        </div>
      </div>

      {/* ══════════════════════════════
          CATALOG CONTENT
      ══════════════════════════════ */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 48px 80px' }}>

        {/* Filters */}
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
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Sort bar */}
        <ProductSorting
          totalCount={filteredProducts.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onMobileFilterToggle={() => { }}
        />

        {/* Products */}
        {loading ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: '120px 0', gap: '16px' }}>
            <div style={{ position: 'relative', width: '48px', height: '48px' }}>
              <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.06)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderTopColor: '#FF3B30', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>Loading collection...</p>
          </div>
        ) : (
          <>
            <ProductGrid products={filteredProducts.slice(0, visibleCount)} viewMode={viewMode} onResetFilters={handleResetFilters} />
            {visibleCount < filteredProducts.length && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  style={{ padding: '14px 32px', background: 'transparent', color: '#FF3B30', border: '1px solid rgba(255,59,48,0.5)', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#FF3B30'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#FF3B30'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF3B30'; e.currentTarget.style.borderColor = 'rgba(255,59,48,0.5)'; }}
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
