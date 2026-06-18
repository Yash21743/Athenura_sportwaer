import { Link } from 'react-router-dom';

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
  ));
};

const RelatedProducts = ({ products = [], currentProductId, title = 'You May Also Like' }) => {
  const related = products.filter(p => p.id !== currentProductId).slice(0, 4);

  if (related.length === 0) return null;

  // Split the title to color the last word red
  const words = title.split(' ');
  const lastWord = words.pop();
  const firstPart = words.join(' ');

  return (
    <div className="bg-[#0a0f1c] border-t border-gray-800 py-16">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="w-8 h-0.5 bg-[#FF3B30] mx-auto mb-4"></div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">
            {firstPart}{' '}<span className="text-[#FF3B30]">{lastWord}</span>
          </h2>
          <div className="w-8 h-0.5 bg-[#FF3B30] mx-auto mt-4"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {related.map(p => {
            const discount = p.oldPrice
              ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
              : 0;

            return (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group bg-[#141c30] rounded-xl overflow-hidden border border-gray-700/30 hover:border-[#FF3B30]/40 transition-all duration-300 block hover:shadow-[0_8px_30px_rgba(255,59,48,0.12)] hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                  />

                  {p.badge && (
                    <div className={`absolute top-2 left-2 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest ${
                      p.badge === 'SALE' ? 'bg-green-600' : p.badge === 'HOT' ? 'bg-orange-500' : 'bg-[#FF3B30]'
                    }`}>
                      {p.badge}
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                      -{discount}%
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute bottom-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF3B30] transition-colors shadow-md opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="p-3 pb-4">
                  <h4 className="text-[11px] font-bold uppercase text-white mb-1 truncate group-hover:text-[#FF3B30] transition-colors">
                    {p.name}
                  </h4>
                  <div className="flex text-[10px] mb-2">{renderStars(p.rating || 5)}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-[13px]">₹{p.price.toLocaleString('en-IN')}</span>
                    {p.oldPrice && (
                      <span className="text-gray-500 text-[10px] font-bold line-through">₹{p.oldPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[11px] font-black border border-gray-700 text-gray-300 px-6 py-2.5 rounded-lg uppercase tracking-widest hover:bg-[#FF3B30] hover:text-white hover:border-[#FF3B30] transition-all"
          >
            View All Products
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
