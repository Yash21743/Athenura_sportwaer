import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

function useVisible(threshold = 0.12) {
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

function ScrambleText({ target, active, delay = 0 }) {
  const [text, setText] = useState(target);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let timeout;
    const totalFrames = 18;
    const run = () => {
      frame++;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * target.length);
      const scrambled = target.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < revealed) return ch;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      setText(scrambled);
      if (frame < totalFrames) timeout = setTimeout(run, 42);
      else setText(target);
    };
    const t = setTimeout(run, delay);
    return () => { clearTimeout(t); clearTimeout(timeout); };
  }, [active, target, delay]);
  return <>{text}</>;
}

const styles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(38px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(-38px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeLeft {
    from { opacity: 0; transform: translateX(38px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes headingIn {
    from { opacity: 0; transform: translateY(-20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .an-up    { animation: fadeUp    0.65s ease both; }
  .an-right { animation: fadeRight 0.65s ease both; }
  .an-left  { animation: fadeLeft  0.65s ease both; }
  .an-head  { animation: headingIn 0.5s ease both; }

  .fc-section {
    background: #fff;
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
    padding-bottom: 28px;
  }

  .fc-heading-wrap {
    text-align: center;
    padding: 44px 16px 28px;
    width: 100%;
    box-sizing: border-box;
  }
  .fc-heading {
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    font-weight: 900;
    color: #111;
    display: block;
    width: 100%;
    text-align: center;
    position: relative;
    letter-spacing: -0.5px;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
  }
  .fc-heading span { color: #0A7F6E; }
  .fc-heading::after {
    content: '';
    display: block;
    width: 52px; height: 3px;
    background: #0A7F6E;
    border-radius: 2px;
    margin: 8px auto 0;
  }
  .fc-subtext {
    font-size: 14px;
    color: #444;
    max-width: 480px;
    margin: 14px auto 0;
    line-height: 1.75;
    text-align: center;
  }
  .fc-subtext strong { color: #111; }

  /* ── DESKTOP GRID ── */
  .fc-main {
    display: flex;
    gap: 12px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    align-items: stretch;
  }
  .fc-left { flex: 0 0 44%; }
  .fc-card-big {
    height: 100%;
    min-height: 420px;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }
  .fc-card-big:hover { transform: translateY(-5px); }
  .fc-card-big:hover .card-img { transform: scale(1.06); }

  .fc-right { flex: 1 1 0; display: flex; flex-direction: column; gap: 12px; }
  .fc-right-top { display: flex; gap: 12px; flex: 1; }

  .fc-card-sm {
    flex: 1;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }
  .fc-card-sm:hover { transform: translateY(-5px); }
  .fc-card-sm:hover .card-img { transform: scale(1.07); }

  .fc-card-wide {
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }
  .fc-card-wide:hover { transform: translateY(-5px); }
  .fc-card-wide:hover .card-img { transform: scale(1.06); }

  .card-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; object-position: center;
    transition: transform 0.55s ease;
  }
  .card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(4,46,40,0.92) 0%, rgba(4,46,40,0.45) 55%, rgba(4,46,40,0.08) 100%);
    z-index: 1;
  }
  .card-overlay-h {
    position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(4,46,40,0.9) 0%, rgba(4,46,40,0.45) 55%, transparent 100%);
    z-index: 1;
  }
  .card-body { position: relative; z-index: 2; padding: 20px 22px; }

  .off-badge {
    position: absolute; top: 13px; left: 13px;
    background: #0A7F6E; color: #fff;
    font-size: 10.5px; font-weight: 700;
    padding: 4px 10px; border-radius: 5px;
    letter-spacing: 0.5px; z-index: 3;
  }

  .card-label { font-size: 10px; color: #0A7F6E; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 5px; }
  .card-title {
    font-size: clamp(1.1rem, 2vw, 1.55rem);
    font-weight: 900;
    color: #fff; line-height: 1.1;
    font-family: 'Montserrat', sans-serif;
    margin: 0 0 4px;
  }
  .card-title span { color: #0A7F6E; }
  .card-off { font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 2px; }

  .shop-btn-red {
    display: inline-flex; align-items: center; gap: 6px;
    background: #0A7F6E; color: #fff; border: none; border-radius: 7px;
    padding: 9px 20px; font-size: 12.5px; font-weight: 700;
    font-family: 'Poppins', sans-serif; cursor: pointer; margin-top: 12px;
    transition: background 0.25s, transform 0.2s;
    letter-spacing: 0.3px;
  }
  .shop-btn-red:hover { background: #085f52; transform: translateY(-1px); }

  .shop-link {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 12px; font-weight: 700; color: #fff;
    background: none; border: none; border-bottom: 1.5px solid rgba(255,255,255,0.45);
    padding: 0 0 2px; cursor: pointer; font-family: 'Poppins', sans-serif;
    margin-top: 6px; transition: color 0.2s, border-color 0.2s;
  }
  .shop-link:hover { color: #0A7F6E; border-color: #0A7F6E; }

  /* ── TRUST BAR ── */
  .trust-bar {
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    padding: 20px 20px 0;
  }
  .trust-item {
    flex: 1 1 0;
    min-width: 0;
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    background: #08201dff;
    border-radius: 12px;
    border-bottom: 5px solid #21897bff;
    box-shadow: 0 4px 18px rgba(0,0,0,0.18);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: default;
  }
  .trust-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(18, 203, 175, 0.18);
  }
  .trust-item:hover .trust-icon-box svg {
    transform: rotate(15deg);
  }
  .trust-icon-box {
    width: 42px; height: 42px; border-radius: 9px;
    border: 1.5px solid rgba(255,255,255,0.9);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .trust-icon-box svg { transition: transform 0.3s ease; }
  .trust-title { font-size: 11px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.8px; min-height: 16px; }
  .trust-sub   { font-size: 10px; color: #888; margin-top: 2px; }

  /* ── TABLET 921px–1024px: trust bar 1 line, grid 2-col ── */
  @media (max-width: 1024px) {
    .trust-bar { gap: 10px; padding: 16px 14px 0; }
    .trust-item { padding: 12px 10px; gap: 10px; }
    .trust-icon-box { width: 36px; height: 36px; }
    .trust-title { font-size: 10px; }
    .trust-sub { font-size: 9px; }
  }

  /* ── TABLET 400px–920px: trust 2x2, cards stacked ── */
  @media (max-width: 920px) {
    .trust-bar {
      flex-wrap: wrap;
      gap: 10px;
      padding: 16px 14px 0;
    }
    .trust-item {
      flex: 1 1 calc(50% - 5px);
      padding: 13px 14px;
      gap: 12px;
    }
    .trust-icon-box { width: 38px; height: 38px; }
    .trust-title { font-size: 11px; }
    .trust-sub { font-size: 10px; }

    .fc-main {
      flex-direction: column;
      padding: 0 14px;
      gap: 12px;
    }
    .fc-left { flex: none; width: 100%; }
    .fc-card-big {
      width: 100%;
      min-height: 320px;
      height: 320px;
    }
    .fc-right {
      width: 100%;
      flex-direction: column;
      gap: 12px;
    }
    .fc-right-top {
      flex-direction: row;
      gap: 12px;
      width: 100%;
    }
    .fc-card-sm {
      flex: 1;
      min-height: 220px;
      height: 220px;
    }
    .fc-card-wide {
      width: 100%;
      min-height: 220px;
      height: 220px;
    }
  }

  /* ── MOBILE up to 400px: everything single column ── */
  @media (max-width: 400px) {
    .trust-bar {
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px 10px 0;
    }
    .trust-item {
      flex: 1 1 calc(50% - 4px);
      padding: 10px 10px;
      gap: 8px;
    }
    .trust-icon-box { width: 32px; height: 32px; }
    .trust-title { font-size: 9px; }
    .trust-sub { font-size: 8px; }

    .fc-main {
      flex-direction: column;
      padding: 0 10px;
      gap: 10px;
    }
    .fc-card-big { min-height: 260px; height: 260px; }
    .fc-right-top { flex-direction: column; gap: 10px; }
    .fc-card-sm { min-height: 200px; height: 200px; flex: none; width: 100%; }
    .fc-card-wide { min-height: 200px; height: 200px; }

    .fc-heading { font-size: 1.4rem; letter-spacing: 0; }
  }

  /* ── TINY screens 320–360px ── */
  @media (max-width: 360px) {
    .fc-heading {
      font-size: 1.25rem;
      letter-spacing: 0;
      word-break: break-word;
    }
    .fc-heading-wrap { padding: 32px 12px 20px; }
    .fc-subtext { font-size: 12px; }
    .trust-item { flex: 1 1 calc(50% - 4px); padding: 9px 8px; gap: 7px; }
    .trust-icon-box { width: 28px; height: 28px; }
    .trust-title { font-size: 8.5px; }
    .trust-sub { font-size: 7.5px; }
  }
`;

const TruckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="1" y="3" width="13" height="13" rx="1" stroke="#22d3bb" strokeWidth="1.6" />
    <path d="M14 8h4.2L21 11.5V16h-7V8z" stroke="#22d3bb" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="5.5" cy="18.5" r="2" stroke="#22d3bb" strokeWidth="1.6" />
    <circle cx="17.5" cy="18.5" r="2" stroke="#22d3bb" strokeWidth="1.6" />
  </svg>
);
const LockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="#22d3bb" strokeWidth="1.6" />
    <path d="M7 11V7a5 5 0 0110 0v4" stroke="#22d3bb" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.5" fill="#22d3bb" />
  </svg>
);
const MoneyIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#22d3bb" strokeWidth="1.6" />
    <path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3H11a1.5 1.5 0 000 3H15" stroke="#22d3bb" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const ChatIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#22d3bb" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const ArrowSm = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M14 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TRUST = [
  { icon: <TruckIcon />, title: 'Free Shipping', sub: 'On All Orders Over ₹999' },
  { icon: <LockIcon />, title: 'Secure Payment', sub: 'We secure your payment' },
  { icon: <MoneyIcon />, title: '100% Money Back', sub: '20 Days Return Policy' },
  { icon: <ChatIcon />, title: 'Online Support', sub: '24/7 Dedicated Support' },
];

const IMG = {
  tracksuit: 'https://i.pinimg.com/1200x/dc/9d/43/dc9d43a46234fe8f2f8ab86588563c21.jpg',
  jersey: 'https://i.pinimg.com/1200x/a4/36/73/a4367362e16b0936343c0b7628674b43.jpg',
  shorts: 'https://i.pinimg.com/736x/69/37/9a/69379abcc3b27d9428ef6fbdcbb0ff77.jpg',
  gymBag: 'https://i.pinimg.com/736x/b3/2a/d6/b32ad682c86512bdd77f9159a9dcc291.jpg',
};

const FeaturedCategories = () => {
  const [titleRef, titleV] = useVisible();
  const [bigRef, bigV] = useVisible();
  const [sm1Ref, sm1V] = useVisible();
  const [sm2Ref, sm2V] = useVisible();
  const [wideRef, wideV] = useVisible();
  const [trustRef, trustV] = useVisible();

  return (
    <>
      <style>{styles}</style>
      <section className="fc-section">

        <div
          ref={trustRef}
          className={`trust-bar${trustV ? ' an-up' : ''}`}
          style={{ opacity: trustV ? 1 : 0 }}
        >
          {TRUST.map((t, i) => (
            <div key={i} className="trust-item" style={{ animationDelay: `${i * 0.09}s` }}>
              <div className="trust-icon-box">{t.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div className="trust-title">
                  <ScrambleText target={t.title} active={trustV} delay={i * 120} />
                </div>
                <div className="trust-sub">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          ref={titleRef}
          className={`fc-heading-wrap${titleV ? ' an-head' : ''}`}
          style={{ opacity: titleV ? 1 : 0 }}
        >
          <h2 className="fc-heading">
            <span style={{ color: '#111' }}>FEATURED&nbsp;</span>
            <span>CATEGORIES</span>
          </h2>
          <p className="fc-subtext">
            Explore sportwear collections — crafted for athletes who train hard,
            compete harder, and <strong>never compromise on style or performance.</strong>
          </p>
        </div>

        <div className="fc-main">

          <div className="fc-left">
            <div
              ref={bigRef}
              className={`fc-card-big${bigV ? ' an-right' : ''}`}
              style={{ opacity: bigV ? 1 : 0, animationDelay: '0.1s' }}
            >
              <img className="card-img" src={IMG.tracksuit} alt="Women's Tracksuit" style={{ objectPosition: 'center top' }} />
              <div className="card-overlay" />
              <div className="card-body">
                <div className="card-label">New Arrivals</div>
                <h3 className="card-title">COMFY<br /><span>JERSEY</span></h3>
                <p className="card-off">Up to <strong style={{ color: '#0A7F6E' }}>70% Off</strong></p>
                <Link to="/products" className="shop-btn-red">Shop Now <ArrowSm /></Link>
              </div>
            </div>
          </div>

          <div className="fc-right">

            <div className="fc-right-top">
              <div
                ref={sm1Ref}
                className={`fc-card-sm${sm1V ? ' an-up' : ''}`}
                style={{ opacity: sm1V ? 1 : 0, animationDelay: '0.18s' }}
              >
                <div className="off-badge">20% OFF</div>
                <img className="card-img" src={IMG.jersey} alt="Men's Jersey" style={{ objectPosition: 'center top' }} />
                <div className="card-overlay" />
                <div className="card-body">
                  <h3 className="card-title" style={{ fontSize: '1rem' }}>WOMEN<br /><span>JERSEY</span></h3>
                  <Link to="/women" className="shop-link">Shop Now <ArrowSm /></Link>
                </div>
              </div>

              <div
                ref={sm2Ref}
                className={`fc-card-sm${sm2V ? ' an-up' : ''}`}
                style={{ opacity: sm2V ? 1 : 0, animationDelay: '0.28s' }}
              >
                <div className="off-badge">40% OFF</div>
                <img className="card-img" src={IMG.shorts} alt="Sports Shorts" />
                <div className="card-overlay" />
                <div className="card-body">
                  <h3 className="card-title" style={{ fontSize: '1rem' }}>KIDS<br /><span>JERSEY</span></h3>
                  <Link to="/kids" className="shop-link">Shop Now <ArrowSm /></Link>
                </div>
              </div>
            </div>

            <div
              ref={wideRef}
              className={`fc-card-wide${wideV ? ' an-left' : ''}`}
              style={{ opacity: wideV ? 1 : 0, animationDelay: '0.35s' }}
            >
              <img className="card-img" src={IMG.gymBag} alt="Gym Training Bag" />
              <div className="card-overlay-h" />
              <div className="card-body">
                <div className="card-label">Training Wear</div>
                <h3 className="card-title">COOL<br /><span>TRENDING JERSEY</span></h3>
                <p className="card-off">Up to <strong style={{ color: '#0A7F6E' }}>80% OFF</strong></p>
                <Link to="/products" className="shop-link">Shop Now <ArrowSm /></Link>
              </div>
            </div>

          </div>
        </div>

      </section>
    </>
  );
};

export default FeaturedCategories;