import { useEffect, useState } from 'react';

const styles = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideLeft {
    from { opacity: 0; transform: translateX(50px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmerRed {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.05); }
  }
  @keyframes particle {
    0%, 100% { transform: translateY(0) scale(1);       opacity: 0.45; }
    50%       { transform: translateY(-18px) scale(1.3); opacity: 0.18; }
  }
  @keyframes imgFadeIn {
    0%   { opacity: 0; transform: scale(1.04); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes rotateBorder {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  html, body {
    overflow-x: hidden;
    max-width: 100%;
  }

  .card-border-outer {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
  }
  .card-border-outer::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: conic-gradient(
      from 0deg,
      #FF3B30 0deg,
      #FF3B30 40deg,
      #1a1a1a 80deg,
      #0a0a0a 140deg,
      #FF3B30 180deg,
      #FF3B30 220deg,
      #1a1a1a 260deg,
      #0a0a0a 320deg,
      #FF3B30 360deg
    );
    animation: rotateBorder 5s linear infinite;
    z-index: 0;
  }
  .card-border-inner {
    position: relative;
    z-index: 1;
    margin: 2.5px;
    border-radius: 18px;
    overflow: hidden;
    background: #111;
  }

  .btn-shopnow {
    display: inline-flex; align-items: center; gap: 10px;
    background: #FF3B30; color: #fff; border: none; border-radius: 6px;
    padding: 14px 32px; font-size: 0.85rem; font-weight: 700;
    font-family: 'Poppins', sans-serif; letter-spacing: 2px;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 22px rgba(255,59,48,0.4);
    white-space: nowrap;
  }
  .btn-shopnow:hover {
    background: #cc2e25;
    box-shadow: 0 8px 36px rgba(255,59,48,0.6);
    transform: translateY(-2px);
  }
  .btn-explore {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.04); color: #fff;
    border: 1.5px solid rgba(255,255,255,0.25); border-radius: 6px;
    padding: 14px 32px; font-size: 0.85rem; font-weight: 700;
    font-family: 'Poppins', sans-serif; letter-spacing: 2px;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.3s ease; white-space: nowrap;
  }
  .btn-explore:hover {
    background: rgba(255,255,255,0.09);
    border-color: #fff; transform: translateY(-2px);
  }

  .badge-chip {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 6px; padding: 10px 16px;
    cursor: default; transition: all 0.25s ease;
    flex: 1;
    justify-content: center;
  }
  .badge-chip:hover {
    background: rgba(255,59,48,0.08);
    border-color: rgba(255,59,48,0.28);
  }

  .hero-section {
    overflow: hidden !important;
  }

  .hero-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 48px;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: 70px 28px;
    box-sizing: border-box;
  }

  .hero-left {
    flex: 1 1 400px;
    max-width: 560px;
    min-width: 0;
  }

  .hero-right {
    flex: 1 1 320px;
    max-width: 480px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero-title-main {
    font-size: clamp(3.2rem, 7vw, 6.5rem);
    font-weight: 900;
    color: #ffffff;
    line-height: 0.95;
    letter-spacing: -2px;
    text-transform: uppercase;
    margin: 0 0 4px;
  }

  .hero-title-sub {
    font-size: clamp(2.2rem, 5vw, 4.5rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -1px;
    text-transform: uppercase;
    white-space: nowrap;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(90deg, #FF3B30 0%, #ff6b63 45%, #FF3B30 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerRed 3.5s linear infinite;
    margin: 0 0 20px;
  }

  .divider-line {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    width: 100%;
  }

  .hero-chips {
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    margin-bottom: 20px;
    width: 100%;
  }

  .hero-desc {
    color: #888;
    font-size: 0.95rem;
    line-height: 1.85;
    max-width: 440px;
    margin-bottom: 28px;
  }

  .hero-btns {
    display: flex;
    gap: 14px;
    flex-wrap: nowrap;
    width: 100%;
  }

  .hero-img {
    width: 100%;
    height: 460px;
    object-fit: cover;
    object-position: center top;
    display: block;
    animation: imgFadeIn 1.2s ease both;
  }

  @media (max-width: 1024px) {
    .hero-container {
      padding: 60px 24px;
      gap: 36px;
      flex-direction: column;
      align-items: center;
    }
    .hero-left {
      max-width: 100%;
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .hero-right {
      max-width: 100%;
      flex: 1 1 100%;
      width: 100%;
    }
    .hero-img { height: 380px; }
    .hero-title-sub { white-space: normal; }
    .hero-chips { justify-content: center; }
    .hero-btns { justify-content: center; }
    .hero-desc { max-width: 100%; }
    .divider-line { width: 100%; }
  }

  @media (max-width: 600px) {
    .hero-container {
      padding: 48px 16px;
      gap: 24px;
    }
    .hero-title-main { font-size: 2.8rem; letter-spacing: -1px; }
    .hero-title-sub  { font-size: 2rem; white-space: normal; }
    .hero-img { height: 260px; }
    .btn-shopnow, .btn-explore {
      padding: 12px 18px;
      font-size: 0.78rem;
      letter-spacing: 1.2px;
      flex: 1;
      justify-content: center;
    }
    .badge-chip { padding: 8px 8px; gap: 6px; }
    .hero-btns { gap: 10px; }
    .hero-chips { gap: 8px; }
  }
`;

const SLIDES = [
  {
    url: 'https://i.pinimg.com/474x/72/b3/7d/72b37da1923de4411fd381e20dbcdda8.jpg',
    alt: 'Male athlete sportwear',
  },
  {
    url: 'https://i.pinimg.com/474x/bf/6a/e6/bf6ae60f703b825f7b88793b29a6bd1d.jpg',
    alt: 'Athlete running',
  },
  {
    url: 'https://i.pinimg.com/474x/56/47/85/564785c08d507a7f1b43fe26d5ab5e0b.jpg',
    alt: 'Premium gym sportwear',
  },
];

const BoltIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#FF3B30">
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6L12 2z"
      stroke="#FF3B30" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="#FF3B30" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const StarIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#FF3B30">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M14 6l6 6-6 6" stroke="#fff" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HeroSection = () => {
  const [loaded, setLoaded]   = useState(false);
  const [current, setCurrent] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
      setFadeKey(k => k + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const chips = [
    { icon: <BoltIcon />,   text1: 'High Performance', text2: 'Fabric' },
    { icon: <ShieldIcon />, text1: 'Premium',           text2: 'Quality' },
    { icon: <StarIcon />,   text1: 'Top Rated',         text2: 'Brand' },
  ];

  return (
    <>
      <style>{styles}</style>

      <section className="hero-section" style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #070707 0%, #101010 55%, #0b0b0b 100%)',
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'Poppins', sans-serif",
        overflow: 'hidden',
      }}>

        <div style={{
          position: 'absolute', top: -180, right: -80,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,59,48,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', bottom: -120, left: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,59,48,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,59,48,0.06) 1px, transparent 1px)',
          backgroundSize: '44px 44px', pointerEvents: 'none',
        }}/>

        {[
          { top: '12%', left: '5%',   delay: '0s'   },
          { top: '72%', left: '3%',   delay: '1.4s' },
          { top: '38%', left: '36%',  delay: '0.8s' },
          { top: '15%', right: '8%',  delay: '2s'   },
          { top: '80%', right: '5%',  delay: '0.5s' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: '#FF3B30',
            animation: `particle ${3 + i * 0.4}s ease-in-out infinite`,
            animationDelay: p.delay, pointerEvents: 'none', ...p,
          }}/>
        ))}

        <div className="hero-container">

          {/* ═══ LEFT ═══ */}
          <div className="hero-left" style={{
            animation: loaded ? 'fadeSlideUp 0.75s ease 0.1s both' : 'none',
          }}>

            {/* 1. COMFY */}
            <h1 className="hero-title-main">COMFY</h1>

            {/* 2. SPORT WEAR */}
            <h2 className="hero-title-sub">SPORT WEAR</h2>

            {/* 3. Wear Your Strength divider */}
            <div className="divider-line" style={{
              animation: loaded ? 'fadeSlideUp 0.6s ease 0.22s both' : 'none',
            }}>
              <div style={{ flex: 1, height: 1.5, background: 'linear-gradient(to right, transparent, #FF3B30)' }}/>
              <span style={{
                color: '#555', fontSize: 10.5, letterSpacing: 4,
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                fontFamily: "'Montserrat', sans-serif",
              }}>
                Wear Your Strength
              </span>
              <div style={{ flex: 1, height: 1.5, background: 'linear-gradient(to left, transparent, #FF3B30)' }}/>
            </div>

            {/* 4. Badges */}
            <div className="hero-chips" style={{
              animation: loaded ? 'fadeSlideUp 0.65s ease 0.3s both' : 'none',
            }}>
              {chips.map((c, i) => (
                <div key={i} className="badge-chip">
                  {c.icon}
                  <div>
                    <div style={{ color: '#ddd', fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{c.text1}</div>
                    <div style={{ color: '#666', fontSize: 11, lineHeight: 1.2 }}>{c.text2}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Description */}
            <p className="hero-desc" style={{
              animation: loaded ? 'fadeSlideUp 0.65s ease 0.38s both' : 'none',
            }}>
              Premium performance sportswear engineered for athletes who demand the best.
              From training to competition —{' '}
              <strong style={{ color: '#ddd', fontWeight: 700 }}>built to perform, designed to impress.</strong>
            </p>

            {/* 6. Buttons */}
            <div className="hero-btns" style={{
              animation: loaded ? 'fadeSlideUp 0.65s ease 0.46s both' : 'none',
            }}>
              <button className="btn-shopnow">SHOP NOW <ArrowIcon /></button>
              <button className="btn-explore">EXPLORE COLLECTIONS</button>
            </div>

          </div>

          {/* ═══ RIGHT ═══ */}
          <div className="hero-right" style={{
            animation: loaded ? 'fadeSlideLeft 0.9s ease 0.22s both' : 'none',
          }}>
            <div style={{ position: 'relative', width: '100%' }}>

              <div style={{
                position: 'absolute', top: '5%', left: '5%',
                width: '90%', height: '90%', borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(255,59,48,0.22) 0%, transparent 68%)',
                animation: 'pulseGlow 4s ease-in-out infinite',
                pointerEvents: 'none', zIndex: 0,
              }}/>

              <div className="card-border-outer" style={{ position: 'relative', zIndex: 1 }}>
                <div className="card-border-inner">
                  <img
                    key={fadeKey}
                    src={SLIDES[current].url}
                    alt={SLIDES[current].alt}
                    className="hero-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to top, rgba(7,7,7,0.8), transparent)',
          pointerEvents: 'none',
        }}/>
      </section>
    </>
  );
};

export default HeroSection;