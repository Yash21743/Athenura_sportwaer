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
    <div className="mt-16 pt-10 border-t border-zinc-800">
      <h3 className="text-xl sm:text-2xl font-black text-white font-['Montserrat'] mb-6">
        You May Also Like
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {related.map((prod) => (
          <ProductCard key={prod._id} product={prod} viewMode="grid" />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
