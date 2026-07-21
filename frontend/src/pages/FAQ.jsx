import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw, Headphones, HelpCircle, SearchX, MessageCircle } from "lucide-react";

const FILTERS = [
  "All", "Orders", "Shipping", "Returns & Exchange",
  "Sizing", "Payments", "Products",
];

const FAQ_GROUPS = [
  {
    id: "orders-shipping",
    title: ["ORDERS &", "SHIPPING"],
    items: [
      { id: "os-1", category: "Orders", question: "How do I track my order?", answer: "Once your order ships, you will receive an email and SMS with a live tracking link. You can also track it anytime from the \"My Orders\" section of your account dashboard." },
      { id: "os-2", category: "Orders", question: "Can I modify or cancel my order after placing it?", answer: "Orders can be modified or cancelled within 2 hours of placing them, as long as they have not entered the fulfillment stage. Just head to \"My Orders\" and select \"Edit\" or \"Cancel\", or contact our support team." },
      { id: "os-3", category: "Shipping", question: "How long does delivery take?", answer: "Standard shipping takes 3–5 business days, while express shipping arrives in 1–2 business days. Delivery times may vary slightly during peak sale periods." },
      { id: "os-4", category: "Shipping", question: "Do you offer free shipping?", answer: "Yes! We offer free standard shipping on all orders above $75. Orders below that threshold have a flat $5.99 shipping fee." },
      { id: "os-5", category: "Orders", question: "Do you ship internationally?", answer: "Yes, we ship to over 30 countries worldwide. International delivery takes 7–14 business days and customs duties may apply depending on your location." },
      { id: "os-6", category: "Shipping", question: "What happens if my package is lost?", answer: "If your package hasn't arrived within the estimated delivery window, contact our support team with your order number and we will investigate and reship or refund as needed." }
    ],
  },
  {
    id: "returns-refunds",
    title: ["RETURNS &", "REFUNDS"],
    items: [
      { id: "rr-1", category: "Returns & Exchange", question: "What is your return policy?", answer: "We offer a 30-day return window from the date of delivery. Items must be unworn, unwashed, and have original tags attached. Returns are free for store credit and a small fee applies for refunds to the original payment method." },
      { id: "rr-2", category: "Returns & Exchange", question: "How do I start an exchange?", answer: "Visit the \"My Orders\" page, select the item you want to exchange, choose your new size or color, and print the prepaid return label. Your replacement ships as soon as we receive the original item." },
      { id: "rr-3", category: "Returns & Exchange", question: "When will I receive my refund?", answer: "Refunds are processed within 3–5 business days after we receive and inspect your return. The amount will be credited back to your original payment method." },
      { id: "rr-4", category: "Returns & Exchange", question: "Can I return a sale or discounted item?", answer: "Sale items are eligible for store credit only. Final sale items marked as non-returnable cannot be returned or exchanged under any circumstances." },
      { id: "rr-5", category: "Returns & Exchange", question: "Do I need the original packaging to return?", answer: "Original packaging is preferred but not required. Items must be securely packed to avoid damage in transit. We recommend using a similar sized box with adequate cushioning." },
      { id: "rr-6", category: "Returns & Exchange", question: "Can I return a gift?", answer: "Yes, gifts can be returned for store credit within 30 days of the original purchase date. You will need the order number or gift receipt to initiate the return." }
    ],
  },
  {
    id: "sizing-fit",
    title: ["SIZING &", "FIT"],
    items: [
      { id: "sf-1", category: "Sizing", question: "How do I find my correct size?", answer: "Each product page includes a detailed size chart with measurements in both inches and centimeters. We recommend measuring your chest, waist, and hips and comparing them to the chart for the best fit." },
      { id: "sf-2", category: "Sizing", question: "Do your products run true to size?", answer: "Most of our performance wear is designed for a true-to-size athletic fit. Compression styles run snug by design, so if you prefer a looser feel, we suggest sizing up." },
      { id: "sf-3", category: "Products", question: "What materials are used in your sportswear?", answer: "Our gear uses moisture-wicking, breathable performance fabrics blended with recycled polyester and elastane for stretch, durability, and all-day comfort." },
    ],
  },
  {
    id: "payments-offers",
    title: ["PAYMENTS &", "OFFERS"],
    items: [
      { id: "po-1", category: "Payments", question: "What payment methods do you accept?", answer: "We accept all major credit and debit cards, Apple Pay, Google Pay, PayPal, and buy-now-pay-later options like Klarna and Afterpay." },
      { id: "po-2", category: "Payments", question: "Is it safe to use my card on your site?", answer: "Absolutely. All transactions are encrypted with industry-standard SSL and processed through PCI-compliant payment gateways. We never store your full card details." },
      { id: "po-3", category: "Payments", question: "Can I use multiple discount codes on one order?", answer: "Only one promo code can be applied per order. However, active sitewide sales and free shipping benefits stack automatically with your code at checkout." },
    ],
  },
];

const BADGES = [
  { icon: <Truck size={24} />, label: "Free Shipping", sub: "On orders over ₹599" },
  { icon: <ShieldCheck size={24} />, label: "Secure Payment", sub: "100% encrypted checkout" },
  { icon: <RotateCcw size={24} />, label: "100% Money Back", sub: "30-day easy returns" },
  { icon: <Headphones size={24} />, label: "Online Support", sub: "We're here 24/7" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d0d;
    --fg: #f5f5f5;
    --surface: #1a1a1a;
    --light: #f4f4f5;
    --light-fg: #111111;
    --light-muted: #6b7280;
    --brand: #14a889;
    --brand-fg: #ffffff;
    --muted-fg: #a1a1aa;
    --border: rgba(255,255,255,0.10);
    --card: #ffffff;
    --card-fg: #111111;
    --radius: 1rem;
  }

  .page { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--fg); min-height: 100vh; }

  .heading-display {
    font-family: 'Oswald', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    line-height: 0.95;
  }

  .hero {
    position: relative;
    overflow: hidden;
    background: linear-gradient(120deg, rgba(6,37,31,0.13), rgba(10,61,51,0.13), rgba(5,22,18,0.13)), url('https://i.ibb.co/zTCVmL8y/Chat-GPT-Image-Jul-21-2026-12-23-54-AM.png');
    background-size: cover;
    background-position: center;
    padding: 5rem 1.5rem 5rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 900px) {
    .hero {
      min-height: 627px;
      padding: 4rem 1.5rem;
    }
  }
  
  .hero-inner { position: relative; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    border: 1px solid var(--border); background: var(--surface);
    padding: 0.375rem 1rem; border-radius: 99px;
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--muted-fg); margin-bottom: 1.25rem;
  }
  .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brand); }
  .hero-title { font-size: clamp(2.5rem, 8vw, 4.5rem); color: var(--fg); margin-bottom: 1.25rem; max-width: 700px; }
  .hero-title span { color: var(--brand); }
  .hero-sub { color: var(--muted-fg); font-size: 1rem; line-height: 1.7; max-width: 480px; margin-bottom: 2.25rem; }
  .search-wrap {
    display: flex; align-items: center; gap: 0.75rem;
    width: 100%; max-width: 520px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: calc(var(--radius) + 4px); padding: 1rem 1.25rem;
    transition: border-color 0.2s;
  }
  .search-wrap:focus-within { border-color: var(--brand); }
  .search-wrap svg { color: var(--muted-fg); flex-shrink: 0; transition: color 0.2s; width: 20px; height: 20px; }
  .search-wrap:focus-within svg { color: var(--brand); }
  .search-input { flex: 1; background: transparent; border: none; outline: none; font-size: 1rem; color: var(--fg); }
  .search-input::placeholder { color: var(--muted-fg); }

.filters { background: var(--light); padding: 2.5rem 1.5rem 2rem; }  .filters-inner { max-width: 1200px; margin: 0 auto; }
  .filters-scroll {
    display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem;
    scrollbar-width: none; flex-wrap: wrap; justify-content: center;
  }
  .filters-scroll::-webkit-scrollbar { display: none; }
  .filter-btn {
    flex-shrink: 0; white-space: nowrap; border-radius: 99px;
    padding: 0.625rem 1.25rem; font-size: 0.875rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; border: 1px solid var(--border);
    background: var(--surface); color: var(--muted-fg);
  }
  .filter-btn:hover { border-color: rgba(20,168,137,0.5); color: var(--fg); }
  .filter-btn.active { background: var(--brand); color: var(--brand-fg); border-color: var(--brand); }

  .faq-section { background: var(--light); padding: 5rem 2rem; }
  .faq-inner { max-width: 1100px; margin: 0 auto; }
  .faq-groups {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

@media (max-width: 768px) {
  .faq-groups { grid-template-columns: 1fr; }
}
  .group-header { margin-bottom: 1.75rem; }
  .group-title { font-size: clamp(1.75rem, 5vw, 2.25rem); color: var(--light-fg); }
  .group-title span { color: var(--brand); }
  .group-bar { width: 3rem; height: 4px; background: var(--brand); border-radius: 99px; margin-top: 0.75rem; }

  .faq-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 270px;
    overflow-y: auto;
    padding-right: 0.4rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .faq-items::-webkit-scrollbar { display: none; }

  .faq-item {
    overflow: hidden; border-radius: var(--radius);
    border: 1px solid rgba(0,0,0,0.06); background: var(--card);
    box-shadow: 0 1px 4px rgba(0,0,0,0.06); transition: box-shadow 0.2s;
    flex-shrink: 0;
  }
  .faq-item:hover { box-shadow: 0 3px 12px rgba(0,0,0,0.10); }
  .faq-btn {
    display: flex; width: 100%; align-items: center; gap: 1rem;
    padding: 0.875rem 1.5rem; text-align: left; background: none; border: none; cursor: pointer;
  }
  .faq-icon {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: var(--brand); color: var(--brand-fg); font-size: 1rem;
  }
  .faq-question { flex: 1; font-size: 1rem; font-weight: 600; color: var(--card-fg); line-height: 1.4; }
  .faq-toggle {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    font-size: 1.25rem; transition: background 0.2s, color 0.2s;
  }
  .faq-toggle.open { background: rgba(20,168,137,0.12); color: var(--brand); }
  .faq-toggle.closed { background: rgba(0,0,0,0.06); color: var(--card-fg); }
 .faq-answer {
  display: grid;
  transition: grid-template-rows 0.35s ease, opacity 0.35s ease;
  overflow-y: auto;
  max-height: 200px;
}
  .faq-answer-text {
  overflow: hidden;
  padding: 0 1.5rem 1.5rem;
  padding-left: calc(1.5rem + 36px + 1rem);
  font-size: 0.93rem; line-height: 1.7; color: var(--light-muted);
}

  .empty {
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
    border-radius: var(--radius); border: 1px solid rgba(0,0,0,0.06);
    background: var(--card); padding: 4rem 1.5rem; text-align: center;
  }
  .empty-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(20,168,137,0.1); color: var(--brand);
    display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
  }
  .empty h3 { font-size: 1.25rem; font-weight: 600; color: var(--light-fg); }
  .empty p { color: var(--light-muted); max-width: 340px; }

  .trust { background: var(--bg); padding: 3.5rem 1.5rem; }
  .trust-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;
  }
  .badge-card {
    display: flex; align-items: center; gap: 1rem;
    border-radius: calc(var(--radius) + 4px); border: 1px solid var(--border);
    background: var(--surface); padding: 1.25rem 1.25rem;
    transition: all 1.3s ease;
    cursor: pointer;
  }
  .badge-card:hover {
    background: var(--brand);
    border-color: var(--brand);
  }
  .badge-card:hover .badge-icon {
    background: var(--bg);
    color: var(--brand);
  }
  .badge-card:hover .badge-label {
    color: var(--brand-fg);
  }
  .badge-card:hover .badge-sub {
    color: rgba(255,255,255,0.7);
  }
  .badge-icon {
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px; border-radius: calc(var(--radius) - 4px);
    background: var(--brand); color: var(--brand-fg); font-size: 1.5rem; flex-shrink: 0;
  }
  .badge-label { font-size: 1rem; font-weight: 600; color: var(--fg); }
  .badge-sub { font-size: 0.8rem; color: var(--muted-fg); margin-top: 2px; }

  .cta-section { background: #ffffff; padding: 30px 1.5rem 25px; }
  .cta-box {
    position: relative; max-width: 1200px; margin: 0 auto;
    border-radius: 20px; overflow: hidden;
    background: linear-gradient(135deg, #14a889 0%, #0a3d33 50%, #051612 100%);
    box-shadow: 0 16px 44px rgba(20, 168, 137, 0.22);
    border: none;
  }
  .cta-bg-wrap {
    position: absolute; inset: 0;
    z-index: 0;
    overflow: hidden;
  }
  .cta-bg-img {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0.3;
    transform: scale(1.1);
    transition: transform 0.8s cubic-bezier(0.25, 1, 0.36, 1);
  }
  .cta-box:hover .cta-bg-img {
    transform: scale(1);
  }
  .cta-content {
    position: relative; display: flex; flex-direction: column;
    align-items: center; text-align: center; gap: 1.5rem; padding: 80px 40px;
    z-index: 2;
  }
  @media (min-width: 768px) { .cta-content { padding: 80px 60px; } }
  .cta-title { font-size: clamp(2rem, 5vw, 3.5rem); color: var(--fg); max-width: 540px; font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase; }
  .cta-title span { color: var(--brand); }
  .cta-sub { color: rgba(255,255,255,0.7); font-size: 1rem; max-width: 580px; line-height: 1.7; }
  .cta-btns { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: #ffffff; color: #0a3d33;
    padding: 14px 34px; border-radius: 6px; border: none; cursor: pointer;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); text-decoration: none;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
    font-family: 'Poppins', sans-serif;
  }
  .btn-primary:hover { transform: translateY(-3px); background: #f8f9fa; color: #14a889; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); }
  .btn-secondary {
    display: inline-flex; align-items: center; gap: 10px;
    border: 1.5px solid rgba(255,255,255,0.35); background: rgba(255,255,255,0.08);
    color: var(--fg); padding: 13px 32px; border-radius: 6px;
    font-size: 0.85rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; transition: background 0.2s, transform 0.15s, border-color 0.2s; text-decoration: none;
    font-family: 'Poppins', sans-serif;
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); border-color: #ffffff; }
`;

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="faq-item">
      <button className="faq-btn" onClick={onToggle} aria-expanded={isOpen} type="button">
        <span className="faq-icon"><HelpCircle size={18} /></span>
        <span className="faq-question">{item.question}</span>
        <span className={`faq-toggle ${isOpen ? "open" : "closed"}`}>
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        className="faq-answer"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
      >
        <p className="faq-answer-text">{item.answer}</p>
      </div>
    </div>
  );
}

function FaqList({ query, category }) {
  const [openId, setOpenId] = useState(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const matchesCategory = category === "All" || item.category === category;
        const matchesQuery =
          q === "" ||
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      }),
    })).filter((g) => g.items.length > 0);
  }, [query, category]);

  return (
    <section className="faq-section">
      <div className="faq-inner">
        {groups.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><SearchX size={24} /></div>
            <h3>No matching questions</h3>
            <p>Try a different search term or category — or reach out to our support team below.</p>
          </div>
        ) : (
          <div className="faq-groups">
            {groups.map((group) => (
              <div key={group.id}>
                <div className="group-header">
                  <h2 className="heading-display group-title">
                    {group.title[0]} <span>{group.title[1]}</span>
                  </h2>
                  <div className="group-bar" />
                </div>
                <div className="faq-items">
                  {group.items.map((item) => (
                    <FaqItem
                      key={item.id}
                      item={item}
                      isOpen={openId === item.id}
                      onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  return (
    <>
      <style>{styles}</style>
      <main className="page">
        <header className="hero">
          <div className="hero-inner">
            <h1 className="heading-display hero-title">
              Frequently Asked <span>Questions</span>
            </h1>
            <p className="hero-sub">
              Got questions about sizing, shipping, or returns? We've got answers.
            </p>
            <div className="search-wrap">
              <SearchIcon />
              <input
                className="search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your question..."
                aria-label="Search frequently asked questions"
              />
            </div>
          </div>
        </header>
        <div className="filters">
          <div className="filters-inner">
            <div className="filters-scroll" role="group" aria-label="Filter by category">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filter-btn${category === f ? " active" : ""}`}
                  onClick={() => setCategory(f)}
                  aria-pressed={category === f}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        <FaqList query={query} category={category} />
        <section className="trust">
          <div className="trust-grid">
            {BADGES.map((b) => (
              <div key={b.label} className="badge-card">
                <div className="badge-icon" aria-hidden="true">{b.icon}</div>
                <div>
                  <p className="badge-label">{b.label}</p>
                  <p className="badge-sub">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="cta-section">
          <div className="cta-box">
            <div className="cta-bg-wrap">
              <img
                className="cta-bg-img"
                src="https://images.unsplash.com/photo-1649520937981-763d6a14de7d?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Athletes Custom Sportswear Background"
              />
            </div>
            <div className="cta-content">
              <h2 className="heading-display cta-title" style={{ position: 'relative', zIndex: 2 }}>
                Still Have Questions?
              </h2>
              <p className="cta-sub" style={{ position: 'relative', zIndex: 2 }}>Our support team is here to help — reach out anytime.</p>
              <div className="cta-btns" style={{ position: 'relative', zIndex: 2 }}>
                <Link to="/contact" className="btn-primary">
                  Contact Support ↗
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}