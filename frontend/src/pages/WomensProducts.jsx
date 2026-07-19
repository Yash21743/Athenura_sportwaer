import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import ProductFilter from '../components/products/ProductFilter';
import ProductSorting from '../components/products/ProductSorting';
import ProductGrid from '../components/products/ProductGrid';
import { mockProducts } from '../services/mockProducts';
import API from '../services/api';

const WomensProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(3000);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedStockStatuses, setSelectedStockStatuses] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(10);
  const scrollTargetId = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get('/products');
        const list = response.data?.data || response.data;
        if (
          list &&
          Array.isArray(list) &&
          list.length > 0 &&
          list[0]._id
        ) {
          // Temporarily just showing all products, but prioritizing those with 'women' in name/tags if any existed
          setProducts(list.filter((p) => p.status !== 'inactive'));
        } else throw new Error('Empty or invalid response');
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
    products.forEach((p) => {
      const cat = typeof p.category === 'object' && p.category ? p.category.name : p.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const pCode = p.code || p.productCode || '';
          if (!p.name.toLowerCase().includes(term) && !pCode.toLowerCase().includes(term) &&
            !(p.tags && p.tags.some((t) => t.toLowerCase().includes(term)))) return false;
        }
        if (selectedCategory !== 'All') {
          const cat = typeof p.category === 'object' && p.category ? p.category.name : p.category;
          if (cat !== selectedCategory) return false;
        }
        if (p.price > priceRange) return false;
        const pSizes = p.sizes || p.availableSizes || [];
        if (selectedSizes.length > 0 && !pSizes.some((s) => selectedSizes.includes(s))) return false;
        const pStockStatus = p.stockStatus || (p.inStock ? "In Stock" : "Out of Stock");
        if (selectedStockStatuses.length > 0 && !selectedStockStatuses.includes(pStockStatus)) return false;
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
    setVisibleCount(10);
  }, [searchTerm, selectedCategory, selectedSizes, selectedStockStatuses, sortBy]);

  // Scroll to first new card after Load More
  useEffect(() => {
    if (scrollTargetId.current) {
      const el = document.getElementById(`card-${scrollTargetId.current}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      scrollTargetId.current = null;
    }
  }, [visibleCount]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange(maxPriceLimit);
    setSelectedSizes([]);
    setSelectedStockStatuses([]);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen font-['Poppins']" style={{ background: '#DDDFD2', color: '#111111' }}>

      {/* ══════════════════════════════
          HERO BANNER
      ══════════════════════════════ */}
      <div className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '500px' }}>

        {/* Women image bg */}
        <div className="absolute inset-0" style={{ backgroundColor: '#000' }}>
          <img
            src="/womens.png"
            alt="Women's Activewear"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', opacity: 0.6, transform: 'scale(1.2)' }}
          />
        </div>

        {/* Green tint overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(5,30,22,0.88) 0%, rgba(10,80,65,0.72) 50%, rgba(5,30,22,0.88) 100%)',
          zIndex: 1,
        }} />

        {/* Gradient overlays removed to fix the smoky look */}



        {/* Content */}
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '100px 48px', position: 'relative', zIndex: 10, textAlign: 'center', width: '100%' }}>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1, marginBottom: '8px', fontSize: 'clamp(30px, 5vw, 60px)', color: '#ffffff', textShadow: '0 2px 16px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.5)' }}
          >
            Women's Activewear
            <br />
            <span style={{ color: '#0A7F6E' }}>Collection</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: 'clamp(12px, 2vw, 18px)', color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '12px' }}
          >
            Performance Wear for Her
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
              <div style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderTopColor: '#0A7F6E', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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
                  onClick={() => {
                    const firstNewCard = filteredProducts[visibleCount];
                    if (firstNewCard) scrollTargetId.current = firstNewCard._id;
                    setVisibleCount((prev) => prev + 10);
                  }}
                  style={{ padding: '14px 32px', background: 'transparent', color: '#0A7F6E', border: '1px solid rgba(10,127,110,0.5)', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#0A7F6E'; e.currentTarget.style.color = '#111111'; e.currentTarget.style.borderColor = '#0A7F6E'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0A7F6E'; e.currentTarget.style.borderColor = 'rgba(10,127,110,0.5)'; }}
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

export default WomensProducts;
