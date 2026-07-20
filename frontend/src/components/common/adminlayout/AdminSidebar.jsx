import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import logo from "../../../assets/images/comfy_logo4.png";


const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    key: "dashboard",
  },
  {
    label: "Products",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
    key: "products",
  },
//   {
//     label: "Categories",
//     icon: (
//       <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//         <path d="M3 5h8M3 10h5M3 15h8M3 20h5M13 5l4 4-4 4M21 9h-4" />
//       </svg>
//     ),
//     key: "categories",
//   },
  {
    label: "Leads",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    key: "leads",
  },
  {
    label: "Bulk Orders",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 17H5a2 2 0 00-2 2v0a2 2 0 002 2h14a2 2 0 002-2v0a2 2 0 00-2-2h-4" />
        <rect x="7" y="3" width="10" height="14" rx="2" />
        <path d="M10 7h4M10 11h4" />
      </svg>
    ),
    key: "bulkorders",
  },
  {
    label: "Testimonials",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    key: "testimonials",
  },
];

const AdminSidebar = ({ activeKey, onNavigate, isMobileOpen, onMobileClose, onCollapsedChange }) => {
  const [collapsed, setCollapsed] = useState(false);
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
    const routeMap = {
      dashboard: "/admin/dashboard",
      products: "/admin/products",
      categories: "/admin/categories",
      leads: "/admin/leads",
      bulkorders: "/admin/bulk-orders",
      testimonials: "/admin/testimonials",
    };
    if (routeMap[key]) {
      navigate(routeMap[key]);
    }
    if (onNavigate) onNavigate(key);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
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

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isMobileOpen ? "260px" : collapsed ? "72px" : "260px",
          background: "rgba(8, 18, 16, 0.92)",
          backdropFilter: "blur(18px)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "width 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          transform: isMobileOpen ? "translateX(0)" : "translateX(0)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.5)",
          fontFamily: "'Manrope', sans-serif",
          overflowX: "hidden",
          overflowY: "auto",
          borderRight: "1px solid rgba(23, 184, 147, 0.10)",
        }}
        className="admin-sidebar"
      >
        {/* Brand Header */}
        <div
          style={{
            padding: collapsed ? "24px 16px" : "24px 20px",

            borderBottom: "1px solid rgba(10,127,110,0.2)",

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
              alt="Comfy Sportswear Logo"
              style={{ height: '84px', width: 'auto', objectFit: 'contain', paddingLeft: collapsed ? '0' : '30px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>

          {/* Collapse Toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "rgba(23, 184, 147, 0.08)",
              border: "1px solid rgba(23, 184, 147, 0.15)",
              borderRadius: "8px",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(23, 184, 147, 0.7)",
              flexShrink: 0,
              transition: "background 0.2s ease, transform 0.3s ease, border-color 0.2s ease",
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
            className="collapse-btn"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Section Label */}
        {!collapsed && (
          <div
            style={{
              padding: "16px 20px 8px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "1.6px",
              textTransform: "uppercase",
              color: "rgba(23, 184, 147, 0.5)",
              transition: "opacity 0.2s ease",
            }}
          >
            Navigation
          </div>
        )}
        {collapsed && <div style={{ height: "12px" }} />}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
          {navItems.map((item, idx) => {
            const isActive = activeKey === item.key;
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
                  animation: mounted ? `slideIn 0.4s ease ${idx * 0.05}s both` : "none",
                  fontFamily: "'Manrope', sans-serif",
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
                    fontFamily: "'Manrope', sans-serif",
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
                      fontFamily: "'Manrope', sans-serif",
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

        {/* Bottom User Section */}
        <div
          style={{
            padding: "14px 10px",
            borderTop: "1px solid rgba(23, 184, 147, 0.10)",
          }}
        >
          {/* Logout */}
          <button
            onClick={() => {
              sessionStorage.removeItem("csw_admin_session");
              sessionStorage.removeItem("csw_admin_token");
              navigate("/admin");
            }}
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
              fontFamily: "'Manrope', sans-serif",
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
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
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
              Logout
            </span>
          </button>
        </div>
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .admin-sidebar::-webkit-scrollbar { width: 4px; }
        .admin-sidebar::-webkit-scrollbar-track { background: transparent; }
        .admin-sidebar::-webkit-scrollbar-thumb { background: rgba(23, 184, 147, 0.2); border-radius: 2px; }
        .admin-sidebar::-webkit-scrollbar-thumb:hover { background: rgba(23, 184, 147, 0.35); }
        .collapse-btn:hover {
          background: rgba(23, 184, 147, 0.16) !important;
          border-color: rgba(23, 184, 147, 0.3) !important;
          color: #17B893 !important;
        }


        @media (max-width: 768px) {
          .admin-sidebar {
            transform: ${isMobileOpen ? "translateX(0)" : "translateX(-100%)"} !important;
            width: 260px !important;
          }
          .collapse-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;