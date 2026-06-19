import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const icons = {
  star: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="1.5">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  starEmpty: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D1D1D6" strokeWidth="1.5">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  heartOutline: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  heartFilled: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF3B30" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  cart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  ),
  eye: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

const PRODUCTS_DATA = [
  {
    id: 1,
    name: 'Pro Match Football Jersey',
    category: 'Football Jersey',
    price: 1299,
    originalPrice: 1999,
    image: 'https://i.pinimg.com/474x/eb/20/0a/eb200aa2f0416231516bac2a1041726d.jpg',
    rating: 4.8,
    reviews: 156,
    badge: 'Best Seller',
    desc: 'Lightweight breathable football jersey with moisture-wicking fabric, built for speed and comfort on the pitch.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#FF3B30', '#000000', '#FFFFFF'],
  },
  {
    id: 2,
    name: 'Elite Cricket Team Jersey',
    category: 'Cricket Jersey',
    price: 1499,
    originalPrice: 2299,
    image: 'https://i.pinimg.com/474x/d0/35/bc/d035bc947f313fbd1e1ed892332cf191.jpg',
    rating: 4.7,
    reviews: 98,
    badge: 'New',
    desc: 'Premium cricket jersey with UV-protective fabric and ventilated mesh panels for all-day match comfort.',
    sizes: ['M', 'L', 'XL'],
    colors: ['#1565C0', '#FFFFFF', '#0D47A1'],
  },
  {
    id: 3,
    name: 'Classic Basketball Jersey',
    category: 'Basketball Jersey',
    price: 999,
    originalPrice: 1599,
    image: 'https://i.pinimg.com/474x/73/bc/e7/73bce79294617ee37acf213b01208a50.jpg',
    rating: 4.6,
    reviews: 210,
    badge: '30% OFF',
    desc: 'Sleeveless basketball jersey with breathable mesh fabric and reinforced stitching for high-intensity play.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#FF3B30', '#8E8E93'],
  },
  {
    id: 4,
    name: 'Premium Rugby Jersey',
    category: 'Rugby Jersey',
    price: 1799,
    originalPrice: 2599,
    image: 'https://i.pinimg.com/474x/88/e1/ad/88e1adf4790a798cae2d11774d080b62.jpg',
    rating: 4.9,
    reviews: 134,
    badge: 'Hot',
    desc: 'Heavy-duty rugby jersey built with durable rip-stop fabric to withstand intense contact and rough play.',
    sizes: ['M', 'L', 'XL'],
    colors: ['#2C2C2E', '#FFFFFF', '#FF3B30'],
  },
];

function useVisible(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const styles = `
  @keyframes fp-fadeUp {
    from { opacity: 0; transform: translateY(45px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fp-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fp-modalZoom {
    from { opacity: 0; transform: scale(0.92) translateY(24px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .fp-section {
    background: #fafafa;
    font-family: 'Poppins', sans-serif;
    padding: 76px 0 88px;
    position: relative;
    overflow: hidden;
  }
  .fp-section::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(0, 0, 0, 0.02) 1.2px, transparent 1.2px);
    background-size: 24px 24px;
    pointer-events: none;
  }
  .fp-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    position: relative;
    z-index: 1;
  }
  .fp-head-wrap {
    text-align: center;
    margin-bottom: 40px;
    opacity: 0;
  }
  .fp-head-wrap.visible {
    animation: fp-fadeUp 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .fp-heading {
    font-size: clamp(1.9rem, 3.2vw, 2.9rem);
    font-weight: 900;
    color: #111;
    letter-spacing: -0.5px;
    margin: 0 0 12px;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
  }
  .fp-heading span {
    color: #FF3B30;
  }
  .fp-heading::after {
    content: '';
    display: block;
    width: 52px;
    height: 3px;
    background: #FF3B30;
    border-radius: 2px;
    margin: 8px auto 0;
  }
  .fp-subtext {
    font-size: 14px;
    color: #777;
    max-width: 520px;
    margin: 14px auto 0;
    line-height: 1.7;
  }
  .fp-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  min-height: 280px;
}

@media (max-width: 930px) {
  .fp-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
}
@media (max-width: 480px) {
  .fp-grid { grid-template-columns: 1fr; gap: 16px; }
}
  .fp-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    position: relative;
    cursor: default;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
                box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1),
                border-color 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    opacity: 0;
  }
  .fp-card.visible {
    animation: fp-fadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .fp-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
    border-color: rgba(255, 59, 48, 0.25);
  }
  .fp-wishlist {
    position: absolute;
    top: 12px; right: 12px;
    width: 34px; height: 34px;
    border-radius: 50%;
    background: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 3;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s, background-color 0.2s, color 0.2s;
    color: #8E8E93;
  }
  .fp-wishlist:hover {
    transform: scale(1.1);
    color: #FF3B30;
  }
  .fp-wishlist.active {
    color: #FF3B30;
  }
  .fp-badge-wrap {
    position: absolute;
    top: 12px; left: 12px;
    z-index: 3;
  }
  .fp-badge {
    background: #FF3B30;
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 3px 8px;
    border-radius: 3px;
    box-shadow: 0 3px 8px rgba(255, 59, 48, 0.2);
  }
  .fp-badge.dark {
    background: #111;
    color: #fff;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  }
  .fp-card-img-box {
    position: relative;
    padding-top: 84%;
    overflow: hidden;
    background: #f8f9fa;
  }
  .fp-card-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fp-card:hover .fp-card-img {
    transform: scale(1.08);
  }
  .fp-card-actions {
    position: absolute; inset: 0;
    background: rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 2;
  }
  .fp-card:hover .fp-card-actions {
    opacity: 1;
  }
  .fp-action-btn {
    width: 42px; height: 42px;
    border-radius: 50%;
    background: #fff;
    border: none;
    color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
  }
  .fp-action-btn:hover {
    transform: translateY(-3px);
    background: #FF3B30;
    color: #fff;
  }
  .fp-card-info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .fp-card-cat {
    font-size: 10px;
    color: #8e8e93;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 4px;
  }
  .fp-card-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #1c1c1e;
    margin: 0 0 6px;
    line-height: 1.4;
    height: 38px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .fp-rating {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-bottom: 8px;
  }
  .fp-reviews-count {
    font-size: 10.5px;
    color: #8e8e93;
    margin-left: 4px;
    font-weight: 500;
  }
  .fp-card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px dashed rgba(0,0,0,0.06);
  }
  .fp-price-box {
    display: flex;
    flex-direction: column;
  }
  .fp-price-current {
    font-size: 16px;
    font-weight: 800;
    color: #111;
    font-family: 'Montserrat', sans-serif;
  }
  .fp-price-original {
    font-size: 12.5px;
    color: #aeaeae;
    text-decoration: line-through;
    font-family: 'Montserrat', sans-serif;
    margin-top: 1px;
  }
  .fp-direct-add {
    background: transparent;
    border: 1.5px solid #FF3B30;
    color: #FF3B30;
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .fp-direct-add:hover {
    background: #FF3B30;
    color: #fff;
    box-shadow: 0 4px 10px rgba(255, 59, 48, 0.2);
  }
  .fp-view-all-wrap {
    text-align: center;
    margin-top: 40px;
    opacity: 0;
  }
  .fp-view-all-wrap.visible {
    animation: fp-fadeUp 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: 0.45s;
  }
  .fp-btn-view-all {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 13px 32px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    font-family: 'Poppins', sans-serif;
  }
  .fp-btn-view-all:hover {
    background: #FF3B30;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 59, 48, 0.3);
  }
  .fp-btn-view-all svg {
    transition: transform 0.25s ease;
  }
  .fp-btn-view-all:hover svg {
    transform: translateX(4px);
  }
  .fp-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fp-fadeIn 0.25s ease forwards;
  }
  .fp-modal {
    background: #fff;
    border-radius: 20px;
    max-width: 820px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.24);
    display: flex;
    animation: fp-modalZoom 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }
  .fp-modal-close {
    position: absolute;
    top: 18px; right: 18px;
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 1);
    border: none;
    color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 5;
    transition: all 0.25s ease;
  }
  .fp-modal-close:hover {
    background: #FF3B30;
    color: #fff;
    transform: rotate(90deg);
  }
  .fp-modal-left {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #f8f9fa;
    min-height: 380px;
  }
  .fp-modal-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .fp-modal-right {
    flex: 1.1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #fff;
  }
  .fp-modal-cat {
    font-size: 11px;
    font-weight: 700;
    color: #FF3B30;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .fp-modal-title {
    font-size: 22px;
    font-weight: 800;
    color: #111;
    line-height: 1.3;
    margin: 0 0 10px;
    font-family: 'Montserrat', sans-serif;
  }
  .fp-modal-stars {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 18px;
  }
  .fp-modal-price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .fp-modal-price {
    font-size: 26px;
    font-weight: 800;
    color: #FF3B30;
    font-family: 'Montserrat', sans-serif;
  }
  .fp-modal-price-old {
    font-size: 16px;
    color: #aeaeae;
    text-decoration: line-through;
    font-family: 'Montserrat', sans-serif;
  }
  .fp-modal-desc {
    font-size: 13.5px;
    color: #666;
    line-height: 1.65;
    margin: 0 0 24px;
  }
  .fp-selector-title {
    font-size: 12px;
    font-weight: 700;
    color: #111;
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }
  .fp-sizes-wrap {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }
  .fp-size-pill {
    min-width: 40px;
    height: 38px;
    border-radius: 8px;
    border: 1.5px solid #e2e2e2;
    background: transparent;
    color: #333;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Poppins', sans-serif;
    padding: 0 10px;
  }
  .fp-size-pill:hover {
    border-color: #111;
  }
  .fp-size-pill.selected {
    border-color: #FF3B30;
    background: rgba(255, 59, 48, 0.05);
    color: #FF3B30;
    font-weight: 700;
  }
  .fp-colors-wrap {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
  }
  .fp-color-circle {
    width: 24px; height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, border-color 0.2s;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  }
  .fp-color-circle:hover {
    transform: scale(1.12);
  }
  .fp-color-circle.selected {
    border-color: #FF3B30;
  }
  .fp-color-inner {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }
  .fp-modal-actions {
    display: flex;
    gap: 14px;
    align-items: center;
    margin-top: 10px;
  }
  .fp-qty {
    display: flex;
    align-items: center;
    border: 1.5px solid #e2e2e2;
    border-radius: 8px;
    height: 46px;
    overflow: hidden;
  }
  .fp-qty-btn {
    width: 38px;
    height: 100%;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .fp-qty-btn:hover {
    background: #f0f0f0;
  }
  .fp-qty-val {
    width: 36px;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
    color: #111;
  }
  .fp-modal-buy-btn {
    flex-grow: 1;
    height: 46px;
    background: #FF3B30;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s;
    box-shadow: 0 4px 14px rgba(255, 59, 48, 0.25);
    font-family: 'Poppins', sans-serif;
  }
  .fp-modal-buy-btn:hover {
    background: #cc2e25;
    box-shadow: 0 6px 20px rgba(255, 59, 48, 0.4);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .fp-modal {
      flex-direction: column;
      max-width: 380px;
      max-height: 94vh;
    }
    .fp-modal-close {
      top: 10px; right: 10px;
      width: 30px; height: 30px;
    }
    .fp-modal-left {
      min-height: 220px;
      max-height: 220px;
    }
    .fp-modal-right {
      padding: 16px 18px;
    }
    .fp-modal-cat {
      font-size: 9px;
      margin-bottom: 4px;
    }
    .fp-modal-title {
      font-size: 16px;
      margin: 0 0 5px;
    }
    .fp-modal-stars {
      margin-bottom: 8px;
    }
    .fp-modal-price-row {
      margin-bottom: 10px;
      padding-bottom: 10px;
    }
    .fp-modal-price {
      font-size: 18px;
    }
    .fp-modal-price-old {
      font-size: 13px;
    }
    .fp-modal-desc {
      font-size: 11.5px;
      line-height: 1.5;
      margin: 0 0 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .fp-selector-title {
      font-size: 10px;
      margin-bottom: 5px;
    }
    .fp-sizes-wrap {
      gap: 6px;
      margin-bottom: 10px;
    }
    .fp-size-pill {
      height: 30px;
      min-width: 32px;
      font-size: 11px;
      padding: 0 8px;
    }
    .fp-colors-wrap {
      gap: 8px;
      margin-bottom: 12px;
    }
    .fp-color-circle {
      width: 20px; height: 20px;
    }
    .fp-color-inner {
      width: 11px; height: 11px;
    }
    .fp-modal-actions {
      gap: 8px;
      margin-top: 4px;
    }
    .fp-qty {
      height: 36px;
    }
    .fp-qty-btn {
      width: 28px;
      font-size: 14px;
    }
    .fp-qty-val {
      width: 28px;
      font-size: 12px;
    }
    .fp-modal-buy-btn {
      height: 36px;
      font-size: 10.5px;
      gap: 6px;
    }
  }

  @media (max-width: 380px) {
    .fp-modal-left {
      min-height: 170px;
      max-height: 170px;
    }
    .fp-modal-right {
      padding: 14px 16px;
    }
  }
`;

const FeaturedProducts = () => {
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [headRef, headVisible] = useVisible();
  const [gridRef, gridVisible] = useVisible(0.06);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('comfy_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load wishlist', e);
    }
  }, []);

  const toggleWishlist = (e, prod) => {
    e.stopPropagation();
    let updated;
    if (wishlist.includes(prod.id)) {
      updated = wishlist.filter(id => id !== prod.id);
      toast.error(`${prod.name} removed from Wishlist!`, {
        icon: '💔',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
    } else {
      updated = [...wishlist, prod.id];
      toast.success(`${prod.name} added to Wishlist!`, {
        icon: '❤️',
        style: { borderRadius: '10px', background: '#FF3B30', color: '#fff' },
      });
    }
    setWishlist(updated);
    localStorage.setItem('comfy_wishlist', JSON.stringify(updated));
  };

  const addToCart = (e, prod) => {
    e.stopPropagation();
    toast.success(`${prod.name} added to Cart!`, {
      icon: '🛒',
      style: { borderRadius: '10px', background: '#111', color: '#fff' },
    });
  };

  const openQuickView = (e, prod) => {
    e.stopPropagation();
    setSelectedProduct(prod);
    setSelectedSize(prod.sizes[0] || 'M');
    setSelectedColor(prod.colors[0] || '');
    setQty(1);
  };

  const closeQuickView = () => setSelectedProduct(null);

  const handleModalAdd = () => {
    toast.success(`${selectedProduct.name} (${selectedSize} / ${selectedColor ? 'Selected Color' : 'Default'}) x${qty} added to Cart!`, {
      icon: '🛒',
      style: { borderRadius: '10px', background: '#111', color: '#fff' },
    });
    closeQuickView();
  };

  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i}>{i <= floor ? icons.star : icons.starEmpty}</span>);
    }
    return stars;
  };

  return (
    <>
      <style>{styles}</style>

      <section className="fp-section">
        <div className="fp-container">
          <div ref={headRef} className={`fp-head-wrap${headVisible ? ' visible' : ''}`}>
            <h2 className="fp-heading">
              Featured <span>Products</span>
            </h2>
            <p className="fp-subtext">
              Unleash your potential with our high-performance sportswear engineered for absolute comfort, durability, and style.
            </p>
          </div>

          <div ref={gridRef} className="fp-grid">
            {PRODUCTS_DATA.map((prod, index) => {
              const isWishlisted = wishlist.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className={`fp-card${gridVisible ? ' visible' : ''}`}
                  style={{ animationDelay: `${index * 0.15}s`, opacity: gridVisible ? 1 : 0 }}
                >
                  <button
                    className={`fp-wishlist${isWishlisted ? ' active' : ''}`}
                    onClick={(e) => toggleWishlist(e, prod)}
                  >
                    {isWishlisted ? icons.heartFilled : icons.heartOutline}
                  </button>

                  {prod.badge && (
                    <div className="fp-badge-wrap">
                      <div className={`fp-badge ${prod.badge.toLowerCase() === 'best seller' ? 'dark' : ''}`}>
                        {prod.badge}
                      </div>
                    </div>
                  )}

                  <div className="fp-card-img-box">
                    <img className="fp-card-img" src={prod.image} alt={prod.name} />
                    <div className="fp-card-actions">
                      <button className="fp-action-btn" title="Quick View" onClick={(e) => openQuickView(e, prod)}>
                        {icons.eye}
                      </button>
                    </div>
                  </div>

                  <div className="fp-card-info">
                    <div className="fp-card-cat">{prod.category}</div>
                    <h3 className="fp-card-title">{prod.name}</h3>
                    <div className="fp-rating">
                      {renderStars(prod.rating)}
                      <span className="fp-reviews-count">({prod.reviews})</span>
                    </div>
                    <div className="fp-card-bottom">
                      <div className="fp-price-box">
                        <span className="fp-price-current">₹{prod.price.toLocaleString()}</span>
                        <span className="fp-price-original">₹{prod.originalPrice.toLocaleString()}</span>
                      </div>
                      <button className="fp-direct-add" title="Add to Cart" onClick={(e) => addToCart(e, prod)}>
                        {icons.cart}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`fp-view-all-wrap${gridVisible ? ' visible' : ''}`} style={{ opacity: gridVisible ? 1 : 0 }}>
            <Link to="/products" className="fp-btn-view-all">
              Explore Full Collection {icons.arrowRight}
            </Link>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="fp-modal-backdrop" onClick={closeQuickView}>
          <div className="fp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="fp-modal-close" onClick={closeQuickView}>
              {icons.close}
            </button>

            <div className="fp-modal-left">
              <img className="fp-modal-img" src={selectedProduct.image} alt={selectedProduct.name} />
            </div>

            <div className="fp-modal-right">
              <div className="fp-modal-cat">{selectedProduct.category}</div>
              <h2 className="fp-modal-title">{selectedProduct.name}</h2>

              <div className="fp-modal-stars">
                {renderStars(selectedProduct.rating)}
                <span className="fp-reviews-count">({selectedProduct.reviews} customer reviews)</span>
              </div>

              <div className="fp-modal-price-row">
                <span className="fp-modal-price">₹{selectedProduct.price.toLocaleString()}</span>
                <span className="fp-modal-price-old">₹{selectedProduct.originalPrice.toLocaleString()}</span>
              </div>

              <p className="fp-modal-desc">{selectedProduct.desc}</p>

              {selectedProduct.sizes?.length > 0 && (
                <>
                  <div className="fp-selector-title">Select Size</div>
                  <div className="fp-sizes-wrap">
                    {selectedProduct.sizes.map((s) => (
                      <button
                        key={s}
                        className={`fp-size-pill${selectedSize === s ? ' selected' : ''}`}
                        onClick={() => setSelectedSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {selectedProduct.colors?.length > 0 && (
                <>
                  <div className="fp-selector-title">Select Color</div>
                  <div className="fp-colors-wrap">
                    {selectedProduct.colors.map((c) => (
                      <div
                        key={c}
                        className={`fp-color-circle${selectedColor === c ? ' selected' : ''}`}
                        onClick={() => setSelectedColor(c)}
                      >
                        <div className="fp-color-inner" style={{ backgroundColor: c }} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="fp-modal-actions">
                <div className="fp-qty">
                  <button className="fp-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                  <div className="fp-qty-val">{qty}</div>
                  <button className="fp-qty-btn" onClick={() => setQty(qty + 1)}>+</button>
                </div>
                <button className="fp-modal-buy-btn" onClick={handleModalAdd}>
                  Add to Cart {icons.cart}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedProducts;