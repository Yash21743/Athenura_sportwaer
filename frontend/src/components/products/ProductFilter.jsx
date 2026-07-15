import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, SlidersHorizontal, Search } from 'lucide-react';

const CATEGORIES = ['All', 'Sports T-Shirts', 'Jerseys', 'Team Uniforms', 'Sports Shorts', 'Track Pants', 'Tracksuits', 'Custom Team Kits', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const STOCK_STATUSES = ['In Stock', 'Limited Stock', 'Out of Stock'];

const DropPanel = ({ open, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.13 }}
        style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 100,
          background: '#DDDFD2', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const ProductFilter = ({
  selectedCategory, onCategoryChange,
  priceRange, maxPriceLimit = 3000, onPriceChange,
  selectedSizes, onSizesChange,
  selectedStockStatuses, onStockStatusesChange,
  onClearFilters, productCounts = {},
  searchTerm = '', onSearchChange,
}) => {
  const [openPanel, setOpenPanel] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.filter-dropdown-wrapper')) {
        setOpenPanel(null);
      }
    };
    document.addEventListener('mousedown', handler, true);
    document.addEventListener('touchstart', handler, true);
    return () => {
      document.removeEventListener('mousedown', handler, true);
      document.removeEventListener('touchstart', handler, true);
    };
  }, []);

  const togglePanel = (name) => setOpenPanel((p) => (p === name ? null : name));
  const handleSizeToggle = (sz) => onSizesChange(selectedSizes.includes(sz) ? selectedSizes.filter((s) => s !== sz) : [...selectedSizes, sz]);
  const handleStockToggle = (st) => onStockStatusesChange(selectedStockStatuses.includes(st) ? selectedStockStatuses.filter((s) => s !== st) : [...selectedStockStatuses, st]);

  const isAnyFilterActive = selectedCategory !== 'All' || priceRange < maxPriceLimit || selectedSizes.length > 0 || selectedStockStatuses.length > 0 || searchTerm.trim() !== '';

  /* shared pill style */
  const pillBase = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    height: '38px', padding: '0 16px', borderRadius: '999px',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease',
    fontFamily: 'Inter, Poppins, sans-serif',
    border: '1px solid', background: 'transparent', 
    whiteSpace: 'nowrap', flexShrink: 0,
  };
  const pillInactive = { ...pillBase, borderColor: 'rgba(10,127,110,0.25)', background: 'rgba(10,127,110,0.04)', color: '#0A7F6E' };
  const pillActive = { ...pillBase, borderColor: '#0A7F6E', background: '#0A7F6E', color: '#ffffff', fontWeight: 600 };
  const pillCategory = (active) => active
    ? { ...pillBase, borderColor: '#0A7F6E', background: '#0A7F6E', color: '#111111', fontWeight: 600 }
    : { ...pillBase, borderColor: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.65)' };

  return (
    <div ref={containerRef} style={{ marginBottom: '12px', fontFamily: 'Poppins, sans-serif' }}>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#0A7F6E', display: 'flex' }}>
          <Search size={15} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, SKU, or tags..."
          style={{
            width: '100%', height: '44px', paddingLeft: '40px', paddingRight: searchTerm ? '40px' : '16px',
            background: 'rgba(10,127,110,0.03)', border: '1px solid rgba(10,127,110,0.15)',
            borderRadius: '12px', color: '#111', fontSize: '14px', outline: 'none',
            fontFamily: 'Inter, Poppins, sans-serif', transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => { e.target.style.borderColor = '#0A7F6E'; e.target.style.background = 'rgba(10,127,110,0.06)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(10,127,110,0.15)'; e.target.style.background = 'rgba(10,127,110,0.03)'; }}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(0,0,0,0.4)', cursor: 'pointer', display: 'flex', padding: '4px' }}
          >
            <X size={14} />
          </button>
        )}
      </div>


      {/* Filter dropdowns + clear */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

        {/* Price */}
        <div className="filter-dropdown-wrapper" style={{ position: 'relative' }}>
          <button 
            onClick={() => togglePanel('price')} 
            style={priceRange < maxPriceLimit ? pillActive : pillInactive}
            onMouseEnter={(e) => { if(priceRange === maxPriceLimit) { e.currentTarget.style.borderColor = '#0A7F6E'; e.currentTarget.style.color = '#0A7F6E'; } }}
            onMouseLeave={(e) => { if(priceRange === maxPriceLimit) { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'rgba(0,0,0,0.65)'; } }}
          >
            <span>Price{priceRange < maxPriceLimit ? `: ₹${priceRange.toLocaleString()}` : ''}</span>
            <ChevronDown size={14} style={{ transform: openPanel === 'price' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>
          <DropPanel open={openPanel === 'price'}>
            <div style={{ width: '260px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Max Price</span>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#0A7F6E' }}>₹{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range" min="300" max={maxPriceLimit} step="50" value={priceRange}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#0A7F6E', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(0,0,0,0.45)', marginTop: '8px' }}>
                <span>₹300</span><span>₹{maxPriceLimit.toLocaleString()}</span>
              </div>
            </div>
          </DropPanel>
        </div>

        {/* Size */}
        <div className="filter-dropdown-wrapper" style={{ position: 'relative' }}>
          <button 
            onClick={() => togglePanel('size')} 
            style={selectedSizes.length > 0 ? pillActive : pillInactive}
            onMouseEnter={(e) => { if(selectedSizes.length === 0) { e.currentTarget.style.borderColor = '#0A7F6E'; e.currentTarget.style.color = '#0A7F6E'; } }}
            onMouseLeave={(e) => { if(selectedSizes.length === 0) { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'rgba(0,0,0,0.65)'; } }}
          >
            <span>Size{selectedSizes.length > 0 ? ` · ${selectedSizes.length}` : ''}</span>
            <ChevronDown size={14} style={{ transform: openPanel === 'size' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>
          <DropPanel open={openPanel === 'size'}>
            <div style={{ width: '220px', padding: '16px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Select Sizes</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {SIZES.map((sz) => {
                  const isSel = selectedSizes.includes(sz);
                  return (
                    <button key={sz} onClick={() => handleSizeToggle(sz)} style={{ height: '38px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s', background: isSel ? '#0A7F6E' : 'rgba(0,0,0,0.03)', borderColor: isSel ? '#0A7F6E' : 'rgba(0,0,0,0.1)', color: isSel ? '#111111' : 'rgba(0,0,0,0.6)' }}>
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          </DropPanel>
        </div>

        {/* Availability */}
        <div className="filter-dropdown-wrapper" style={{ position: 'relative' }}>
          <button 
            onClick={() => togglePanel('stock')} 
            style={selectedStockStatuses.length > 0 ? pillActive : pillInactive}
            onMouseEnter={(e) => { if(selectedStockStatuses.length === 0) { e.currentTarget.style.borderColor = '#0A7F6E'; e.currentTarget.style.color = '#0A7F6E'; } }}
            onMouseLeave={(e) => { if(selectedStockStatuses.length === 0) { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'rgba(0,0,0,0.65)'; } }}
          >
            <span>Availability{selectedStockStatuses.length > 0 ? ` · ${selectedStockStatuses.length}` : ''}</span>
            <ChevronDown size={14} style={{ transform: openPanel === 'stock' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>
          <DropPanel open={openPanel === 'stock'}>
            <div style={{ width: '200px', padding: '16px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Availability</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {STOCK_STATUSES.map((status) => {
                  const isSel = selectedStockStatuses.includes(status);
                  const dot = status === 'In Stock' ? '#22c55e' : status === 'Limited Stock' ? '#fbbf24' : '#f87171';
                  return (
                    <button key={status} onClick={() => handleStockToggle(status)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '10px', cursor: 'pointer', border: 'none', background: isSel ? 'rgba(10,127,110,0.06)' : 'transparent', color: isSel ? '#111' : 'rgba(0,0,0,0.6)', fontSize: '12px', fontWeight: 500, textAlign: 'left', transition: 'all 0.15s' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '5px', border: `1px solid ${isSel ? '#0A7F6E' : 'rgba(0,0,0,0.2)'}`, background: isSel ? '#0A7F6E' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isSel && <Check size={10} color="#fff" strokeWidth={3} />}
                      </div>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </DropPanel>
        </div>

        {/* Active size tags */}
        <AnimatePresence>
          {selectedSizes.map((sz) => (
            <motion.button key={sz} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => handleSizeToggle(sz)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', height: '28px', padding: '0 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: 'rgba(10,127,110,0.08)', border: '1px solid rgba(10,127,110,0.25)', color: '#0A7F6E', cursor: 'pointer' }}
            >
              {sz} <X size={10} />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Clear all */}
        <AnimatePresence>
          {isAnyFilterActive && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClearFilters}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '34px', padding: '0 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto', border: '1px solid rgba(10,127,110,0.25)', background: 'rgba(10,127,110,0.06)', color: '#0A7F6E', transition: 'all 0.18s' }}
            >
              <X size={12} /> Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductFilter;
