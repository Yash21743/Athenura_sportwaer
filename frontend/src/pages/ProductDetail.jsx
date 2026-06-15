import { useParams } from 'react-router-dom';
import { useState } from 'react';
import RelatedProducts from '../components/products/RelatedProducts';

const ProductDetail = () => {
  const { id } = useParams();
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', background: '#f9f9f9' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#000' }}>Product Detail</h1>
      <p style={{ color: '#888', fontSize: '1rem' }}>Product ID: {id}</p>
      <RelatedProducts />
    </div>
  );
};

export default ProductDetail;
