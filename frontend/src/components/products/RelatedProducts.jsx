import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { mockProducts } from '../../services/mockProducts';
import API from '../../services/api';

const RelatedProducts = ({ category, currentProductId }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      let allProducts = mockProducts;
      try {
        const response = await API.get('/products');
        if (response.data && response.data.length > 0) {
          allProducts = response.data.filter(p => p.isActive !== false);
        }
      } catch (err) {
        // Fallback silently
      }

      let filtered = allProducts.filter(
        (p) => p.category === category && p._id !== currentProductId
      );

      if (filtered.length < 4) {
        const extra = allProducts.filter(
          (p) => p._id !== currentProductId && p.category !== category && p.isFeatured
        );
        filtered = [...filtered, ...extra].slice(0, 4);
      } else {
        filtered = filtered.slice(0, 4);
      }

      setRelated(filtered);
    };

    if (category && currentProductId) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  if (related.length === 0) return null;

  return (
    <div className="mt-16 pt-10">
      <div className="flex flex-col items-center justify-center mb-12 sm:mb-16" style={{ marginBottom: '64px' }}>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#0A7F6E] opacity-70"></div>
          <h3 className="text-xl sm:text-3xl font-black text-[#111111] font-['Montserrat'] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-center m-0">
            You May Also <span className="text-[#0A7F6E]">Like</span>
          </h3>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#0A7F6E] opacity-70"></div>
        </div>
        <p className="mt-3 text-[10px] sm:text-xs text-[#111111]/40 uppercase tracking-widest font-medium">Explore Similar Styles</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {related.map((prod) => (
          <ProductCard key={prod._id} product={prod} viewMode="grid" />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
