import SearchBar from '../components/products/SearchBar';
import ProductFilter from '../components/products/ProductFilter';
import ProductSorting from '../components/products/ProductSorting';
import ProductGrid from '../components/products/ProductGrid';

const Products = () => {
  return (
    <>
      <SearchBar />
      <ProductFilter />
      <ProductSorting />
      <ProductGrid />
    </>
  );
};

export default Products;
