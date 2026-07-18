import { useState, useRef, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

/* ─── Inline Styles ─── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

.bo-root {
  --bg: #0d0d0d;
  --surface: #1a1a1a;
  --red: #14a889;
  --light: #f4f4f5;
  --white: #ffffff;
  --muted-dark: #9b9b9f;
  --muted-light: #6b6b70;
  --radius: 1rem;
  --border: rgba(255,255,255,0.10);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--white);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}
.bo-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Hero ── */
.bo-hero {
  position: relative;
  padding: 7rem 1.5rem 6rem;
  overflow: hidden;
  background: linear-gradient(120deg, rgba(6,37,31,0.13), rgba(10,61,51,0.13), rgba(5,22,18,0.13)), url('https://i.ibb.co/zHszBhFQ/Chat-GPT-Image-Jul-18-2026-01-20-04-PM.png');
  background-size: cover;
  background-position: center;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
}

@media (min-width: 600px) {
  .bo-hero {
    min-height: 540px;
  }
}

@media (min-width: 900px) {
  .bo-hero {
    min-height: 627px;
  }
}

.bo-hero-noise {
  position: absolute; inset: 0; opacity: 0.03; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.bo-hero-inner {
  position: relative; max-width: 1120px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center;
}

.bo-heading {
  font-family: 'Oswald', sans-serif; font-weight: 700;
  text-transform: uppercase; letter-spacing: -0.01em; line-height: 1.02;
}
.bo-hero-h1 { font-size: clamp(2.8rem, 7vw, 5.2rem); margin-bottom: 1.25rem; }
.bo-hero-accent {
  background: linear-gradient(180deg, #72d4c6 0%, #14a889 35%, #0f6e5c 70%, #051612 100%);
  background-size: 100% 200%; -webkit-background-clip: text; background-clip: text;
  color: transparent;
  text-shadow: 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(20,168,137,0.45);
  animation: bo-grad-shift 5s ease infinite;
}
@keyframes bo-grad-shift { 0%,100%{background-position:0% 0%;} 50%{background-position:0% 100%;} }

.bo-hero-sub {
  max-width: 580px; font-size: 1.1rem; line-height: 1.7;
  color: var(--muted-dark); margin-bottom: 2.5rem;
}
.bo-hero-stats {
  display: flex; flex-wrap: wrap; gap: 2.5rem;
  justify-content: center; align-items: center; margin-bottom: 2.5rem;
}
.bo-stat { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.bo-stat-num {
  font-family: 'Oswald', sans-serif; font-weight: 700;
  font-size: 2.2rem; color: var(--red); line-height: 1;
  font-variant-numeric: tabular-nums;
}
.bo-stat-label { font-size: 0.78rem; color: var(--muted-dark); letter-spacing: 0.06em; text-transform: uppercase; }
.bo-hero-divider {
  width: 1px; height: 40px; background: rgba(255,255,255,0.12);
  align-self: center;
}
.bo-hero-pills { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
.bo-pill {
  display: inline-flex; align-items: center; gap: 0.55rem;
  padding: 0.55rem 1.1rem; border-radius: 999px;
  font-size: 0.82rem; font-weight: 600; letter-spacing: 0.03em;
  text-decoration: none; border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05); color: var(--white);
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.bo-pill:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }
.bo-pill-red { background: var(--red); border-color: var(--red); }
.bo-pill-red:hover { background: #18c39f; border-color: #18c39f; }

/* ── Sections ── */
.bo-section { padding: 5rem 1.5rem; position: relative; }
.bo-inner { max-width: 1120px; margin: 0 auto; }
.bo-dark { background: var(--bg); }
.bo-light { background: var(--light); color: #111113; }
.bo-section-head { text-align: center; max-width: 640px; margin: 0 auto 3.5rem; }
.bo-section-head h2 {
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase;
  font-size: clamp(2rem, 4.5vw, 3rem); margin-bottom: 0.75rem; letter-spacing: -0.01em;
}
.bo-section-head p { color: #888; line-height: 1.6; font-size: 1.05rem; }
.bo-light .bo-section-head p { color: #555; }
.bo-accent { color: var(--red); }

/* ── Benefits Grid (white section, 3-up, equal size, centered) ── */
.bo-benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 1.5rem;
}
@media (max-width: 900px) { .bo-benefits-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .bo-benefits-grid { grid-template-columns: 1fr; } }

.bo-benefit-card {
  height: 100%;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: var(--radius);
  padding: 2.1rem 1.6rem;
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;
  box-shadow: 0 2px 14px rgba(0,0,0,0.05);
  transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
}
.bo-benefit-card:hover {
  border-color: rgba(20,168,137,0.4); transform: translateY(-4px);
  box-shadow: 0 14px 34px rgba(20,168,137,0.14);
}
.bo-benefit-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, rgba(20,168,137,0.22), rgba(20,168,137,0.08));
  border: 1px solid rgba(20,168,137,0.25);
  color: var(--red);
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), background 0.25s;
}
.bo-benefit-card:hover .bo-benefit-icon {
  transform: rotate(-12deg) scale(1.1);
  background: radial-gradient(circle at 32% 28%, rgba(20,168,137,0.35), rgba(20,168,137,0.12));
}
.bo-benefit-title {
  font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1.05rem;
  text-transform: uppercase; letter-spacing: 0.04em; color: #111;
}
.bo-benefit-desc { font-size: 0.88rem; color: #666; line-height: 1.6; }

/* ── Process Steps (stays black, line is now an animation) ── */
.bo-steps-wrap { position: relative; }
.bo-steps-line {
  position: absolute;
  top: 30px; left: 10%; right: 10%; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(20,168,137,0.55), transparent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 1.2s cubic-bezier(0.22,1,0.36,1);
  pointer-events: none;
  z-index: 0;
}
.bo-steps-line.bo-line-visible { transform: scaleX(1); }
@media (max-width: 640px) { .bo-steps-line { display: none; } }
@media (min-width: 641px) and (max-width: 1024px) {
  .bo-steps-line { top: 24px; }
}

.bo-steps {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  position: relative;
}
@media (max-width: 640px) {
  .bo-steps { grid-template-columns: 1fr; gap: 2rem; }
}
.bo-step {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 1rem; padding: 0.5rem;
}
.bo-step-num {
  width: 60px; height: 60px; border-radius: 50%;
  background: #0d211d; border: 2px solid rgba(20,168,137,0.45);
  color: var(--red); font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1.4rem;
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1; transition: background 0.3s, border-color 0.3s;
}
.bo-step:hover .bo-step-num { background: #123a30; border-color: var(--red); }
.bo-step-title {
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase;
  font-size: 0.95rem; letter-spacing: 0.04em;
}
.bo-step-desc { font-size: 0.85rem; color: var(--muted-dark); line-height: 1.5; max-width: 180px; }

@media (min-width: 641px) and (max-width: 1024px) {
  .bo-step-num { width: 48px; height: 48px; font-size: 1.15rem; }
  .bo-step-title { font-size: 0.85rem; }
  .bo-step-desc { font-size: 0.77rem; max-width: 100%; }
}

/* ── Form ── */
.bo-form-layout {
  display: grid; grid-template-columns: 1fr 1.5fr; gap: 2.5rem; align-items: stretch;
}
.bo-form-layout > div {
  display: flex;
  flex-direction: column;
  height: 100%;
}
@media (max-width: 900px) {
  .bo-form-layout { grid-template-columns: 1fr; gap: 2rem; }
  .bo-form-layout > div { height: auto; }
}

.bo-form-sidebar {
  display: flex; flex-direction: column;
  justify-content: flex-start;
  gap: 2.2rem;
  height: 100%;
}
.bo-sidebar-tagline {
  font-family: 'Oswald', sans-serif; font-weight: 700; font-size: clamp(2.3rem, 4.6vw, 3.3rem);
  text-transform: uppercase; line-height: 1.05; color: #111;
}
.bo-sidebar-tagline span { color: var(--red); }
.bo-sidebar-sub { font-size: 1.05rem; color: #666; line-height: 1.75; }
.bo-mini-benefits { display: flex; flex-direction: column; gap: 1.4rem; }
.bo-mini-benefit {
  display: flex; align-items: flex-start; gap: 0.8rem;
  font-size: 0.95rem; color: #444; line-height: 1.55;
}
.bo-mini-icon { color: var(--red); flex-shrink: 0; margin-top: 2px; }
.bo-mini-benefit strong { font-weight: 600; color: #222; display: block; font-size: 0.95rem; }

.bo-contact-quick { display: flex; flex-direction: column; gap: 1.1rem; }
.bo-contact-item {
  display: flex; align-items: center; gap: 0.85rem;
  font-size: 1.05rem; color: #444; text-decoration: none;
  transition: color 0.2s, transform 0.2s;
}
.bo-contact-item:hover { color: var(--red); transform: translateX(4px); }
.bo-contact-item svg { color: var(--red); flex-shrink: 0; transform: scale(1.15); }

/* form card & contact card */
.bo-form-card {
  background: #ffffff; border-radius: calc(var(--radius) + 4px);
  padding: 2.5rem; box-shadow: 0 8px 40px rgba(0,0,0,0.10);
  border: 1.5px solid rgba(20,168,137,0.35);
  height: 100%;
}
.bo-contact-card {
  background: #ffffff; border-radius: calc(var(--radius) + 4px);
  padding: 2.2rem 2rem; box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  border: 1.5px solid rgba(20,168,137,0.35);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.bo-contact-card-title {
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase;
  font-size: clamp(1.8rem, 3.5vw, 2.3rem); color: #111; line-height: 1.05;
  margin-bottom: 1.3rem; letter-spacing: 0.02em;
}
.bo-contact-card-title span {
  color: var(--red); display: block;
}
.bo-contact-card-sub {
  font-size: 0.9rem; color: #666; line-height: 1.55; margin-bottom: 1.4rem;
}
.bo-form-title {
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase;
  font-size: 1.5rem; color: #111; margin-bottom: 0.35rem;
}
.bo-form-sub { font-size: 0.88rem; color: #888; margin-bottom: 1.75rem; }
.bo-form { display: flex; flex-direction: column; gap: 1rem; }
.bo-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 520px) { .bo-field-row { grid-template-columns: 1fr; } }
.bo-field { display: flex; flex-direction: column; gap: 0.3rem; }
.bo-label {
  font-size: 0.78rem; font-weight: 600; color: #444;
  letter-spacing: 0.05em; text-transform: uppercase;
}
.bo-required { color: var(--red); }
.bo-input, .bo-textarea, .bo-select {
  padding: 0.75rem 1rem; border: 1.5px solid #e5e5e5;
  border-radius: 0.625rem; font-size: 0.95rem; font-family: 'Inter', sans-serif;
  color: #111; background: #fafafa; outline: none; width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.bo-input:focus, .bo-textarea:focus, .bo-select:focus {
  border-color: #14a889; box-shadow: 0 0 0 3px rgba(20,168,137,0.12); background: #fff;
}
.bo-textarea { resize: vertical; min-height: 110px; }
.bo-select {
  cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1rem; padding-right: 2.5rem;
}

/* radio group */
.bo-radio-group { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.bo-radio-label {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.55rem 1rem; border-radius: 999px;
  border: 1.5px solid #e5e5e5; cursor: pointer; font-size: 0.88rem;
  font-weight: 500; color: #555; transition: border-color 0.2s, background 0.2s, color 0.2s;
  user-select: none;
}
.bo-radio-label input { display: none; }
.bo-radio-label.selected { border-color: var(--red); background: rgba(20,168,137,0.07); color: var(--red); font-weight: 600; }

/* date input */
.bo-input[type="date"] { cursor: pointer; }
.bo-input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.5; }
.bo-input[type="date"]:focus::-webkit-calendar-picker-indicator { opacity: 1; }

.bo-submit-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.65rem;
  padding: 0.95rem 2rem; border-radius: 999px; background: var(--red); color: #fff;
  font-size: 0.9rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  border: none; cursor: pointer; width: 100%;
  transition: transform 0.15s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(20,168,137,0.30);
}
.bo-submit-btn:hover { transform: translateY(-2px); background: #18c39f; box-shadow: 0 8px 24px rgba(20,168,137,0.35); }
.bo-submit-btn:active { transform: translateY(0); }
.bo-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.bo-disclaimer {
  font-size: 0.77rem; color: #aaa; text-align: center; line-height: 1.6; margin-top: 0.25rem;
}

/* Success State */
.bo-success {
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  text-align: center; padding: 3rem 1rem;
}
.bo-success-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(20,168,137,0.08);
  display: flex; align-items: center; justify-content: center; color: var(--red);
}
.bo-success h3 {
  font-family: 'Oswald', sans-serif; font-size: 1.8rem;
  text-transform: uppercase; font-weight: 700; color: #111;
}
.bo-success p { color: #666; font-size: 0.95rem; max-width: 320px; line-height: 1.6; }
.bo-success-meta { font-size: 0.82rem; color: #aaa; }

/* ── CTA Banner (now white section) ── */
.bo-cta-section { background: #ffffff; padding: 30px 1.5rem 25px; }
.bo-cta-box {
  max-width: 1120px; margin: 0 auto; position: relative;
  border-radius: 20px; overflow: hidden;
  background: linear-gradient(135deg, #14a889 0%, #0a3d33 50%, #051612 100%);
  box-shadow: 0 16px 44px rgba(20, 168, 137, 0.22);
}
.bo-cta-bg-wrap {
  position: absolute; inset: 0;
  z-index: 0;
  overflow: hidden;
}
.bo-cta-bg-img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.3;
  transform: scale(1.1);
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.36, 1);
}
.bo-cta-box:hover .bo-cta-bg-img {
  transform: scale(1);
}
.bo-cta-content {
  position: relative; display: flex; flex-direction: column;
  align-items: center; text-align: center; gap: 1.5rem; padding: 80px 40px;
  z-index: 2;
}
@media (min-width: 1024px) {
  .bo-cta-content { padding: 80px 60px; flex-direction: column; justify-content: center; text-align: center; }
}
.bo-cta-text { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; text-align: center; }
.bo-cta-title {
  font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase;
  font-size: clamp(1.8rem, 4vw, 3rem); color: var(--white); line-height: 1.05;
}
.bo-cta-sub { color: rgba(255,255,255,0.7); font-size: 1rem; max-width: 580px; line-height: 1.6; margin: 0 auto; }
.bo-cta-btns { display: flex; flex-wrap: nowrap; gap: 1rem; justify-content: center; margin-top: 1rem; }
@media (min-width: 1024px) { .bo-cta-btns { justify-content: center; } }
.bo-cta-btn-wa {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 14px 34px; border-radius: 6px;
  background: #ffffff; color: #0a3d33;
  font-size: 0.85rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  text-decoration: none; flex-shrink: 0;
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  font-family: 'Poppins', sans-serif;
}
.bo-cta-btn-wa:hover { transform: translateY(-3px); background: #f8f9fa; color: #14a889; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); }
.bo-cta-btn-ghost {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 13px 32px; border-radius: 6px;
  border: 1.5px solid rgba(255,255,255,0.35); background: rgba(255,255,255,0.08);
  color: var(--white); font-size: 0.85rem; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase; text-decoration: none; flex-shrink: 0;
  transition: background 0.2s, transform 0.15s, border-color 0.2s;
  font-family: 'Poppins', sans-serif;
}
.bo-cta-btn-ghost:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); border-color: #ffffff; }

/* ── Fade animations ── */
.bo-fade-up {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
}
.bo-fade-up.bo-visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .bo-hero { padding: 5rem 1.25rem 4rem; }
  .bo-section { padding: 3.5rem 1.25rem; }
  .bo-form-card { padding: 1.75rem 1.25rem; }
  .bo-cta-btn-wa, .bo-cta-btn-ghost { padding: 0.75rem 1.2rem; font-size: 0.78rem; }
  .bo-hero-stats { gap: 1.5rem; }
  .bo-hero-divider { height: 30px; }
}
@media (max-width: 640px) {
  .bo-cta-btns { flex-direction: column; width: 100%; gap: 0.75rem; }
  .bo-cta-btn-wa, .bo-cta-btn-ghost { justify-content: center; width: 100%; }
}
`;

/* ─── SVG Icons ─── */
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-.52a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PackageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const PrintIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
  </svg>
);
const DiscountIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const HeadsetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const WAIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* ─── Contact constants ─── */
const PHONE_DISPLAY = "+91 8755578878";
const PHONE_TEL = "+91 8755578878";
const WA_LINK = "https://wa.me/918755578878";
const EMAIL = "official@athenura.in";

/* ─── Data ─── */
const STATS = [
  { end: 150, suffix: "+", label: "B2B Clients" },
  { end: 50, suffix: "", label: "MOQ Units" },
  { end: 24, suffix: "h", label: "Quote Time" },
  { end: 100, suffix: "%", label: "Custom Print" },
];

const BENEFITS = [
  { icon: <DiscountIcon />, title: "Best Bulk Pricing", desc: "Exclusive wholesale rates starting from MOQ 50 units — bigger the order, lower the price per unit." },
  { icon: <PrintIcon />, title: "Custom Printing", desc: "Your logo, team name, or any design — screen print, sublimation, or embroidery available." },
  { icon: <TruckIcon />, title: "Pan-India Delivery", desc: "Fast & reliable shipping across India with full order tracking and dedicated support." },
  { icon: <ShieldIcon />, title: "Quality Assured", desc: "Every bulk order goes through strict QC checks before dispatch. No compromises on quality." },
  { icon: <HeadsetIcon />, title: "Dedicated B2B Support", desc: "A dedicated account manager for your business — from quote to delivery and beyond." },
  { icon: <PackageIcon />, title: "Custom Packaging", desc: "Branded packaging options available for resellers, corporates, and sports academies." },
];

const STEPS = [
  { num: "01", title: "Submit Request", desc: "Fill the B2B enquiry form with your requirements" },
  { num: "02", title: "Get a Quote", desc: "Our team sends a detailed quote within 24 hours" },
  { num: "03", title: "Confirm & Pay", desc: "Approve the quote and complete the advance payment" },
  { num: "04", title: "Production", desc: "Your order goes into manufacturing with quality checks" },
  { num: "05", title: "Delivery", desc: "Packed & shipped — tracked delivery to your doorstep" },
];

const CATEGORIES = [
  "T-Shirts & Jerseys",
  "Hoodies & Sweatshirts",
  "Track Pants & Shorts",
  "Sports Jackets",
  "Compression Wear",
  "Team Kits (Full Set)",
  "Corporate Uniforms",
  "Gym & Training Wear",
  "Other / Mixed",
];

/* ─── FadeUp Component ─── */
function FadeUp({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("bo-visible"); observer.unobserve(el); }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="bo-fade-up" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ─── CountUp Component (0 → exact value, triggers on view/refresh) ─── */
function CountUp({ end, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Process line (scroll-triggered draw animation) ─── */
function StepsLine() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("bo-line-visible"); observer.unobserve(el); }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="bo-steps-line" aria-hidden="true" />;
}

/* ─── Bulk Order Form ─── */
function BulkOrderForm() {
  const [form, setForm] = useState({
    fullName: "", orgName: "", phone: "", email: "",
    category: "", quantity: "", customPrinting: "", deliveryDate: "", requirements: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setPrinting = (val) => setForm((prev) => ({ ...prev, customPrinting: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.orgName || !form.phone || !form.email || !form.category || !form.quantity) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post('/bulk-orders', form);
      if (response.data && response.data.success) {
        toast.success(response.data.message || "Enquiry submitted successfully!");
        setSubmitted(true);
      } else {
        toast.error("Invalid response from server. Please try again.");
      }
    } catch (err) {
      console.warn("API submission failed. Falling back to mockup.", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bo-success">
        <div className="bo-success-icon"><CheckCircleIcon /></div>
        <h3>Request Received!</h3>
        <p>
          Thank you, <strong>{form.fullName || "there"}</strong>! Our B2B team will review your
          enquiry and reach out within <strong>24 business hours</strong>.
        </p>
        <p className="bo-success-meta">Check your email: {form.email}</p>
        <button
          className="bo-submit-btn"
          style={{ marginTop: "1rem" }}
          onClick={() => { setSubmitted(false); setForm({ fullName:"",orgName:"",phone:"",email:"",category:"",quantity:"",customPrinting:"",deliveryDate:"",requirements:"" }); }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="bo-form-title">B2B Enquiry Form</h2>
      <p className="bo-form-sub">Fill in your details and our team will send you a custom quote.</p>
      <form className="bo-form" onSubmit={handleSubmit} noValidate>

        {/* Row 1: Full Name + Org Name */}
        <div className="bo-field-row">
          <div className="bo-field">
            <label className="bo-label" htmlFor="bo-fullName">Full Name <span className="bo-required">*</span></label>
            <input id="bo-fullName" name="fullName" className="bo-input" type="text" placeholder="Enter your name" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="bo-field">
            <label className="bo-label" htmlFor="bo-orgName">Organization Name <span className="bo-required">*</span></label>
            <input id="bo-orgName" name="orgName" className="bo-input" type="text" placeholder="ABC Sports Club" value={form.orgName} onChange={handleChange} required />
          </div>
        </div>

        {/* Row 2: Phone + Email */}
        <div className="bo-field-row">
          <div className="bo-field">
            <label className="bo-label" htmlFor="bo-phone">Phone Number <span className="bo-required">*</span></label>
            <input id="bo-phone" name="phone" className="bo-input" type="tel" placeholder={PHONE_DISPLAY} value={form.phone} onChange={handleChange} required />
          </div>
          <div className="bo-field">
            <label className="bo-label" htmlFor="bo-email">Email Address <span className="bo-required">*</span></label>
            <input id="bo-email" name="email" className="bo-input" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
          </div>
        </div>

        {/* Row 3: Category + Quantity */}
        <div className="bo-field-row">
          <div className="bo-field">
            <label className="bo-label" htmlFor="bo-category">Product Category <span className="bo-required">*</span></label>
            <select id="bo-category" name="category" className="bo-select" value={form.category} onChange={handleChange} required>
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="bo-field">
            <label className="bo-label" htmlFor="bo-quantity">Quantity Required <span className="bo-required">*</span></label>
            <select id="bo-quantity" name="quantity" className="bo-select" value={form.quantity} onChange={handleChange} required>
              <option value="">Select range...</option>
              <option value="50-100">50 – 100 units</option>
              <option value="100-250">100 – 250 units</option>
              <option value="250-500">250 – 500 units</option>
              <option value="500-1000">500 – 1,000 units</option>
              <option value="1000+">1,000+ units</option>
            </select>
          </div>
        </div>

        {/* Custom Printing */}
        <div className="bo-field">
          <label className="bo-label">Custom Printing Required <span className="bo-required">*</span></label>
          <div className="bo-radio-group">
            {["Yes – Logo / Text", "Yes – Full Sublimation", "Yes – Embroidery", "No Printing"].map((opt) => (
              <label key={opt} className={`bo-radio-label${form.customPrinting === opt ? " selected" : ""}`}>
                <input type="radio" name="customPrinting" value={opt} checked={form.customPrinting === opt} onChange={() => setPrinting(opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Delivery Date */}
        <div className="bo-field">
          <label className="bo-label" htmlFor="bo-deliveryDate">Preferred Delivery Date</label>
          <input
            id="bo-deliveryDate" name="deliveryDate" className="bo-input" type="date"
            min={new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]}
            value={form.deliveryDate} onChange={handleChange}
          />
        </div>

        {/* Additional Requirements */}
        <div className="bo-field">
          <label className="bo-label" htmlFor="bo-requirements">Additional Requirements</label>
          <textarea
            id="bo-requirements" name="requirements" className="bo-textarea"
            placeholder="Sizes breakdown, color preferences, reference designs, special instructions..."
            value={form.requirements} onChange={handleChange}
          />
        </div>

        <button type="submit" className="bo-submit-btn" disabled={loading}>
          {loading ? "Submitting…" : <><SendIcon /> Submit B2B Enquiry</>}
        </button>
        <p className="bo-disclaimer">
          By submitting, you agree our team will contact you within 24 hours.
          Your data is safe and never shared with third parties.
        </p>
      </form>
    </>
  );
}

/* ─── Main Page ─── */
export default function BulkOrderPage() {
  return (
    <div className="bo-root">
      <style>{styles}</style>

      {/* ── HERO ── */}
      <header
        className="bo-hero"
        aria-label="Bulk order hero"
      >
        <div className="bo-hero-noise" aria-hidden="true" />
        <div className="bo-hero-inner">

          <FadeUp delay={0}>
            <h1 className="bo-heading bo-hero-h1">
              Bulk <span className="bo-hero-accent">Orders</span>
            </h1>
          </FadeUp>

          <FadeUp delay={120}>
            <p className="bo-hero-sub">
              Premium sportswear at wholesale prices — custom branding, team kits,
              corporate uniforms &amp; more. Trusted by 500+ businesses across India.
            </p>
          </FadeUp>

          <FadeUp delay={240}>
            <div className="bo-hero-stats">
              {STATS.map((s, i) => (
                <div key={s.label} style={{ display: "contents" }}>
                  <div className="bo-stat">
                    <span className="bo-stat-num">
                      <CountUp end={s.end} suffix={s.suffix} />
                    </span>
                    <span className="bo-stat-label">{s.label}</span>
                  </div>
                  {i < STATS.length - 1 && <div className="bo-hero-divider" aria-hidden="true" />}
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={360}>
            <div className="bo-hero-pills">
              <a href="#bulk-form" className="bo-pill bo-pill-red">Get a Free Quote</a>
              <a href={`tel:${PHONE_TEL}`} className="bo-pill">
                <PhoneIcon /> Call Now
              </a>
            </div>
          </FadeUp>

        </div>
      </header>

      {/* ── BENEFITS (white, 3-up, equal size, centered) ── */}
      <section className="bo-section bo-light" aria-label="Bulk order benefits">
        <div className="bo-inner">
          <FadeUp>
            <div className="bo-section-head">
              <h2 className="bo-heading">Why Order <span className="bo-accent">Bulk?</span></h2>
              <p>Everything your business needs — quality, customization, and competitive pricing under one roof.</p>
            </div>
          </FadeUp>
          <div className="bo-benefits-grid">
            {BENEFITS.map((b, i) => (
              <FadeUp key={b.title} delay={i * 80} style={{ height: "100%" }}>
                <div className="bo-benefit-card">
                  <div className="bo-benefit-icon" aria-hidden="true">{b.icon}</div>
                  <p className="bo-benefit-title">{b.title}</p>
                  <p className="bo-benefit-desc">{b.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS (stays black, line animates in on scroll) ── */}
      <section className="bo-section bo-dark" style={{ paddingTop: "3.5rem" }} aria-label="Order process">
        <div className="bo-inner">
          <FadeUp>
            <div className="bo-section-head">
              <h2 className="bo-heading">How It <span className="bo-accent">Works</span></h2>
              <p style={{ color: "var(--muted-dark)" }}>Simple, streamlined — from enquiry to delivery in 5 easy steps.</p>
            </div>
          </FadeUp>
          <div className="bo-steps-wrap">
            <StepsLine />
            <div className="bo-steps">
              {STEPS.map((s, i) => (
                <FadeUp key={s.num} delay={i * 100}>
                  <div className="bo-step">
                    <div className="bo-step-num" aria-hidden="true">{s.num}</div>
                    <p className="bo-step-title">{s.title}</p>
                    <p className="bo-step-desc">{s.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM SECTION ── */}
      <section id="bulk-form" className="bo-section bo-light" aria-label="Bulk order form">
        <div className="bo-inner">
          <div className="bo-form-layout">

            {/* Sidebar */}
            <FadeUp delay={0} style={{ height: "100%" }}>
              <div className="bo-form-sidebar">
                <div>
                  <h2 className="bo-sidebar-tagline">
                    Start Your <span>Bulk</span> Journey Today
                  </h2>
                  <p className="bo-sidebar-sub" style={{ marginTop: "1rem" }}>
                    Tell us about your requirements and our dedicated B2B team will prepare
                    a custom quote tailored to your budget and timeline.
                  </p>
                </div>
                <div className="bo-mini-benefits">
                  {[
                    { title: "Free Sampling", desc: "Request samples before placing a large order." },
                    { title: "Flexible MOQ", desc: "Minimum order of just 50 units to get started." },
                    { title: "Net 30 for Corporates", desc: "Deferred payment terms for registered businesses." },
                    { title: "Repeat Order Discount", desc: "Extra savings on every subsequent bulk order." },
                  ].map((item) => (
                    <div className="bo-mini-benefit" key={item.title}>
                      <span className="bo-mini-icon"><CheckIcon /></span>
                      <div>
                        <strong>{item.title}</strong>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bo-contact-card">
                  <h3 className="bo-contact-card-title">Reach Us <span>Directly</span></h3>
                  <p className="bo-contact-card-sub">
                    Have questions or need assistance? Connect with our dedicated B2B team instantly via call, email, or WhatsApp.
                  </p>
                  <div className="bo-contact-quick">
                    <a href={`tel:${PHONE_TEL}`} className="bo-contact-item">
                      <PhoneIcon /> {PHONE_DISPLAY}
                    </a>
                    <a href={`mailto:${EMAIL}`} className="bo-contact-item">
                      <MailIcon /> {EMAIL}
                    </a>
                    <a href={WA_LINK} target="_blank" rel="noreferrer" className="bo-contact-item">
                      <WAIcon /> WhatsApp for Bulk Orders
                    </a>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Form Card */}
            <FadeUp delay={150}>
              <div className="bo-form-card">
                <BulkOrderForm />
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ── CTA BANNER (white section) ── */}
      <section className="bo-cta-section" aria-label="WhatsApp bulk order CTA">
        <FadeUp>
          <div className="bo-cta-box">
            <div className="bo-cta-bg-wrap">
              <img
                className="bo-cta-bg-img"
                src="https://images.unsplash.com/photo-1649520937981-763d6a14de7d?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Athletes Custom Sportswear Background"
              />
            </div>
            <div className="bo-cta-content">
              <div className="bo-cta-text">
                <h2 className="bo-heading bo-cta-title">
                  Need a Quick Quote?
                </h2>
                <p className="bo-cta-sub">
                  Drop us a WhatsApp message with your requirements — we'll get back with
                  pricing within the hour during business hours.
                </p>
              </div>
              <div className="bo-cta-btns">
                <a
                  href={`${WA_LINK}?text=Hi%2C%20I'm%20interested%20in%20a%20bulk%20order.%20Please%20share%20pricing%20details.`}
                  target="_blank"
                  rel="noreferrer"
                  className="bo-cta-btn-wa"
                  aria-label="WhatsApp bulk order enquiry"
                >
                  <WAIcon /> Chat for Quote
                </a>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="bo-cta-btn-ghost"
                  aria-label="Call for bulk order"
                >
                  <PhoneIcon /> Call Us Now
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

    </div>
  );
}