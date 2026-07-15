import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Flame,
  Target,
  Heart,
  Zap,
  ShieldCheck,
  Quote,
  ArrowRight,
  MapPin,
  Mail,
  Home as HomeIcon,
  Rocket,
  Globe2,
  FlaskConical,
  Flag,
  Check,
  ChevronRight,
} from "lucide-react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

.au-root {
  --bg: #0d0d0d;
  --surface: #1a1a1a;
  --red: #ff3b30;
  --light: #f4f4f5;
  --white: #ffffff;
  --muted-dark: #9b9b9f;
  --muted-light: #6b6b70;
  --radius: 1rem;
  --teal-primary: #14a889;
  --teal-dark: #0a3d33;
  --teal-light: #72d4c6;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--white);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
}

.au-root * { box-sizing: border-box; }

.au-heading {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  line-height: 1.02;
  margin: 0;
}

.au-eyebrow {
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.8rem;
  color: var(--teal-primary);
  margin: 0 0 1rem;
}

.au-eyebrow-blink {
  animation: au-blink 1s step-start infinite;
}

@keyframes au-blink {
  0%, 100% { color: var(--teal-primary); }
  50%       { color: #000000; }
}

.au-section { padding: 5rem 1.5rem; position: relative; }
.au-inner { max-width: 1120px; margin: 0 auto; }

.au-dark { background: var(--bg); color: var(--white); }
.au-light { background: var(--light); color: #111113; }

.au-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.au-pill-red { background: var(--red); color: var(--white); }
.au-pill-surface { background: var(--surface); color: var(--white); border: 1px solid #2a2a2a; }
.au-pill-outline { background: transparent; color: var(--teal-primary); border: 1px solid var(--teal-primary); }
.au-pill-teal-outline { background: transparent; color: var(--teal-primary); border: 1px solid var(--teal-primary); }

.au-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.85rem 1.6rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.2s ease, opacity 0.2s ease;
}
.au-btn:hover { transform: translateY(-2px); }
.au-btn-red { background: var(--red); color: var(--white); }
.au-btn-red:hover { background: #ff5249; }
.au-btn-ghost { background: rgba(255,255,255,0.08); color: var(--white); border: 1px solid rgba(255,255,255,0.2); }
.au-btn-ghost:hover { background: rgba(255,255,255,0.16); }

.au-hero {
  position: relative;
  width: 100%;
  height: calc(100vh - 76px);
  min-height: calc(100vh - 76px);
  padding: 0 1.5rem;
  overflow: hidden;
  background: linear-gradient(120deg, #06251f, #0a3d33, #051612);
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.au-hero-container {
  position: relative;
  z-index: 2;
  max-width: 1320px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  overflow: visible;
}

.au-hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.au-hero-heading {
  font-size: clamp(2.4rem, 7vw, 5rem);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0;
  color: var(--white);
}

.au-hero-heading-row {
  display: inline;
  white-space: normal;
}

.au-hero-heading-line-2 {
  background: linear-gradient(135deg, #14a889 0%, #72d4c6 50%, #14a889 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: au-gradient-glow 3s ease infinite;
  text-shadow: 0 0 20px rgba(20, 168, 137, 0.5);
}

@keyframes au-gradient-glow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.au-hero-desc {
  color: rgba(255, 255, 255, 0.75);
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  line-height: 1.7;
  margin: 0;
  max-width: 520px;
}

.au-hero-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2rem;
  border-radius: 999px;
  background: #11846d;
  color: var(--white);
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  width: fit-content;
  box-shadow: 0 10px 30px rgba(17, 132, 109, 0.35);
  overflow: hidden;
  isolation: isolate;
}

.au-hero-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.45), transparent);
  transform: skewX(-20deg);
  z-index: -1;
  transition: left 0.6s ease;
}

.au-hero-cta:hover {
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 15px 40px rgba(17, 132, 109, 0.5);
  background: #14a889;
}

.au-hero-cta:hover::before {
  left: 125%;
}

.au-hero-cta:active {
  transform: translateY(-1px) scale(0.98);
}

.au-hero-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.au-hero-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.au-hero-feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--teal-primary);
  color: var(--teal-primary);
  background: rgba(20, 168, 137, 0.1);
  box-shadow: 0 0 20px rgba(20, 168, 137, 0.25);
  transition: all 0.3s ease;
}

.au-hero-feature:hover .au-hero-feature-icon {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(20, 168, 137, 0.4);
}

.au-hero-feature-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--teal-primary);
}

.au-hero-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: visible;
}

.au-hero-image-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.au-hero-parallelogram {
  position: absolute;
  top: 0;
  right: -5%;
  width: 95%;
  height: 100%;
  background: rgba(20, 168, 137, 0.16);
  border-radius: 32px;
  clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
  z-index: 1;
}

.au-hero-image-wrapper {
  position: relative;
  z-index: 2;
  max-width: 420px;
  width: 100%;
}

.au-hero-image {
  width: auto;
  height: 100%;
  max-width: 100%;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5));
  z-index: 3;
  transform: scale(1.15);
}

.au-hero-ghost-text {
  position: absolute;
  top: 45%;
  right: -6%;
  transform: translateY(-50%);
  font-family: 'Oswald', sans-serif;
  font-size: clamp(2rem, 6.5vw, 4.5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  text-align: right;
  line-height: 1.08;
  pointer-events: none;
  z-index: 1;
  white-space: normal;
  width: 50%;
}

@media (min-width: 961px) and (max-width: 1150px) {
  .au-hero-ghost-text {
    right: 2%;
    font-size: clamp(1.4rem, 4vw, 2.4rem);
    width: 42%;
  }
}

.au-ghost-letter {
  display: inline-block;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(114, 212, 198, 0.35);
  text-stroke: 1.5px rgba(114, 212, 198, 0.35);
  transition: color 0.6s ease, -webkit-text-stroke 0.6s ease, text-shadow 0.6s ease;
}

.au-ghost-letter-filled {
  color: rgba(114, 212, 198, 0.45);
  -webkit-text-stroke: 1.5px rgba(114, 212, 198, 0.7);
  text-stroke: 1.5px rgba(114, 212, 198, 0.7);
  text-shadow: 0 0 18px rgba(20, 168, 137, 0.5);
}

@media (prefers-reduced-motion: reduce) {
  .au-ghost-letter {
    transition: none;
  }
}

.au-hero-glow-effect {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 120px;
  background: radial-gradient(ellipse at center, rgba(20, 168, 137, 0.4), transparent 70%);
  filter: blur(40px);
  z-index: 1;
}

.au-hero-fog-layer {
  position: absolute;
  left: -25%;
  right: -25%;
  bottom: -8%;
  height: 70%;
  z-index: 3;
  pointer-events: none;
  mix-blend-mode: screen;
}

.au-hero-fog-layer-1 {
  background:
    radial-gradient(ellipse 45% 60% at 15% 85%, rgba(220,235,232,0.30), transparent 70%),
    radial-gradient(ellipse 55% 50% at 45% 70%, rgba(220,235,232,0.22), transparent 70%),
    radial-gradient(ellipse 40% 55% at 75% 90%, rgba(220,235,232,0.26), transparent 70%),
    radial-gradient(ellipse 50% 45% at 95% 65%, rgba(220,235,232,0.20), transparent 70%);
  filter: blur(22px);
  opacity: 0.9;
  animation: au-fog-drift-1 16s ease-in-out infinite;
}

.au-hero-fog-layer-2 {
  background:
    radial-gradient(ellipse 35% 50% at 30% 95%, rgba(200,225,220,0.24), transparent 70%),
    radial-gradient(ellipse 45% 40% at 60% 80%, rgba(200,225,220,0.18), transparent 70%),
    radial-gradient(ellipse 30% 45% at 85% 100%, rgba(200,225,220,0.22), transparent 70%);
  filter: blur(16px);
  opacity: 0.75;
  animation: au-fog-drift-2 22s ease-in-out infinite;
  animation-delay: -8s;
}

.au-hero-fog-layer-3 {
  background:
    radial-gradient(ellipse 60% 35% at 50% 100%, rgba(180,210,205,0.20), transparent 75%),
    radial-gradient(ellipse 40% 30% at 10% 90%, rgba(180,210,205,0.16), transparent 75%),
    radial-gradient(ellipse 40% 30% at 90% 90%, rgba(180,210,205,0.16), transparent 75%);
  filter: blur(28px);
  opacity: 0.7;
  animation: au-fog-drift-3 26s ease-in-out infinite;
  animation-delay: -14s;
}

@keyframes au-fog-drift-1 {
  0%   { transform: translateX(-5%) translateY(0%) scale(1); }
  50%  { transform: translateX(5%) translateY(-4%) scale(1.1); }
  100% { transform: translateX(-5%) translateY(0%) scale(1); }
}

@keyframes au-fog-drift-2 {
  0%   { transform: translateX(6%) translateY(2%) scale(1.05); }
  50%  { transform: translateX(-6%) translateY(-3%) scale(0.98); }
  100% { transform: translateX(6%) translateY(2%) scale(1.05); }
}

@keyframes au-fog-drift-3 {
  0%   { transform: translateX(-3%) translateY(1%) scale(1); }
  50%  { transform: translateX(4%) translateY(-2%) scale(1.06); }
  100% { transform: translateX(-3%) translateY(1%) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .au-hero-fog-layer-1,
  .au-hero-fog-layer-2,
  .au-hero-fog-layer-3 {
    animation: none;
  }
}

.au-hero-accent-bars {
  position: absolute;
  bottom: 20px;
  right: 40px;
  display: flex;
  gap: 8px;
  z-index: 2;
}

.au-hero-accent-bar {
  width: 4px;
  height: 40px;
  background: var(--teal-primary);
  transform: skewY(-15deg);
  opacity: 0.6;
  animation: au-bar-pulse 1.5s ease-in-out infinite;
}

.au-hero-accent-bar:nth-child(2) {
  animation-delay: 0.2s;
}

.au-hero-accent-bar:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes au-bar-pulse {
  0%, 100% { opacity: 0.3; transform: skewY(-15deg) scaleY(1); }
  50% { opacity: 0.8; transform: skewY(-15deg) scaleY(1.2); }
}

.au-hero-dot-grid {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 150px;
  height: 150px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 13px;
  z-index: 1;
}

.au-hero-dot {
  width: 3px;
  height: 3px;
  background: var(--teal-primary);
  border-radius: 50%;
  opacity: 0.3;
  transition: opacity 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
}

.au-hero-dot-lit {
  opacity: 1;
  background: var(--teal-light);
  box-shadow:
    0 0 10px rgba(20, 168, 137, 1),
    0 0 22px rgba(20, 168, 137, 0.85),
    0 0 40px rgba(114, 212, 198, 0.6),
    0 0 60px rgba(114, 212, 198, 0.35);
  animation: au-dot-blink-in 0.5s ease, au-dot-pulse-glow 1.8s ease-in-out 0.5s infinite;
}

@keyframes au-dot-blink-in {
  0%   { opacity: 0; transform: scale(0.3); box-shadow: 0 0 0 rgba(20, 168, 137, 0); }
  40%  { opacity: 1; transform: scale(2.3); }
  100% { opacity: 1; transform: scale(1.9); }
}

@keyframes au-dot-pulse-glow {
  0%, 100% {
    transform: scale(1.9);
    box-shadow:
      0 0 10px rgba(20, 168, 137, 1),
      0 0 22px rgba(20, 168, 137, 0.85),
      0 0 40px rgba(114, 212, 198, 0.6),
      0 0 60px rgba(114, 212, 198, 0.35);
  }
  50% {
    transform: scale(2.2);
    box-shadow:
      0 0 16px rgba(20, 168, 137, 1),
      0 0 32px rgba(20, 168, 137, 1),
      0 0 55px rgba(114, 212, 198, 0.8),
      0 0 80px rgba(114, 212, 198, 0.5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .au-hero-dot-lit {
    animation: none;
  }
}

@media (max-height: 700px) and (min-width: 961px) {
  .au-hero {
    height: auto;
    min-height: auto;
    padding: 3rem 1.5rem 2.5rem;
  }

  .au-hero-image-container {
    min-height: 320px;
  }

  .au-hero-heading {
    font-size: clamp(1.8rem, 4.5vw, 2.6rem);
  }
}

@media (max-width: 960px) {
  .au-hero {
    height: auto;
    min-height: 100vh;
    padding: 2rem 1.5rem;
  }

  .au-hero-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    height: auto;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .au-hero-content {
    align-items: center;
    text-align: center;
  }

  .au-hero-desc {
    max-width: 600px;
  }

  .au-hero-image-container {
    min-height: 350px;
    max-height: 500px;
    order: -1;
  }

  .au-hero-features {
    justify-content: center;
  }

  .au-hero-ghost-text {
    top: auto;
    bottom: 32%;
    right: 2%;
    transform: none;
    font-size: clamp(2.6rem, 7vw, 4rem);
  }
}

@media (max-width: 768px) {
  .au-hero {
    padding: 1.5rem 1.25rem;
    min-height: calc(100svh - 76px);
  }

  .au-hero-heading {
    font-size: clamp(2.4rem, 8vw, 3.5rem);
  }

  .au-hero-desc {
    font-size: clamp(0.9rem, 3vw, 1rem);
  }

  .au-hero-cta {
    font-size: 0.9rem;
    padding: 0.85rem 1.8rem;
  }

  .au-hero-image-container {
    min-height: 280px;
  }

  .au-hero-ghost-text {
    display: none;
  }

  .au-hero-parallelogram {
    width: 90%;
    right: 0;
    clip-path: polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%);
  }

  .au-hero-accent-bars {
    bottom: 10px;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .au-hero {
    padding: 1.25rem 1rem;
  }

  .au-hero-container {
    gap: 2rem;
  }

  .au-hero-heading {
    font-size: clamp(2rem, 10vw, 2.8rem);
  }

  .au-hero-desc {
    font-size: 0.92rem;
  }

  .au-hero-cta {
    padding: 0.8rem 1.5rem;
  }

  .au-hero-features {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .au-hero-feature-icon {
    width: 60px;
    height: 60px;
  }

  .au-hero-image-container {
    min-height: 250px;
  }

  .au-hero-accent-bars {
    display: none;
  }

  .au-hero-dot-grid {
    display: none;
  }
}

.au-story { display: grid; grid-template-columns: 1.1fr 1fr; gap: 3rem; align-items: center; }
.au-story-media-frame {
  padding: 1.1rem;
  border-radius: calc(var(--radius) + 0.75rem);
  background: linear-gradient(120deg, #072a23, #14a889, #72d4c6, #0a3d33, #14a889, #072a23);
  background-size: 300% 300%;
  animation: au-story-frame-glow 12s ease infinite;
  box-shadow:
    8px 8px 18px rgba(6, 37, 31, 0.45),
    -8px -8px 18px rgba(114, 212, 198, 0.5),
    inset 1px 1px 3px rgba(180, 240, 230, 0.5),
    inset -1px -1px 3px rgba(0, 0, 0, 0.25);
}

@keyframes au-story-frame-glow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .au-story-media-frame {
    animation: none;
  }
}

.au-story-media {
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--surface);
  border: 1px solid #2a2a2a;
  box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.4), 0 15px 25px rgba(0, 0, 0, 0.15);
}

@keyframes au-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-16px); }
}
.au-story-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.au-story h2 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 1.25rem; }
.au-story p { color: var(--muted-dark); line-height: 1.7; margin: 0 0 1rem; font-size: 1.02rem; }

.au-section-head { text-align: center; max-width: 640px; margin: 0 auto 3rem; }

.au-gradient-text {
  background: linear-gradient(120deg, #14a889, #0a3d33, #72d4c6, #14a889);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: au-gradient 6s ease infinite;
}

.au-gradient-text-move {
  background: linear-gradient(90deg, #14a889, #72d4c6, #0a3d33, #14a889, #72d4c6);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: au-gradient-move 3s linear infinite;
}

.au-team-gradient {
  background: linear-gradient(120deg, #14a889, #72d4c6, #0a3d33, #14a889, #72d4c6);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: au-team-glow 4s ease-in-out infinite;
  display: inline-block;
}

@keyframes au-team-glow {
  0% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 20px rgba(20, 168, 137, 0.3));
  }
  25% {
    filter: drop-shadow(0 0 40px rgba(20, 168, 137, 0.6));
  }
  50% {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 20px rgba(20, 168, 137, 0.3));
  }
  75% {
    filter: drop-shadow(0 0 40px rgba(20, 168, 137, 0.6));
  }
  100% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 20px rgba(20, 168, 137, 0.3));
  }
}

@keyframes au-gradient-move {
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
.au-section-head h2 { font-size: clamp(2rem, 4.5vw, 3.2rem); margin-bottom: 1rem; }
.au-section-head p { color: var(--muted-light); line-height: 1.6; font-size: 1.05rem; margin: 0; }
.au-light .au-section-head p { color: var(--muted-light); }

.au-grid { 
  display: grid; 
  gap: 2.5rem; 
  justify-content: center;
}
.au-grid-4 { 
  grid-template-columns: repeat(4, 1fr); 
  max-width: 100%;
  gap: 3.5rem;
}
.au-grid-3 { grid-template-columns: repeat(3, 1fr); }
.au-grid-2 { grid-template-columns: repeat(2, 1fr); }

.au-card {
  background: #262626;
  border-radius: var(--radius);
  padding: 0;
  box-shadow: 7px 5px 10px rgba(0, 0, 0, 0.333);
  border: none;
  overflow: hidden;
  width: 100%;
  max-width: 350px;
  height: 100%;
  min-height: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.au-card-header {
  height: 85px;
  flex-shrink: 0;
  background: linear-gradient(120deg, #0a3d33, #14a889, #072a23, #14a889, #0a3d33);
  background-size: 300% 300%;
  animation: au-card-header-glow 6s ease-in-out infinite;
  display: flex;
  align-items: flex-start;
  padding: 14px;
  gap: 12px;
  transition: background 0.3s ease;
}

@keyframes au-card-header-glow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.au-card-icon {
  width: 58px;
  height: 58px;
  border-radius: 12px;
  background: #414141;
  color: var(--teal-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.au-card-icon svg { color: #72d4c6; }
.au-card-meta { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
.au-card-name-bar {
  background: transparent;
  width: auto;
  height: auto;
  border-radius: 0;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.95rem;
  color: #ffffff;
}
.au-card-id-bar {
  background: transparent;
  width: auto;
  height: auto;
  border-radius: 0;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.au-card-body {
  background: linear-gradient(120deg, #2a2a2a, #414141, #1c1c1c, #414141, #2a2a2a);
  background-size: 300% 300%;
  animation: au-card-body-glow 7s ease-in-out infinite;
  margin: 8px 6px;
  flex: 1;
  border-radius: 5px;
  transition: background 0.3s ease;
  padding: 16px;
}

@keyframes au-card-body-glow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.au-card-body p {
  margin: 0;
  color: rgba(255,255,255,0.75);
  font-size: 0.9rem;
  line-height: 1.6;
  display: block;
}

.au-card {
  cursor: default;
  transition: box-shadow 0.3s ease;
}

.au-card:hover .au-card-header {
  background: #262626;
  animation: none;
  transition: background 1s ease;
}

.au-card:hover .au-card-body {
  background: #14a889;
  animation: none;
}

.au-card:hover .au-card-body p {
  color: #ffffff;
}

.au-card > h3 { display: none; }
.au-card > p { display: none; }
.au-card-social {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 10px 0 0;
  border-top: 2px solid #414141;
  margin: 0 5px;
}
.au-card-social a svg {
  width: 20px;
  fill: #ff5858;
}

.au-stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
.au-stat {
  background: var(--surface);
  border: 1px solid #2a2a2a;
  border-radius: var(--radius);
  padding: 2rem 1.5rem;
  text-align: center;
}
.au-stat-num {
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: var(--teal-primary);
  line-height: 1;
}
.au-stat-label {
  margin-top: 0.6rem;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-dark);
  font-weight: 600;
}

.au-eyebrow-shine {
  background: linear-gradient(90deg, #72d4c6, #b8ede4, #14a889, #b8ede4, #72d4c6);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: au-shine 3s linear infinite;
}

@keyframes au-shine {
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.au-tl-section {
  --tl-line: #d1d5db;
  --tl-active: #14a889;
  --tl-node-bg: rgba(20, 168, 137, 0.08);
  --tl-node-border: #14a889;
  --tl-year: #14a889;
  --tl-title: #111827;
  --tl-desc: #6b7280;
  background: #ffffff;
}

.au-tl-path-glow {
  filter: drop-shadow(0 0 20px rgba(20, 168, 137, 0.25));
}

@keyframes au-pulseNode {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(20, 168, 137, 0.35);
  }
  50% {
    transform: scale(1.12);
    box-shadow: 0 0 0 10px rgba(20, 168, 137, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(20, 168, 137, 0);
  }
}

.au-tl-node-pulse {
  animation: au-pulseNode 1.8s ease-in-out infinite;
}

.au-tl-node-complete {
  background: linear-gradient(120deg, #072a23, #14a889, #0a3d33, #14a889, #072a23) !important;
  background-size: 300% 300% !important;
  animation: au-tl-node-glow 5s ease-in-out infinite !important;
  border-color: var(--tl-active) !important;
  color: #ffffff !important;
}

@keyframes au-tl-node-glow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.au-tl-node-pending {
  background: #f3f4f6;
  border-color: var(--tl-line);
  color: #9ca3af;
}

.au-tl-node-active-glow {
  background: linear-gradient(120deg, rgba(20,168,137,0.15), rgba(10,61,51,0.25), rgba(20,168,137,0.15)) !important;
  background-size: 300% 300% !important;
  animation: au-tl-node-pulse 1.8s ease-in-out infinite, au-tl-active-glow 3s ease-in-out infinite !important;
  border-color: #14a889 !important;
  color: #14a889 !important;
}

@keyframes au-tl-active-glow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.au-tl-rail-mobile {
  background: var(--tl-line);
}

@media (prefers-reduced-motion: reduce) {
  .au-tl-node-pulse {
    animation: none;
  }
}

.au-team-card {
  background: linear-gradient(120deg, #1a1a1a, #2a2a2a, #0d0d0d, #2a2a2a, #1a1a1a);
  background-size: 300% 300%;
  animation: au-team-card-glow-dark 7s ease-in-out infinite;
  border: 1px solid #2a2a2a;
  border-radius: var(--radius);
  padding: 2rem 1.5rem;
  text-align: center;
  transition: border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
  cursor: pointer;
}

@keyframes au-team-card-glow-dark {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.au-team-card:hover {
  background: linear-gradient(120deg, #072a23, #14a889, #0a3d33, #14a889, #072a23);
  background-size: 300% 300%;
  animation: au-team-card-glow-red 5s ease-in-out infinite;
  border-color: #14a889;
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(20, 168, 137, 0.3);
}

@keyframes au-team-card-glow-red {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.au-team-card:hover .au-avatar {
  border-color: #ffffff;
  transform: scale(1.1);
}

.au-team-card:hover h3 {
  color: #ffffff;
}

.au-team-card:hover .au-team-role {
  color: #ffffff;
  opacity: 0.9;
}

.au-team-card:hover p {
  color: rgba(255, 255, 255, 0.85);
}
.au-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  margin: 0 auto 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--white);
  background: #232323;
  border: 3px solid var(--teal-primary);
  overflow: hidden;
}
.au-team-card h3 {
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 1.1rem;
  margin: 0 0 0.3rem;
}
.au-team-role { color: var(--teal-primary); font-size: 0.82rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin: 0 0 0.75rem; }
.au-team-card p { color: var(--muted-dark); font-size: 0.9rem; line-height: 1.55; margin: 0; }

.au-quote-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 2rem 1.8rem;
  box-shadow: 0 10px 30px rgba(17, 17, 19, 0.07);
  border: 1px solid #ececef;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.au-quote-icon { color: var(--red); }
.au-quote-card blockquote { margin: 0; font-size: 1.05rem; line-height: 1.65; color: #1c1c1f; }
.au-quote-foot { display: flex; align-items: center; gap: 0.85rem; margin-top: auto; }
.au-quote-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--red); color: var(--white);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 0.95rem;
}
.au-quote-name { font-weight: 600; color: #111113; font-size: 0.95rem; }
.au-quote-meta { color: var(--muted-light); font-size: 0.82rem; }
.au-stars { display: flex; gap: 2px; color: var(--red); }

#cta {
  padding: 30px 1.5rem 25px;
}

.au-cta-box {
  border-radius: 20px;
  padding: 80px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #14a889 0%, #0a3d33 50%, #051612 100%);
  box-shadow: 0 16px 44px rgba(20, 168, 137, 0.22);
}
.au-cta-bg-wrap {
  position: absolute; inset: 0;
  z-index: 0;
  overflow: hidden;
}
.au-cta-bg-img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.3;
  transform: scale(1.1);
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.36, 1);
}
.au-cta-box:hover .au-cta-bg-img {
  transform: scale(1);
}
.au-cta-box h2 { font-size: clamp(2rem, 4.5vw, 3.2rem); color: var(--white); margin-bottom: 1.5rem; font-family: 'Montserrat', sans-serif; font-weight: 900; text-transform: uppercase; }
.au-cta-box p { color: rgba(255,255,255,0.9); max-width: 580px; margin: 0 auto 2.5rem; line-height: 1.75; font-size: 1.05rem; }
.au-cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.au-btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #0a3d33;
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
.au-btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  background: #f8f9fa;
  color: #14a889;
}

@media (max-width: 1024px) {
  .au-grid-4 { 
    grid-template-columns: repeat(2, 1fr); 
  }
}

@media (max-width: 768px) {
  .au-section { padding: 3.5rem 1.25rem; }
  .au-story { grid-template-columns: 1fr; gap: 2rem; }
  .au-story > div:last-child { text-align: center; }
  .au-grid-4, .au-grid-3 { 
    grid-template-columns: repeat(2, 1fr); 
  }
  .au-grid-2 { grid-template-columns: 1fr; }
  .au-stats-strip { grid-template-columns: repeat(2, 1fr); }
  .au-card {
    max-width: 100%;
    min-height: auto;
  }
}

@media (max-width: 480px) {
  .au-grid-4, .au-grid-3 { 
    grid-template-columns: 1fr; 
  }
  .au-card {
    max-width: 320px;
    margin: 0 auto;
  }
}
`;

const VALUES = [
  { icon: Flame, title: "Relentless Performance", text: "Every product is crafted to help you train harder, move faster, and perform better. We design gear that keeps up with your ambition." },
  { icon: Target, title: "Engineered for Athletes", text: "From advanced fabrics to precision fits, our sportswear is built using athlete feedback and real-world testing to maximize comfort and performance." },
  { icon: Heart, title: "Stronger Together", text: "We believe sport connects people. Whether you're a beginner or a champion, we're here to support a community that inspires, motivates, and grows together." },
  { icon: ShieldCheck, title: "Quality with Purpose", text: "We combine durable craftsmanship, innovative materials, and responsible production practices to create sportswear that lasts through every challenge." },
];

const STATS = [
  { num: "10+", label: "Years Strong", target: 10 },
  { num: "2M+", label: "Customers", target: 2, suffix: "M+" },
  { num: "30+", label: "Countries", target: 30 },
  { num: "500+", label: "Products", target: 500 },
];

const TIMELINE_JOURNEY = [
  {
    year: "2014",
    title: "THE FIRST STITCH",
    description: "Our journey began with a simple vision: create sportswear that delivers comfort, durability, and performance for every athlete.",
    icon: HomeIcon,
    side: "left",
  },
  {
    year: "2017",
    title: "GAINING MOMENTUM",
    description: "Expanded our product range and earned the trust of thousands of fitness enthusiasts, runners, and sports lovers across the country.",
    icon: Rocket,
    side: "right",
  },
  {
    year: "2020",
    title: "PERFORMANCE EVOLUTION",
    description: "Introduced advanced fabric technologies focused on breathability, flexibility, and all-day comfort for training and competition.",
    icon: Globe2,
    side: "left",
  },
  {
    year: "2023",
    title: "INNOVATION IN MOTION",
    description: "Launched new performance collections and strengthened our commitment to sustainable materials and athlete-driven design.",
    icon: FlaskConical,
    side: "right",
  },
  {
    year: "2026",
    title: "THE FUTURE OF SPORT",
    description: "Continuing to push boundaries with premium sportswear, innovative technology, and a growing community united by movement and ambition.",
    icon: Flag,
    side: "left",
  },
];

const TEAM = [
  { name: "Anirudh Rautela", role: "Founder & CEO", initials: "MR", bio: "Driven by a passion for fitness and innovation, Anirudh founded the brand with a vision to create sportswear that empowers athletes to perform at their best.", image: "/team/anirudh.jpg" },
  { name: "Arya Roy", role: "Head of Design", initials: "AR", bio: "Combines performance, comfort, and modern aesthetics to create apparel that looks as good as it feels during every workout.", image: "/team/arya.jpg" },
  { name: "Ramam Rajya", role: "VP, Product", initials: "RR", bio: "Leads product innovation, ensuring every collection meets the highest standards of quality, durability, and athletic performance.", image: "/team/ramam.jpg" },
  { name: "Leena Rishi", role: "Community Lead", initials: "LR", bio: "Fosters a strong community of athletes, fitness enthusiasts, and creators who inspire each other to push beyond their limits.", image: "/team/leena.jpg" },
];

const FEATURES = [
  { icon: ShieldCheck, label: "Premium Quality" },
  { icon: Zap, label: "Performance Driven" },
  { icon: Heart, label: "Built for Champions" },
  { icon: Target, label: "Beyond Limits" },
];

function AnimatedCounter({ target, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function TimelinePath({ fromSide = "left", active, onComplete, height = 120 }) {
  const width = 400;
  const isLeft = fromSide === "left";

  const d = isLeft
    ? `M ${width / 2} 0 C ${width / 2} ${height * 0.35}, ${width * 0.85} ${height * 0.4}, ${width * 0.85} ${height * 0.65} C ${width * 0.85} ${height * 0.85}, ${width / 2} ${height * 0.8}, ${width / 2} ${height}`
    : `M ${width / 2} 0 C ${width / 2} ${height * 0.35}, ${width * 0.15} ${height * 0.4}, ${width * 0.15} ${height * 0.65} C ${width * 0.15} ${height * 0.85}, ${width / 2} ${height * 0.8}, ${width / 2} ${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      style={{ display: "block", overflow: "visible" }}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={d} stroke="#d1d5db" strokeWidth="3" fill="none" strokeLinecap="round" />
      {active && (
        <motion.path
          d={d}
          stroke="#14a889"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="au-tl-path-glow"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
        />
      )}
    </svg>
  );
}

function TimelineCard({ milestone, active, complete, onRevealComplete }) {
  const { year, title, description, icon: Icon, side } = milestone;
  const isLeft = side === "left";
  const hasFiredReveal = useRef(false);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
      }}
      className={`au-tl-row ${isLeft ? "au-tl-row-left" : "au-tl-row-right"}`}
    >
      <div className="au-tl-content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.p
            style={{
              color: "#14a889",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 3vw, 2rem)",
              margin: "0 0 0.25rem",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {year}
          </motion.p>

          <motion.h3
            style={{
              color: "#111827",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              fontSize: "1.15rem",
              margin: "0 0 0.5rem",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {title}
          </motion.h3>

          <motion.p
            style={{
              color: "#6b7280",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "360px",
              marginLeft: isLeft ? "auto" : 0,
              marginRight: isLeft ? 0 : "auto",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.45 }}
            onAnimationComplete={() => {
              if (active && !hasFiredReveal.current) {
                hasFiredReveal.current = true;
                onRevealComplete?.();
              }
            }}
          >
            {description}
          </motion.p>
        </motion.div>
      </div>

      <div className="au-tl-node-wrap">
        <motion.div
          className={`au-tl-node ${complete ? "au-tl-node-complete" : active ? "au-tl-node-pulse au-tl-node-active-glow" : "au-tl-node-pending"
            }`}
          initial={{ scale: 0, rotate: -180 }}
          animate={active ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: "spring", stiffness: 150 }}
        >
          {complete ? (
            <Check size={26} strokeWidth={3} aria-hidden="true" />
          ) : (
            <Icon size={26} aria-hidden="true" />
          )}
        </motion.div>
      </div>

      <div className="au-tl-spacer" aria-hidden="true" />
    </div>
  );
}

function TimelineJourneySection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const [activeStep, setActiveStep] = useState(-1);
  const [drawingPathAfter, setDrawingPathAfter] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(() => new Set());
  const [journeyComplete, setJourneyComplete] = useState(false);

  useEffect(() => {
    if (isInView && activeStep === -1) {
      setActiveStep(0);
    }
  }, [isInView, activeStep]);

  const handleCardRevealComplete = (index) => {
    const isLast = index === TIMELINE_JOURNEY.length - 1;
    if (isLast) {
      setCompletedSteps((prev) => new Set(prev).add(index));
      setJourneyComplete(true);
      return;
    }
    setDrawingPathAfter(index);
  };

  const handlePathComplete = (index) => {
    setCompletedSteps((prev) => new Set(prev).add(index));
    setDrawingPathAfter(null);
    setActiveStep(index + 1);
  };

  return (
    <section
      ref={sectionRef}
      className="au-section au-tl-section"
      aria-labelledby="company-journey-title"
    >
      <div className="au-inner">
        <div className="au-section-head">
          <p className="au-eyebrow" style={{ color: "#14a889" }}>The Road So Far</p>
          <h2
            className="au-heading"
            id="company-journey-title"
            style={{ color: "#111827" }}
          >
            Our Journey
          </h2>
          <p style={{ color: "#6b7280" }}>
            From our first performance wear collection to becoming a trusted sportswear brand, every milestone reflects our commitment to athletes and active lifestyles.
          </p>
        </div>

        <div className="au-tl-rail">
          {TIMELINE_JOURNEY.map((milestone, index) => {
            const isLast = index === TIMELINE_JOURNEY.length - 1;
            return (
              <React.Fragment key={milestone.year}>
                <TimelineCard
                  milestone={milestone}
                  active={index <= activeStep}
                  complete={completedSteps.has(index)}
                  onRevealComplete={() => {
                    if (index === activeStep) handleCardRevealComplete(index);
                  }}
                />
                {!isLast && (
                  <div className="au-tl-path-row">
                    <div className="au-tl-path-col">
                      <TimelinePath
                        fromSide={milestone.side}
                        active={drawingPathAfter === index}
                        onComplete={() => handlePathComplete(index)}
                        height={110}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="au-tl-progress" role="list" aria-label="Journey progress">
          {TIMELINE_JOURNEY.map((milestone, index) => (
            <span
              key={milestone.year}
              role="listitem"
              className="au-tl-progress-pill"
              style={
                completedSteps.has(index)
                  ? { background: "#14a889", borderColor: "#14a889", color: "#ffffff" }
                  : { background: "transparent", borderColor: "#d1d5db", color: "#9ca3af" }
              }
            >
              {milestone.year} {completedSteps.has(index) ? "✔" : ""}
            </span>
          ))}
        </div>

        {journeyComplete && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem" }} aria-hidden="true">
            <div
              className="au-tl-node-pulse"
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#14a889" }}
            />
          </div>
        )}
      </div>

      <style>{`
        .au-tl-rail { position: relative; margin-top: 1rem; }

        .au-tl-row { flex-direction: row; }
        .au-tl-row-right { flex-direction: row-reverse; }

        .au-tl-content { flex: 1; }
        .au-tl-row-left .au-tl-content { text-align: right; padding-right: 2rem; }
        .au-tl-row-right .au-tl-content { text-align: left; padding-left: 2rem; }

        .au-tl-node-wrap { position: relative; z-index: 2; flex-shrink: 0; margin: 0 1rem; }
        .au-tl-node {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
        }

        .au-tl-spacer { flex: 1; }

        .au-tl-path-row { display: flex; justify-content: center; margin: -0.5rem 0; }
        .au-tl-path-col { width: 6rem; }

        .au-tl-progress {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }
        .au-tl-progress-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          border: 1px solid;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        @media (max-width: 768px) {
          .au-tl-row, .au-tl-row-right { flex-direction: row; }
          .au-tl-content {
            text-align: left !important;
            padding-left: 1.25rem !important;
            padding-right: 0 !important;
            order: 2;
          }
          .au-tl-row .au-tl-content p,
          .au-tl-row .au-tl-content h3 { margin-left: 0 !important; margin-right: 0 !important; }
          .au-tl-node-wrap { order: 1; margin: 0 0 0 0.25rem; }
          .au-tl-node { width: 60px; height: 60px; }
          .au-tl-spacer { display: none; }
          .au-tl-path-row { justify-content: flex-start; padding-left: 1.75rem; }
          .au-tl-path-col { width: 4rem; }
        }
      `}</style>
    </section>
  );
}

const DOT_LETTERS = ["C", "O", "M", "F", "Y"];

const LETTER_PATTERNS = {
  C: [
    "0111110",
    "1000001",
    "1000000",
    "1000000",
    "1000000",
    "1000001",
    "0111110",
  ],
  O: [
    "0111110",
    "1000001",
    "1000001",
    "1000001",
    "1000001",
    "1000001",
    "0111110",
  ],
  M: [
    "1000001",
    "1100011",
    "1010101",
    "1001001",
    "1000001",
    "1000001",
    "1000001",
  ],
  F: [
    "1111111",
    "1000000",
    "1111110",
    "1000000",
    "1000000",
    "1000000",
    "1000000",
  ],
  Y: [
    "1000001",
    "0100010",
    "0010100",
    "0001000",
    "0001000",
    "0001000",
    "0001000",
  ],
};

function getLitDots(letter) {
  const pattern = LETTER_PATTERNS[letter] || [];
  const lit = new Set();
  pattern.forEach((rowStr, r) => {
    rowStr.split("").forEach((ch, c) => {
      if (ch === "1") lit.add(r * 7 + c);
    });
  });
  return lit;
}

function HeroDotMatrix() {
  const [litDots, setLitDots] = useState(() => new Set());
  const letterIdxRef = useRef(0);

  useEffect(() => {
    let holdTimer;
    let blinkTimer;

    const showNextLetter = () => {
      setLitDots(new Set());
      blinkTimer = setTimeout(() => {
        const letter = DOT_LETTERS[letterIdxRef.current % DOT_LETTERS.length];
        setLitDots(getLitDots(letter));
        letterIdxRef.current += 1;
        holdTimer = setTimeout(showNextLetter, 2000);
      }, 350);
    };

    showNextLetter();

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(blinkTimer);
    };
  }, []);

  return (
    <div className="au-hero-dot-grid">
      {Array.from({ length: 49 }).map((_, i) => (
        <div
          key={i}
          className={`au-hero-dot ${litDots.has(i) ? "au-hero-dot-lit" : ""}`}
        />
      ))}
    </div>
  );
}

const GHOST_WORD_1 = "NEVER";
const GHOST_WORD_2 = "SETTLE";

function GhostTextFill() {
  const totalLetters = GHOST_WORD_1.length + GHOST_WORD_2.length;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalLetters);
    }, 2000);
    return () => clearInterval(interval);
  }, [totalLetters]);

  let globalIdx = -1;

  return (
    <div className="au-hero-ghost-text" aria-hidden="true">
      <div>
        {GHOST_WORD_1.split("").map((ch) => {
          globalIdx += 1;
          const idx = globalIdx;
          return (
            <span
              key={idx}
              className={`au-ghost-letter ${activeIndex === idx ? "au-ghost-letter-filled" : ""}`}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div>
        {GHOST_WORD_2.split("").map((ch) => {
          globalIdx += 1;
          const idx = globalIdx;
          return (
            <span
              key={idx}
              className={`au-ghost-letter ${activeIndex === idx ? "au-ghost-letter-filled" : ""}`}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const BRAND = "Athenura Sportswear";

export default function AboutUs() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  const handleVideoEnter = () => {
    videoRef.current?.play();
  };
  const handleVideoLeave = () => {
    videoRef.current?.pause();
  };

  return (
    <div className="au-root">
      <style>{styles}</style>

      <header
        ref={heroRef}
        className="au-hero"
        aria-label="About hero"
      >
        <motion.div 
          className="au-hero-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="au-hero-content">
            <motion.h1
              className="au-hero-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            >
              Built to Compete.
              <br />
              <span className="au-hero-heading-line-2">Born to Conquer.</span>
            </motion.h1>

            <motion.p
              className="au-hero-desc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              {BRAND} was built for the ones who never settle. The ones who wake up before the world does. The ones who see every workout as a war against their own limits.
            </motion.p>

            <motion.a
              href="#story"
              className="au-hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            >
              Our Journey
              <ArrowRight size={18} strokeWidth={2} />
            </motion.a>
          </div>

          <motion.div
            className="au-hero-image-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="au-hero-parallelogram" aria-hidden="true" />

            <HeroDotMatrix />

            <GhostTextFill />

            <img
              src="https://i.ibb.co/vx7cGDkZ/Chat-GPT-Image-Jul-14-2026-09-52-06-PM.png"
              alt="Athletic runner in motion"
              className="au-hero-image"
            />

            <div className="au-hero-fog-layer au-hero-fog-layer-3" aria-hidden="true" />
            <div className="au-hero-fog-layer au-hero-fog-layer-1" aria-hidden="true" />
            <div className="au-hero-fog-layer au-hero-fog-layer-2" aria-hidden="true" />

            <div className="au-hero-accent-bars">
              <div className="au-hero-accent-bar" />
              <div className="au-hero-accent-bar" />
              <div className="au-hero-accent-bar" />
            </div>
          </motion.div>
        </motion.div>
      </header>

      <section className="au-section au-light" id="story" aria-labelledby="story-title">
        <div className="au-inner au-story">
          <motion.div 
            className="au-story-media-frame"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <div
              className="au-story-media"
              onMouseEnter={handleVideoEnter}
              onMouseLeave={handleVideoLeave}
            >
              <video
                ref={videoRef}
                src="/sport.mp4"
                loop
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <p className="au-eyebrow au-eyebrow-blink">Where It Started</p>
            <h2 className="au-heading" id="story-title">
              Forged In Sweat, Built To Last
            </h2>
            <p>
              It began in a cramped garage with one sewing machine and an unshakable
              obsession: create training gear that performs as hard as the athletes who
              wear it. No shortcuts. No filler. Just relentless iteration.
            </p>
            <p>
              A decade later, that obsession has scaled into a global movement. But our
              mission hasn&apos;t changed — engineer the finest performance sportswear on
              earth, and put it on the backs of people chasing something bigger.
            </p>
            <span className="au-pill au-pill-outline" style={{ marginTop: "0.5rem" }}>
              Est. 2014
            </span>
          </motion.div>
        </div>
      </section>

      <section className="au-section au-light" aria-labelledby="values-title">
        <div className="au-inner">
          <motion.div 
            className="au-section-head"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="au-eyebrow">What Drives Us</p>
            <h2 className="au-heading au-gradient-text" id="values-title">Our Core Values</h2>
            <p>The principles stitched into everything we design, build, and stand for.</p>
          </motion.div>
          <div className="au-grid au-grid-4">
            {VALUES.map((v, idx) => {
              const Icon = v.icon;
              return (
                <motion.article 
                  className="au-card" 
                  key={v.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.65, delay: idx * 0.15, ease: "easeOut" }}
                >
                  <div className="au-card-header">
                    <div className="au-card-icon">
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <div className="au-card-meta">
                      <div className="au-card-name-bar">{v.title}</div>
                    </div>
                  </div>
                  <div className="au-card-body">
                    <p>{v.text}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="au-section au-dark" aria-labelledby="stats-title">
        <div className="au-inner">
          <motion.div 
            className="au-section-head"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="au-eyebrow au-eyebrow-shine">By The Numbers</p>
            <h2 className="au-heading au-gradient-text-move" id="stats-title">
              Milestones That Matter
            </h2>
          </motion.div>
          <div className="au-stats-strip">
            {STATS.map((s, idx) => (
              <motion.div 
                className="au-stat" 
                key={s.label}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: idx * 0.1, ease: "easeOut" }}
              >
                <div className="au-stat-num">
                  <AnimatedCounter target={s.target} suffix={s.suffix || "+"} />
                </div>
                <div className="au-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TimelineJourneySection />

      <section className="au-section au-dark" aria-labelledby="team-title">
        <div className="au-inner">
          <motion.div 
            className="au-section-head"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="au-eyebrow">The People Behind It</p>
            <h2 className="au-heading au-team-gradient" id="team-title">
              Meet The Team
            </h2>
          </motion.div>
          <div className="au-grid au-grid-4">
            {TEAM.map((m, idx) => (
              <motion.article 
                className="au-team-card" 
                key={m.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, delay: idx * 0.15, ease: "easeOut" }}
              >
                <div className="au-avatar" aria-label={`${m.name} avatar`}>
                  <img
                    src={m.image}
                    alt={m.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <h3>{m.name}</h3>
                <p className="au-team-role">{m.role}</p>
                <p>{m.bio}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="au-section au-light" id="cta" aria-labelledby="cta-title">
        <div className="au-inner">
          <motion.div 
            className="au-cta-box"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <div className="au-cta-bg-wrap">
              <img
                className="au-cta-bg-img"
                src="https://images.unsplash.com/photo-1649520937981-763d6a14de7d?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Athletes Custom Sportswear Background"
              />
            </div>

            <h2 className="au-heading" id="cta-title" style={{ position: 'relative', zIndex: 2 }}>Ready to Elevate Your Game?</h2>
            <p style={{ position: 'relative', zIndex: 2 }}>
              Push your limits with sportswear built for performance, comfort, and confidence. Whether you're training or competing, we're here to help you perform at your best.
            </p>
            <div className="au-cta-actions" style={{ position: 'relative', zIndex: 2 }}>
              <Link to="/contact" className="au-btn-cta">
                <Mail size={18} aria-hidden="true" /> Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}