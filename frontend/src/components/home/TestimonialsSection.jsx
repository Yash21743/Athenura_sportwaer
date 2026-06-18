import { useState, useEffect, useRef } from 'react';

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'Amit Sharma',
    role: 'Fitness Coach & Trainer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80&fit=crop',
    rating: 5,
    quote: 'The fabric quality of the tracksuits is unmatched. It holds its stretch, absorbs sweat, and doesn’t lose color after multiple wash cycles. My clients absolutely love it!',
  },
  {
    id: 2,
    name: 'Sneha Patel',
    role: 'National Athletics Runner',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&q=80&fit=crop',
    rating: 5,
    quote: 'The Aero-Dry tees are a game-changer. They stay feather-light and incredibly breathable even during my intense 15k training runs. Comfy really understands athletic needs.',
  },
  {
    id: 3,
    name: 'Vikram Singh',
    role: 'Professional Weightlifter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&fit=crop',
    rating: 5,
    quote: 'Elite compression tops are outstanding. They give excellent chest and core support. Recovering between heavy squat sets feels much quicker. A solid 10/10.',
  },
  {
    id: 4,
    name: 'Rohan Mehta',
    role: 'Marathon Runner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&fit=crop',
    rating: 5,
    quote: 'Zero chafing during my half-marathon run! The mesh running shorts are lightweight and have a very secure inner liner. The waistband is extremely comfortable.',
  },
  {
    id: 5,
    name: 'Priya Rao',
    role: 'Power Yoga Practitioner',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&fit=crop',
    rating: 5,
    quote: 'Super comfy active joggers! The high-waisted fit sits perfectly without sliding down during stretches, and the material is buttery soft. Perfect for yoga and travel.',
  },
];

function useVisible(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const icons = {
  star: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="1.5">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  quote: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 59, 48, 0.18)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-9 7-14h-3v-3h7v5c0 6.627-5.373 12-11 12zm13 0c3 0 7-9 7-14h-3v-3h7v5c0 6.627-5.373 12-11 12z" />
    </svg>
  ),
};

const styles = `
  @keyframes ts-fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ts-marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .ts-section {
    background: #080808;
    padding: 92px 0 100px;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }
  .ts-section::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(255, 59, 48, 0.03) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
  }
  .ts-head-wrap {
    text-align: center;
    margin-bottom: 56px;
    padding: 0 24px;
    opacity: 0;
  }
  .ts-head-wrap.visible {
    animation: ts-fadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .ts-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    color: #FF3B30;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
    margin-bottom: 8px;
  }
  .ts-eyebrow::before,
  .ts-eyebrow::after {
    content: '';
    display: block;
    width: 24px;
    height: 1.5px;
    background: #FF3B30;
  }
  .ts-heading {
    font-size: clamp(1.8rem, 3.2vw, 2.5rem);
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.5px;
    margin: 0 0 12px;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
  }
  .ts-heading span {
    color: #FF3B30;
  }
  .ts-heading::after {
    content: '';
    display: block;
    width: 52px;
    height: 3px;
    background: #FF3B30;
    border-radius: 2px;
    margin: 8px auto 0;
  }
  .ts-subtext {
    font-size: 14.5px;
    color: #777;
    max-width: 520px;
    margin: 14px auto 0;
    line-height: 1.7;
  }
  .ts-marquee-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 10px 0;
    display: flex;
  }
  .ts-marquee-container::before,
  .ts-marquee-container::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    width: 15%;
    z-index: 2;
    pointer-events: none;
  }
  .ts-marquee-container::before {
    left: 0;
    background: linear-gradient(to right, #080808 0%, transparent 100%);
  }
  .ts-marquee-container::after {
    right: 0;
    background: linear-gradient(to left, #080808 0%, transparent 100%);
  }
  .ts-marquee-track {
    display: flex;
    gap: 24px;
    width: max-content;
    animation: ts-marquee 30s linear infinite;
  }
  .ts-marquee-container:hover .ts-marquee-track {
    animation-play-state: paused;
  }
  .ts-card {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 18px;
    padding: 32px;
    width: 380px;
    flex-shrink: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
                border-color 0.4s cubic-bezier(0.25, 1, 0.5, 1),
                box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
  }
  .ts-card:hover {
    transform: translateY(-6px);
    border-color: #FF3B30;
    box-shadow: 0 12px 30px rgba(255, 59, 48, 0.08);
  }
  .ts-quote-icon {
    position: absolute;
    top: 24px; right: 24px;
  }
  .ts-stars {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
  }
  .ts-quote-text {
    font-size: 13.5px;
    line-height: 1.75;
    color: #aeaea2;
    margin-bottom: 24px;
    font-style: italic;
  }
  .ts-user-profile {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: auto;
  }
  .ts-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    background: #2c2c2c;
  }
  .ts-user-details {
    display: flex;
    flex-direction: column;
  }
  .ts-user-name {
    font-size: 14.5px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }
  .ts-user-role {
    font-size: 11.5px;
    color: #666;
    margin-top: 2px;
    font-weight: 500;
  }

  @media (max-width: 520px) {
    .ts-card {
      width: 310px;
      padding: 24px;
    }
  }
`;

const TestimonialsSection = () => {
  const [headRef, headVisible] = useVisible();

  const marqueeItems = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];

  return (
    <>
      <style>{styles}</style>

      <section className="ts-section">
        <div ref={headRef} className={`ts-head-wrap${headVisible ? ' visible' : ''}`}>
          <h2 className="ts-heading">
            What They <span>Say</span>
          </h2>
          <p className="ts-subtext">
            Read inspiring feedback from professional trainers, athletes, and fitness enthusiasts who train with Comfy.
          </p>
        </div>

        <div className="ts-marquee-container">
          <div className="ts-marquee-track">
            {marqueeItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="ts-card">
                <div className="ts-quote-icon">
                  {icons.quote}
                </div>

                <div className="ts-stars">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i}>{icons.star}</span>
                  ))}
                </div>

                <p className="ts-quote-text">"{item.quote}"</p>

                <div className="ts-user-profile">
                  <img className="ts-avatar" src={item.avatar} alt={item.name} />
                  <div className="ts-user-details">
                    <h4 className="ts-user-name">{item.name}</h4>
                    <span className="ts-user-role">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;
