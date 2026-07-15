import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Sort by: Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A → Z' },
  { value: 'name-desc', label: 'Name: Z → A' },
];

const ProductSorting = ({ totalCount, sortBy, onSortChange, viewMode = 'grid', onViewModeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = SORT_OPTIONS.find((opt) => opt.value === sortBy) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      {/* Count */}
      <p style={{ fontSize: '13px', color: 'rgba(0,0,0,0.55)', fontFamily: 'Inter, Poppins, sans-serif' }}>
        <span style={{ color: '#111', fontWeight: 600, fontSize: '14px' }}>{totalCount}</span>
        {' '}Products
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Custom Premium Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'transparent', color: '#111', fontSize: '13px', fontWeight: 500,
              border: 'none', cursor: 'pointer', fontFamily: 'Inter, Poppins, sans-serif',
              padding: '6px 0',
            }}
          >
            {currentOption.label}
            <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  width: '180px',
                  zIndex: 50,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsOpen(false);
                    }}
                    style={{
                      background: sortBy === option.value ? 'rgba(255, 59, 48, 0.06)' : 'transparent',
                      color: sortBy === option.value ? '#FF3B30' : '#111',
                      border: 'none', padding: '12px 16px', textAlign: 'left',
                      fontSize: '13px', fontWeight: sortBy === option.value ? 600 : 400,
                      cursor: 'pointer', transition: 'all 0.2s',
                      fontFamily: 'Inter, Poppins, sans-serif',
                      borderLeft: sortBy === option.value ? '2px solid #FF3B30' : '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (sortBy !== option.value) {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (sortBy !== option.value) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ProductSorting;
