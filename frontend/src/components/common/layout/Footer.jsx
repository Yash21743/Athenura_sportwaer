import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { MessageCircle, Mail, Phone } from "lucide-react"
import logo from "../../../assets/images/ath.logo.jpeg"

const styles = `
.footer-root {
  --bg-3d: #000000;
  --shadow-3d-dark: 6px 6px 12px rgba(0, 0, 0, 0.8);
  --shadow-3d-light: -6px -6px 12px rgba(255, 255, 255, 0.04);
  --inset-3d-dark: inset 4px 4px 8px rgba(0, 0, 0, 0.8);
  --inset-3d-light: inset -4px -4px 8px rgba(255, 255, 255, 0.04);
  background: #000000;
  color: rgba(255, 255, 255, 0.8);
  padding: 3rem clamp(1rem, 4vw, 3rem) 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  box-shadow: var(--shadow-3d-dark), var(--shadow-3d-light);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  max-width: 100%;
  margin: 0 auto;
}

@media (min-width: 550px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem 2rem;
  }
}

@media (min-width: 900px) {
  .footer-grid {
    grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
    gap: 2rem;
  }
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-heading {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #ffffff;
  margin-bottom: 0.25rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  position: relative;
  width: fit-content;
}

.footer-heading::after {
  content: '';
  display: block;
  width: 35px;
  height: 2px;
  background: #FF3B30;
  margin-top: 0.35rem;
  border-radius: 1px;
}


.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  user-select: none;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.footer-logo span {
  color: #e60000;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  transition: color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  width: fit-content;
}

.footer-link:hover {
  color: #ffffff;
  background: linear-gradient(135deg, #3d0000, #800000, #3d0000);
  background-size: 200% 200%;
  animation: redShift 1.5s ease infinite;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.04);
}

.footer-social {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.footer-social a {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  background: var(--bg-3d);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  box-shadow: var(--shadow-3d-dark), var(--shadow-3d-light);
  transition: all 0.2s ease;
}

.footer-social a:hover {
  color: #ffffff;
  background: linear-gradient(135deg, #3d0000, #800000, #3d0000);
  background-size: 200% 200%;
  animation: redShift 1.5s ease infinite;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.04);
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
}

@keyframes redShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`

export default function Footer() {
  useEffect(() => {
    const styleTag = document.createElement("style")
    styleTag.textContent = styles
    document.head.appendChild(styleTag)
    return () => document.head.removeChild(styleTag)
  }, [])

  return (
    <footer className="footer-root">
      <div className="footer-grid">
        <div className="footer-col" style={{ gap: '1rem' }}>
          <Link to="/" className="footer-logo" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <motion.img
              src={logo}
              alt="Athenura Sportswear Logo"
              style={{ height: '84px', width: 'auto', objectFit: 'contain' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>
          <p style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "0.25rem", lineHeight: 1.6 }}>
            Premium sportswear crafted for comfort and performance.
          </p>
          <div style={{ marginTop: '0.5rem' }}>
            <h3 className="footer-heading" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Follow Us</h3>
            <div className="footer-social">
              <a href="https://www.linkedin.com/company/athenura/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" style={{ width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                </svg>
              </a>
              <a href="https://www.instagram.com/athenura.in" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" style={{ width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                </svg>
              </a>
              <a href="https://x.com/athenura_in" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" style={{ width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg">
                  <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                </svg>
              </a>
              <a href="https://athenura.medium.com" target="_blank" rel="noopener noreferrer" aria-label="Medium">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" style={{ width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 32v448h448V32H0zm372.2 106.1l-24 23c-2.1 1.6-3.1 4.2-2.7 6.7v169.3c-.4 2.6.6 5.2 2.7 6.7l23.5 23v5.1h-118V367l24.3-23.6c2.4-2.4 2.4-3.1 2.4-6.7V199.8l-67.6 171.6h-9.1L125 199.8v115c-.7 4.8 1 9.7 4.4 13.2l31.6 38.3v5.1H71.2v-5.1l31.6-38.3c3.4-3.5 4.9-8.4 4.1-13.2v-133c.4-3.7-1-7.3-3.8-9.8L75 138.1V133h87.3l67.4 148L289 133.1h83.2v5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Quick Links</h3>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/about" className="footer-link">About Us</Link>
          <Link to="/products" className="footer-link">Products</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">Services</h3>
          <Link to="/bulk-orders" className="footer-link">Bulk Orders</Link>
          <Link to="/testimonials" className="footer-link">Testimonials</Link>
          <Link to="/faq" className="footer-link">FAQ</Link>
        </div>

        <div className="footer-col contact-col">
          <h3 className="footer-heading">Contact Us</h3>
          <a href="mailto:official@athenura.in" className="footer-link" style={{ fontSize: '0.85rem', wordBreak: 'break-all', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} style={{ flexShrink: 0 }} />
            <span>official@athenura.in</span>
          </a>
          <a href="tel:+919835051934" className="footer-link" style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={16} style={{ flexShrink: 0 }} />
            <span>+91 9835051934</span>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Athenura Sportswear. All rights reserved.
      </div>
    </footer>
  )
}