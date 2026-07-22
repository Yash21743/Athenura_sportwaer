import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  ShoppingBag, 
  ShoppingCart,
  MapPin, 
  Settings, 
  LogOut, 
  ArrowLeft,
} from "lucide-react";
import logo from "../../assets/images/comfy_logo4.png";

const navItems = [
  {
    label: "My Dashboard",
    icon: <User size={18} />,
    key: "dashboard",
  },
  {
    label: "Order History",
    icon: <ShoppingBag size={18} />,
    key: "orders",
  },
  {
    label: "My Cart",
    icon: <ShoppingCart size={18} />,
    key: "cart",
  },
  {
    label: "Edit Profile",
    icon: <Settings size={18} />,
    key: "settings",
  },
];

const UserSidebar = ({ activeTab, setActiveTab, user = {}, isMobileOpen, onMobileClose, onCollapsedChange }) => {
  const collapsed = false;
  const [hoveredKey, setHoveredKey] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (onCollapsedChange) onCollapsedChange(collapsed);
  }, [collapsed, onCollapsedChange]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNav = (key) => {
    if (setActiveTab) setActiveTab(key);
    if (onMobileClose) onMobileClose();
  };

  const handleLogout = () => {
    // Save current cart under user-specific key before clearing
    try {
      const activeUser = localStorage.getItem('csw_active_user');
      if (activeUser) {
        const currentCart = localStorage.getItem('csw_cart_items');
        if (currentCart) localStorage.setItem(`csw_cart_${activeUser}`, currentCart);
        localStorage.removeItem('csw_active_user');
      }
      localStorage.removeItem('csw_cart_items');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Cart save/clear failed:', err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("csw_is_logged_in");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        onClick={onMobileClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(5,11,10,0.7)",
          zIndex: 40,
          opacity: isMobileOpen ? 1 : 0,
          pointerEvents: isMobileOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Sidebar Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isMobileOpen ? "280px" : collapsed ? "72px" : "280px",
          background: "rgba(8, 18, 16, 0.92)",
          backdropFilter: "blur(18px)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "width 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.5)",
          fontFamily: "'Manrope', sans-serif",
          overflowX: "hidden",
          overflowY: "auto",
          borderRight: "1px solid rgba(23, 184, 147, 0.10)",
        }}
        className="user-sidebar"
      >
        {/* Brand Header */}
        <div
          style={{
            padding: collapsed ? "24px 16px" : "24px 20px",
            borderBottom: "1px solid rgba(23, 184, 147, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minHeight: "80px",
            justifyContent: collapsed ? "center" : "space-between",
            transition: "all 0.35s ease",
          }}
        >
          <Link to="/" className="dashboard-logo" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <motion.img
              src={logo}
              alt="Logo"
              style={{ height: '48px', maxWidth: '230px', width: 'auto', objectFit: 'contain', paddingLeft: collapsed ? '0' : '5px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>
        </div>

        {/* User Card */}
        <div
          style={{
            margin: collapsed ? "12px 8px" : "16px 12px 10px 12px",
            padding: collapsed ? "8px" : "12px 10px",
            borderRadius: "12px",
            border: "1px solid rgba(23, 184, 147, 0.10)",
            background: "rgba(23, 184, 147, 0.02)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "all 0.3s ease",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #17B893, #0B7A63)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              flexShrink: 0
            }}
          >
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name || "User"}
              </h4>
              <p style={{ margin: 0, fontSize: "10.5px", color: "rgba(244, 251, 249, 0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email || "member@comfysport.com"}
              </p>
            </div>
          )}
        </div>




        {/* Navigation items list */}
        <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
          {navItems.map((item, idx) => {
            const isActive = activeTab === item.key;
            const isHovered = hoveredKey === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: collapsed ? "11px 16px" : "11px 14px",
                  borderRadius: "10px",
                  border: isActive ? "1px solid rgba(23, 184, 147, 0.25)" : "1px solid transparent",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(23, 184, 147, 0.18) 0%, rgba(11, 122, 99, 0.12) 100%)"
                    : isHovered
                    ? "rgba(23, 184, 147, 0.07)"
                    : "transparent",
                  color: isActive ? "#17B893" : isHovered ? "#F4FBF9" : "rgba(244, 251, 249, 0.55)",
                  transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: isActive ? "0 4px 16px rgba(23, 184, 147, 0.15), inset 0 1px 0 rgba(23, 184, 147, 0.1)" : "none",
                  transform: isActive ? "translateX(2px)" : isHovered ? "translateX(2px)" : "translateX(0)",
                  justifyContent: collapsed ? "center" : "flex-start",
                  position: "relative",
                  opacity: mounted ? 1 : 0,
                  animation: mounted ? `userSlideIn 0.4s ease ${idx * 0.05}s both` : "none",
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    color: isActive ? "#17B893" : isHovered ? "#17B893" : "rgba(244, 251, 249, 0.4)",
                    transition: "color 0.22s ease",
                  }}
                >
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  style={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    opacity: collapsed ? 0 : 1,
                    maxWidth: collapsed ? 0 : "200px",
                    transition: "opacity 0.2s ease, max-width 0.35s ease",
                    letterSpacing: "0.2px",
                  }}
                >
                  {item.label}
                </span>

                {/* Active indicator bar */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "55%",
                      background: "linear-gradient(180deg, #17B893, #0B7A63)",
                      borderRadius: "0 3px 3px 0",
                      opacity: 1,
                    }}
                  />
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div
                    style={{
                      position: "absolute",
                      left: "calc(100% + 12px)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(12, 25, 23, 0.95)",
                      backdropFilter: "blur(12px)",
                      color: "#F4FBF9",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      opacity: isHovered ? 1 : 0,
                      pointerEvents: "none",
                      transition: "opacity 0.2s ease",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                      border: "1px solid rgba(23, 184, 147, 0.2)",
                      zIndex: 100,
                    }}
                  >
                    {item.label}
                    <div
                      style={{
                        position: "absolute",
                        left: "-5px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 0,
                        height: 0,
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        borderRight: "5px solid rgba(23, 184, 147, 0.2)",
                      }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div
          style={{
            padding: "14px 10px",
            borderTop: "1px solid rgba(23, 184, 147, 0.10)",
            display: "flex",
            flexDirection: "column",
            gap: "5px"
          }}
        >
          {/* Back to Home */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              cursor: "pointer",
              background: "transparent",
              color: "rgba(244, 251, 249, 0.45)",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "all 0.22s ease",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(23, 184, 147, 0.06)";
              e.currentTarget.style.color = "#17B893";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(244, 251, 249, 0.45)";
            }}
          >
            <ArrowLeft size={14} />
            <span style={{ display: collapsed ? "none" : "inline" }}>Back to Store</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(248, 113, 113, 0.18)",
              cursor: "pointer",
              width: "100%",
              background: "rgba(248, 113, 113, 0.06)",
              color: "#F87171",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "all 0.22s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(248, 113, 113, 0.14)";
              e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.3)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(248, 113, 113, 0.06)";
              e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.18)";
            }}
          >
            <LogOut size={17} />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 500,
                opacity: collapsed ? 0 : 1,
                maxWidth: collapsed ? 0 : "200px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                transition: "opacity 0.2s ease, max-width 0.35s ease",
              }}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        @keyframes userSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .user-sidebar::-webkit-scrollbar { width: 4px; }
        .user-sidebar::-webkit-scrollbar-track { background: transparent; }
        .user-sidebar::-webkit-scrollbar-thumb { background: rgba(23, 184, 147, 0.2); border-radius: 2px; }
        .user-sidebar::-webkit-scrollbar-thumb:hover { background: rgba(23, 184, 147, 0.35); }

        .collapse-btn:hover {
          background: rgba(23, 184, 147, 0.16) !important;
          border-color: rgba(23, 184, 147, 0.3) !important;
          color: #17B893 !important;
        }

        @media (max-width: 1024px) {
          .user-sidebar {
            transform: ${isMobileOpen ? "translateX(0)" : "translateX(-100%)"} !important;
            width: 280px !important;
          }
          .collapse-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default UserSidebar;