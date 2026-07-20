import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

.tm-root {
  --bg: #0d0d0d;
  --surface: #161616;
  --red: #14a889;
  --light: #f4f4f5;
  --white: #ffffff;
  --muted-dark: #9b9b9f;
  --muted-light: #6b6b70;
  --radius: 1rem;
  --border: rgba(255,255,255,0.08);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--white);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
.tm-root * { box-sizing: border-box; margin: 0; padding: 0; }

.tm-hero {
  position: relative;
  padding: 8rem 1.5rem 6rem;
  overflow: hidden;
  background: linear-gradient(120deg, rgba(6,37,31,0.13), rgba(10,61,51,0.13), rgba(5,22,18,0.13)), url('https://i.ibb.co/6cCJ931z/Chat-GPT-Image-Jul-21-2026-12-27-11-AM.png');
  background-size: cover;
  background-position: center;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
}

@media (min-width: 600px) {
  .tm-hero {
    min-height: 540px;
  }
}

@media (min-width: 900px) {
  .tm-hero {
    min-height: 627px;
  }
}
.tm-hero-noise {
  position: absolute; inset: 0; opacity: 0.03; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.tm-hero-inner {
  position: relative; max-width: 1120px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center;
}
.tm-heading {
  font-family: 'Oswald', sans-serif; font-weight: 700;
  text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.02;
}
.tm-hero-h1 { font-size: clamp(2.8rem, 7vw, 5.2rem); margin-bottom: 1.25rem; }
.tm-hero-accent {
  background: linear-gradient(180deg, #72d4c6 0%, #14a889 35%, #0f6e5c 70%, #051612 100%);
  background-size: 100% 200%; -webkit-background-clip: text; background-clip: text;
  color: transparent;
  text-shadow: 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(20,168,137,0.45);
  animation: tm-grad-shift 5s ease infinite;
}
@keyframes tm-grad-shift { 0%,100%{background-position:0% 0%;} 50%{background-position:0% 100%;} }

.tm-hero-sub {
  max-width: 600px; font-size: 1.1rem; line-height: 1.7;
  color: var(--muted-dark); margin-bottom: 2.5rem;
}

.tm-hero-stats {
  display: flex; flex-wrap: wrap; gap: 2.5rem;
  justify-content: center; align-items: center; margin-bottom: 2.5rem;
}
.tm-stat { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.tm-stat-num {
  font-family: 'Oswald', sans-serif; font-weight: 700;
  font-size: 2.2rem; color: var(--red); line-height: 1;
  min-width: 3ch; font-variant-numeric: tabular-nums;
}
.tm-stat-label { font-size: 0.78rem; color: var(--muted-dark); letter-spacing: 0.06em; text-transform: uppercase; text-align: center; }
.tm-hero-divider {
  width: 1px; height: 40px; background: rgba(255,255,255,0.12);
  align-self: center;
}
@media (max-width: 600px) {
  .tm-hero-divider {
    display: none;
  }
  .tm-hero-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem 0;
    max-width: 440px;
    margin: 0 auto 2.5rem;
  }
  .tm-hero-stats > .tm-stat:first-child {
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    width: 100%;
    padding-right: 1.5rem;
  }
  .tm-hero-stats > .tm-stat:nth-child(3) {
    width: 100%;
    padding-left: 1.5rem;
  }
  .tm-hero-stats > .tm-stat:last-child {
    grid-column: 1 / span 2;
    justify-self: center;
  }
}

.tm-section { padding: 5rem 1.5rem; position: relative; }
.tm-inner { max-width: 1120px; margin: 0 auto; }
.tm-dark { background: var(--bg); }
.tm-light { background: var(--light); color: #111113; }
.tm-section-white { background: #ffffff; color: #111113; }
.tm-section-white .tm-section-head p { color: #555; }

.tm-section-head { text-align: center; max-width: 640px; margin: 0 auto 3rem; }
.tm-section-head h2 {
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase;
  font-size: clamp(2rem, 4.5vw, 3rem); margin-bottom: 0.75rem; letter-spacing: -0.01em;
}
.tm-section-head p { color: #888; line-height: 1.6; font-size: 1.05rem; }
.tm-light .tm-section-head p { color: #555; }
.tm-accent { color: var(--red); }

.tm-filter-bar {
  display: flex; justify-content: center; align-items: center;
  margin-bottom: 2.5rem; padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  width: 100%;
}
.tm-section-white .tm-filter-bar { border-bottom: 1px solid rgba(0,0,0,0.08); }
.tm-tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  padding: 0.25rem 0.5rem 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.tm-tabs::-webkit-scrollbar {
  display: none;
}
@media (max-width: 768px) {
  .tm-tabs {
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
  }
}
.tm-tab-btn {
  padding: 0.6rem 1.2rem; border-radius: 999px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: var(--muted-dark); font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.tm-tab-btn:hover { background: rgba(255,255,255,0.08); color: var(--white); }
.tm-tab-btn.active {
  background: var(--red); border-color: var(--red); color: var(--white);
  box-shadow: 0 4px 14px rgba(20,168,137,0.25);
}
.tm-section-white .tm-tab-btn {
  background: #f5f5f6; border: 1px solid rgba(0,0,0,0.08); color: #666;
}
.tm-section-white .tm-tab-btn:hover { background: #ececee; color: #111; }
.tm-section-white .tm-tab-btn.active {
  background: var(--red); border-color: var(--red); color: #fff;
}

.tm-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 24px; align-items: stretch;
}
@media (max-width: 900px) { .tm-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .tm-grid { grid-template-columns: 1fr; } }

.tm-card {
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
              border-color 0.4s cubic-bezier(0.25, 1, 0.5, 1),
              box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
  height: 100%;
}
.tm-card:hover {
  transform: translateY(-6px);
  border-color: #14a889;
  box-shadow: 0 12px 30px rgba(20, 168, 137, 0.08);
}
.tm-quote-icon {
  position: absolute;
  top: 24px; right: 24px;
}
.tm-stars {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}
.tm-quote-text {
  font-size: 13.5px;
  line-height: 1.75;
  color: #aeaea2;
  margin-bottom: 24px;
  font-style: italic;
  position: relative;
  z-index: 1;
}
.tm-user-profile {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: auto;
}
.tm-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  background: #2c2c2c;
  flex-shrink: 0;
}
.tm-avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(20,168,137,0.15), rgba(20,168,137,0.05));
  border: 1px solid rgba(20,168,137,0.3); color: var(--red);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1.2rem;
  flex-shrink: 0;
}
.tm-user-details {
  display: flex;
  flex-direction: column;
}
.tm-user-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}
.tm-user-org {
  font-size: 11.5px;
  color: #666;
  margin-top: 2px;
  font-weight: 500;
}

.tm-no-results {
  text-align: center; padding: 4rem 1rem; width: 100%; grid-column: 1 / -1;
  color: var(--muted-dark); display: flex; flex-direction: column; align-items: center; gap: 1rem;
}

.tm-form-layout {
  display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: stretch;
}
@media (max-width: 900px) { .tm-form-layout { grid-template-columns: 1fr; gap: 2.5rem; } }

.tm-form-sidebar { display: flex; flex-direction: column; gap: 1.5rem; height: 100%; }
.tm-form-sidebar h3 {
  font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 2.2rem;
  text-transform: uppercase; line-height: 1.1; color: #111;
}
.tm-form-sidebar h3 span { color: var(--red); display: block; }
.tm-form-sidebar p { font-size: 1.05rem; color: #555; line-height: 1.7; }

.tm-form-card {
  background: #ffffff; border-radius: calc(var(--radius) + 4px);
  padding: 2.5rem; box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  border: 1.5px solid rgba(20,168,137,0.35);
}
.tm-form-title {
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase;
  font-size: 1.5rem; color: #111; margin-bottom: 0.35rem;
}
.tm-form-sub { font-size: 0.88rem; color: #888; margin-bottom: 1.75rem; }
.tm-form { display: flex; flex-direction: column; gap: 1.1rem; }
.tm-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 520px) { .tm-field-row { grid-template-columns: 1fr; } }
.tm-field { display: flex; flex-direction: column; gap: 0.3rem; }
.tm-label {
  font-size: 0.78rem; font-weight: 600; color: #444;
  letter-spacing: 0.05em; text-transform: uppercase;
}
.tm-required { color: var(--red); }
.tm-input, .tm-textarea {
  padding: 0.75rem 1rem; border: 1.5px solid #e5e5e5;
  border-radius: 0.625rem; font-size: 0.95rem; font-family: 'Inter', sans-serif;
  color: #111; background: #fafafa; outline: none; width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.tm-input:focus, .tm-textarea:focus {
  border-color: #14a889; box-shadow: 0 0 0 3px rgba(20,168,137,0.12); background: #fff;
}
.tm-textarea { resize: vertical; min-height: 110px; }

.tm-star-input { display: flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0; }
.tm-star-btn {
  background: none; border: none; cursor: pointer; color: #e5e5e5;
  transition: transform 0.15s, color 0.15s; display: flex;
}
.tm-star-btn:hover { transform: scale(1.2); }
.tm-star-btn.active { color: #f59e0b; }

.tm-submit-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.65rem;
  padding: 0.95rem 2rem; border-radius: 999px; background: var(--red); color: #fff;
  font-size: 0.9rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  border: none; cursor: pointer; width: 100%;
  transition: transform 0.15s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(20,168,137,0.30);
}
.tm-submit-btn:hover { transform: translateY(-2px); background: #18c39f; box-shadow: 0 8px 24px rgba(20,168,137,0.35); }
.tm-submit-btn:active { transform: translateY(0); }
.tm-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.tm-disclaimer {
  font-size: 0.77rem; color: #aaa; text-align: center; line-height: 1.6; margin-top: 0.25rem;
}

.tm-success {
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  text-align: center; padding: 3rem 1rem;
}
.tm-success-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(20,168,137,0.08);
  display: flex; align-items: center; justify-content: center; color: var(--red);
}
.tm-success h3 {
  font-family: 'Oswald', sans-serif; font-size: 1.8rem;
  text-transform: uppercase; font-weight: 700; color: #111;
}
.tm-success p { color: #666; font-size: 0.95rem; max-width: 320px; line-height: 1.6; }
.tm-success-meta { font-size: 0.82rem; color: #aaa; }

.tm-load-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 3.5rem;
  width: 100%;
}
.tm-load-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.9rem 2.5rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  border: 2px solid #111111;
  background: #111111;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.tm-load-btn:hover {
  background: #14a889;
  border-color: #14a889;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(20, 168, 137, 0.25);
}
.tm-load-btn:active {
  transform: translateY(0);
}

.tm-guidelines-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.75rem;
  text-align: left;
  flex-grow: 1;
}
.tm-guideline-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 1.15rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.015);
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1),
              border-color 0.25s cubic-bezier(0.25, 1, 0.5, 1),
              box-shadow 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}
.tm-guideline-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(20, 168, 137, 0.06);
  border-color: rgba(20, 168, 137, 0.25);
}
.tm-guideline-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(20, 168, 137, 0.08);
  color: #14a889;
  flex-shrink: 0;
}
.tm-guideline-content h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.25rem;
}
.tm-guideline-content p {
  font-size: 0.82rem;
  color: #555;
  line-height: 1.5;
  margin: 0 !important;
}
.tm-trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #14a889;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}

.tm-fade-up {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
}
.tm-fade-up.tm-visible { opacity: 1; transform: translateY(0); }
`;

const StarIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#FFC107" : "none"} stroke="#FFC107" strokeWidth="1.5" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);
const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(20, 168, 137, 0.18)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-9 7-14h-3v-3h7v5c0 6.627-5.373 12-11 12zm13 0c3 0 7-9 7-14h-3v-3h7v5c0 6.627-5.373 12-11 12z" />
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const ArrowDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const ArrowUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);
const ShieldCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const AwardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"/>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const INITIAL_TESTIMONIALS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    org: "Mumbai Cricket Club",
    rating: 5,
    status: "Approved",
    review: "The custom cricket uniforms were top-notch! The sublimation print is bright, breathable, and didn't fade after multiple washes. All players loved the fit.",
    time: "2 hrs ago",
    img: "https://images.unsplash.com/photo-1759694705159-fad2c93938f1?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Dr. Shalini Sen",
    org: "St. Xavier's Academy (Sports Coordinator)",
    rating: 5,
    status: "Approved",
    review: "Ordered 150 school hoodies for the winter sports fest. Outstanding cotton fleece quality and precise emblem embroidery. Avnish helped us finalize the size charts.",
    time: "1 day ago",
    img: "https://images.unsplash.com/photo-1760115622105-b5d845bb29e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Amit Sharma",
    org: "FitLife Gym Chain (Head Coach)",
    rating: 5,
    status: "Approved",
    review: "The fabric quality of the tracksuits is unmatched. It holds its stretch, absorbs sweat, and doesn't lose color after multiple wash cycles. My clients absolutely love it!",
    time: "2 days ago",
    img: "https://images.unsplash.com/photo-1653773869760-5b0f846231fb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Sneha Patel",
    org: "National Athletics Runner",
    rating: 5,
    status: "Approved",
    review: "The Aero-Dry tees are a game-changer. They stay feather-light and incredibly breathable even during my intense 15k training runs. Comfy really understands athletic needs.",
    time: "1 week ago",
    img: "https://images.unsplash.com/photo-1761225291317-6bbf383011f2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Pooja Hegde",
    org: "Pune Women Runners (Captain)",
    rating: 5,
    status: "Approved",
    review: "Fantastic training track pants! High stretch, zippered pockets, and custom branding fits perfectly. Prompt delivery network as promised.",
    time: "1 week ago",
    img: "https://images.unsplash.com/photo-1596913152332-e56f2cc8165c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Vikram Singh",
    org: "Professional Weightlifter",
    rating: 4,
    status: "Approved",
    review: "Elite compression tops are outstanding. They give excellent chest and core support. Recovering between heavy squat sets feels much quicker. A solid 10/10.",
    time: "2 weeks ago",
    img: "https://images.unsplash.com/photo-1541600383005-565c949cf777?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Rohan Mehta",
    org: "Marathon Runner",
    rating: 5,
    status: "Approved",
    review: "Zero chafing during my half-marathon run! The mesh running shorts are lightweight and have a very secure inner liner. The waistband is extremely comfortable.",
    time: "3 weeks ago",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Priya Rao",
    org: "Power Yoga Practitioner",
    rating: 5,
    status: "Approved",
    review: "Super comfy active joggers! The high-waisted fit sits perfectly without sliding down during stretches, and the material is buttery soft. Perfect for yoga and travel.",
    time: "3 weeks ago",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Lt. Col. Sandeep Thapa",
    org: "Army Sports Institute",
    rating: 5,
    status: "Approved",
    review: "The custom activewear sets supplied to our training academy are outstanding. Durable seams, zero shrinkage, and the corporate emblem printing is flawless.",
    time: "1 month ago",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10,
    name: "Aisha Mirza",
    org: "Zumba & Aerobics Instructor",
    rating: 5,
    status: "Approved",
    review: "I run 3 classes a day and wash these leggings daily. No sagging, no pilling, and absolute squat-proof confidence. Recommended to all my students!",
    time: "1 month ago",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Gaurav Gill",
    org: "Delhi Football Academy",
    rating: 5,
    status: "Approved",
    review: "Avnish and the Athenura B2B team prepared custom sublimated football jerseys for our junior teams in just 10 days. The design precision is remarkable.",
    time: "2 months ago",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Meera Deshmukh",
    org: "Corporate CSR Lead (TCS)",
    rating: 5,
    status: "Approved",
    review: "Outstanding corporate uniforms for our annual sports meet! The fabric is high grade and very soft. Quick delivery and highly professional communication.",
    time: "2 months ago",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
  }
];

function FadeUp({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("tm-visible"); observer.unobserve(el); }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="tm-fade-up" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function useCountUp(target, duration = 1800, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let startTime = null;
    let frame;
    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value);
}

function ReviewForm({ onNewSubmission }) {
  const [form, setForm] = useState({ name: "", org: "", rating: 5, review: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRate = (stars) => {
    setForm((prev) => ({ ...prev, rating: stars }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.review.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/testimonials', {
        name: form.name.trim(),
        org: form.org.trim(),
        rating: form.rating,
        review: form.review.trim(),
        status: "Pending"
      });

      if (response.data && response.data.success) {
        toast.success("Feedback submitted for moderation!");
        setSubmitted(true);
        if (onNewSubmission) onNewSubmission();
      } else {
        toast.error("Failed to submit feedback.");
      }
    } catch (err) {
      console.warn("API submission failed. Falling back to mockup.", err);
      setSubmitted(true);
      if (onNewSubmission) onNewSubmission();
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="tm-success">
        <div className="tm-success-icon"><CheckCircleIcon /></div>
        <h3>Feedback Submitted!</h3>
        <p>
          Thank you, <strong>{form.name}</strong>! Your review has been submitted for admin approval. Once approved, it will be visible on this page.
        </p>
        <button
          className="tm-submit-btn"
          style={{ marginTop: "1rem", maxWidth: "240px" }}
          onClick={() => { setSubmitted(false); setForm({ name: "", org: "", rating: 5, review: "" }); }}
        >
          Submit Another Review
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="tm-form-title">Write a Review</h2>
      <p className="tm-form-sub">Share your training or bulk ordering experience with Athenura.</p>
      <form className="tm-form" onSubmit={handleSubmit} noValidate>
        <div className="tm-field">
          <label className="tm-label" htmlFor="tm-name">Full Name <span className="tm-required">*</span></label>
          <input id="tm-name" name="name" className="tm-input" type="text" placeholder="Enter your name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="tm-field">
          <label className="tm-label" htmlFor="tm-org">Organization / Club / Role</label>
          <input id="tm-org" name="org" className="tm-input" type="text" placeholder="e.g. Mumbai Football Club, or Runner" value={form.org} onChange={handleChange} />
        </div>

        <div className="tm-field">
          <label className="tm-label">Star Rating <span className="tm-required">*</span></label>
          <div className="tm-star-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`tm-star-btn${form.rating >= star ? " active" : ""}`}
                onClick={() => handleRate(star)}
                aria-label={`Rate ${star} Stars`}
              >
                <StarIcon filled={form.rating >= star} />
              </button>
            ))}
          </div>
        </div>

        <div className="tm-field">
          <label className="tm-label" htmlFor="tm-review">Your Feedback <span className="tm-required">*</span></label>
          <textarea id="tm-review" name="review" className="tm-textarea" placeholder="Describe the product quality, fit, customization, or customer support..." value={form.review} onChange={handleChange} required />
        </div>

        <button type="submit" className="tm-submit-btn" disabled={loading || !form.name.trim() || !form.review.trim()}>
          {loading ? "Submitting…" : <><SendIcon /> Submit Review</>}
        </button>
        <p className="tm-disclaimer">
          By submitting, you agree your feedback will be reviewed by our B2B moderation team before going live.
        </p>
      </form>
    </>
  );
}

export default function TestimonialsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [testimonials, setTestimonials] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const animatedAthletes = useCountUp(150, 1800, 0);
  const animatedOrgs = useCountUp(200, 1800, 0);
  const animatedRating = useCountUp(4.2, 1800, 1);

  const loadTestimonials = async () => {
    try {
      const response = await API.get('/testimonials');
      const list = response.data?.data;
      if (list && Array.isArray(list) && list.length > 0) {
        const normalized = list.map(t => ({
          ...t,
          id: t._id,
          name: t.customerName,
          org: t.organization || '',
          img: t.image || '',
          status: t.status === 'active' ? 'Approved' : 'Pending'
        }));
        setTestimonials(normalized);
      } else {
        throw new Error('Empty or invalid testimonials data');
      }
    } catch (err) {
      console.warn("API fetch failed, falling back to mock testimonials.", err);
      const saved = localStorage.getItem("csw_admin_testimonials");
      if (saved) {
        setTestimonials(JSON.parse(saved));
      } else {
        setTestimonials(INITIAL_TESTIMONIALS);
      }
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    setShowAll(false);
  }, [activeTab]);

  const approvedList = useMemo(() => testimonials.filter(t => t.status === "Approved"), [testimonials]);

  const filteredList = useMemo(() => {
    return approvedList.filter(t => {
      let matchesTab = true;
      const orgLower = (t.org || "").toLowerCase();

      if (activeTab === "Organization") {
        matchesTab = t.org && t.org.trim().length > 0 &&
          (orgLower.includes("club") || orgLower.includes("academy") || orgLower.includes("school") ||
           orgLower.includes("chain") || orgLower.includes("team") || orgLower.includes("association") ||
           orgLower.includes("corporation") || orgLower.includes("gym") || orgLower.includes("company"));
      } else if (activeTab === "Team") {
        matchesTab = t.org && t.org.trim().length > 0 &&
          (orgLower.includes("coach") || orgLower.includes("captain") || orgLower.includes("runner") ||
           orgLower.includes("trainer") || orgLower.includes("director"));
      } else if (activeTab === "Individual") {
        matchesTab = !t.org || t.org.trim().length === 0 || orgLower.includes("runner") || orgLower.includes("weightlifter");
      }

      return matchesTab;
    });
  }, [approvedList, activeTab]);

  const displayedList = useMemo(() => {
    if (activeTab === "All" && !showAll) {
      return filteredList.slice(0, 6);
    }
    return filteredList;
  }, [filteredList, activeTab, showAll]);

  return (
    <div className="tm-root">
      <style>{styles}</style>

      <header
        className="tm-hero"
        aria-label="Testimonials hero"
      >
        <div className="tm-hero-noise" aria-hidden="true" />
        <div className="tm-hero-inner">
          <FadeUp delay={0}>
            <h1 className="tm-heading tm-hero-h1">
              Client <span className="tm-hero-accent">Testimonials</span>
            </h1>
          </FadeUp>

          <FadeUp delay={120}>
            <p className="tm-hero-sub">
              See how academies, corporate teams, and professional athletes elevate their performance and team pride with Athenura premium gear.
            </p>
          </FadeUp>

          <FadeUp delay={240}>
            <div className="tm-hero-stats">
              <div className="tm-stat">
                <span className="tm-stat-num">{animatedAthletes}+</span>
                <span className="tm-stat-label">Active Athletes</span>
              </div>
              <div className="tm-hero-divider" aria-hidden="true" />
              <div className="tm-stat">
                <span className="tm-stat-num">{animatedOrgs}+</span>
                <span className="tm-stat-label">B2B Organizations</span>
              </div>
              <div className="tm-hero-divider" aria-hidden="true" />
              <div className="tm-stat">
                <span className="tm-stat-num">{animatedRating}</span>
                <span className="tm-stat-label">Average Star Rating</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </header>

      <section className="tm-section tm-section-white" aria-label="Customer feedback cards">
        <div className="tm-inner">
          <FadeUp>
            <div className="tm-section-head">
              <h2 className="tm-heading">What They <span className="tm-accent">Say</span></h2>
              <p>Unbiased reviews from coaches, team captains, and fitness enthusiasts.</p>
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <div className="tm-filter-bar">
              <div className="tm-tabs">
                {[
                  { id: "All", label: "All Reviews" },
                  { id: "Organization", label: "Organizations & Clubs" },
                  { id: "Team", label: "Team Staff & Captains" },
                  { id: "Individual", label: "Individual Athletes" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`tm-tab-btn${activeTab === tab.id ? " active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          <div className="tm-grid">
            {displayedList.length > 0 ? (
              displayedList.map((item, idx) => (
                <FadeUp key={item.id} delay={idx * 60} style={{ height: "100%" }}>
                  <div className="tm-card">
                    <div className="tm-quote-icon" aria-hidden="true"><QuoteIcon /></div>
                    <div>
                      <div className="tm-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            <StarIcon filled={i < item.rating} />
                          </span>
                        ))}
                      </div>
                      <p className="tm-quote-text">"{item.review}"</p>
                    </div>
                    <div className="tm-user-profile">
                      {(() => {
                        const idNum = Number(item.id) || 0;
                        const fallbackHashes = [
                          "1534528741775-53994a69daeb",
                          "1517841905240-472988babdf9",
                          "1507003211169-0a1dd7228f2d",
                          "1500648767791-00dcc994a43e",
                          "1494790108377-be9c29b29330",
                          "1539571696357-5a69c17a67c6",
                          "1506794778202-cad84cf45f1d",
                          "1438761681033-6461ffad8d80",
                          "1507003211169-0a1dd7228f2d",
                          "1544005313-94ddf0286df2",
                          "1506794778202-cad84cf45f1d",
                          "1573496359142-b8d87734a5a2"
                        ];
                        const hash = fallbackHashes[idNum % fallbackHashes.length];
                        const avatarUrl = (item.img && typeof item.img === "string" && item.img.startsWith("http")) 
                          ? item.img 
                          : `https://images.unsplash.com/photo-${hash}?w=120&q=80&fit=crop`;
                        return <img className="tm-avatar" src={avatarUrl} alt={item.name} loading="lazy" />;
                      })()}
                      <div className="tm-user-details">
                        <h4 className="tm-user-name">{item.name}</h4>
                        {item.org && <span className="tm-user-org">{item.org}</span>}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))
            ) : (
              <FadeUp>
                <div className="tm-no-results">
                  <p style={{ fontSize: "1.1rem" }}>No matching reviews found.</p>
                  <p style={{ fontSize: "0.88rem" }}>Try selecting a different tab.</p>
                </div>
              </FadeUp>
            )}
          </div>

          {activeTab === "All" && filteredList.length > 6 && (
            <div className="tm-load-btn-container">
              {!showAll ? (
                <button className="tm-load-btn" onClick={() => setShowAll(true)}>
                  Load More <ArrowDownIcon />
                </button>
              ) : (
                <button className="tm-load-btn" onClick={() => setShowAll(false)}>
                  Show Less <ArrowUpIcon />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="tm-section tm-light" aria-label="Submit review form">
        <div className="tm-inner">
          <div className="tm-form-layout">
            <FadeUp delay={0} style={{ height: "100%" }}>
              <div className="tm-form-sidebar">
                <div className="tm-trust-badge">
                  <ShieldCheckIcon /> Verified Reviews
                </div>
                <h3>
                  Loved our Gear? <span>Share Your Story</span>
                </h3>
                <p>
                  Your feedback helps us continuously perfect our fit, styling, and fabrics. Submit your review and bulk ordering experience below. We read every story to keep elevating our premium quality standards.
                </p>

                <div className="tm-guidelines-list">
                  <div className="tm-guideline-item">
                    <div className="tm-guideline-icon">
                      <AwardIcon />
                    </div>
                    <div className="tm-guideline-content">
                      <h4>Fabric & Performance</h4>
                      <p>Tell us how our Aero-Dry fabric or compression fit holds up during intense training matches.</p>
                    </div>
                  </div>

                  <div className="tm-guideline-item">
                    <div className="tm-guideline-icon">
                      <ShieldCheckIcon />
                    </div>
                    <div className="tm-guideline-content">
                      <h4>Customization & Print</h4>
                      <p>Comment on the precision of our B2B embroidery or the vibrance of our sublimation printing.</p>
                    </div>
                  </div>

                  <div className="tm-guideline-item">
                    <div className="tm-guideline-icon">
                      <MessageIcon />
                    </div>
                    <div className="tm-guideline-content">
                      <h4>B2B Service & Support</h4>
                      <p>Share your experience with our bulk order coordinators, delivery timelines, and customer service.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={120} style={{ height: "100%" }}>
              <div className="tm-form-card" style={{ height: "100%" }}>
                <ReviewForm onNewSubmission={loadTestimonials} />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  );
}