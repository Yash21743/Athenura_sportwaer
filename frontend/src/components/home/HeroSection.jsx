import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import amuBl from '../../assets/ath.jersey/amu_bl.jpeg';
import d2Img from '../../assets/ath.jersey/D2 2.png';
import designImg from '../../assets/ath.jersey/Design.png';

const styles = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideLeft {
    from { opacity: 0; transform: translateX(50px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmerGreen {
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
      #0A7F6E 0deg,
      #0A7F6E 40deg,
      #1a1a1a 80deg,
      #0a0a0a 140deg,
      #0A7F6E 180deg,
      #0A7F6E 220deg,
      #1a1a1a 260deg,
      #0a0a0a 320deg,
      #0A7F6E 360deg
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
    background: transparent;
  }

  .btn-shopnow {
    display: inline-flex; align-items: center; gap: 10px;
    background: #0A7F6E; color: #fff; border: 2px solid #DDDFD2; border-radius: 6px;
    padding: 14px 32px; font-size: 0.85rem; font-weight: 700;
    font-family: 'Poppins', sans-serif; letter-spacing: 2px;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 22px rgba(10,127,110,0.4);
    white-space: nowrap;
  }
  .btn-shopnow:hover {
    background: #085f52;
    box-shadow: 0 8px 36px rgba(10,127,110,0.6);
    transform: translateY(-2px);
  }
  .btn-explore {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.18); color: #fff;
    border: 1.5px solid rgba(255,255,255,0.6); border-radius: 6px;
    padding: 14px 32px; font-size: 0.85rem; font-weight: 700;
    font-family: 'Poppins', sans-serif; letter-spacing: 2px;
    text-transform: uppercase; cursor: pointer;
    transition: all 0.3s ease; white-space: nowrap;
  }
  .btn-explore:hover {
    background: rgba(255,255,255,0.30);
    border-color: #fff; transform: translateY(-2px);
  }

  .badge-chip {
    display: flex; align-items: center; gap: 10px;
    background: #DDDFD2;
    border: 1px solid rgba(10,127,110,0.25);
    border-radius: 6px; padding: 10px 16px;
    cursor: default; transition: all 0.25s ease;
    flex: 1;
    justify-content: center;
  }
  .badge-chip:hover {
    background: #cdd0c4;
    border-color: #0A7F6E;
  }
  .badge-title {
    color: #053d35;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.2;
  }
  .badge-sub {
    color: #3a5c55;
    font-size: 11px;
    line-height: 1.2;
  }

  .hero-section {
    position: relative;
    min-height: calc(100vh - 76px);
    background: linear-gradient(135deg, #0A7F6E 0%, #0A7F6E 55%, #a8c4bc 80%, #DDDFD2 100%);
    display: flex;
    align-items: center;
    font-family: 'Poppins', sans-serif;
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
    padding: 30px 28px 50px;
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
    margin-top: -20px;
  }

  .hero-title-main {
    font-size: clamp(3.2rem, 7vw, 6.5rem);
    font-weight: 900;
    color: #ffffff;
    line-height: 0.95;
    letter-spacing: -2px;
    text-transform: uppercase;
    margin: 0 0 4px;
    text-shadow: 0 3px 18px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.6);
  }

  .hero-title-sub {
    font-size: clamp(2.2rem, 5vw, 4.5rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -1px;
    text-transform: uppercase;
    white-space: nowrap;
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(90deg, #053d35 0%, #DDDFD2 40%, #053d35 70%, #DDDFD2 100%);
    background-size: 250% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerGreen 3.5s linear infinite;
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
    color: #fff;
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
    height: auto;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    object-position: center top;
    display: block;
    animation: imgFadeIn 1.2s ease both;
    background: transparent;
  }

  @media (max-width: 1024px) {
    .hero-section {
      min-height: auto;
    }
    .hero-container {
      padding: 60px 24px 45px;
      gap: 30px;
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
      max-width: 400px;
      flex: 1 1 100%;
      width: 100%;
      margin-top: 0;
    }
    .hero-img {
      height: auto;
      aspect-ratio: 3 / 4;
    }
    .hero-title-sub { white-space: normal; }
    .hero-chips { justify-content: center; }
    .hero-btns { justify-content: center; }
    .hero-desc { max-width: 100%; }
    .divider-line { width: 100%; }
  }

  @media (max-width: 600px) {
    .hero-section {
      min-height: auto;
    }
    .hero-container {
      padding: 45px 16px 35px;
      gap: 20px;
    }
    .hero-title-main { font-size: 2.8rem; letter-spacing: -1px; }
    .hero-title-sub  { font-size: 2rem; white-space: normal; }
    .hero-right {
      max-width: 300px;
    }
    .hero-img {
      height: auto;
      aspect-ratio: 3 / 4;
    }
    .btn-shopnow, .btn-explore {
      padding: 12px 14px;
      font-size: 0.75rem;
      letter-spacing: 1px;
      flex: 1;
      justify-content: center;
    }
    .badge-chip { 
      padding: 8px 10px; 
      gap: 6px;
      flex: 1;
    }
    .hero-btns { gap: 10px; }
    .hero-chips { gap: 8px; flex-wrap: nowrap; justify-content: space-between; }
  }

  @media (max-width: 380px) {
    .hero-btns {
      flex-direction: row;
      flex-wrap: nowrap;
      width: 100%;
      gap: 6px;
    }
    .btn-shopnow, .btn-explore {
      padding: 10px 4px;
      font-size: 0.65rem;
      letter-spacing: 0.5px;
      flex: 1;
      justify-content: center;
      white-space: nowrap;
    }
    .badge-chip {
      flex: 1;
      padding: 6px 4px;
      gap: 4px;
      border-radius: 4px;
    }
    .badge-title {
      font-size: 8px;
    }
    .badge-sub {
      font-size: 7px;
    }
    .hero-chips {
      flex-direction: row;
      align-items: stretch;
      gap: 4px;
      flex-wrap: nowrap;
    }
  }
`;


const SLIDES = [
  {
    url: amuBl,
    alt: 'Comfy sportwear jersey',
  },
  {
    url: d2Img,
    alt: 'Comfy D2 jersey design',
  },
  {
    url: designImg,
    alt: 'Comfy custom design jersey',
  },
];

const BoltIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#0A7F6E">
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6L12 2z"
      stroke="#0A7F6E" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="#0A7F6E" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const StarIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="#0A7F6E">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M14 6l6 6-6 6" stroke="#fff" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const navigate = useNavigate();

  const scrollToProducts = () => {
    const el = document.getElementById('featured-products');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
    { icon: <BoltIcon />, text1: 'High Performance', text2: 'Fabric' },
    { icon: <ShieldIcon />, text1: 'Premium', text2: 'Quality' },
    { icon: <StarIcon />, text1: 'Top Rated', text2: 'Brand' },
  ];

  return (
    <>
      <style>{styles}</style>

      <section className="hero-section">



        {[
          { top: '12%', left: '5%', delay: '0s' },
          { top: '72%', left: '3%', delay: '1.4s' },
          { top: '38%', left: '36%', delay: '0.8s' },
          { top: '15%', right: '8%', delay: '2s' },
          { top: '80%', right: '5%', delay: '0.5s' },
        ].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', width: 5, height: 5, borderRadius: '50%',
            background: '#0A7F6E',
            animation: `particle ${3 + i * 0.4}s ease-in-out infinite`,
            animationDelay: p.delay, pointerEvents: 'none', ...p,
          }} />
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
              <div style={{ flex: 1, height: 1.5, background: 'linear-gradient(to right, transparent, #053d35)' }} />
              <span style={{
                color: '#DDDFD2', fontSize: 10.5, letterSpacing: 4,
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                fontFamily: "'Montserrat', sans-serif",
              }}>
                Wear Your Strength
              </span>
              <div style={{ flex: 1, height: 1.5, background: 'linear-gradient(to left, transparent, #053d35)' }} />
            </div>

            {/* 4. Badges */}
            <div className="hero-chips" style={{
              animation: loaded ? 'fadeSlideUp 0.65s ease 0.3s both' : 'none',
            }}>
              {chips.map((c, i) => (
                <div key={i} className="badge-chip">
                  {c.icon}
                  <div>
                    <div className="badge-title">{c.text1}</div>
                    <div className="badge-sub">{c.text2}</div>
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
              <button className="btn-shopnow" onClick={scrollToProducts}>SHOP NOW <ArrowIcon /></button>
              <button className="btn-explore" onClick={() => navigate('/products')}>EXPLORE COLLECTIONS</button>
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
                background: 'radial-gradient(ellipse, rgba(10,127,110,0.22) 0%, transparent 68%)',
                animation: 'pulseGlow 4s ease-in-out infinite',
                pointerEvents: 'none', zIndex: 0,
              }} />

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
        }} />
      </section>
    </>
  );
};

export default HeroSection;