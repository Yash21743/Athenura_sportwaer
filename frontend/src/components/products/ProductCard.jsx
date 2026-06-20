import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');

const stockConf = {
  'In Stock':      { dot: '#4ade80', color: '#4ade80', label: 'In Stock' },
  'Limited Stock': { dot: '#fbbf24', color: '#fbbf24', label: 'Limited' },
  'Out of Stock':  { dot: '#f87171', color: '#f87171', label: 'Sold Out' },
};

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { _id, name, code, category, price, fabric, sizes, images, stockStatus } = product;
  const description = stripHtml(product.description);
  const img1 = images?.[0] || '';
  const img2 = images?.[1] || images?.[0] || '';
  const stock = stockConf[stockStatus] || { dot: '#888', color: '#888', label: stockStatus };

  /* ─── LIST ─── */
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
        className="group flex flex-col sm:flex-row"
        style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.25s, box-shadow 0.25s' }}
        onMouseEnter={(e) => { setIsHovered(true); e.currentTarget.style.borderColor = 'rgba(255,59,48,0.3)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)'; }}
        onMouseLeave={(e) => { setIsHovered(false); e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        <Link to={`/products/${_id}`} className="w-full aspect-[4/5] sm:aspect-auto sm:w-[220px] shrink-0" style={{ position: 'relative', overflow: 'hidden', background: '#111', display: 'block', minHeight: '180px' }}>
          {img1 && <img src={img1} alt={name} style={{ position: 'absolute', inset: '-1px', width: 'calc(100% + 2px)', height: 'calc(100% + 2px)', objectFit: 'cover', transition: 'all 0.5s ease', transform: isHovered ? 'scale(1.03)' : 'scale(1.01)', filter: isHovered ? 'contrast(1.1) saturate(1.2)' : 'contrast(1) saturate(1)' }} />}
          {/* Glass Shine Effect */}
          <div style={{ position: 'absolute', top: 0, width: '50%', height: '100%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)', transform: 'skewX(-25deg)', transition: isHovered ? 'left 0.6s ease-out' : 'none', left: isHovered ? '200%' : '-100%', zIndex: 5, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.4))' }} />
        </Link>
        <div className="flex-1 p-5 sm:p-5 sm:px-6 flex flex-col justify-between overflow-hidden">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span className="text-[10px] font-bold px-[10px] py-[2px] rounded-full bg-white/5 text-white/50 uppercase tracking-wide">{category}</span>
              <span className="text-[10px] font-mono text-white/30">{code}</span>
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 700, color: stock.color }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stock.dot, display: 'inline-block' }} />{stock.label}
              </span>
            </div>
            <Link to={`/products/${_id}`}>
              <h3 className="text-lg font-black text-white font-['Montserrat'] mb-[6px] truncate transition-colors duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FF3B30')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
              >{name}</h3>
            </Link>
            <p className="-webkit-box text-[12px] text-white/40 leading-relaxed mb-3 font-light overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {sizes.map((sz) => (
                <span key={sz} style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>{sz}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-[14px] border-t border-white/10">
            <span className="text-[22px] font-black text-white">₹{price}</span>
            <Link to={`/products/${_id}`}
              className="flex items-center gap-[6px] text-[12px] font-bold px-[18px] py-[8px] rounded-[10px] bg-[#FF3B30] text-white no-underline transition-colors duration-200"
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e0332a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FF3B30')}
            >
              <MessageSquare size={14} /> Inquire Now
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ─── GRID ─── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="group"
      style={{ 
        display: 'flex', flexDirection: 'column', background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', 
        transition: 'all 0.3s ease-out'
      }}
      onMouseEnter={(e) => { 
        setIsHovered(true);
        e.currentTarget.style.borderColor = '#FF3B30'; 
        e.currentTarget.style.boxShadow = '0 0 25px rgba(255,59,48,0.5), inset 0 0 15px rgba(255,59,48,0.2)'; 
        e.currentTarget.style.zIndex = 10; 
      }}
      onMouseLeave={(e) => { 
        setIsHovered(false);
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; 
        e.currentTarget.style.boxShadow = 'none'; 
        e.currentTarget.style.zIndex = 1; 
      }}
    >
      {/* Image area */}
      <Link to={`/products/${_id}`} style={{ position: 'relative', display: 'block', height: '220px', background: '#111', overflow: 'hidden', flexShrink: 0 }}>
        {img1 && (
          <img src={img1} alt={name}
            style={{ position: 'absolute', inset: '-1px', width: 'calc(100% + 2px)', height: 'calc(100% + 2px)', objectFit: 'cover', transition: 'all 0.5s ease', transform: isHovered ? 'scale(1.05)' : 'scale(1.01)', filter: isHovered ? 'contrast(1.1) saturate(1.2)' : 'contrast(1) saturate(1)' }}
          />
        )}
        {/* Glass Shine Effect */}
        <div style={{ position: 'absolute', top: 0, width: '50%', height: '100%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)', transform: 'skewX(-25deg)', transition: isHovered ? 'left 0.7s ease-out' : 'none', left: isHovered ? '200%' : '-100%', zIndex: 5, pointerEvents: 'none' }} />
        {/* Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)', pointerEvents: 'none' }} />

        {/* Category */}
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '5px', background: 'rgba(0,0,0,0.65)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.08)' }}>{category}</span>
        </div>
        {/* Stock */}
        <div style={{ position: 'absolute', top: '11px', right: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stock.dot, display: 'inline-block' }} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: stock.color }}>{stock.label}</span>
        </div>
        {/* SKU */}
        <div style={{ position: 'absolute', bottom: '10px', left: '12px' }}>
          <span style={{ fontSize: '8px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>{code}</span>
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '14px 14px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '8px' }}>
          {[...Array(5)].map((_, i) => <Star key={i} size={11} style={{ fill: i < 4 ? '#fbbf24' : '#2a2a2a', color: i < 4 ? '#fbbf24' : '#2a2a2a' }} />)}
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginLeft: '5px' }}>4.0</span>
        </div>

        {/* Name */}
        <Link to={`/products/${_id}`}>
          <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#fff', fontFamily: 'Montserrat, sans-serif', marginBottom: '5px', lineHeight: 1.2, transition: 'color 0.2s', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FF3B30')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
          >{name}</h3>
        </Link>

        {/* Description */}
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginBottom: '10px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 300 }}>{description}</p>

        {/* Sizes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
          {sizes.slice(0, 5).map((sz) => (
            <span key={sz} style={{ fontSize: '8px', fontWeight: 700, padding: '2px 7px', borderRadius: '5px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>{sz}</span>
          ))}
          {sizes.length > 5 && <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.25)' }}>+{sizes.length - 5}</span>}
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: '17px', fontWeight: 900, color: '#fff' }}>₹{price}</span>
          <Link to={`/products/${_id}`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 700, padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,59,48,0.3)', color: '#FF3B30', background: 'rgba(255,59,48,0.05)', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FF3B30'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#FF3B30'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,59,48,0.05)'; e.currentTarget.style.color = '#FF3B30'; e.currentTarget.style.borderColor = 'rgba(255,59,48,0.3)'; }}
          >
            <MessageSquare size={11} /> Inquire
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
