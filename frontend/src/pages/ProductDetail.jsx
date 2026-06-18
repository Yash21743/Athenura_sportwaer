import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { products } from './Products';

// --- MOCK RELATED DATA ---
const relatedProducts = [
  { id: 101, name: 'Cramploos Sweatpants', cat: 'Kicostonics', price: 2695, oldPrice: 3499, stars: 5, reviews: 244, img: 'https://images.unsplash.com/photo-1556822284-e58ebdf581f1?auto=format&fit=crop&w=400&q=80' },
  { id: 102, name: 'Water Bottle', cat: 'Accessories', price: 2650, oldPrice: 3159, stars: 5, reviews: 240, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80' },
  { id: 103, name: 'Mar-toolahate Jacket', cat: 'Jackets', price: 793, oldPrice: 3588, stars: 4, reviews: 101, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80' },
  { id: 104, name: 'Pre-Prah Running Jacket', cat: 'Jackets', price: 799, oldPrice: 2894, stars: 5, reviews: 994, img: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=400&q=80' }
];

export default function ProductDetail() {
  const { id } = useParams();
  
  // Find the product matching the URL ID, or fallback to the first product if not found
  const foundProduct = products.find(p => p.id === parseInt(id));
  const product = foundProduct || products[0];

  const [activeSize, setActiveSize] = useState('M');
  const [activeColor, setActiveColor] = useState('black');
  const [activeThumb, setActiveThumb] = useState(0);
  const [specOpen, setSpecOpen] = useState(true);

  // Reset active thumbnail and scroll to top when product changes
  useEffect(() => {
    setActiveThumb(0);
    window.scrollTo(0, 0);
  }, [product.id]);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { id: 'black', hex: '#111' },
    { id: 'grey', hex: '#6b7280' },
    { id: 'red', hex: '#991b1b' }
  ];

  const thumbnails = [
    product.image,
    "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=400&q=80",
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&q=80",
    "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400&q=80",
    "https://images.unsplash.com/photo-1556822284-e58ebdf581f1?w=400&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80"
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-['Montserrat',sans-serif] text-gray-700 relative overflow-hidden selection:bg-[#E63946] selection:text-white pb-32">

      {/* --- AMBIENT BACKGROUND GLOWS REMOVED FOR LIGHT THEME --- */}

      <div className="w-full max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16 pt-32 relative z-10">

        {/* BREADCRUMB */}
        <div className="text-[11px] text-gray-500 mb-8 flex items-center gap-2 font-medium tracking-wide">
          <span className="hover:text-gray-900 cursor-pointer transition-colors">Home</span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700 truncate font-bold">{product.name}</span>
        </div>

        {/* ════════ HERO SECTION ════════ */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-14 mb-20 items-center">

          {/* LEFT: IMAGES */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg border border-black/[0.05] shadow-[0_10px_40px_rgba(0,0,0,0.08)] aspect-[4/5] flex items-center justify-center relative overflow-hidden group">
              <img
                src={thumbnails[activeThumb]}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            {/* Thumbnails (4 in row 1, 2 in row 2) */}
            <div className="grid grid-cols-4 gap-3">
              {thumbnails.map((thumb, i) => (
                <div
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border shadow-sm ${activeThumb === i ? 'border-[#E63946] shadow-[0_4px_15px_rgba(230,57,70,0.2)] opacity-100 scale-[1.02]' : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300 hover:shadow-md'}`}
                >
                  <img src={thumb} alt={`Thumbnail ${i}`} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-4">

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase italic tracking-tight mb-4 leading-[0.95] text-gray-900 drop-shadow-sm">
              {product.name.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {i === Math.floor(product.name.split(' ').length / 2) ? (
                    <span className="text-[#E63946]">{word} </span>
                  ) : (
                    <span>{word} </span>
                  )}
                  {i === 0 || i === 2 ? <br /> : null}
                </React.Fragment>
              ))}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-[#E63946] text-sm gap-1">
                ★★★★★
              </div>
              <span className="text-[12px] text-gray-500 font-medium">{product.rating} out of 5 stars ({product.reviews} Reviews)</span>
            </div>

            {/* Price Box */}
            <div className="bg-white border border-gray-200 shadow-md rounded-md px-6 py-4 flex items-center gap-4 w-max mb-8">
              <span className="text-gray-900 text-3xl font-black tracking-tight leading-none">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-gray-400 text-xl font-bold line-through leading-none">₹{product.oldPrice.toLocaleString('en-IN')}</span>
              <span className="bg-[#E63946] text-white text-[11px] font-black uppercase px-2.5 py-1.5 rounded tracking-widest leading-none ml-2 shadow-[0_4px_10px_rgba(230,57,70,0.3)]">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-3">SELECT COLOR</h4>
              <div className="flex gap-4">
                {colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setActiveColor(color.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${activeColor === color.id ? 'border-2 border-[#E63946] p-0.5 scale-110 shadow-md' : 'border-2 border-transparent hover:border-gray-300'}`}
                  >
                    <div className="w-full h-full rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color.hex }}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3 max-w-[360px]">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">SELECT SIZE</h4>
                <button onClick={() => toast('Size Guide is currently unavailable.', { icon: '📏' })} className="text-[10px] font-bold text-[#E63946] hover:text-red-500 tracking-widest uppercase transition-colors">SIZE GUIDE</button>
              </div>
              <div className="flex gap-3 flex-wrap max-w-[360px]">
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(s)}
                    className={`flex-1 min-w-[55px] h-12 rounded-md text-[13px] font-black transition-all border shadow-sm ${activeSize === s
                        ? 'border-[#E63946] text-white bg-[#E63946] shadow-[0_4px_15px_rgba(230,57,70,0.3)]'
                        : 'border-gray-200 text-gray-600 bg-white hover:border-gray-400 hover:text-gray-900'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-8 max-w-[360px]">
              <button onClick={() => toast.success('Added to Cart!')} className="w-full bg-[#E63946] text-white font-black text-[13px] uppercase tracking-widest py-4 rounded-md flex justify-center items-center gap-3 hover:bg-[#c9323d] transition-colors shadow-[0_10px_20px_rgba(230,57,70,0.2)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                ADD TO CART
              </button>
              <button onClick={() => toast('Proceeding to Checkout...', { icon: '💳' })} className="w-full bg-gray-900 text-white font-black text-[13px] uppercase tracking-widest py-4 rounded-md flex justify-center items-center hover:bg-black transition-colors shadow-lg">
                BUY NOW
              </button>
              <div className="flex gap-4 mt-1">
                <button onClick={() => toast.success('Added to Wishlist!')} className="flex-1 bg-white border border-gray-200 py-3 rounded-md flex items-center justify-center gap-2 text-[11px] font-bold tracking-widest text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all uppercase shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  WISHLIST
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied to clipboard!'); }} className="flex-1 bg-white border border-gray-200 py-3 rounded-md flex items-center justify-center gap-2 text-[11px] font-bold tracking-widest text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all uppercase shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  SHARE
                </button>
              </div>
            </div>

            {/* Description & Features */}
            <p className="text-gray-600 text-[13px] leading-relaxed mb-6 font-medium max-w-md">
              Engineered for extreme performance and optimal comfort, this elite tactical hoodie features moisture-wicking technology and a precision-tailored fit to help you dominate any environment.
            </p>

            <ul className="space-y-3 mb-10 max-w-md">
              {[
                '4-way stretch fabric',
                'Moisture-wicking',
                'Reflective details for visibility',
                'Breathable knit panels'
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-[12px] text-gray-700 font-bold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#E63946] shadow-sm"></span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Trust Badges */}
            <div className="flex gap-10 pt-2 mt-auto">
              <div className="flex items-center gap-3">
                <div className="text-[#E63946]">
                  <svg className="w-8 h-8 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-gray-900 tracking-widest uppercase">FREE DELIVERY</span>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5">Free outstanding</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[#E63946]">
                  <svg className="w-8 h-8 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-gray-900 tracking-widest uppercase">EASY RETURNS</span>
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5">Get your products</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ════════ SPEC SHEET ACCORDION ════════ */}
        <div className="mb-24 mt-16 max-w-4xl w-full mx-auto">
          <div
            className="border-b border-gray-200 pb-4 mb-4 flex items-center justify-between cursor-pointer group"
            onClick={() => setSpecOpen(!specOpen)}
          >
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 drop-shadow-sm">
              SPEC <span className="text-[#E63946]">SHEET</span>
            </h2>
            <div className={`text-[#E63946] transition-transform duration-300 ${specOpen ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-500 ${specOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <table className="w-full text-xs text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <tbody>
                {[
                  ['Product Name', product.name],
                  ['Category', product.category || 'Performance Activewear'],
                  ['Color Options', 'Onyx Black, Tactical Grey, Crimson Red'],
                  ['Fabric Tech', 'Moisture-wicking, 4-way stretch blend'],
                  ['Visibility', 'Reflective micro-details on sleeves'],
                  ['Breathability', 'Engineered knit navix ventilation panels'],
                  ['Durability', 'Reinforced double-stitched seams']
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-5 font-black text-gray-900 w-1/3 text-[12px] tracking-wide px-6 bg-gray-50/50">{row[0]}</td>
                    <td className="py-5 font-bold text-gray-600 text-[12px] tracking-wide px-6">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ════════ CUSTOMER REVIEWS ════════ */}
        <div className="mb-24 relative z-10">

          <div className="flex items-center justify-center mb-12 relative">
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-center px-4 bg-[#FAFAFA] z-10 text-gray-900">
              CUSTOMER <span className="text-[#E63946]">REVIEWS</span>
            </h2>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[2px] bg-[#E63946] z-0 mt-6 shadow-[0_2px_10px_rgba(230,57,70,0.5)]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                name: "Marcus T.",
                text: "The absolute best quality training hoodie I've owned. The moisture-wicking technology actually works during intense HIIT sessions, and the fit is ergonomically perfect. Highly recommend.",
                img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&q=80"
              },
              {
                name: "David R.",
                text: "Unbelievable durability. I've taken this through mud runs, tactical training, and harsh weather. It still looks brand new. The reflective details are a massive plus for night runs.",
                img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80"
              },
              {
                name: "Elena S.",
                text: "Finally, a hoodie that doesn't restrict movement. The 4-way stretch fabric gives me complete freedom of motion while lifting. It looks aggressive and performs flawlessly.",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
              }
            ].map((review, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-8 shadow-md flex flex-col relative group hover:border-gray-300 hover:shadow-lg transition-all duration-300">

                {/* Decorative Quote Mark */}
                <div className="absolute top-4 right-6 text-6xl font-serif text-[#E63946] opacity-[0.1] leading-none drop-shadow-sm">"</div>

                <div className="flex text-[#F59E0B] text-[14px] mb-5 gap-0.5">
                  ★★★★★
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed font-bold mb-8 flex-grow z-10 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto pt-5 border-t border-gray-100">
                  <img src={review.img} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  <span className="text-[12px] font-black text-gray-900 tracking-wide">{review.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button onClick={() => toast('All reviews will be displayed here.', { icon: '⭐' })} className="text-[11px] font-black border border-gray-300 text-gray-700 bg-white px-8 py-4 rounded-md hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all uppercase tracking-[0.2em] shadow-sm">
              VIEW ALL REVIEWS
            </button>
          </div>
        </div>

        {/* ════════ YOU MAY ALSO LIKE ════════ */}
        <div className="mb-20 max-w-[1300px] mx-auto">
          <div className="flex items-center justify-center mb-12 relative">
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-center px-4 bg-[#FAFAFA] z-10 text-gray-900">
              YOU MAY ALSO <span className="text-[#E63946]">LIKE</span>
            </h2>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[2px] bg-[#E63946] z-0 mt-6 shadow-[0_2px_10px_rgba(230,57,70,0.5)]"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <Link to={`/products/${p.id}`} key={p.id} className="group cursor-pointer bg-white rounded-2xl overflow-hidden flex flex-col shadow-md border border-black/[0.04] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 hover:border-[#E63946]/20">
                <div className="aspect-[4/5] bg-gradient-to-b from-gray-50 to-white relative overflow-hidden flex items-center justify-center p-6">
                  {/* Faint grey heart icon top right */}
                  <button onClick={(e) => { e.preventDefault(); toast.success('Added to Wishlist!'); }} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 flex items-center justify-center text-gray-400 hover:text-[#E63946] z-20 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-1000 ease-out relative z-0 opacity-95 group-hover:opacity-100" />
                </div>
                <div className="bg-white p-6 flex-grow flex flex-col justify-between z-20">
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold tracking-[0.3em] uppercase mb-2">{p.cat}</p>
                    <h3 className="text-[14px] font-black text-gray-900 mb-3 truncate group-hover:text-[#E63946] transition-colors tracking-tight">{p.name}</h3>
                    <div className="flex items-center gap-1.5 mb-5">
                      <div className="flex text-[#E63946] text-[10px]">★</div>
                      <span className="text-[10px] text-gray-600 font-bold">{p.stars}.0 ({p.reviews})</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] text-gray-400 font-bold line-through tracking-wider leading-none">₹{p.oldPrice.toLocaleString('en-IN')}</p>
                      <p className="text-xl text-gray-900 font-black tracking-tighter leading-none">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); toast.success('Added to Cart!'); }} className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-500 hover:!bg-[#E63946] hover:!text-white hover:!border-[#E63946] shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}