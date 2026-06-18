import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { ArchiveX } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 25 } 
  }
};

const ProductGrid = ({ products, viewMode = 'grid', onResetFilters }) => {
  if (!products || products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4 bg-[#111] border border-zinc-800/80 rounded-3xl text-center"
      >
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mb-4 border border-rose-500/25">
          <ArchiveX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-['Montserrat']">No Products Found</h3>
        <p className="text-zinc-500 text-sm max-w-sm mb-6 font-['Poppins'] font-light">
          We couldn't find any products matching your active filters. Try adjusting your search term, size or price limits.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 py-2.5 bg-[#FF3B30] hover:bg-[#cc2e25] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm font-['Poppins']"
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
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-center justify-items-center'
          : 'flex flex-col gap-4'
      }
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div
            key={product._id}
            variants={itemVariants}
            layout
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-full"
          >
            <ProductCard product={product} viewMode={viewMode} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductGrid;
