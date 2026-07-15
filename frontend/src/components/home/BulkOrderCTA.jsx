import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function useVisible(threshold = 0.14) {
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

const icons = {
  arrowRight: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  mail: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
};

const styles = `
  @keyframes bo-fadeUp {
    from { opacity: 0; transform: translateY(42px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .bo-container-outer {
    max-width: 1200px;
    margin: 30px auto 25px;
    padding: 0 24px;
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
  }

  .bo-card-inner {
    position: relative;
    border-radius: 20px;
    background: linear-gradient(135deg, #0A7F6E 0%, #05453cff 50%, #053f36 100%);
    padding: 80px 40px;
    overflow: hidden;
    text-align: center;
    box-shadow: 0 16px 44px rgba(10, 127, 110, 0.25);
    opacity: 0;
  }

  .bo-card-inner.visible {
    animation: bo-fadeUp 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .bo-bg-wrap {
    position: absolute; inset: 0;
    z-index: 0;
    overflow: hidden;
  }
  .bo-bg-img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0.3;
    transform: scale(1.1);
    transition: transform 0.8s cubic-bezier(0.25, 1, 0.36, 1);
  }
  .bo-card-inner:hover .bo-bg-img {
    transform: scale(1);
  }

  .bo-green-overlay {
    position: absolute; inset: 0;
    
    z-index: 1;
  }

  .bo-heading {
    position: relative;
    z-index: 2;
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 900;
    color: #ffffff;
    line-height: 1.15;
    margin: 0 0 16px;
    font-family: 'Montserrat', sans-serif;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  }

  .bo-desc {
    position: relative;
    z-index: 2;
    font-size: clamp(14px, 1.8vw, 15.5px);
    color: rgba(255, 255, 255, 0.85);
    max-width: 580px;
    margin: 0 auto 36px;
    line-height: 1.75;
    font-weight: 400;
  }

  .bo-actions {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .bo-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    color: #0A7F6E;
    border: none;
    border-radius: 6px;
    padding: 14px 34px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
    font-family: 'Poppins', sans-serif;
    text-decoration: none;
  }
  .bo-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    background: #f8f9fa;
    color: #086658;
  }

  .bo-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    color: #ffffff;
    border: 1.5px solid rgba(255, 255, 255, 0.35);
    border-radius: 6px;
    padding: 13px 32px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;
    text-decoration: none;
  }
  .bo-btn-secondary:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: #ffffff;
    transform: translateY(-2px);
  }

  @media (max-width: 520px) {
    .bo-card-inner {
      padding: 56px 24px;
      border-radius: 16px;
    }
    .bo-actions {
      flex-direction: column;
      gap: 12px;
    }
    .bo-btn-primary, .bo-btn-secondary {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
`;

const BulkOrderCTA = () => {
  const [cardRef, cardVisible] = useVisible();

  return (
    <>
      <style>{styles}</style>

      <div className="bo-container-outer">
        <div
          ref={cardRef}
          className={`bo-card-inner${cardVisible ? ' visible' : ''}`}
        >
          <div className="bo-bg-wrap">
            <img
              className="bo-bg-img"
              src="https://images.unsplash.com/photo-1649520937981-763d6a14de7d?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Athletes Custom Sportswear Background"
            />
          </div>

          <div className="bo-green-overlay" />

          <h2 className="bo-heading">
            Start Today — Get Custom Bulk Pricing!
          </h2>

          <p className="bo-desc">
            100+ gyms and sports clubs already trust Comfy. Join them and equip your team with premium, high-performance customized sportswear.
          </p>

          <div className="bo-actions">
            <Link to="/bulk-orders" className="bo-btn-primary">
              Get Free Quote {icons.arrowRight}
            </Link>
            <Link to="/contact" className="bo-btn-secondary">
              Contact Us {icons.mail}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkOrderCTA;