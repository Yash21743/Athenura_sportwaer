import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Desktop background slides
import hero1 from '../../assets/images/herom.png';
import hero2 from '../../assets/images/herof.png';
import hero3 from '../../assets/images/herok.png';

// Mobile background slides
import hero1phn from '../../assets/images/hero1phn.png';
import herophn2 from '../../assets/images/herophn2.png';
import herophn3 from '../../assets/images/herophn3.png';

// Tablet background slides
import herotab1 from '../../assets/images/herotab1.png';
import herotab2 from '../../assets/images/herotab2.png';
import herotab3 from '../../assets/images/heroktab.png';

const DESKTOP_SLIDES = [{ img: hero1 }, { img: hero2 }, { img: hero3 }];
const MOBILE_SLIDES = [{ img: hero1phn }, { img: herophn2 }, { img: herophn3 }];
const TABLET_SLIDES = [{ img: herotab1 }, { img: herotab2 }, { img: herotab3 }];

/* ─────────────────────────── CSS ─────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&family=Montserrat:wght@400;700&display=swap');

  @keyframes shimmerGreen {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes contentFadeIn {
    0%   { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes sectionReveal {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes particle {
    0%, 100% { transform: translateY(0) scale(1);       opacity: 0.5; }
    50%       { transform: translateY(-18px) scale(1.3); opacity: 0.15; }
  }

  /* ── Section ── */
  .hero-section {
    position: relative;
    min-height: calc(100vh - 76px);
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    font-family: 'Poppins', sans-serif;
    background: #051410;
  }

  /* ── Background slides (both desktop & mobile) ── */
  .hero-bg-slide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top right;
    transition: opacity 1.2s ease;
    z-index: 0;
  }

  /* dark overlay – desktop: gradient from left */
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      rgba(5, 20, 18, 0.82) 0%,
      rgba(5, 20, 18, 0.60) 45%,
      rgba(5, 20, 18, 0.10) 75%,
      transparent 100%
    );
    z-index: 1;
    pointer-events: none;
  }

  /* bottom fade */
  .hero-bottom-fade {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 100px;
    background: linear-gradient(to top, rgba(5,20,18,0.75), transparent);
    pointer-events: none;
    z-index: 2;
  }

  /* ── Container ── */
  .hero-container {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: 50px 60px 60px 24px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }

  /* ── Left content ── */
  .hero-left {
    max-width: 580px;
    width: 100%;
  }

  /* titles */
  .hero-title-main {
    font-size: clamp(3.2rem, 7vw, 6.5rem);
    font-weight: 700;
    color: #ffffff;
    line-height: 0.92;
    letter-spacing: -2px;
    text-transform: uppercase;
    margin: 0 0 4px;
    text-shadow: 0 4px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9);
  }
  .hero-title-sub {
    font-size: clamp(2.2rem, 5vw, 4.5rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -1px;
    text-transform: uppercase;
    white-space: nowrap;
    font-family: 'Poppins', sans-serif;
    color: #0A7F6E;
    margin: 0 0 20px;
  }

  /* divider */
  .divider-line {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }
  .divider-line .line-left {
    width: 35px;
    height: 1.5px;
    background: linear-gradient(to right, transparent, rgba(221, 223, 210, 0.4));
  }
  .divider-line .line-right {
    flex: 1;
    height: 1.5px;
    background: linear-gradient(to left, transparent, rgba(221, 223, 210, 0.4));
  }
  @media (max-width: 1100px) {
    .divider-line {
      justify-content: center;
    }
    .divider-line .line-left,
    .divider-line .line-right {
      width: 35px;
      flex: none;
    }
  }

  /* description */
  .hero-desc {
    color: rgba(255, 255, 255, 0.88);
    font-size: 0.95rem;
    line-height: 2.1;
    max-width: 480px;
    margin-bottom: 28px;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
  }

  /* buttons */
  .hero-btns { display: flex; gap: 14px; flex-wrap: nowrap; }
  .btn-shopnow {
    display: inline-flex; align-items: center; gap: 10px;
    background: #0A7F6E; color: #fff; border: 2px solid rgba(221, 223, 210, 0.6);
    border-radius: 6px; padding: 14px 32px; font-size: 0.85rem; font-weight: 700;
    font-family: 'Poppins', sans-serif; letter-spacing: 2px;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 22px rgba(10, 127, 110, 0.5);
    white-space: nowrap;
  }
  .btn-shopnow:hover { background: #085f52; box-shadow: 0 8px 36px rgba(10, 127, 110, 0.7); transform: translateY(-2px); }
  .btn-explore {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255, 255, 255, 0.12); color: #fff;
    border: 1.5px solid rgba(255, 255, 255, 0.55); border-radius: 6px;
    padding: 14px 32px; font-size: 0.85rem; font-weight: 700;
    font-family: 'Poppins', sans-serif; letter-spacing: 2px;
    text-transform: uppercase; cursor: pointer;
    backdrop-filter: blur(6px);
    transition: all 0.3s ease; white-space: nowrap;
  }
  .btn-explore:hover { background: rgba(255, 255, 255, 0.25); border-color: #fff; transform: translateY(-2px); }

  /* slide dots */
  .hero-dots {
    position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%);
    z-index: 3; display: flex; gap: 10px; align-items: center;
  }
  .hero-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(255, 255, 255, 0.35);
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    transition: all 0.4s ease; cursor: pointer;
  }
  .hero-dot.active {
    background: #0A7F6E; border-color: #0A7F6E;
    width: 28px; border-radius: 4px;
    box-shadow: 0 0 10px rgba(10, 127, 110, 0.7);
  }

  /* ══════════════════════════════════════════
     MOBILE  320px – 520px
     Phone images = full background, text on top
  ══════════════════════════════════════════ */
  @media (max-width: 520px) {
    .hero-section {
      min-height: 100svh;
      align-items: flex-start;
    }

    /* phone images: full cover background */
    .hero-bg-slide {
      object-fit: cover;
      object-position: top center;
    }

    /* overlay — enough to keep text readable, but face stays visible */
    .hero-overlay {
      background: linear-gradient(
        180deg,
        rgba(5, 20, 18, 0.72) 0%,
        rgba(5, 20, 18, 0.30) 35%,
        rgba(5, 20, 18, 0.08) 65%,
        transparent 100%
      );
    }

    /* text pushed to top */
    .hero-container {
      padding: 44px 18px 20px 18px;
      align-items: flex-start;
      justify-content: center;
    }

    .hero-left {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .hero-title-main { font-size: 2.6rem; letter-spacing: -1px; }
    .hero-title-sub  { font-size: 1.85rem; white-space: normal; }
    .hero-desc       { font-size: 0.82rem; line-height: 1.65; margin-bottom: 18px; max-width: 100%; }
    .divider-line    { width: 100%; }
    .hero-chips      { justify-content: center; gap: 7px; margin-bottom: 14px; }
    .hero-btns       { justify-content: center; gap: 10px; }

    .badge-chip  { padding: 7px 8px; gap: 5px; }
    .badge-title { font-size: 10px; }
    .badge-sub   { font-size: 9px; }

    .btn-shopnow, .btn-explore {
      padding: 11px 14px;
      font-size: 0.72rem;
      letter-spacing: 1px;
      flex: 1;
      justify-content: center;
    }

    .hero-dots { bottom: 14px; }
  }

  /* tiny phones */
  @media (max-width: 360px) {
    .hero-container { padding: 38px 14px 16px 14px; }
    .hero-title-main { font-size: 2.2rem; }
    .hero-title-sub  { font-size: 1.6rem; }
    .btn-shopnow, .btn-explore {
      padding: 9px 8px;
      font-size: 0.63rem;
      letter-spacing: 0.4px;
    }
    .badge-chip  { padding: 6px 4px; gap: 4px; }
    .badge-title { font-size: 8px; }
    .badge-sub   { font-size: 7px; }
  }

  /* Tablet 521px – 1100px */
  @media (min-width: 521px) and (max-width: 1100px) {
    .hero-section { min-height: auto; }
    .hero-bg-slide {
      object-fit: cover;
      object-position: top right;
      top: -50px;
      height: calc(100% + 50px);
    }
    .hero-container { padding: 60px 28px 55px 24px; }
    .hero-left { max-width: 520px; }

    /* "Wear Your Strength" — left-aligned in tablet range */
    .divider-line {
      justify-content: flex-start;
    }
    .divider-line .line-left {
      width: 35px;
      flex: none;
    }
    .divider-line .line-right {
      flex: 1;
    }
  }

  /* 630px – 850px: shorten right divider line */
  @media (min-width: 630px) and (max-width: 850px) {
    .divider-line .line-right {
      flex: none;
      width: 80px;
    }
  }
`;

/* ─────────────────── Icons ─────────────────── */
const BoltIcon = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="#0A7F6E"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>);
const ShieldIcon = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6L12 2z" stroke="#0A7F6E" strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="#0A7F6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const StarIcon = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="#0A7F6E"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>);
const ArrowIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);

const PARTICLES = [
  { top: '12%', left: '5%', delay: '0s' },
  { top: '72%', left: '4%', delay: '1.4s' },
  { top: '38%', left: '32%', delay: '0.8s' },
  { top: '15%', right: '6%', delay: '2s' },
  { top: '80%', right: '5%', delay: '0.5s' },
];

/* ─────────────────── Component ─────────────────── */
const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const timerRef = useRef(null);

  const scrollToProducts = () => {
    const el = document.getElementById('featured-products');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // detect device tier
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 520);
      setIsTablet(w > 520 && w <= 1100);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // start / restart auto-slide
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % 3);
      setTextKey(k => k + 1);
    }, 4000);
  };

  // slide timer — reset when device tier changes
  useEffect(() => {
    setCurrent(0);
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [isMobile, isTablet]);

  // go to specific slide (dots / manual)
  const goTo = (index) => {
    setCurrent(index);
    setTextKey(k => k + 1);
    startTimer(); // reset timer on manual change
  };

  // swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;
    const len = SLIDES.length;
    if (diff > 0) {
      setCurrent(prev => (prev + 1) % len);
    } else {
      setCurrent(prev => (prev - 1 + len) % len);
    }
    setTextKey(k => k + 1);
    startTimer();
    touchStartX.current = null;
  };

  // pick correct slide set based on device
  const SLIDES = isMobile ? MOBILE_SLIDES : isTablet ? TABLET_SLIDES : DESKTOP_SLIDES;

  return (
    <>
      <style>{styles}</style>

      <section
        className="hero-section"
        style={{
          opacity: loaded ? 1 : 0,
          animation: loaded ? 'sectionReveal 1.1s ease both' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        {/* ── Background slides ── */}
        {SLIDES.map((slide, i) => (
          <img
            key={`${isMobile ? 'm' : 'd'}-${i}`}
            src={slide.img}
            alt={`hero-bg-${i + 1}`}
            className="hero-bg-slide"
            style={{ opacity: i === current ? 1 : 0 }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}

        {/* overlay */}
        <div className="hero-overlay" />

        {/* bottom fade */}
        <div className="hero-bottom-fade" />

        {/* particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: '#0A7F6E',
            animation: `particle ${3 + i * 0.4}s ease-in-out infinite`,
            animationDelay: p.delay, pointerEvents: 'none', zIndex: 2, ...p,
          }} />
        ))}

        {/* ── Text content ── */}
        <div className="hero-container">
          <div
            className="hero-left"
            style={{ animation: loaded ? 'contentFadeIn 0.85s ease both' : 'none' }}
          >

            {/* COMFY */}
            <h1 className="hero-title-main">COMFY</h1>

            {/* SPORT WEAR */}
            <h2 className="hero-title-sub">SPORT WEAR</h2>

            {/* Divider */}
            <div className="divider-line">
              <div className="line-left" />
              <span style={{
                color: '#DDDFD2', fontSize: 10.5, letterSpacing: 4,
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                fontFamily: "'Montserrat', sans-serif",
              }}>
                Wear Your Strength
              </span>
              <div className="line-right" />
            </div>

            {/* Description */}
            <p className="hero-desc">
              Premium performance sportswear engineered for athletes who demand the best.
              From training to competition —{' '}
              <strong style={{ color: '#ddd', fontWeight: 700 }}>built to perform, designed to impress.</strong>
              {' '}Elevate your style and workout sessions with designs that inspire confidence and power.
            </p>

            {/* Buttons */}
            <div className="hero-btns">
              <button className="btn-shopnow" onClick={scrollToProducts}>
                SHOP NOW <ArrowIcon />
              </button>
              <button className="btn-explore" onClick={() => navigate('/products')}>
                EXPLORE COLLECTIONS
              </button>
            </div>

          </div>
        </div>

        {/* ── Slide dots ── */}
        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`hero-dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

      </section>
    </>
  );
};

export default HeroSection;