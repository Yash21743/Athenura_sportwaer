import { useState, useEffect } from "react";
import { Menu, ShoppingBag, ShoppingCart, CheckCircle, MapPin, User } from "lucide-react";
import UserSidebar from "../userlayout/UserSidebar";

// Jersey Image Imports from website assets
import amuBl from "../../assets/ath.jersey/amu_bl.jpeg";
import hills from "../../assets/ath.jersey/hills.jpeg";
import purvanchal from "../../assets/ath.jersey/purvanchal.jpeg";
import rcbred from "../../assets/ath.jersey/rcbred.jpeg";

// Sub-components
import OrderHistory from "./OrderHistory";
import MyCart from "./MyCart";
import Addresses from "./Addresses";
import EditProfile from "./EditProfile";

// Mock User Data
const MOCK_USER = {
  name: "Biswajit Roy",
  email: "biswajit@comfysportwear.com",
  phone: "+91 9876543210",
  joinDate: "July 2026",
};

// Mock Orders - Only Jerseys with website calculations
const MOCK_ORDERS = [
  {
    id: "#CS-82049",
    date: "July 12, 2026",
    status: "Delivered",
    total: "₹3,797",
    items: [
      { name: "AMU Blue Striker", qty: 2, size: "L", price: "₹1,299", image: amuBl },
      { name: "Hills FC Classic", qty: 1, size: "M", price: "₹1,199", image: hills },
    ]
  },
  {
    id: "#CS-81930",
    date: "June 28, 2026",
    status: "In Transit",
    total: "₹1,599",
    items: [
      { name: "RCB Flame Edition", qty: 1, size: "XL", price: "₹1,599", image: rcbred },
    ]
  },
  {
    id: "#CS-81544",
    date: "May 15, 2026",
    status: "Processing",
    total: "₹2,798",
    items: [
      { name: "Purvanchal Legacy", qty: 2, size: "XL", price: "₹1,399", image: purvanchal },
    ]
  }
];

// Mock Wishlist / Saved Items
const MOCK_WISHLIST = [
  { id: 1, name: "Premium Hooded Track Jacket", price: "₹2,499", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&auto=format&fit=crop" },
  { id: 2, name: "Athletic Compression Shorts", price: "₹899", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=300&auto=format&fit=crop" },
  { id: 3, name: "AMU Classic Polo Jersey", price: "₹1,699", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&auto=format&fit=crop" }
];

// Mock Addresses
const MOCK_ADDRESSES = [
  {
    id: 1,
    type: "Home",
    isDefault: true,
    fullName: "Biswajit Roy",
    addressLine: "Flat 402, Green Glen Heights, Sector 4",
    city: "Bangalore",
    state: "Karnataka",
    pinCode: "560103",
    phone: "+91 9876543210"
  },
  {
    id: 2,
    type: "Office",
    isDefault: false,
    fullName: "Biswajit Roy",
    addressLine: "Athenura Sports Tech, Block C, 7th Floor, Tech Park",
    city: "Mumbai",
    state: "Maharashtra",
    pinCode: "400051",
    phone: "+91 9876543211"
  }
];

// Reusable card container matching clean light style
const Card = ({ children, title, titleParts, sub, action, delay = 0 }) => {
  return (
    <div 
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 15px 35px -8px rgba(0, 0, 0, 0.12), 0 4px 12px -5px rgba(0, 0, 0, 0.04)",
        animation: "csw-fadein 0.45s ease both",
        animationDelay: `${delay}s`,
      }}
    >
      {(title || titleParts) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
          <div>
            {titleParts ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "15px", letterSpacing: "0.3px", margin: 0, textTransform: "uppercase" }}>
                  <span style={{ color: "#0f172a" }}>{titleParts.first} </span>
                  <span style={{ color: "#0A7F6E" }}>{titleParts.second}</span>
                </h3>
                <div style={{ width: "30px", height: "2.5px", background: "#0A7F6E", borderRadius: "1px" }} />
              </div>
            ) : (
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "15px", color: "#0f172a", letterSpacing: "0.3px", margin: 0 }}>
                {title}
              </h3>
            )}
            {sub && <p style={{ color: "#64748b", fontSize: "11px", fontFamily: "'Poppins', sans-serif", marginTop: titleParts ? "6px" : "2px", margin: 0 }}>{sub}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

// Reusable stat card matching clean light style
const StatCard = ({ title, value, badge, accent, icon, vector, delay = 0 }) => {
  const [hov, setHov] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Parse target value
    const target = parseInt(value, 10);
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp = null;
    const duration = 800; // Count-up speed (800ms)

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quad formula: t * (2 - t)
      const easeProgress = progress * (2 - progress);
      setDisplayValue(Math.floor(easeProgress * target));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#ffffff",
        border: `1px solid ${hov ? accent : "#e2e8f0"}`,
        borderRadius: "16px",
        padding: "20px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hov 
          ? "0 15px 35px -10px rgba(0, 0, 0, 0.12), 0 5px 15px -5px rgba(0, 0, 0, 0.04)" 
          : "0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        animation: "csw-fadein 0.45s ease both",
        animationDelay: `${delay}s`,
      }}
    >
      {/* Accent top line */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2.5px",
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />

      {/* Decorative vector background */}
      {vector && (
        <div 
          style={{ 
            position: "absolute", 
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: hov ? 0.35 : 0.22, 
            pointerEvents: "none",
            transition: "opacity 0.25s ease, transform 0.3s ease",
            transform: hov ? "scale(1.02)" : "scale(1)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            overflow: "hidden",
            borderRadius: "16px"
          }}
        >
          {vector}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "11px",
            background: `${accent}12`,
            border: `1px solid ${accent}25`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
            transition: "transform 0.25s ease",
            transform: hov ? "scale(1.08)" : "scale(1)",
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: accent,
            background: `${accent}10`,
            border: `1px solid ${accent}25`,
            borderRadius: "8px",
            padding: "3px 8px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {badge}
        </span>
      </div>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "30px", color: "#0f172a", marginBottom: "4px", lineHeight: 1 }}>
        {displayValue}
      </p>
      <p style={{ color: "#64748b", fontSize: "12px", fontFamily: "'Poppins', sans-serif", margin: 0 }}>{title}</p>
    </div>
  );
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth > 1024 : true);

  // Addresses, profile and cart items state
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [profile, setProfile] = useState(MOCK_USER);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkCart = () => {
      const stored = localStorage.getItem("csw_cart_items");
      if (stored) {
        try {
          setCartCount(JSON.parse(stored).length);
        } catch (e) {}
      }
    };
    checkCart();
    window.addEventListener("cartUpdated", checkCart);
    return () => window.removeEventListener("cartUpdated", checkCart);
  }, []);

  // Return header title based on active key
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "orders":
        return "Order History";
      case "cart":
        return "My Cart";
      case "addresses":
        return "Edit Address";
      case "settings":
        return "Edit Profile";
      default:
        return "Dashboard";
    }
  };

  // Get two part header titles
  const getHeaderTitleParts = () => {
    switch (activeTab) {
      case "dashboard":
        return { first: "DASHBOARD", second: "OVERVIEW" };
      case "orders":
        return { first: "ORDER", second: "HISTORY" };
      case "cart":
        return { first: "MY", second: "CART" };
      case "addresses":
        return { first: "EDIT", second: "ADDRESS" };
      case "settings":
        return { first: "EDIT", second: "PROFILE" };
      default:
        return { first: "MY", second: "DASHBOARD" };
    }
  };

  // Delivered count
  const deliveredCount = MOCK_ORDERS.filter(o => o.status === "Delivered").length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans user-dashboard-root">
      {/* Sidebar Layout */}
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={profile}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div 
        style={{
          marginLeft: isDesktop ? (sidebarCollapsed ? "72px" : "280px") : "0px",
          transition: "margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          width: isDesktop ? (sidebarCollapsed ? "calc(100% - 72px)" : "calc(100% - 280px)") : "100%",
        }}
        className="min-h-screen flex flex-col"
      >
        {/* Header/Navbar */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-30 shadow-sm py-5">
          {/* Hamburger sits inside the sticky header, absolutely on the left — mobile only */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            style={{
              position: "absolute",
              top: "50%",
              left: "16px",
              transform: "translateY(-50%)",
              zIndex: 40,
              width: "38px",
              height: "38px",
              display: isDesktop ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0A7F6E",
              border: "1px solid #0A7F6E",
              borderRadius: "9px",
              cursor: "pointer",
              padding: 0,
              transition: "opacity 0.2s ease",
              color: "#ffffff",
              boxShadow: "0 2px 8px rgba(10,127,110,0.3)"
            }}
            className="hover:opacity-90"
          >
            <Menu size={20} />
          </button>

          {/* Centered Heading and Description */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", paddingTop: "8px" }}>
            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "clamp(15px, 4vw, 24px)", letterSpacing: "0.5px", margin: 0, lineHeight: 1.1, textTransform: "uppercase" }}>
              <span style={{ color: "#0f172a" }}>{getHeaderTitleParts().first} </span>
              <span style={{ color: "#0A7F6E" }}>{getHeaderTitleParts().second}</span>
            </h1>
            <div style={{ width: "45px", height: "3.5px", background: "#0A7F6E", borderRadius: "2px" }} />
          </div>
          
          <p style={{ color: "#475569", fontSize: "13px", fontFamily: "'Poppins', sans-serif", margin: "10px auto 4px", lineHeight: 1.5, maxWidth: "600px", textAlign: "center", padding: "0 60px 0 60px" }}>
            Your orders, cart & profile — all in <strong style={{ color: "#0A7F6E", fontWeight: 700 }}>one place.</strong>
          </p>
        </header>

        {/* Content Pane */}
        <main className="user-main" style={{ padding: "24px 12px 40px", minHeight: "100vh", background: "#f8fafc", overflowX: "hidden", boxSizing: "border-box" }}>
          <div style={{ maxWidth: "1300px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
            {activeTab === "dashboard" && (
              <div className="animate-fadeIn">
                {/* Stats Row at Top */}
                <div className="csw-stats">
                  {/* Card 1: Total Orders */}
                  <StatCard 
                    title="Total Orders"
                    value={MOCK_ORDERS.length}
                    badge="Active"
                    accent="#0A7F6E"
                    icon={<ShoppingBag size={20} />}
                    delay={0}
                    vector={
                      <svg viewBox="0 0 200 50" fill="none" style={{ width: "100%", height: "50px", alignSelf: "flex-end" }} preserveAspectRatio="none">
                        <path d="M0,45 Q25,25 50,40 T100,15 T150,35 T200,5" stroke="#0A7F6E" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M0,45 Q25,25 50,40 T100,15 T150,35 T200,5 L200,50 L0,50 Z" fill="url(#grad-orders)" opacity="0.12" />
                        <defs>
                          <linearGradient id="grad-orders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0A7F6E" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                      </svg>
                    }
                  />

                  {/* Card 2: My Cart */}
                  <StatCard 
                    title="My Cart"
                    value={cartCount}
                    badge="Items"
                    accent="#ec4899"
                    icon={<ShoppingCart size={20} />}
                    delay={0.07}
                    vector={
                      <svg viewBox="0 0 120 80" fill="none" style={{ width: "130px", height: "80px", alignSelf: "flex-end" }}>
                        <circle cx="95" cy="50" r="38" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                        <circle cx="95" cy="50" r="24" stroke="#ec4899" strokeWidth="2" opacity="0.6" />
                        <g fill="#ec4899" opacity="0.25">
                          {[...Array(4)].map((_, r) =>
                            [...Array(6)].map((_, c) => (
                              <circle key={`${r}-${c}`} cx={15 + c * 10} cy={20 + r * 10} r="1.5" />
                            ))
                          )}
                        </g>
                      </svg>
                    }
                  />

                  {/* Card 3: Orders Delivered */}
                  <StatCard 
                    title="Orders Delivered"
                    value={deliveredCount}
                    badge="Delivered"
                    accent="#3B82F6"
                    icon={<CheckCircle size={20} />}
                    delay={0.14}
                    vector={
                      <svg viewBox="0 0 160 60" fill="none" style={{ width: "140px", height: "65px", alignSelf: "flex-end" }}>
                        {[12, 18, 15, 28, 22, 35, 28, 48].map((h, i) => (
                          <rect 
                            key={i} 
                            x={10 + i * 16} 
                            y={60 - h} 
                            width="8" 
                            height={h} 
                            rx="2" 
                            fill="#3B82F6" 
                            opacity={0.3 + (i * 0.1)} 
                          />
                        ))}
                        <circle cx="140" cy="15" r="3" fill="#3B82F6" opacity="0.8" />
                        <circle cx="125" cy="20" r="1.5" fill="#3B82F6" opacity="0.6" />
                      </svg>
                    }
                  />
                </div>

                {/* Main Grid */}
                <div className="csw-main-grid">
                  {/* Left Column: Recent Orders */}
                  <div className="csw-left-col">
                    <Card titleParts={{ first: "RECENT", second: "ORDERS" }} sub="Latest product purchases" delay={0.2}>
                      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginLeft: "-4px", marginRight: "-4px", paddingLeft: "4px", paddingRight: "4px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "280px" }}>
                          <thead>
                            <tr>
                              {["Order ID", "Date", "Items", "Status", "Amount"].map(h => (
                                <th
                                  key={h}
                                  style={{
                                    textAlign: h === "Amount" ? "right" : h === "Status" ? "center" : "left",
                                    padding: "7px 10px",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.8px",
                                    fontFamily: "'Poppins', sans-serif",
                                    borderBottom: "1px solid #e2e8f0"
                                  }}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {MOCK_ORDERS.slice(0, 3).map((order) => (
                              <tr
                                key={order.id}
                                className="csw-tr"
                                style={{
                                  borderBottom: "1px solid #f1f5f9",
                                  transition: "background 0.2s ease"
                                }}
                              >
                                <td style={{ padding: "12px 10px", fontSize: "12.5px", fontWeight: 700, color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>
                                  {order.id}
                                </td>
                                <td style={{ padding: "12px 10px", fontSize: "12px", color: "#64748b", fontFamily: "'Poppins', sans-serif" }}>
                                  {order.date}
                                </td>
                                <td style={{ padding: "12px 10px", fontSize: "12px", color: "#475569", fontFamily: "'Poppins', sans-serif" }}>
                                  {order.items.map(i => `${i.name.split(" - ")[0]} (${i.size})`).join(", ")}
                                </td>
                                <td style={{ padding: "12px 10px", textAlign: "center" }}>
                                  <span
                                    style={{
                                      padding: "3px 9px",
                                      borderRadius: "20px",
                                      fontSize: "10px",
                                      fontWeight: 600,
                                      background:
                                        order.status === "Delivered"
                                          ? "rgba(16,185,129,0.08)"
                                          : order.status === "In Transit"
                                          ? "rgba(59,130,246,0.08)"
                                          : "rgba(245,158,11,0.08)",
                                      color:
                                        order.status === "Delivered"
                                          ? "#10B981"
                                          : order.status === "In Transit"
                                          ? "#3B82F6"
                                          : "#F59E0B",
                                      border: `1px solid ${
                                        order.status === "Delivered"
                                          ? "rgba(16,185,129,0.2)"
                                          : order.status === "In Transit"
                                          ? "rgba(59,130,246,0.2)"
                                          : "rgba(245,158,11,0.2)"
                                      }`,
                                      fontFamily: "'Poppins', sans-serif",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td style={{ padding: "12px 10px", textAlign: "right", fontSize: "13px", fontWeight: 800, color: "#0A7F6E", fontFamily: "'Montserrat', sans-serif" }}>
                                  {order.total}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <button
                          onClick={() => setActiveTab("orders")}
                          style={{
                            width: "fit-content",
                            padding: "11px 28px",
                            marginTop: "16px",
                            background: "#F4F1EA",
                            border: "1px solid #E4DFD5",
                            borderRadius: "10px",
                            color: "#5C5243",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                            cursor: "pointer",
                            fontFamily: "'Poppins', sans-serif",
                            transition: "all 0.22s ease",
                          }}
                          onMouseEnter={e => {
                            e.target.style.background = "#EDE9DF";
                            e.target.style.borderColor = "#D9D3C7";
                          }}
                          onMouseLeave={e => {
                            e.target.style.background = "#F4F1EA";
                            e.target.style.borderColor = "#E4DFD5";
                          }}
                        >
                          View All Orders
                        </button>
                      </div>
                    </Card>
                  </div>

                  {/* Right Column: Profile details */}
                  <div className="csw-right-col">
                    <Card titleParts={{ first: "PROFILE", second: "DETAILS" }} sub="Account configuration" delay={0.25}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "16px" }}>
                        {[
                          { label: "Full Name", val: profile.name },
                          { label: "Email", val: profile.email },
                          { label: "Phone", val: profile.phone },
                          { label: "Default Address", val: addresses.find(a => a.isDefault) ? `${addresses.find(a => a.isDefault).city}, ${addresses.find(a => a.isDefault).state}` : "None set" },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              flexWrap: "wrap",
                              gap: "4px",
                              padding: "12px 0",
                              borderBottom: idx < 3 ? "1px solid #f1f5f9" : "none",
                            }}
                          >
                            <span style={{ fontSize: "10.5px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Poppins', sans-serif", fontWeight: 600, flexShrink: 0 }}>
                              {item.label}
                            </span>
                            <span style={{ fontSize: "12px", color: "#0f172a", fontFamily: "'Poppins', sans-serif", fontWeight: 600, wordBreak: "break-all", textAlign: "right", flex: "1 1 auto", minWidth: 0 }} title={item.val}>
                              {item.val}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <button
                          onClick={() => setActiveTab("settings")}
                          style={{
                            width: "fit-content",
                            padding: "11px 28px",
                            background: "linear-gradient(135deg, #0A7F6E, #0d9488)",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                            cursor: "pointer",
                            fontFamily: "'Poppins', sans-serif",
                            transition: "all 0.22s ease",
                            boxShadow: "0 4px 12px rgba(10,127,110,0.15)",
                          }}
                          onMouseEnter={e => {
                            e.target.style.transform = "translateY(-1px)";
                            e.target.style.boxShadow = "0 6px 16px rgba(10,127,110,0.25)";
                          }}
                          onMouseLeave={e => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 12px rgba(10,127,110,0.15)";
                          }}
                        >
                          Edit Profile Details
                        </button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <OrderHistory orders={MOCK_ORDERS} />
            )}

            {activeTab === "cart" && (
              <MyCart />
            )}

            {activeTab === "addresses" && (
              <Addresses addresses={addresses} setAddresses={setAddresses} />
            )}

            {activeTab === "settings" && (
              <EditProfile profile={profile} setProfile={setProfile} />
            )}
          </div>
        </main>
      </div>

      {/* Global CSS Style Rules */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
        
        .user-dashboard-root * {
          box-sizing: border-box;
        }

        @keyframes csw-fadein {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Stats Row Grid */
        .csw-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        /* 2 Column Content Layout */
        .csw-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        /* Table hover style */
        .csw-tr:hover td {
          background: #f8fafc !important;
        }

        /* Responsive Breakpoints matching AdminDashboard.jsx */
        @media (max-width: 1023px) {
          .csw-stats {
            grid-template-columns: 1fr 1fr !important;
          }
          .csw-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .csw-stats {
            grid-template-columns: 1fr !important;
          }
          .csw-main-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .csw-left-col,
          .csw-right-col {
            min-width: 0 !important;
            width: 100% !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;