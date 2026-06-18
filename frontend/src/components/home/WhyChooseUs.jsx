import { useEffect, useRef, useState } from 'react';

/* ── Counter animation ── */
function useCounter(target, active, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

/* ── Intersection Observer hook ── */
function useVisible(threshold = 0.14) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Styles ── */
const styles = `
  @keyframes wcu-fadeUp {
    from { opacity: 0; transform: translateY(42px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wcu-fadeLeft {
    from { opacity: 0; transform: translateX(-42px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes wcu-fadeRight {
    from { opacity: 0; transform: translateX(42px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes wcu-headIn {
    from { opacity: 0; transform: translateY(-24px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes wcu-iconPulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.15); }
  }
  @keyframes wcu-lineDraw {
    from { width: 0; }
    to   { width: 56px; }
  }

  .wcu-section {
    background: linear-gradient(145deg, #080808 0%, #0f0f0f 50%, #0a0a0a 100%);
    font-family: 'Poppins', sans-serif;
    padding: 72px 0 0;
    margin-top: 48px;
    overflow: hidden;
    position: relative;
  }

  /* BG pattern */
  .wcu-section::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(255,59,48,0.05) 1px, transparent 1px);
    background-size: 42px 42px;
    pointer-events: none;
  }

  /* ── Heading ── */
  .wcu-head-wrap {
    text-align: center;
    padding: 0 20px 52px;
    position: relative; z-index: 1;
  }
  .wcu-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    margin-bottom: 14px;
    font-size: 11px; font-weight: 700;
    color: #FF3B30; letter-spacing: 3.5px;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
  }
  .wcu-eyebrow::before,
  .wcu-eyebrow::after {
    content: ''; display: block;
    width: 32px; height: 1.5px;
    background: #FF3B30; border-radius: 1px;
  }
  .wcu-heading {
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 900;
    color: #fff; letter-spacing: -1px;
    margin: 0 0 14px;
    font-family: 'Montserrat', sans-serif;
  }
  .wcu-heading span { color: #FF3B30; }

  .wcu-heading-line {
    width: 56px;
    height: 3px;
    background: #FF3B30;
    border-radius: 2px;
    margin: 0 auto 22px;
  }
  .wcu-an-line { animation: wcu-lineDraw 0.6s ease 0.3s both; }

  .wcu-subtext {
    font-size: 15px; color: #666;
    max-width: 480px; margin: 0 auto;
    line-height: 1.75;
  }

  /* ── Cards grid ── */
  .wcu-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 24px 64px;
    position: relative; z-index: 1;
  }

  .wcu-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 34px 28px;
    transition: transform 0.35s ease, background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
    cursor: default;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .wcu-card::before {
    content: '';
    position: absolute; bottom: 0; left: 0;
    height: 3px; width: 0;
    background: linear-gradient(to right, #FF3B30, #ff6b63);
    border-radius: 0 0 0 16px;
    transition: width 0.4s ease;
  }
  .wcu-card:hover {
    transform: translateY(-6px);
   
    border-color: rgba(255,59,48,0.25);
    box-shadow: 0 16px 48px rgba(255,59,48,0.12);
  }
  .wcu-card:hover::before { width: 100%; }
  .wcu-card:hover .wcu-icon-box { border-color: rgba(255,59,48,0.5); }
  .wcu-card:hover .wcu-icon-box svg { animation: wcu-iconPulse 0.6s ease; }

  .wcu-icon-box {
    width: 58px; height: 58px; border-radius: 14px;
   
    border: 1.5px solid rgba(254, 254, 254, 1);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
    transition: background 0.3s, border-color 0.3s;
  }

  .wcu-card-title {
    font-size: 16px; font-weight: 700;
    color: #fff; margin-bottom: 10px;
    font-family: 'Montserrat', sans-serif;
  }
  .wcu-card-desc {
    font-size: 13px; color: #666;
    line-height: 1.75;
  }

  /* ── Stats bar ── */
  .wcu-stats {
    background: #FF3B30;
    padding: 36px 24px;
    position: relative; z-index: 1;
  }
  .wcu-stats-inner {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    max-width: 1000px;
    margin: 0 auto;
  }
  .wcu-stat-item {
    text-align: center;
    padding: 10px 20px;
    border-right: 1px solid rgba(255,255,255,0.25);
    border-bottom: none;
  }
  .wcu-stat-item:nth-child(4) {
    border-right: none;
  }
  .wcu-stat-num {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900; color: #fff;
    font-family: 'Montserrat', sans-serif;
    line-height: 1;
    font-style: italic;
  }
  .wcu-stat-label {
    font-size: 12px; color: rgba(255,255,255,0.8);
    font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; margin-top: 6px;
  }

  /* ── Animation classes ── */
  .wcu-an-up    { animation: wcu-fadeUp    0.7s ease both; }
  .wcu-an-left  { animation: wcu-fadeLeft  0.7s ease both; }
  .wcu-an-right { animation: wcu-fadeRight 0.7s ease both; }
  .wcu-an-head  { animation: wcu-headIn   0.55s ease both; }

  /* ── Responsive: Cards (unchanged) ── */
  @media (max-width: 860px) {
    .wcu-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 0 16px 48px; }
  }
  @media (max-width: 520px) {
    .wcu-grid { grid-template-columns: 1fr; gap: 12px; padding: 0 12px 40px; }
    .wcu-section { padding: 52px 0 0; }
  }

  /* ── Responsive: Stats bar (2x2 between 344px–760px) ── */
  @media (max-width: 760px) {
    .wcu-stats-inner {
      grid-template-columns: repeat(2, 1fr);
    }
    .wcu-stat-item {
      border-bottom: 1px solid rgba(255,255,255,0.25);
    }
    .wcu-stat-item:nth-child(2n) {
      border-right: none;
    }
    .wcu-stat-item:nth-child(3),
    .wcu-stat-item:nth-child(4) {
      border-bottom: none;
    }
  }
`;

/* ── SVG Icons ── */
const icons = {
  quality: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="#FF3B30" strokeWidth="1.7" strokeLinejoin="round"/>
    </svg>
  ),
  delivery: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="1" y="3" width="13" height="13" rx="1.5" stroke="#FF3B30" strokeWidth="1.7"/>
      <path d="M14 8h4.5L22 12v4h-8V8z" stroke="#FF3B30" strokeWidth="1.7" strokeLinejoin="round"/>
      <circle cx="5.5" cy="18.5" r="2" stroke="#FF3B30" strokeWidth="1.7"/>
      <circle cx="18" cy="18.5" r="2" stroke="#FF3B30" strokeWidth="1.7"/>
    </svg>
  ),
  design: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" stroke="#FF3B30" strokeWidth="1.7"/>
      <path d="M8 12l3 3 5-5" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  performance: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="#FF3B30" strokeWidth="1.7" strokeLinejoin="round"/>
    </svg>
  ),
  returns: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 109-9H3m0 0l3-3M3 3l3 3" stroke="#FF3B30" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  support: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="#FF3B30" strokeWidth="1.7"/>
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="#FF3B30" strokeWidth="1.7"/>
      <path d="M12 9V7M12 17v-2" stroke="#FF3B30" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M9 12H7M17 12h-2" stroke="#FF3B30" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
  ),
};

const FEATURES = [
  {
    icon: icons.quality,
    title: 'Premium Quality Fabric',
    desc: 'Only the finest performance-grade materials — moisture-wicking, breathable, and built to endure the toughest training sessions.',
    anim: 'wcu-an-left',
    delay: '0s',
  },
  {
    icon: icons.delivery,
    title: 'Fast & Free Delivery',
    desc: 'Order today, receive in 2–4 business days. Free shipping on all orders above ₹999, anywhere across India.',
    anim: 'wcu-an-up',
    delay: '0.08s',
  },
  {
    icon: icons.design,
    title: 'Expert Sport Design',
    desc: 'Crafted by professional athletes and designers who understand the demands of high-performance sport.',
    anim: 'wcu-an-right',
    delay: '0.16s',
  },
  {
    icon: icons.performance,
    title: 'Performance Tested',
    desc: 'Every product is rigorously tested in real conditions — from gym floors to outdoor tracks — before it reaches you.',
    anim: 'wcu-an-left',
    delay: '0.22s',
  },
  {
    icon: icons.returns,
    title: 'Hassle-Free Returns',
    desc: '20-day easy return policy. Not satisfied? We make it right — no questions asked, no complicated process.',
    anim: 'wcu-an-up',
    delay: '0.3s',
  },
  {
    icon: icons.support,
    title: '24/7 Customer Support',
    desc: 'Our dedicated support team is always here for you — chat, call, or email — any time of the day or night.',
    anim: 'wcu-an-right',
    delay: '0.38s',
  },
];

const STATS = [
  { value: 10000, suffix: '+', label: 'Happy Customers' },
  { value: 500,   suffix: '+', label: 'Products Available' },
  { value: 98,    suffix: '%', label: 'Satisfaction Rate' },
  { value: 50,    suffix: '+', label: 'Cities Served' },
];

/* ── Stat Item (with counter) ── */
const StatItem = ({ value, suffix, label, active, delay }) => {
  const count = useCounter(value, active, 2000);
  return (
    <div className="wcu-stat-item" style={{ animationDelay: delay }}>
      <div className="wcu-stat-num">{count.toLocaleString()}{suffix}</div>
      <div className="wcu-stat-label">{label}</div>
    </div>
  );
};

/* ══════════════════════════════════════ */
const WhyChooseUs = () => {
  const [headRef,  headV]  = useVisible();
  const [gridRef,  gridV]  = useVisible(0.08);
  const [statsRef, statsV] = useVisible();

  return (
    <>
      <style>{styles}</style>

      <section className="wcu-section">

        {/* ── Heading ── */}
        <div
          ref={headRef}
          className={`wcu-head-wrap${headV ? ' wcu-an-head' : ''}`}
          style={{ opacity: headV ? 1 : 0 }}
        >
          <h2 className="wcu-heading">
            WHY <span>CHOOSE US</span>
          </h2>
          <div className={`wcu-heading-line${headV ? ' wcu-an-line' : ''}`} />
          <p className="wcu-subtext">
            At Comfy Sport Wear, we don't just sell sportswear — we deliver
            <strong style={{ color: '#fff' }}> confidence, comfort, and performance</strong> with every product.
          </p>
        </div>

        {/* ── Feature Cards ── */}
        <div ref={gridRef} className="wcu-grid">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className={`wcu-card${gridV ? ` ${f.anim}` : ''}`}
              style={{ opacity: gridV ? 1 : 0, animationDelay: f.delay }}
            >
              <div className="wcu-icon-box">{f.icon}</div>
              <div className="wcu-card-title">{f.title}</div>
              <p className="wcu-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Stats Bar ── */}
        <div
          ref={statsRef}
          className={`wcu-stats${statsV ? ' wcu-an-up' : ''}`}
          style={{ opacity: statsV ? 1 : 0 }}
        >
          <div className="wcu-stats-inner">
            {STATS.map((s, i) => (
              <StatItem
                key={i}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                active={statsV}
                delay={`${i * 0.1}s`}
              />
            ))}
          </div>
        </div>

      </section>
    </>
  );
};

export default WhyChooseUs;