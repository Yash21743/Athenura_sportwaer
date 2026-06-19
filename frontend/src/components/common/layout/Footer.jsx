import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { FaInstagram, FaFacebookF } from "react-icons/fa"

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
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 900px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
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
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              COMFY SPORT WEAR
            </motion.span>
          </Link>
          <p style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "0.25rem" }}>
            Premium sportswear crafted for comfort and performance.
          </p>
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

        <div className="footer-col">
          <h3 className="footer-heading">Follow Us</h3>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF size={20} />
            </a>
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </a>
          </div>
          <p style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "0.5rem" }}>
            Reach out via social or WhatsApp.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} COMFY SPORT WEAR. All rights reserved.
      </div>
    </footer>
  )
}