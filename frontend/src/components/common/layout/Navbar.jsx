"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, ShoppingBag, User, X, LogIn, Heart, Package, Settings } from "lucide-react"
import { Link, NavLink as RouterNavLink } from "react-router-dom"

const styles = `
.nav-root {
  --nav-h: 76px;
  --bg-3d: #1e1e22;
  --shadow-3d-dark: 6px 6px 12px rgba(0, 0, 0, 0.6);
  --shadow-3d-light: -6px -6px 12px rgba(255, 255, 255, 0.06);
  --inset-3d-dark: inset 4px 4px 8px rgba(0, 0, 0, 0.6);
  --inset-3d-light: inset -4px -4px 8px rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
}

.nav-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  height: var(--nav-h);
  padding: 0 clamp(1rem, 4vw, 3rem);
  background: #000000;
  border-bottom: none;
  box-shadow: var(--shadow-3d-dark), var(--shadow-3d-light);
  transition: background 0.35s ease, box-shadow 0.35s ease;
}

.nav-shell[data-scrolled='true'] {
  background: #222228;
  box-shadow: var(--shadow-3d-dark), var(--shadow-3d-light), 0 6px 25px rgba(200, 0, 0, 0.15);
}

.nav-links {
  display: none;
  align-items: center;
  gap: 0.25rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  transition: color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #ffffff;
  background: linear-gradient(135deg, #3d0000, #800000, #3d0000);
  background-size: 200% 200%;
  animation: redShift 1.5s ease infinite;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.04);
}

.nav-link__dot {
  display: none;
}

.nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  user-select: none;
  position: relative;
  z-index: 1;
}

.nav-logo__text {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.nav-logo__text span {
  color: #e60000;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-btn {
  position: relative;
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

.icon-btn:hover {
  color: #ffffff;
  background: linear-gradient(135deg, #3d0000, #800000, #3d0000);
  background-size: 200% 200%;
  animation: redShift 1.5s ease infinite;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.04);
}

.cart-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1;
  color: #ffffff;
  background: #e60000;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 12px rgba(230, 0, 0, 0.6);
}

.account-wrap {
  position: relative;
}

.account-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  width: 220px;
  padding: 0.5rem;
  background: #2a2a2f;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.7), -4px -4px 12px rgba(255, 255, 255, 0.05);
  transform-origin: top right;
  overflow: hidden;
}

.account-menu__head {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 0.35rem;
}

.account-menu__head strong {
  display: block;
  font-size: 0.9rem;
}

.account-menu__head small {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.78rem;
}

.account-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.55rem 0.75rem;
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.8);
  background: transparent;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.account-item:hover {
  background: #1e1e22;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(255, 255, 255, 0.03);
  color: #ffffff;
}

.nav-burger {
  display: inline-grid;
}

.mobile-panel {
  position: fixed;
  top: var(--nav-h);
  left: 0;
  right: 0;
  overflow: hidden;
  background: #222227;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
  z-index: 49;
}

.mobile-inner {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem clamp(1rem, 4vw, 3rem) 1.25rem;
}

.mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  text-decoration: none;
  border-radius: 12px;
  background: #1e1e22;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), -3px -3px 6px rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.02);
  transition: all 0.2s ease;
}

.mobile-link:hover {
  background: #222227;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(255, 255, 255, 0.03);
}

.mobile-overlay {
  position: fixed;
  inset: var(--nav-h) 0 0 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 40;
}

@media (min-width: 900px) {
  .nav-links {
    display: flex;
  }
  .nav-burger {
    display: none;
  }
}
`

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar({ cartCount = 3 }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)

  useEffect(() => {
    const styleTag = document.createElement("style")
    styleTag.textContent = styles
    document.head.appendChild(styleTag)
    return () => document.head.removeChild(styleTag)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <header className="nav-root">
      <motion.nav
        className="nav-shell"
        data-scrolled={scrolled}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" className="nav-logo">
          <motion.span
            className="nav-logo__text"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            COMFY SPORT WEAR
          </motion.span>
        </Link>

        <motion.ul
          className="nav-links"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
          }}
        >
          {NAV_LINKS.map((link) => (
            <motion.li
              key={link.label}
              variants={{
                hidden: { opacity: 0, y: -12 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <NavLink href={link.href} label={link.label} />
            </motion.li>
          ))}
        </motion.ul>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn nav-burger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "grid" }}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <motion.button
            type="button"
            className="icon-btn"
            aria-label={`Cart, ${cartCount} items`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <motion.span
                className="cart-badge"
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          <div className="account-wrap" ref={accountRef}>
            <motion.button
              type="button"
              className="icon-btn"
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAccountOpen((v) => !v)}
            >
              <User size={20} />
            </motion.button>

            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  className="account-menu"
                  role="menu"
                  initial={{ opacity: 0, scale: 0.92, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className="account-menu__head">
                    <strong>Hello, Guest</strong>
                    <small>Sign in for a faster checkout</small>
                  </div>
                  <button className="account-item" role="menuitem">
                    <LogIn size={16} /> Sign in
                  </button>
                  <button className="account-item" role="menuitem">
                    <Package size={16} /> My Orders
                  </button>
                  <button className="account-item" role="menuitem">
                    <Heart size={16} /> Wishlist
                  </button>
                  <button className="account-item" role="menuitem">
                    <Settings size={16} /> Settings
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="mobile-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="mobile-inner"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06 } },
                }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.div
                    key={link.label}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      to={link.href}
                      className="mobile-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

function NavLink({ href, label }) {
  return (
    <RouterNavLink
      to={href}
      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
    >
      {label}
    </RouterNavLink>
  )
}