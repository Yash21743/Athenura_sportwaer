import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const icons = {
    intro: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    collect: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M3 7l9-4 9 4" />
      </svg>
    ),
    use: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    sharing: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
      </svg>
    ),
    orders: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2l1.5 4h9L18 2" />
        <path d="M3.5 6h17l-1.5 14a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2L3.5 6z" />
      </svg>
    ),
    cookies: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="9" cy="10" r="0.6" fill="currentColor" />
        <circle cx="14" cy="9" r="0.6" fill="currentColor" />
        <circle cx="15" cy="14" r="0.6" fill="currentColor" />
        <circle cx="10" cy="15" r="0.6" fill="currentColor" />
      </svg>
    ),
    security: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      </svg>
    ),
    rights: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  };

  const sections = [
    {
      id: 'intro',
      title: 'Introduction',
      content: `We value your trust. This policy explains how Comfy Sport Wear collects, uses, and protects your information when you browse our products or place an order with us.`,
      points: [],
    },
    {
      id: 'collect',
      title: 'Information We Collect',
      content: `When you shop with us or request a bulk order, we collect:`,
      points: [
        'Name, email, phone number, and delivery address',
        'Order details like size, quantity, and product preferences',
        'Payment information (processed securely, not stored by us)',
        'Device and browsing data via cookies',
      ],
    },
    {
      id: 'use',
      title: 'How We Use Your Information',
      content: `Your data helps us deliver a smooth shopping experience:`,
      points: [
        'Process and ship your orders (T-shirts, jerseys, team kits, etc.)',
        'Send order confirmations, tracking updates, and offers',
        'Respond to bulk order and custom printing inquiries',
        'Improve our product range based on customer feedback',
      ],
    },
    {
      id: 'sharing',
      title: 'Sharing of Information',
      content: `We never sell or rent your personal data. We only share order details with trusted courier and payment partners so we can deliver your sportswear on time.`,
      points: [],
    },
    {
      id: 'orders',
      title: 'Bulk & Custom Orders',
      content: `For teams, clubs, schools, and academies placing bulk or custom-printed orders, we collect organization name, quantity, and design preferences solely to process your request accurately.`,
      points: [],
    },
    {
      id: 'cookies',
      title: 'Cookies',
      content: `We use cookies to remember your cart, sizes, and browsing preferences. You can disable cookies from your browser settings, though some features like size memory may stop working.`,
      points: [],
    },
    {
      id: 'security',
      title: 'Data Security',
      content: `We use appropriate technical measures to protect your personal and payment information. However, no method of transmission over the internet is 100% secure.`,
      points: [],
    },
    {
      id: 'rights',
      title: 'Your Rights',
      content: `You have the right to access, correct, or delete your personal data, or ask us to stop sending promotional messages, anytime.`,
      points: [],
    },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const navbarOffset = 100;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navbarOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const navigate = useNavigate();

  return (
    <div id="pp-root" style={{ fontFamily: "'Poppins', sans-serif", background: '#f4f9f7', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&family=Montserrat:wght@700;900&display=swap');
        @keyframes ppFadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pp-fade {
          opacity: 0;
        }
        .pp-fade.pp-show {
          animation: ppFadeInUp 0.6s ease forwards;
        }

        .pp-hero-buttons { display: flex; gap: 16px; margin-top: 28px; flex-wrap: wrap; justify-content: center; }
        .pp-btn {
          padding: 12px 28px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border: 2px solid #ffffff;
          transition: all 0.25s ease;
        }
        .pp-btn-fill { background: #ffffff; color: #0B3D2E; }
        .pp-btn-fill:hover { background: transparent; color: #ffffff; }
        .pp-btn-outline { background: transparent; color: #ffffff; }
        .pp-btn-outline:hover { background: #ffffff; color: #0B3D2E; }

        /* Mobile / Tablet TOC pills */
        .pp-toc-pills {
          display: none;
        }
        .pp-toc-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          background: #ffffff;
          color: #0B3D2E;
          border: 1px solid #cfe8de;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pp-toc-pill svg { flex-shrink: 0; }
        .pp-toc-pill.active {
          background: #0B3D2E;
          color: #ffffff;
          border-color: #0B3D2E;
        }

        .pp-layout {
          display: flex;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 12px;
          gap: 26px;
        }
        .pp-sidebar {
          width: 250px;
          flex-shrink: 0;
          background: #0B3D2E;
          border-radius: 14px;
          padding: 22px;
          height: fit-content;
          position: sticky;
          top: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }
        .pp-toc-title {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #F5E6D3;
          margin-bottom: 14px;
        }
        .pp-toc-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13.5px;
          color: #d7ede4;
          cursor: pointer;
          margin-bottom: 4px;
          transition: all 0.2s ease;
        }
        .pp-toc-item svg { flex-shrink: 0; color: #8fd9c4; }
        .pp-toc-item.active svg { color: #0B3D2E; }
        .pp-toc-item:hover { background: rgba(255,255,255,0.08); }
        .pp-toc-item.active {
          background: #F5E6D3;
          color: #0B3D2E;
          font-weight: 700;
        }

        .pp-content {
          flex: 1;
          background: #ffffff;
          border-radius: 14px;
          padding: 40px 44px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .pp-section { margin-bottom: 34px; scroll-margin-top: 90px; }
        .pp-section h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.45rem;
          font-weight: 800;
          color: #0B3D2E;
          margin-bottom: 12px;
          font-family: 'Montserrat', sans-serif;
        }
        .pp-section h2 svg {
          background: #e6f2ee;
          padding: 7px;
          border-radius: 8px;
          width: 26px;
          height: 26px;
          box-sizing: content-box;
        }
        .pp-section p {
          color: #444;
          font-size: 14.5px;
          line-height: 1.8;
          margin: 0 0 10px 0;
        }
        .pp-section ul {
          margin: 0;
          padding-left: 4px;
          list-style: none;
        }
        .pp-section ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #444;
          font-size: 14.5px;
          line-height: 1.8;
          padding: 10px 0;
          border-bottom: 2px solid #d7ede4;
        }
        .pp-section ul li:last-child {
          border-bottom: none;
        }
        .pp-bullet {
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0A7F6E;
          margin-top: 8px;
        }

        @media (max-width: 1300px) {
          .pp-sidebar { display: none; }
          .pp-toc-pills {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding: 16px 14px;
            margin: 0 auto 20px auto;
            max-width: 1240px;
            scrollbar-width: none;
          }
          .pp-toc-pills::-webkit-scrollbar { display: none; }
          .pp-layout { flex-direction: column; padding: 0 14px; }
          .pp-content { padding: 26px 20px; }
        }

        @media print {
          nav, header, footer { display: none !important; }
          .pp-toc-pills, .pp-sidebar { display: none !important; }
          .pp-content { box-shadow: none !important; }
          .pp-layout { display: block !important; max-width: 100% !important; }
          body * { visibility: hidden; }
          .pp-print-area, .pp-print-area * { visibility: visible; }
          .pp-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      <div className="pp-print-area">
        {/* Hero Section */}
        <div style={{
          position: 'relative',
          padding: '90px 20px',
          textAlign: 'center',
          color: '#ffffff',
          backgroundImage: `linear-gradient(135deg, rgba(5,20,16,0.88) 0%, rgba(10,46,39,0.82) 60%, rgba(13,59,50,0.80) 100%), url('https://i.pinimg.com/1200x/3e/39/2f/3e392fb7484c3d39adb63eefd7511673.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: "'Poppins', sans-serif",
        }}>
          <h1 style={{
            fontSize: '2.6rem',
            fontWeight: 900,
            margin: 0,
            fontFamily: "'Montserrat', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#d7ede4', fontSize: '14px', marginTop: '10px' }}>
            How Comfy Sport Wear Collects, Uses, and Protects Your Information
          </p>
          <div className="pp-hero-buttons">
            <button className="pp-btn pp-btn-fill" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
            <button className="pp-btn pp-btn-outline" onClick={() => window.print()}>
              Download PDF
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Pills TOC */}
        <div className="pp-toc-pills">
          {sections.map((s) => (
            <div
              key={s.id}
              className={`pp-toc-pill ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => scrollToSection(s.id)}
            >
              {icons[s.id]}
              {s.title}
            </div>
          ))}
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="pp-layout" style={{ marginTop: '50px', marginBottom: '60px' }}>
          <div className="pp-sidebar">
            <p className="pp-toc-title">Table of Contents</p>
            {sections.map((s) => (
              <div
                key={s.id}
                className={`pp-toc-item ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => scrollToSection(s.id)}
              >
                {icons[s.id]}
                {s.title}
              </div>
            ))}
          </div>

          <div className="pp-content">
            {sections.map((s, idx) => (
              <div
                key={s.id}
                id={s.id}
                className={`pp-section pp-fade ${loaded ? 'pp-show' : ''}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <h2>{icons[s.id]}{s.title}</h2>
                <p>{s.content}</p>
                {s.points.length > 0 && (
                  <ul>
                    {s.points.map((pt, i) => (
                      <li key={i}>
                        <span className="pp-bullet" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;