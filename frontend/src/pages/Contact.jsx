import { useState, useRef, useEffect, useMemo } from "react";

/* ─── Inline Styles ─── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

.ct-root {
  --bg: #0d0d0d;
  --surface: #1a1a1a;
  --red: #14a889;
  --teal-primary: #14a889;
  --teal-dark: #0a3d33;
  --teal-light: #72d4c6;
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

.ct-root * { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Hero ── */
.ct-hero {
  position: relative;
  padding: 7rem 1.5rem 6rem;
  overflow: hidden;
  background: linear-gradient(120deg, #06251f, #0a3d33, #051612);
  text-align: center;
}
.ct-hero-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    600px circle at var(--mx, 50%) var(--my, 30%),
    rgba(20,168,137,0.18),
    transparent 60%
  );
  transition: background 0.1s ease;
}
.ct-hero-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.ct-hero-dots {
  position: absolute;
  top: 48px; right: 6%;
  width: 110px; height: 110px;
  color: rgba(61,220,151,0.5);
  pointer-events: none;
  z-index: 0;
}
@media (max-width: 900px) { .ct-hero-dots { display: none; } }
.ct-hero-side-label {
  position: absolute;
  top: 50%; right: 3%;
  transform: translateY(-50%) rotate(90deg);
  transform-origin: right center;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.18);
  white-space: nowrap;
  pointer-events: none;
  z-index: 0;
}
@media (max-width: 1024px) { .ct-hero-side-label { display: none; } }
.ct-hero-inner {
  position: relative;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ct-heading {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 1.02;
}
.ct-hero-h1 {
  font-size: clamp(2.4rem, 6.2vw, 4.6rem);
  margin-bottom: 1.25rem;
}
.ct-hero-h1 span.ct-hero-line { display: block; }
.ct-hero-accent {
  background: linear-gradient(180deg, #72d4c6 0%, #14a889 35%, #0a3d33 70%, #051612 100%);
  background-size: 100% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(20,168,137,0.45);
  animation: ct-gradient-shift 5s ease infinite;
}
@keyframes ct-gradient-shift {
  0%,100% { background-position: 0% 0%; }
  50% { background-position: 0% 100%; }
}

.ct-hero-sub {
  max-width: 540px;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--muted-dark);
  margin-bottom: 2.5rem;
}

/* quick-contact pills */
.ct-hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.ct-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: var(--white);
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.ct-pill:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); transform: translateY(-2px); }
.ct-pill-red { background: var(--red); border-color: var(--red); color: var(--white); }
.ct-pill-red:hover { background: #18c19e; border-color: #18c19e; }

/* ── Sections ── */
.ct-section { padding: 5rem 1.5rem; position: relative; }
.ct-inner { max-width: 1120px; margin: 0 auto; }
.ct-dark { background: var(--bg); color: var(--white); }
.ct-light { background: var(--light); color: #111113; }

/* ── Section head ── */
.ct-section-head { text-align: center; max-width: 640px; margin: 0 auto 3.5rem; }
.ct-section-head h2 {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  font-size: clamp(2rem, 4.5vw, 3rem);
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}
.ct-section-head p { color: var(--muted-light); line-height: 1.6; font-size: 1.05rem; }
.ct-light .ct-section-head p { color: #555; }
.ct-accent { color: var(--red); }

/* ── Contact Info Cards (now on white section) ── */
.ct-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-auto-rows: 1fr;
  gap: 1.5rem;
}
.ct-info-card {
  height: 100%;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.07);
  border-radius: var(--radius);
  padding: 2.25rem 1.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  box-shadow: 0 2px 14px rgba(0,0,0,0.05);
  transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
  cursor: default;
}
.ct-info-card:hover {
  border-color: rgba(20,168,137,0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(20,168,137,0.12);
}
.ct-info-icon {
  width: 48px; height: 48px;
  border-radius: calc(var(--radius) - 4px);
  background: rgba(20,168,137,0.10);
  color: var(--red);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ct-info-label {
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: var(--red);
}
.ct-info-value {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111113;
  line-height: 1.4;
}
.ct-info-sub {
  font-size: 0.85rem;
  color: #6b6b70;
}
.ct-info-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--red);
  text-decoration: none;
  letter-spacing: 0.04em;
  margin-top: auto;
  padding-top: 0.25rem;
  transition: gap 0.2s;
}
.ct-info-link:hover { gap: 0.65rem; }

/* ── Main Content: Form + Map ── */
.ct-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: stretch;
}
@media (max-width: 900px) {
  .ct-content-grid { grid-template-columns: 1fr; }
}

/* ── Contact Form ── */
.ct-form-wrap {
  background: #ffffff;
  border-radius: calc(var(--radius) + 4px);
  padding: 2.5rem;
  box-shadow: 0 4px 40px rgba(0,0,0,0.08);
  border: 1.5px solid rgba(20,168,137,0.35);
  height: 100%;
}
.ct-form-title {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.5rem;
  color: #111;
  margin-bottom: 0.4rem;
}
.ct-form-sub { font-size: 0.9rem; color: #777; margin-bottom: 1.75rem; }
.ct-form { display: flex; flex-direction: column; gap: 1.1rem; }
.ct-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 520px) { .ct-field-row { grid-template-columns: 1fr; } }
.ct-field { display: flex; flex-direction: column; gap: 0.35rem; }
.ct-label { font-size: 0.8rem; font-weight: 600; color: #444; letter-spacing: 0.04em; text-transform: uppercase; }
.ct-input, .ct-textarea, .ct-select {
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e5e5;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  color: #111;
  background: #fafafa;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}
.ct-input:focus, .ct-textarea:focus, .ct-select:focus {
  border-color: #14a889;
  box-shadow: 0 0 0 3px rgba(20,168,137,0.12);
  background: #fff;
}
.ct-textarea { resize: vertical; min-height: 130px; }
.ct-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1rem; padding-right: 2.5rem; }
.ct-submit-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  padding: 0.9rem 2rem;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-size: 0.9rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  border: none; cursor: pointer;
  transition: transform 0.15s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(20,168,137,0.3);
  width: 100%;
}
.ct-submit-btn:hover { transform: translateY(-2px); background: #18c19e; box-shadow: 0 8px 24px rgba(20,168,137,0.35); }
.ct-submit-btn:active { transform: translateY(0); }
.ct-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.ct-success {
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  text-align: center; padding: 3rem 1rem;
}
.ct-success-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(20,168,137,0.1);
  display: flex; align-items: center; justify-content: center;
  color: var(--red);
}
.ct-success h3 { font-family: 'Oswald', sans-serif; font-size: 1.6rem; text-transform: uppercase; font-weight: 700; color: #111; }
.ct-success p { color: #777; font-size: 0.95rem; max-width: 280px; }

/* ── Map ── */
.ct-map-wrap { display: flex; flex-direction: column; gap: 1.5rem; height: 100%; }
.ct-map-frame {
  border-radius: calc(var(--radius) + 4px);
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 4px 40px rgba(0,0,0,0.08);
  aspect-ratio: 4/3;
  background: #e8e8e8;
  position: relative;
  flex-shrink: 0;
}
.ct-map-direction-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.7rem 1.4rem; border-radius: 999px;
  background: var(--red); border: 1.5px solid var(--red);
  color: #fff; font-size: 0.82rem; font-weight: 600;
  text-decoration: none; letter-spacing: 0.04em; text-transform: uppercase;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  width: fit-content;
  box-shadow: 0 4px 14px rgba(20,168,137,0.25);
}
.ct-map-direction-btn:hover { background: #18c19e; transform: translateY(-2px); }

/* ── Map info card (matches form height) ── */
.ct-map-info-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  background: #ffffff;
  border-radius: calc(var(--radius) + 4px);
  padding: 2.25rem 2rem;
  box-shadow: 0 4px 40px rgba(0,0,0,0.08);
  border: 1.5px solid rgba(20,168,137,0.35);
}
.ct-map-address { font-size: 1.1rem; font-weight: 700; color: #111; }
.ct-map-timing { font-size: 0.95rem; color: #666; }

/* ── Integrated Services (dark section) ── */
.ct-services-dark { background: var(--bg); color: var(--white); }
.ct-services-dark .ct-section-head p { color: var(--muted-dark); }
.ct-services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  grid-auto-rows: 1fr;
  gap: 1.5rem;
  justify-items: stretch;
}
.ct-service-card {
  height: 100%;
  border-radius: calc(var(--radius) + 2px);
  padding: 2.25rem 1.5rem;
  background: #1a1a1a;
  border: 1px solid rgba(255,255,255,0.08);
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.9rem;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.ct-service-card:hover {
  transform: translateY(-5px);
  border-color: rgba(20,168,137,0.4);
  box-shadow: 0 14px 34px rgba(20,168,137,0.14);
}
.ct-service-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, rgba(20,168,137,0.28), rgba(20,168,137,0.08));
  border: 1px solid rgba(20,168,137,0.3);
  color: var(--red);
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), background 0.25s;
}
.ct-service-card:hover .ct-service-icon {
  transform: rotate(-12deg) scale(1.1);
  background: radial-gradient(circle at 32% 28%, rgba(20,168,137,0.4), rgba(20,168,137,0.12));
}
.ct-service-title {
  font-family: 'Oswald', sans-serif; font-weight: 700;
  text-transform: uppercase; font-size: 1.05rem;
  color: var(--white); letter-spacing: 0.02em;
}
.ct-service-desc { font-size: 0.88rem; color: var(--muted-dark); line-height: 1.6; }
.ct-service-link {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.8rem; font-weight: 700;
  color: var(--red); text-decoration: none;
  letter-spacing: 0.04em; text-transform: uppercase;
  transition: gap 0.2s;
  margin-top: auto;
}
.ct-service-link:hover { gap: 0.7rem; }

/* ── WhatsApp Banner (white section) ── */
.ct-wa-section { background: #ffffff; padding: 30px 1.5rem 25px; }
.ct-wa-box {
  max-width: 1120px; margin: 0 auto;
  position: relative; border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #14a889 0%, #0a3d33 50%, #051612 100%);
  box-shadow: 0 16px 44px rgba(20, 168, 137, 0.22);
}
.ct-wa-bg-wrap {
  position: absolute; inset: 0;
  z-index: 0;
  overflow: hidden;
}
.ct-wa-bg-img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.3;
  transform: scale(1.1);
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.36, 1);
}
.ct-wa-box:hover .ct-wa-bg-img {
  transform: scale(1);
}
.ct-wa-content {
  position: relative;
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
  gap: 1.5rem; padding: 80px 40px;
  z-index: 2;
}
@media (min-width: 1024px) {
  .ct-wa-content {
    padding: 80px 60px;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
}
.ct-wa-text { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; text-align: center; }
.ct-wa-title {
  font-family: 'Oswald', sans-serif; font-weight: 700;
  text-transform: uppercase; font-size: clamp(1.8rem, 4vw, 3rem);
  color: var(--white); line-height: 1.05;
}
.ct-wa-sub { color: rgba(255,255,255,0.7); font-size: 1rem; max-width: 580px; line-height: 1.6; margin: 0 auto; }
.ct-wa-btn {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 14px 34px; border-radius: 6px;
  background: #ffffff; color: #0a3d33;
  font-size: 0.85rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  text-decoration: none; flex-shrink: 0;
  transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  font-family: 'Poppins', sans-serif;
}
.ct-wa-btn:hover { transform: translateY(-3px); background: #f8f9fa; color: #14a889; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); }
.ct-wa-call-btn {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 13px 32px; border-radius: 6px;
  border: 1.5px solid rgba(255,255,255,0.35); background: rgba(255,255,255,0.08);
  color: var(--white);
  font-size: 0.85rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  text-decoration: none; flex-shrink: 0;
  transition: background 0.2s, transform 0.15s, border-color 0.2s;
  font-family: 'Poppins', sans-serif;
}
.ct-wa-call-btn:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); border-color: #ffffff; }
.ct-wa-btns { display: flex; flex-wrap: nowrap; gap: 0.75rem; justify-content: center; margin-top: 1rem; }
@media (min-width: 1024px) { .ct-wa-btns { justify-content: center; } }

/* ── Fade-in animations ── */
.ct-fade-up {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
}
.ct-fade-up.ct-visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .ct-hero { padding: 5rem 1.25rem 4rem; }
  .ct-section { padding: 3.5rem 1.25rem; }
  .ct-form-wrap { padding: 1.75rem 1.25rem; }
  .ct-map-info-card { padding: 1.5rem 1.4rem; }
  .ct-wa-btn, .ct-wa-call-btn { padding: 0.75rem 1.2rem; font-size: 0.78rem; }
}
/* 700px – 1014px: 2×2 grid */
@media (min-width: 700px) and (max-width: 1014px) {
  .ct-info-grid { grid-template-columns: repeat(2, 1fr); }
  .ct-services-grid { grid-template-columns: repeat(2, 1fr); }
}
/* 1015px – 1100px: force 4 columns in one row */
@media (min-width: 1015px) and (max-width: 1100px) {
  .ct-info-grid { grid-template-columns: repeat(4, 1fr); }
  .ct-services-grid { grid-template-columns: repeat(4, 1fr); }
}
/* below 700px: single column */
@media (max-width: 699px) {
  .ct-info-grid { grid-template-columns: 1fr; }
  .ct-services-grid { grid-template-columns: 1fr; }
}
`;

/* ─── SVG Icons ─── */
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-.52a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const GoogleMapIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);
const FormIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const ClickCallIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-.52a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    <path d="M17 1l4 4-4 4M7 7l-4 4 4 4" strokeWidth="1.5"/>
  </svg>
);
const WAChatIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const DirectionIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);

/* ─── Data ─── */
const PHONE_DISPLAY = "+91 8755578878";
const PHONE_TEL = "+918755578878";
const WA_LINK = "https://wa.me/918755578878";
const EMAIL = "official@athenura.in";
const ADDRESS_LINE = "Sector 62, Noida";
const ADDRESS_SUB = "Uttar Pradesh, India";
const DIRECTIONS_LINK = "https://www.google.com/maps/dir/?api=1&destination=Sector+62,+Noida,+Uttar+Pradesh";
const MAP_VIEW_LINK = "https://www.google.com/maps?q=Sector+62,+Noida,+Uttar+Pradesh";

const INFO_CARDS = [
  {
    icon: <PhoneIcon />,
    label: "Business Phone",
    value: PHONE_DISPLAY,
    sub: "Mon – Sat, 9am – 6pm IST",
    link: `tel:${PHONE_TEL}`,
    linkText: "Call Now",
  },
  {
    icon: <WhatsAppIcon />,
    label: "WhatsApp",
    value: PHONE_DISPLAY,
    sub: "Chat with us instantly",
    link: WA_LINK,
    linkText: "Open Chat",
  },
  {
    icon: <MailIcon />,
    label: "Email Address",
    value: EMAIL,
    sub: "We reply within 24 hours",
    link: `mailto:${EMAIL}`,
    linkText: "Send Email",
  },
  {
    icon: <MapPinIcon />,
    label: "Business Address",
    value: ADDRESS_LINE,
    sub: ADDRESS_SUB,
    link: DIRECTIONS_LINK,
    linkText: "Get Directions",
  },
];

const SERVICES = [
  {
    icon: <GoogleMapIcon />,
    title: "Google Maps",
    desc: "Find our exact location with embedded Google Maps for easy navigation right from your phone.",
    link: MAP_VIEW_LINK,
    linkText: "Open Maps",
  },
  {
    icon: <FormIcon />,
    title: "Contact Form",
    desc: "Fill out our quick form and our team will get back to you within 24 business hours.",
    link: "#contact-form",
    linkText: "Fill Form",
  },
  {
    icon: <ClickCallIcon />,
    title: "Click-to-Call",
    desc: "Tap to call us instantly — no copy-paste needed. Direct line to our support team.",
    link: `tel:${PHONE_TEL}`,
    linkText: "Call Direct",
  },
  {
    icon: <WAChatIcon />,
    title: "WhatsApp Chat",
    desc: "Message us on WhatsApp for fast replies, order queries, bulk orders, and more.",
    link: WA_LINK,
    linkText: "Chat Now",
  },
];

/* ─── FadeUp wrapper component ─── */
function FadeUp({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("ct-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="ct-fade-up"
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

/* ─── Contact Form ─── */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="ct-form-wrap" id="contact-form">
      {submitted ? (
        <div className="ct-success">
          <div className="ct-success-icon"><CheckCircleIcon /></div>
          <h3>Message Sent!</h3>
          <p>Thanks for reaching out. Our team will get back to you within 24 hours.</p>
          <button
            className="ct-submit-btn"
            style={{ marginTop: "0.5rem" }}
            onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
          >
            Send Another
          </button>
        </div>
      ) : (
        <>
          <h2 className="ct-form-title">Send a Message</h2>
          <p className="ct-form-sub">Fill out the form and we'll get back to you shortly.</p>
          <form className="ct-form" onSubmit={handleSubmit} noValidate>
            <div className="ct-field-row">
              <div className="ct-field">
                <label className="ct-label" htmlFor="ct-name">Full Name *</label>
                <input id="ct-name" name="name" className="ct-input" type="text" placeholder="Enter your name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="ct-field">
                <label className="ct-label" htmlFor="ct-phone">Phone Number</label>
                <input id="ct-phone" name="phone" className="ct-input" type="tel" placeholder={PHONE_DISPLAY} value={form.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="ct-field">
              <label className="ct-label" htmlFor="ct-email">Email Address *</label>
              <input id="ct-email" name="email" className="ct-input" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="ct-field">
              <label className="ct-label" htmlFor="ct-subject">Subject</label>
              <select id="ct-subject" name="subject" className="ct-select" value={form.subject} onChange={handleChange}>
                <option value="">Select a topic...</option>
                <option value="order">Order Enquiry</option>
                <option value="bulk">Bulk / Wholesale Order</option>
                <option value="return">Return / Exchange</option>
                <option value="product">Product Information</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="ct-field">
              <label className="ct-label" htmlFor="ct-message">Message *</label>
              <textarea id="ct-message" name="message" className="ct-textarea" placeholder="Tell us how we can help you..." value={form.message} onChange={handleChange} required />
            </div>
            <button type="submit" className="ct-submit-btn" disabled={loading}>
              {loading ? (
                <>Sending…</>
              ) : (
                <><SendIcon /> Send Message</>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function ContactPage() {
  const heroRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 30 });

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const glowStyle = useMemo(
    () => ({ "--mx": `${glow.x}%`, "--my": `${glow.y}%` }),
    [glow]
  );

  return (
    <div className="ct-root">
      <style>{styles}</style>

      {/* ── Hero ── */}
      <header
        ref={heroRef}
        className="ct-hero"
        onMouseMove={handleMouseMove}
        aria-label="Contact hero"
      >
        <div className="ct-hero-glow" style={glowStyle} aria-hidden="true" />
        <div className="ct-hero-noise" aria-hidden="true" />
        <svg className="ct-hero-dots" viewBox="0 0 120 120" aria-hidden="true">
          {[0, 20, 40, 60, 80, 100, 120].map((x) => (
            <circle key={`h${x}`} cx={x} cy="0" r="2" fill="currentColor" />
          ))}
          {[0, 20, 40, 60, 80, 100, 120].map((y) => (
            <circle key={`v${y}`} cx="120" cy={y} r="2" fill="currentColor" />
          ))}
        </svg>
        <div className="ct-hero-side-label" aria-hidden="true">Reach Us</div>
        <div className="ct-hero-inner">
          <FadeUp delay={0}>
            <h1 className="ct-heading ct-hero-h1">
              <span className="ct-hero-line">Let's Start</span>
              <span className="ct-hero-line ct-hero-accent">A Conversation.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={120}>
            <p className="ct-hero-sub">
              Have a question, bulk order enquiry, or just want to say hello?
              We'd love to hear from you — our team is here to help.
            </p>
          </FadeUp>

          <FadeUp delay={240}>
            <div className="ct-hero-pills">
              <a href={`tel:${PHONE_TEL}`} className="ct-pill ct-pill-red">
                <PhoneIcon /> Call Now
              </a>
              <a href={WA_LINK} className="ct-pill" target="_blank" rel="noreferrer">
                <WhatsAppIcon /> WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`} className="ct-pill">
                <MailIcon /> Email Us
              </a>
            </div>
          </FadeUp>
        </div>
      </header>

      {/* ── Contact Info Cards (white background) ── */}
      <section className="ct-section ct-light" aria-label="Contact information">
        <div className="ct-inner">
          <FadeUp delay={0}>
            <div className="ct-section-head">
              <h2 className="ct-heading">Contact <span className="ct-accent">Information</span></h2>
              <p>Multiple ways to reach us — pick whichever works best for you.</p>
            </div>
          </FadeUp>
          <div className="ct-info-grid">
            {INFO_CARDS.map((card, i) => (
              <FadeUp key={card.label} delay={i * 100} style={{ height: "100%" }}>
                <div className="ct-info-card">
                  <div className="ct-info-icon" aria-hidden="true">{card.icon}</div>
                  <div>
                    <p className="ct-info-label">{card.label}</p>
                    <p className="ct-info-value">{card.value}</p>
                    <p className="ct-info-sub">{card.sub}</p>
                  </div>
                  <a href={card.link} className="ct-info-link" target={card.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {card.linkText} <ArrowRightIcon />
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="ct-section ct-light" aria-label="Contact form and map" style={{ paddingTop: "2rem" }}>
        <div className="ct-inner">
          <FadeUp delay={0}>
            <div className="ct-section-head" style={{ color: "#111" }}>
              <h2 className="ct-heading" style={{ color: "#111" }}>
                Reach <span className="ct-accent">Out</span>
              </h2>
              <p style={{ color: "#555" }}>Send us a message or find us on the map — we're easy to reach.</p>
            </div>
          </FadeUp>
          <div className="ct-content-grid">
            <FadeUp delay={100} style={{ height: "100%" }}>
              <ContactForm />
            </FadeUp>
            <FadeUp delay={250} style={{ height: "100%" }}>
              <div className="ct-map-wrap">
                <div className="ct-map-frame">
                  <iframe
                    title="Athenura Location"
                    src={`${MAP_VIEW_LINK}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="ct-map-info-card">
                  <p className="ct-map-address">Sector 62, Noida, Uttar Pradesh</p>
                  <p className="ct-map-timing">Open Mon – Sat &middot; 9:00 AM – 6:00 PM IST</p>
                  <a
                    href={DIRECTIONS_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="ct-map-direction-btn"
                  >
                    <DirectionIcon /> Get Directions
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Integrated Services (black background) ── */}
      <section className="ct-section ct-services-dark" aria-label="Integrated services" style={{ paddingTop: "4.5rem" }}>
        <div className="ct-inner">
          <FadeUp delay={0}>
            <div className="ct-section-head">
              <h2 className="ct-heading">
                Integrated <span className="ct-accent">Services</span>
              </h2>
              <p>Everything you need to connect with us — all in one place.</p>
            </div>
          </FadeUp>
          <div className="ct-services-grid">
            {SERVICES.map((s, i) => (
              <FadeUp key={s.title} delay={i * 100} style={{ height: "100%" }}>
                <div className="ct-service-card">
                  <div className="ct-service-icon" aria-hidden="true">{s.icon}</div>
                  <p className="ct-service-title">{s.title}</p>
                  <p className="ct-service-desc">{s.desc}</p>
                  <a href={s.link} className="ct-service-link" target={s.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {s.linkText} <ArrowRightIcon />
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA Banner (white background) ── */}
      <section className="ct-wa-section" aria-label="WhatsApp chat">
        <FadeUp delay={0}>
          <div className="ct-wa-box">
            <div className="ct-wa-bg-wrap">
              <img
                className="ct-wa-bg-img"
                src="https://images.unsplash.com/photo-1649520937981-763d6a14de7d?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Athletes Custom Sportswear Background"
              />
            </div>
            <div className="ct-wa-content">
              <div className="ct-wa-text">
                <h2 className="ct-heading ct-wa-title">
                  Chat On WhatsApp
                </h2>
                <p className="ct-wa-sub">
                  Get instant replies for order tracking, bulk enquiries,
                  sizing help, and more — right in your WhatsApp.
                </p>
              </div>
              <div className="ct-wa-btns">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="ct-wa-btn"
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsAppIcon /> Start Chat
                </a>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="ct-wa-call-btn"
                  aria-label="Call us"
                >
                  <PhoneIcon /> Call Us
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}