import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare } from 'lucide-react';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { _id, name, code, category, price, fabric, sizes, images, stockStatus } = product;
  const primaryImage = images && images.length > 0 ? images[0] : '';

  // Helper for stock status color (Dark-theme tailored)
  const getStockBadgeClass = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'Limited Stock':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      case 'Out of Stock':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-[#111] rounded-3xl border border-zinc-800/80 p-5 flex flex-col md:flex-row gap-6 hover:shadow-lg hover:border-zinc-700/80 transition-all duration-300">
        {/* Product Image Section */}
        <div className="relative w-full md:w-56 h-48 rounded-2xl overflow-hidden bg-zinc-900 shrink-0">
          <img
            src={primaryImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 bg-zinc-950/90 backdrop-blur-xs text-xs font-semibold px-2.5 py-1 rounded-full text-white shadow-sm border border-zinc-800">
            {category}
          </span>
        </div>

        {/* Product Info Section */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border tracking-wider uppercase ${getStockBadgeClass(stockStatus)}`}>
                {stockStatus}
              </span>
              <span className="text-xs text-zinc-500 font-mono font-medium">{code}</span>
            </div>
            
            <Link to={`/products/${_id}`}>
              <h3 className="text-lg font-bold text-white group-hover:text-[#FF3B30] transition-colors font-['Montserrat'] mb-2">
                {name}
              </h3>
            </Link>
            
            <p className="text-zinc-400 text-sm line-clamp-2 mb-4 font-['Poppins'] font-light">
              {product.description}
            </p>
            
            {fabric && (
              <p className="text-xs text-zinc-400 mb-4 font-['Poppins']">
                <span className="font-semibold text-zinc-300">Fabric:</span> {fabric}
              </p>
            )}
          </div>

          {/* Sizes available */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mr-1">Sizes:</span>
            {sizes.map((sz) => (
              <span key={sz} className="text-[10px] font-bold bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800 font-['Poppins']">
                {sz}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing and CTAs */}
        <div className="w-full md:w-48 flex flex-col justify-center items-start md:items-end border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 shrink-0 font-['Poppins']">
          {/* Star ratings */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-zinc-700 fill-zinc-700'}`} />
            ))}
            <span className="text-xs text-zinc-500 font-semibold ml-1">4.2</span>
          </div>

          <div className="text-2xl font-black text-white mb-4">
            ₹{price}
          </div>

          <Link
            to={`/products/${_id}`}
            className="w-full text-center px-4 py-2.5 bg-[#FF3B30] hover:bg-[#cc2e25] text-white rounded-xl text-xs sm:text-sm font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquire Now</span>
          </Link>
        </div>
      </div>
    );
  }

  // Default: Grid view mode
  return (
    <div className="group bg-[#111] rounded-3xl border border-zinc-800/80 overflow-hidden hover:shadow-lg hover:border-zinc-700/80 transition-all duration-300 flex flex-col h-full font-['Poppins']">
      {/* Image Container */}
      <Link to={`/products/${_id}`} className="relative aspect-square w-full overflow-hidden bg-zinc-900 block">
        <img
          src={primaryImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dynamic Badge Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
          <span className="bg-zinc-950/90 backdrop-blur-xs text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm border border-zinc-800 font-['Montserrat']">
            {category}
          </span>
          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border tracking-wider uppercase shadow-xs ${getStockBadgeClass(stockStatus)}`}>
            {stockStatus}
          </span>
        </div>

        {/* Code Overlay (Top-Right) */}
        <span className="absolute top-4 right-4 text-[10px] bg-zinc-950/60 text-white/95 font-mono font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs border border-zinc-800/50">
          {code}
        </span>
      </Link>

      {/* Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between text-center">
        <div>
          {/* Rating */}
          <div className="flex justify-center items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-zinc-700 fill-zinc-700'}`} />
            ))}
            <span className="text-xs text-zinc-500 font-semibold ml-1">4.0</span>
          </div>

          {/* Title */}
          <Link to={`/products/${_id}`}>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FF3B30] transition-colors font-['Montserrat'] line-clamp-1 mb-1.5">
              {name}
            </h3>
          </Link>

          {/* Small description excerpt */}
          <p className="text-xs text-zinc-400 line-clamp-2 mb-3 font-light leading-relaxed">
            {product.description}
          </p>

          {/* Sizes available */}
          <div className="flex flex-wrap justify-center gap-1 items-center mb-4">
            {sizes.slice(0, 4).map((sz) => (
              <span key={sz} className="text-[9px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded-md">
                {sz}
              </span>
            ))}
            {sizes.length > 4 && (
              <span className="text-[9px] font-bold text-zinc-500 pl-1">+{sizes.length - 4} more</span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Column (Centered) */}
        <div className="flex flex-col items-center pt-3 border-t border-zinc-800 mt-auto w-full gap-2.5">
          <span className="text-lg font-black text-white">
            ₹{price}
          </span>
          <Link
            to={`/products/${_id}`}
            className="w-full py-2.5 bg-zinc-900 text-[#FF3B30] hover:bg-[#FF3B30] hover:text-white rounded-xl transition-all shadow-xs hover:shadow-md group/btn flex items-center justify-center gap-1.5 border border-zinc-800 text-xs font-bold"
            title="Inquire Now"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Inquire Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
