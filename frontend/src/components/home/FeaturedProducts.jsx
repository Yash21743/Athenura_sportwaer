import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import amuBl from '../../assets/ath.jersey/amu_bl.jpeg';
import hills from '../../assets/ath.jersey/hills.jpeg';
import purv from '../../assets/ath.jersey/purv.jpeg';
import rcbred from '../../assets/ath.jersey/rcbred.jpeg';

const icons = {
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="1.5">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  starEmpty: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D1D6" strokeWidth="1.5">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
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
    name: 'AMU Blue Striker',
    category: 'Jerseys',
    price: 1299,
    originalPrice: 1999,
    image: amuBl,
    rating: 4.8,
    reviews: 156,
    desc: 'Premium AMU edition blue striker jersey. Breathable polyester mesh, moisture-wicking fabric crafted for high performance and style.',
  },
  {
    id: 2,
    name: 'Hills FC Classic',
    category: 'Jerseys',
    price: 1199,
    originalPrice: 1799,
    image: hills,
    rating: 4.7,
    reviews: 98,
    desc: 'Hills FC classic edition jersey. Lightweight and durable — perfect for match days and training sessions.',
  },
  {
    id: 3,
    name: 'Purvanchal Legacy',
    category: 'Jerseys',
    price: 1399,
    originalPrice: 1999,
    image: purv,
    rating: 4.6,
    reviews: 210,
    desc: 'Purvanchal legacy jersey with bold design. A tribute to the spirit of the region — wear it with pride.',
  },
  {
    id: 4,
    name: 'RCB Flame Edition',
    category: 'Jerseys',
    price: 1599,
    originalPrice: 2299,
    image: rcbred,
    rating: 4.9,
    reviews: 134,
    desc: 'RCB Flame edition — iconic red and black combination. Feel the fire every time you wear it.',
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

  .fp-section {
    background: #fafafa;
    font-family: 'Poppins', sans-serif;
    padding: 25px 0 30px;
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
    color: #0A7F6E;
  }
  .fp-heading::after {
    content: '';
    display: block;
    width: 52px;
    height: 3px;
    background: #0A7F6E;
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
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.1);
    position: relative;
    cursor: pointer;
    aspect-ratio: 3 / 4;
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
    box-shadow: 0 20px 40px -6px rgba(0, 0, 0, 0.28), 0 8px 16px -4px rgba(0, 0, 0, 0.18);
    border-color: rgba(10, 127, 110, 0.4);
  }
  .fp-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fp-card:hover .fp-card-img {
    transform: scale(1.08);
  }
  .fp-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.4) 45%, transparent 75%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 22px 18px;
    opacity: 0;
    transition: opacity 0.35s ease, transform 0.35s ease;
    z-index: 2;
    color: #fff;
  }
  .fp-card:hover .fp-card-overlay {
    opacity: 1;
  }
  .fp-overlay-title {
    font-size: 16px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 6px;
    line-height: 1.3;
    font-family: 'Montserrat', sans-serif;
  }
  .fp-overlay-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 10px;
  }
  .fp-overlay-reviews {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.75);
    margin-left: 4px;
    font-weight: 500;
  }
  .fp-overlay-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.55;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
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
    text-decoration: none;
  }
  .fp-btn-view-all:hover {
    background: #0A7F6E;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(10, 127, 110, 0.3);
  }
  .fp-btn-view-all svg {
    transition: transform 0.25s ease;
  }
  .fp-btn-view-all:hover svg {
    transform: translateX(4px);
  }
`;

const FeaturedProducts = () => {
  const [headRef, headVisible] = useVisible();
  const [gridRef, gridVisible] = useVisible(0.06);

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
              return (
                <div
                  key={prod.id}
                  className={`fp-card${gridVisible ? ' visible' : ''}`}
                  style={{ animationDelay: `${index * 0.15}s`, opacity: gridVisible ? 1 : 0 }}
                >
                  <img className="fp-card-img" src={prod.image} alt={prod.name} />

                  <div className="fp-card-overlay">
                    <h3 className="fp-overlay-title">{prod.name}</h3>
                    <div className="fp-overlay-rating">
                      {renderStars(prod.rating)}
                      <span className="fp-overlay-reviews">({prod.reviews})</span>
                    </div>
                    <p className="fp-overlay-desc">{prod.desc}</p>
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
    </>
  );
};

export default FeaturedProducts;