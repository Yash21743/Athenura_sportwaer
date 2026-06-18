import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4 opacity-30">🔍</div>
        <h3 className="text-lg font-black text-white mb-2">No products found</h3>
        <p className="text-sm text-gray-500 mb-4">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
