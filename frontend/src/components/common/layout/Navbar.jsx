import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, ShoppingBag, User, X, LogIn, Package, Settings, ChevronDown, UserPlus, Search } from "lucide-react"

import { Link, NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom"
import logo from "../../../assets/images/comfy_logo4.png"

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

.nav-root--fixed {
  position: fixed !important;
}


.nav-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  height: var(--nav-h);
 padding: 0 clamp(1rem, 4vw, 3rem);
  background: #d6d7cb;
  border-bottom: none;
  box-shadow: var(--shadow-3d-dark), var(--shadow-3d-light);
  transition: background 0.35s ease, box-shadow 0.35s ease;
}

.nav-shell[data-scrolled='true'] {
  background: #d6d7cb;
  box-shadow: var(--shadow-3d-dark), var(--shadow-3d-light), 0 6px 25px rgba(20, 168, 137, 0.15);
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
 color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  border-radius: 14px;
  border: none;
  transition: color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  white-space: nowrap;


}

.nav-link::after {
  content: "";
  position: absolute;
  left: 1.2rem;
  right: 1.2rem;
  bottom: 4px;
  height: 2px;
  background: #14a889;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.25s ease;

}

.nav-link:hover,
.nav-link.active {
  color: #000000;
}

.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
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
  color: #000000;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.nav-logo__text span {
  color: #14a889;
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
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover,
.icon-btn.active {
  color: rgba(0, 0, 0, 0.8);
  background: #ffffff;
  border: 1px solid #14a889;
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
  background: #14a889;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 12px rgba(20, 168, 137, 0.6);
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
  top: calc(var(--nav-h) + 40px);
  left: 0;
  right: 0;
  overflow: hidden;
  background: #d6d7cb;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
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
  color: #000000;
  text-decoration: none;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.mobile-link:hover,
.mobile-link.active {
  color: #ffffff;
  background: linear-gradient(135deg, #0a3d33, #14a889, #0a3d33);
  background-size: 200% 200%;
  animation: redShift 1.5s ease infinite;
  border-color: transparent;
}

.mobile-overlay {
  position: fixed;
  inset: calc(var(--nav-h) + 40px) 0 0 0;
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

@media (min-width: 900px) {
  .nav-links {
    gap: clamp(0px, 0.4vw, 0.25rem);
  }
  .nav-link {
    padding: 0.6rem clamp(0.5rem, 1vw, 1.2rem);
    font-size: clamp(0.74rem, 0.85vw + 0.4rem, 0.9rem);
    white-space: nowrap;
  }
  .nav-shell {
    padding: 0 clamp(0.75rem, 2vw, 3rem);
    gap: clamp(0.5rem, 1.5vw, 1.5rem);
  }
  .nav-logo img {
    height: clamp(34px, 4vw, 48px) !important;
  }
  .nav-actions {
    gap: clamp(0.25rem, 0.5vw, 0.5rem);
  }
  .icon-btn {
    width: clamp(36px, 3vw, 44px);
    height: clamp(36px, 3vw, 44px);
  }
}

.announcement-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  height: 40px;
  padding: 0 1rem;
  background: #1e1e22;
  overflow: hidden;
  position: relative;
}

.announcement-bar__content {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: nowrap;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  max-width: 100%;
}

.announcement-bar__text {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #e8e8ea;
}

.announcement-bar__code {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #ffffff;
  background: #e63946;
  border-radius: 4px;
}

.announcement-bar__cta {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #14a889;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.announcement-bar__cta:hover {
  color: #ffffff;
}

@media (max-width: 600px) {
  .announcement-bar__text,
  .announcement-bar__code,
  .announcement-bar__cta {
    font-size: 0.62rem;
  }
  .announcement-bar {
    padding: 0 0.5rem;
  }
}

.mobile-account {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), -3px -3px 6px rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.02);
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.mobile-account-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #000000;
  background: transparent;
  border: none;
  cursor: pointer;
}

.mobile-account-head svg {
  transition: transform 0.25s ease;
}

.mobile-account-head[data-open='true'] svg {
  transform: rotate(180deg);
}

.mobile-account-body {
  overflow: hidden;
}

.mobile-account-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 0.92rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  text-decoration: none;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease;
}

.mobile-account-item:hover {
  background: #f2f2ea;
  color: #14a889;
}

.desktop-account-wrap {
  position: relative;
  display: none;
}

.desktop-account-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  width: 220px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: var(--shadow-3d-dark), var(--shadow-3d-light);
  overflow: hidden;
  z-index: 60;
}

.desktop-account-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #000000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.desktop-account-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.8rem 1rem;
  font-size: 0.92rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  text-decoration: none;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease;
}

.desktop-account-item:first-of-type {
  border-top: none;
}

.desktop-account-item:hover {
  background: #f2f2ea;
  color: #14a889;
}

.desktop-signin-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.75rem 1rem 1rem;
}

.desktop-signin-input {
  width: 100%;
  height: 40px;
  padding: 0 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  background: #f7f7f2;
  font-size: 0.85rem;
  font-family: inherit;
  color: #000000;
  outline: none;
  transition: border 0.2s ease;
}

.desktop-signin-input:focus {
  border-color: #14a889;
}

.desktop-signin-submit {
  width: 100%;
  padding: 0.6rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #ffffff;
  background: linear-gradient(135deg, #0a3d33, #14a889, #0a3d33);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.desktop-signin-submit:hover {
  opacity: 0.9;
}

.desktop-signin-submit--success {
  background: #14a889;
  cursor: default;
  opacity: 1;
}

.desktop-signin-back {
  align-self: flex-start;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.55);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem 0;
}

.desktop-signin-back:hover {
  color: #14a889;
}

@media (min-width: 900px) {
  .desktop-account-wrap {
    display: inline-flex;
  }
}

.search-wrap {
  position: relative;
}

.search-dropdown {
  position: fixed;
  left: 1rem;
  right: 1rem;
  top: calc(var(--nav-h) + 40px + 10px);
  width: auto;
  max-width: none;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: var(--shadow-3d-dark), var(--shadow-3d-light);
  overflow: hidden;
  z-index: 60;
  padding: 0.75rem;
}

@media (min-width: 900px) {
  .search-dropdown {
    position: absolute;
    left: auto;
    right: 0;
    top: calc(100% + 12px);
    width: 280px;
    max-width: calc(100vw - 2rem);
  }
}

.search-dropdown-form {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-dropdown-input {
  flex: 1;
  height: 42px;
  padding: 0 0.85rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  background: #f7f7f2;
  font-size: 0.88rem;
  font-family: inherit;
  color: #000000;
  outline: none;
  transition: border 0.2s ease;
}

.search-dropdown-input:focus {
  border-color: #14a889;
}

.search-dropdown-submit {
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: #14a889;
  color: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.search-dropdown-submit:hover {
  background: #0a3d33;
}
`
const OFFERS = [

  { text: "Free shipping on orders over ₹999.", code: null, cta: "Shop Now", href: "/products" },
  { text: "New arrivals just dropped. Use code:", code: "NEW10", cta: "Explore", href: "/products" },
]

const NAV_LINKS = [
  { label: "Home", href: "/" },

  { label: "Products", href: "/products" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "About", href: "/about" },
  { label: "Men", href: "/products" },
  { label: "Women", href: "/women" },
  { label: "Kids", href: "/kids" },
  { label: "Contact", href: "/contact" },
  { label: "Bulk Order", href: "/bulk-orders" },
]

export default function Navbar({ cartCount }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false)
  const [showSignInForm, setShowSignInForm] = useState(false)
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [registerName, setRegisterName] = useState("")
  const [registerNumber, setRegisterNumber] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")
  const [registerStatus, setRegisterStatus] = useState("idle")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const accountRef = useRef(null)
  const searchRef = useRef(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  const handleSignInSubmit = (e) => {
    e.preventDefault()
    console.log("Sign in attempt:", { email: signInEmail, password: signInPassword })
    setIsLoggedIn(true)
    setShowSignInForm(false)
    setSignInEmail("")
    setSignInPassword("")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAccountOpen(false)
  }

  const resetRegisterForm = () => {
    setRegisterName("")
    setRegisterNumber("")
    setRegisterEmail("")
    setRegisterPassword("")
    setRegisterConfirmPassword("")
    setRegisterStatus("idle")
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (registerPassword !== registerConfirmPassword) {
      alert("Passwords do not match")
      return
    }
    // TODO: wire this up to your actual registration logic
    console.log("Register attempt:", {
      name: registerName,
      number: registerNumber,
      email: registerEmail,
      password: registerPassword,
    })
    setRegisterStatus("success")
    setTimeout(() => setRegisterStatus("goToLogin"), 1500)
  }
  const updateCartCount = () => {
    try {
      const stored = localStorage.getItem('csw_cart_items');
      if (stored) {
        const items = JSON.parse(stored);
        const count = items.reduce((acc, item) => acc + item.quantity, 0);
        setCartItemsCount(count);
      } else {
        setCartItemsCount(0);
      }
    } catch (err) {
      console.error('Error calculating cart count:', err);
      setCartItemsCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

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
        setShowSignInForm(false)
        setShowRegisterForm(false)
        resetRegisterForm()


      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)

      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    if (!mobileOpen) {
      setShowSignInForm(false)
      setShowRegisterForm(false)
      resetRegisterForm()
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) {
        setMobileOpen(false)
        setMobileAccountOpen(false)
      }
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const [offerIndex, setOfferIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setOfferIndex((i) => (i + 1) % OFFERS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
   <header className={`nav-root ${mobileOpen ? "nav-root--fixed" : ""}`}>
      <div className="announcement-bar">
        <AnimatePresence mode="wait">
          <motion.div
            key={offerIndex}
            className="announcement-bar__content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <span className="announcement-bar__text">{OFFERS[offerIndex].text}</span>
            {OFFERS[offerIndex].code && (
              <span className="announcement-bar__code">{OFFERS[offerIndex].code}</span>
            )}
            <Link to={OFFERS[offerIndex].href} className="announcement-bar__cta">
              {OFFERS[offerIndex].cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.nav
        className="nav-shell"
        data-scrolled={scrolled}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
          <motion.img
            src={logo}
            alt="Comfy Sport Logo"
            style={{
              height: '48px',
              width: 'auto',
              objectFit: 'contain'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
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
              <NavLink href={link.href} label={link.label} currentPath={location.pathname + location.search} />
            </motion.li>
          ))}
        </motion.ul>

        <div className="nav-actions">
          <div className="search-wrap" ref={searchRef}>
            <motion.button
              type="button"
              className={`icon-btn${searchOpen ? " active" : ""}`}
              aria-label="Search"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search size={20} />
            </motion.button>
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  className="search-dropdown"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <form className="search-dropdown-form" onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      className="search-dropdown-input"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="search-dropdown-submit" aria-label="Submit search">
                      <Search size={18} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/cart" style={{ textDecoration: 'none' }}>
            <motion.button
              type="button"
              className={`icon-btn${location.pathname === "/cart" ? " active" : ""}`}
              aria-label={`Cart, ${cartItemsCount} items`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <motion.span
                  className="cart-badge"
                  key={cartItemsCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </motion.button>
          </Link>

          <div className="desktop-account-wrap" ref={accountRef}>
            <motion.button
              type="button"
              className={`icon-btn${accountOpen ? " active" : ""}`}
              aria-label="My Account"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAccountOpen((v) => !v)}
            >
              <User size={20} />
            </motion.button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  className="desktop-account-menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="desktop-account-head">
                    {showSignInForm ? "Sign In" : showRegisterForm ? "Register" : "My Account"}
                  </div>

                  {showSignInForm ? (
                    <form className="desktop-signin-form" onSubmit={handleSignInSubmit}>
                      <input
                        type="email"
                        className="desktop-signin-input"
                        placeholder="Email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        required
                        autoFocus
                      />
                      <input
                        type="password"
                        className="desktop-signin-input"
                        placeholder="Password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                      />
                      <button type="submit" className="desktop-signin-submit">
                        Sign In
                      </button>
                      <button
                        type="button"
                        className="desktop-signin-back"
                        onClick={() => setShowSignInForm(false)}
                      >
                        &larr; Back
                      </button>
                    </form>
                  ) : showRegisterForm ? (
                    <form className="desktop-signin-form" onSubmit={handleRegisterSubmit}>
                      <input
                        type="text"
                        className="desktop-signin-input"
                        placeholder="Full Name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        autoFocus
                        disabled={registerStatus !== "idle"}
                      />
                      <input
                        type="tel"
                        className="desktop-signin-input"
                        placeholder="Mobile Number"
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                        required
                        disabled={registerStatus !== "idle"}
                      />
                      <input
                        type="email"
                        className="desktop-signin-input"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        disabled={registerStatus !== "idle"}
                      />
                      <input
                        type="password"
                        className="desktop-signin-input"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        disabled={registerStatus !== "idle"}
                      />
                      <input
                        type="password"
                        className="desktop-signin-input"
                        placeholder="Confirm Password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                        disabled={registerStatus !== "idle"}
                      />

                      {registerStatus === "idle" && (
                        <button type="submit" className="desktop-signin-submit">
                          Register
                        </button>
                      )}
                      {registerStatus === "success" && (
                        <button type="button" className="desktop-signin-submit desktop-signin-submit--success" disabled>
                          Registered &#10003;
                        </button>
                      )}
                      {registerStatus === "goToLogin" && (
                        <button
                          type="button"
                          className="desktop-signin-submit"
                          onClick={() => {
                            setShowRegisterForm(false)
                            resetRegisterForm()
                            setShowSignInForm(true)
                          }}
                        >
                          Go to SignIn
                        </button>
                      )}

                      {registerStatus === "idle" && (
                        <button
                          type="button"
                          className="desktop-signin-back"
                          onClick={() => {
                            setShowRegisterForm(false)
                            resetRegisterForm()
                          }}
                        >
                          &larr; Back
                        </button>
                      )}
                    </form>
                  ) : (
                    <>
                      {!isLoggedIn ? (
                        <>


                          <Link to="/profile" className="desktop-account-item" onClick={() => setAccountOpen(false)}>
                            <User size={17} />
                            View Profile
                          </Link>

                          <button
                            type="button"
                            className="desktop-account-item"
                            onClick={() => setShowSignInForm(true)}
                          >
                            <LogIn size={17} />
                            Sign in
                          </button>
                          <button
                            type="button"
                            className="desktop-account-item"
                            onClick={() => setShowRegisterForm(true)}
                          >
                            <UserPlus size={17} />
                            Register
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="desktop-account-item"
                          onClick={handleLogout}
                        >
                          <LogIn size={17} style={{ transform: "rotate(180deg)" }} />
                          Logout
                        </button>
                      )}

                      <Link to="/cart" className="desktop-account-item" onClick={() => setAccountOpen(false)}>
                        <ShoppingBag size={17} />
                        Cart
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                <div className="mobile-account">
                  <button
                    type="button"
                    className="mobile-account-head"
                    data-open={mobileAccountOpen}
                    onClick={() => setMobileAccountOpen((v) => !v)}
                  >
                    My Account
                    <ChevronDown size={18} />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileAccountOpen && (
                      <motion.div
                        className="mobile-account-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {showSignInForm ? (
                          <form className="desktop-signin-form" onSubmit={handleSignInSubmit}>
                            <input
                              type="email"
                              className="desktop-signin-input"
                              placeholder="Email"
                              value={signInEmail}
                              onChange={(e) => setSignInEmail(e.target.value)}
                              required
                            />
                            <input
                              type="password"
                              className="desktop-signin-input"
                              placeholder="Password"
                              value={signInPassword}
                              onChange={(e) => setSignInPassword(e.target.value)}
                              required
                            />
                            <button type="submit" className="desktop-signin-submit">
                              Sign In
                            </button>
                            <button
                              type="button"
                              className="desktop-signin-back"
                              onClick={() => setShowSignInForm(false)}
                            >
                              &larr; Back
                            </button>
                          </form>
                        ) : showRegisterForm ? (
                          <form className="desktop-signin-form" onSubmit={handleRegisterSubmit}>
                            <input
                              type="text"
                              className="desktop-signin-input"
                              placeholder="Full Name"
                              value={registerName}
                              onChange={(e) => setRegisterName(e.target.value)}
                              required
                              disabled={registerStatus !== "idle"}
                            />
                            <input
                              type="tel"
                              className="desktop-signin-input"
                              placeholder="Mobile Number"
                              value={registerNumber}
                              onChange={(e) => setRegisterNumber(e.target.value)}
                              required
                              disabled={registerStatus !== "idle"}
                            />
                            <input
                              type="email"
                              className="desktop-signin-input"
                              placeholder="Email"
                              value={registerEmail}
                              onChange={(e) => setRegisterEmail(e.target.value)}
                              required
                              disabled={registerStatus !== "idle"}
                            />
                            <input
                              type="password"
                              className="desktop-signin-input"
                              placeholder="Password"
                              value={registerPassword}
                              onChange={(e) => setRegisterPassword(e.target.value)}
                              required
                              disabled={registerStatus !== "idle"}
                            />
                            <input
                              type="password"
                              className="desktop-signin-input"
                              placeholder="Confirm Password"
                              value={registerConfirmPassword}
                              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                              required
                              disabled={registerStatus !== "idle"}
                            />

                            {registerStatus === "idle" && (
                              <button type="submit" className="desktop-signin-submit">
                                Register
                              </button>
                            )}
                            {registerStatus === "success" && (
                              <button type="button" className="desktop-signin-submit desktop-signin-submit--success" disabled>
                                Registered &#10003;
                              </button>
                            )}
                            {registerStatus === "goToLogin" && (
                              <button
                                type="button"
                                className="desktop-signin-submit"
                                onClick={() => {
                                  setShowRegisterForm(false)
                                  resetRegisterForm()
                                  setShowSignInForm(true)
                                }}
                              >
                                Go to SignIn
                              </button>
                            )}

                            {registerStatus === "idle" && (
                              <button
                                type="button"
                                className="desktop-signin-back"
                                onClick={() => {
                                  setShowRegisterForm(false)
                                  resetRegisterForm()
                                }}
                              >
                                &larr; Back
                              </button>
                            )}
                          </form>
                        ) : (
                          <>
                            {!isLoggedIn ? (
                              <>

                                <Link to="/profile" className="mobile-account-item" onClick={() => setMobileOpen(false)}>
                                  <User size={17} />
                                  View Profile
                                </Link>

                                <button
                                  type="button"
                                  className="mobile-account-item"
                                  onClick={() => setShowSignInForm(true)}
                                >
                                  <LogIn size={17} />
                                  Sign in
                                </button>
                                <button
                                  type="button"
                                  className="mobile-account-item"
                                  onClick={() => setShowRegisterForm(true)}
                                >
                                  <UserPlus size={17} />
                                  Register
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="mobile-account-item"
                                onClick={handleLogout}
                              >
                                <LogIn size={17} style={{ transform: "rotate(180deg)" }} />
                                Logout
                              </button>
                            )}

                            <Link to="/cart" className="mobile-account-item" onClick={() => setMobileOpen(false)}>
                              <ShoppingBag size={17} />
                              Cart
                            </Link>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
                      className={`mobile-link${isLinkActive(link.href, location) ? " active" : ""}`}
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

function isLinkActive(href, location) {
  const [linkPath, linkQuery] = href.split("?")
  const currentPath = location.pathname
  const currentQuery = new URLSearchParams(location.search)

  if (linkPath !== currentPath) return false

  if (!linkQuery) {
    return location.search === ""
  }

  const linkParams = new URLSearchParams(linkQuery)
  for (const [key, value] of linkParams) {
    if (currentQuery.get(key) !== value) return false
  }
  return true
}

function NavLink({ href, label, currentPath }) {
  const location = { pathname: currentPath.split("?")[0], search: currentPath.includes("?") ? "?" + currentPath.split("?")[1] : "" }
  const active = isLinkActive(href, location)
  return (
    <Link to={href} className={`nav-link${active ? " active" : ""}`}>
      {label}
    </Link>
  )
}