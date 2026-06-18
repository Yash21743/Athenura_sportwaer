import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    <Link 
      to={`/products/${product.id}`} 
      className="group relative flex flex-col bg-white border border-black/[0.04] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:border-[#E63946]/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
    >
      
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {product.badge && (
          <span className="bg-[#E63946] text-white text-[9px] font-black px-3 py-1.5 rounded-sm tracking-[0.2em] uppercase shadow-lg shadow-[#E63946]/20">
            {product.badge}
          </span>
        )}
      </div>

      {/* Wishlist Button - Minimalist Frosted Glass */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          toast.success('Added to Wishlist!');
        }}
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-black/5 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#E63946] hover:border-[#E63946] transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
      </button>

      {/* Image Container - Ultra Clean */}
      <div className="aspect-[4/5] bg-gradient-to-b from-gray-50 to-white relative overflow-hidden flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-95 group-hover:opacity-100"
        />
        
        {/* Subtle Ambient Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500"></div>
        
        {/* Premium Quick Add Button */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%] translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-30">
          <button 
            onClick={(e) => {
              e.preventDefault();
              toast.success('Added to Cart!');
            }}
            className="w-full bg-white/80 backdrop-blur-xl border border-black/5 text-gray-900 text-[10px] font-black py-3 rounded-md hover:bg-[#E63946] hover:border-[#E63946] hover:text-white uppercase tracking-[0.3em] transition-colors shadow-xl"
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Content - Sophisticated Typography */}
      <div className="p-6 flex-grow flex flex-col justify-between z-20 bg-white">
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em]">{product.category}</p>
            <div className="flex items-center gap-1">
               <span className="text-[#E63946] text-[10px]">★</span>
               <span className="text-[10px] text-gray-600 font-bold">{product.rating}</span>
            </div>
          </div>
          <h3 className="text-[14px] font-black text-gray-900 uppercase tracking-tighter mb-4 group-hover:text-[#E63946] transition-colors leading-tight line-clamp-2">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col gap-1">
            {product.oldPrice && (
              <span className="text-gray-400 text-[10px] font-bold line-through tracking-wider">₹{product.oldPrice.toLocaleString('en-IN')}</span>
            )}
            <span className="text-gray-900 text-xl font-black tracking-tighter leading-none">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              toast.success('Added to Cart!');
            }}
            className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-500 hover:!bg-[#E63946] hover:!text-white hover:!border-[#E63946] shadow-sm"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          </button>
        </div>
      </div>
      
    </Link>
  );
};

export default ProductCard;
