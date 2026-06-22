import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { ArchiveX } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
};

const ProductGrid = ({ products, viewMode = 'grid', onResetFilters }) => {
  if (!products || products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.01)', textAlign: 'center' }}
      >
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.15)' }}>
          <ArchiveX size={24} style={{ color: '#FF3B30', opacity: 0.7 }} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', fontFamily: 'Montserrat, sans-serif', marginBottom: '8px' }}>No Products Found</h3>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', maxWidth: '280px', marginBottom: '20px', fontWeight: 300, lineHeight: 1.6 }}>
          Try adjusting your filters or search term.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            style={{ padding: '9px 22px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.3)', color: '#FF3B30', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FF3B30'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,59,48,0.12)'; e.currentTarget.style.color = '#FF3B30'; }}
          >
            Clear All Filters
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      key={`${viewMode}-${products.length}`}
      style={viewMode === 'grid'
        ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }
        : { display: 'flex', flexDirection: 'column', gap: '12px' }
      }
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div
            key={product._id}
            id={`card-${product._id}`}
            variants={itemVariants}
            layout
            exit={{ opacity: 0, scale: 0.93, transition: { duration: 0.15 } }}
            style={{ height: viewMode === 'grid' ? '100%' : 'auto' }}
          >
            <ProductCard product={product} viewMode={viewMode} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductGrid;
