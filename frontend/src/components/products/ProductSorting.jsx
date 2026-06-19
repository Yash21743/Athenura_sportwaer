import React from 'react';
import { LayoutGrid, List, ArrowUpDown } from 'lucide-react';

const ProductSorting = ({ totalCount, sortBy, onSortChange, viewMode = 'grid', onViewModeChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Count */}
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, Poppins, sans-serif' }}>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{totalCount}</span>
        {' '}Products
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Sort select */}
        <div style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'transparent', padding: '6px 0', 
          }}
        >
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{ background: 'transparent', color: '#fff', fontSize: '13px', fontWeight: 500, border: 'none', outline: 'none', cursor: 'pointer', fontFamily: 'Inter, Poppins, sans-serif' }}
          >
            <option value="featured" style={{ background: '#111', color: '#fff' }}>Sort by: Featured</option>
            <option value="price-asc" style={{ background: '#111', color: '#fff' }}>Price: Low to High</option>
            <option value="price-desc" style={{ background: '#111', color: '#fff' }}>Price: High to Low</option>
            <option value="name-asc" style={{ background: '#111', color: '#fff' }}>Name: A → Z</option>
            <option value="name-desc" style={{ background: '#111', color: '#fff' }}>Name: Z → A</option>
          </select>
        </div>

        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />

        {/* View toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[{ mode: 'grid', Icon: LayoutGrid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              style={{ padding: '6px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', background: 'transparent', color: viewMode === mode ? '#fff' : 'rgba(255,255,255,0.3)', borderRadius: '6px' }}
              title={mode === 'grid' ? 'Grid View' : 'List View'}
              onMouseEnter={(e) => { if(viewMode !== mode) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
              onMouseLeave={(e) => { if(viewMode !== mode) e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSorting;
