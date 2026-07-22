import { useState, useEffect, useCallback } from "react";
import { useLocation, Outlet } from "react-router-dom";
import {
  Menu,
  ShoppingBag,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";

import UserSidebar from "../userlayout/UserSidebar";
import API from "../../services/api";

import OrderHistory from "./OrderHistory";
import MyCart from "./MyCart";
import EditProfile from "./EditProfile";

/* =====================================================
   CARD COMPONENT
===================================================== */

const Card = ({
  children,
  title,
  titleParts,
  sub,
  action,
  delay = 0,
}) => {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        boxShadow:
          "0 15px 35px -8px rgba(0, 0, 0, 0.12), 0 4px 12px -5px rgba(0, 0, 0, 0.04)",
        animation: "csw-fadein 0.45s ease both",
        animationDelay: delay + "s",
      }}
    >
      {(title || titleParts) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
            borderBottom: "1px solid #f1f5f9",
            paddingBottom: "14px",
          }}
        >
          <div>
            {titleParts ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "15px",
                    letterSpacing: "0.3px",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  <span style={{ color: "#0f172a" }}>
                    {titleParts.first}{" "}
                  </span>
                  <span style={{ color: "#0A7F6E" }}>
                    {titleParts.second}
                  </span>
                </h3>
                <div
                  style={{
                    width: "30px",
                    height: "2.5px",
                    background: "#0A7F6E",
                    borderRadius: "1px",
                  }}
                />
              </div>
            ) : (
              <h3
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "15px",
                  color: "#0f172a",
                  letterSpacing: "0.3px",
                  margin: 0,
                }}
              >
                {title}
              </h3>
            )}
            {sub && (
              <p
                style={{
                  color: "#64748b",
                  fontSize: "11px",
                  fontFamily: "'Poppins', sans-serif",
                  margin: "6px 0 0",
                }}
              >
                {sub}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

/* =====================================================
   STAT CARD
===================================================== */

const StatCard = ({
  title,
  value,
  badge,
  accent,
  icon,
  delay = 0,
}) => {
  const [hov, setHov] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value);
    if (Number.isNaN(target)) {
      setDisplayValue(value);
      return;
    }
    let startTimestamp = null;
    let animationFrameId;
    const duration = 800;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress);
      setDisplayValue(Math.floor(easeProgress * target));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value]);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#ffffff",
        border: "1px solid " + (hov ? accent : "#e2e8f0"),
        borderRadius: "16px",
        padding: "20px",
        transition: "all 0.3s ease",
        boxShadow: hov ? "0 15px 35px -10px rgba(0, 0, 0, 0.12)" : "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        animation: "csw-fadein 0.45s ease both",
        animationDelay: delay + "s",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2.5px", background: "linear-gradient(90deg, " + accent + ", transparent)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "11px", background: accent + "12", border: "1px solid " + accent + "25", display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>
          {icon}
        </div>
        <span style={{ fontSize: "11px", fontWeight: 600, color: accent, background: accent + "10", border: "1px solid " + accent + "25", borderRadius: "8px", padding: "3px 8px", fontFamily: "'Poppins', sans-serif" }}>
          {badge}
        </span>
      </div>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "30px", color: "#0f172a", margin: "0 0 4px", lineHeight: 1 }}>{displayValue}</p>
      <p style={{ color: "#64748b", fontSize: "12px", fontFamily: "'Poppins', sans-serif", margin: 0 }}>{title}</p>
    </div>
  );
};

/* =====================================================
   USER DASHBOARD
===================================================== */

const UserDashboard = () => {
  const location = useLocation();

  // ✅ FIX: OrderSuccess साठी देखील Outlet रेंडर होण्यासाठी isSpecialRoute वापरला आहे.
  const isSpecialRoute = 
    location.pathname.startsWith("/dashboard/checkout") || 
    location.pathname.startsWith("/dashboard/order-success");

  const [activeTab, setActiveTab] = useState(location.state?.tab || "dashboard");

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth > 1024 : true);

  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCartCount = useCallback(async () => {
    try {
      const response = await API.get("/cart");
      const cartItems = response.data?.data || response.data?.cart || response.data || [];
      const totalQuantity = Array.isArray(cartItems)
        ? cartItems.reduce((total, item) => total + Number(item.quantity || 1), 0)
        : 0;
      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
      setCartCount(0);
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, addressesRes, ordersRes] = await Promise.all([
        API.get("/users/me"),
        API.get("/addresses"),
        API.get("/orders"),
      ]);

      const profileData = profileRes.data?.data || profileRes.data?.user || profileRes.data || {};
      const addressesData = addressesRes.data?.data || addressesRes.data?.addresses || addressesRes.data || [];
      const ordersData = ordersRes.data?.data || ordersRes.data?.orders || ordersRes.data || [];

      setProfile(profileData);
      setAddresses(Array.isArray(addressesData) ? addressesData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      await getCartCount();
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [getCartCount]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const refreshCartCount = () => getCartCount();
    window.addEventListener("cartUpdated", refreshCartCount);
    return () => window.removeEventListener("cartUpdated", refreshCartCount);
  }, [getCartCount]);

  const getHeaderTitleParts = () => {
    if (isSpecialRoute) return { first: "CHECKOUT", second: "PROCESS" };
    switch (activeTab) {
      case "dashboard": return { first: "DASHBOARD", second: "OVERVIEW" };
      case "orders": return { first: "ORDER", second: "HISTORY" };
      case "cart": return { first: "MY", second: "CART" };
      case "settings": return { first: "EDIT", second: "PROFILE" };
      default: return { first: "MY", second: "DASHBOARD" };
    }
  };

  const deliveredCount = orders.filter((order) => String(order.status || "").toLowerCase() === "delivered").length;
  const defaultAddress = addresses.find((address) => address.isDefault === true || address.isDefault === "true");

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ position: "relative", width: "48px", height: "48px" }}>
          <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(10,127,110,0.15)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: 0, border: "2px solid transparent", borderTopColor: "#0A7F6E", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      </div>
    );
  }

  const headerTitle = getHeaderTitleParts();

  return (
    <div className="user-dashboard-root">
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={profile}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div
        className="dashboard-content"
        style={{
          marginLeft: isDesktop ? (sidebarCollapsed ? "72px" : "280px") : "0px",
          width: isDesktop ? (sidebarCollapsed ? "calc(100% - 72px)" : "calc(100% - 280px)") : "100%",
        }}
      >
        <header className="dashboard-header">
          <button onClick={() => setIsMobileSidebarOpen(true)} className="mobile-menu-button" style={{ display: isDesktop ? "none" : "flex" }}>
            <Menu size={20} />
          </button>
          <div className="header-title-wrapper">
            <h1 className="header-title">
              <span>{headerTitle.first} </span>
              <strong>{headerTitle.second}</strong>
            </h1>
            <div className="header-line" />
          </div>
          <p className="header-subtitle">
            Your orders, cart & profile — all in <strong>one place.</strong>
          </p>
        </header>

        <main className="dashboard-main">
          <div className="dashboard-container">
            {/* ✅ FIX: isSpecialRoute चेक करून Outlet दाखवत आहोत */}
            {isSpecialRoute ? (
              <Outlet /> 
            ) : (
              <>
                {activeTab === "dashboard" && (
                  <div className="animate-fadeIn">
                    <div className="csw-stats">
                      <StatCard title="Total Orders" value={orders.length} badge="Active" accent="#0A7F6E" icon={<ShoppingBag size={20} />} delay={0} />
                      <StatCard title="My Cart" value={cartCount} badge="Items" accent="#ec4899" icon={<ShoppingCart size={20} />} delay={0.1} />
                      <StatCard title="Orders Delivered" value={deliveredCount} badge="Delivered" accent="#3B82F6" icon={<CheckCircle size={20} />} delay={0.2} />
                    </div>

                    <div className="csw-main-grid">
                      <Card titleParts={{ first: "RECENT", second: "ORDERS" }} sub="Latest product purchases">
                        {orders.length === 0 ? (
                          <p className="empty-text">No orders yet.</p>
                        ) : (
                          <div className="table-wrapper">
                            <table>
                              <thead>
                                <tr>
                                  <th>Order ID</th><th>Date</th><th>Items</th><th>Status</th><th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orders.slice(0, 3).map((order) => (
                                  <tr key={order._id || order.orderNumber}>
                                    <td>{order.orderNumber || order._id || "N/A"}</td>
                                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</td>
                                    <td>{Array.isArray(order.items) ? order.items.map((item) => (item.name || "Product") + " (" + (item.size || "N/A") + ")").join(", ") : "N/A"}</td>
                                    <td>{order.status || "Pending"}</td>
                                    <td>₹{Number(order.total || 0).toLocaleString("en-IN")}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        <div className="center-button">
                          <button onClick={() => setActiveTab("orders")} className="secondary-button">View All Orders</button>
                        </div>
                      </Card>

                      <Card titleParts={{ first: "PROFILE", second: "DETAILS" }} sub="Account configuration">
                        {[
                          { label: "Full Name", val: profile.name || "Not set" },
                          { label: "Email", val: profile.email || "Not set" },
                          { label: "Phone", val: profile.phone || "Not set" },
                        ].map((item) => (
                          <div key={item.label} className="profile-row">
                            <span>{item.label}</span>
                            <strong>{item.val}</strong>
                          </div>
                        ))}
                        <div className="center-button">
                          <button onClick={() => setActiveTab("settings")} className="primary-button">Edit Profile Details</button>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === "orders" && <OrderHistory orders={orders} />}
                {activeTab === "cart" && <MyCart />}
                {activeTab === "settings" && <EditProfile profile={profile} setProfile={setProfile} />}
              </>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        .user-dashboard-root { min-height: 100vh; background: #f8fafc; color: #0f172a; font-family: 'Poppins', sans-serif; }
        .dashboard-content { min-height: 100vh; display: flex; flex-direction: column; transition: margin-left 0.35s ease, width 0.35s ease; }
        .dashboard-header { position: sticky; top: 0; z-index: 30; padding: 20px; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04); }
        .mobile-menu-button { position: absolute; top: 50%; left: 16px; transform: translateY(-50%); width: 38px; height: 38px; align-items: center; justify-content: center; background: #0A7F6E; border: 1px solid #0A7F6E; border-radius: 9px; cursor: pointer; color: #ffffff; }
        .header-title-wrapper { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .header-title { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: clamp(15px, 4vw, 24px); letter-spacing: 0.5px; margin: 0; text-transform: uppercase; }
        .header-title span { color: #0f172a; } .header-title strong { color: #0A7F6E; }
        .header-line { width: 45px; height: 3.5px; background: #0A7F6E; border-radius: 2px; }
        .header-subtitle { color: #475569; font-size: 13px; margin: 10px auto 4px; text-align: center; padding: 0 60px; }
        .header-subtitle strong { color: #0A7F6E; }
        .dashboard-main { flex: 1; padding: 24px 12px 40px; background: #f8fafc; overflow-x: hidden; }
        .dashboard-container { width: 100%; max-width: 1300px; margin: 0 auto; }
        .csw-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .csw-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
        .table-wrapper { width: 100%; overflow-x: auto; }
        table { width: 100%; min-width: 600px; border-collapse: collapse; }
        th { text-align: left; padding: 10px; font-size: 10px; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
        td { padding: 12px 10px; font-size: 12px; border-bottom: 1px solid #f1f5f9; }
        .empty-text { font-size: 12.5px; color: #64748b; text-align: center; padding: 24px 0; }
        .center-button { display: flex; justify-content: center; }
        .secondary-button { padding: 11px 28px; margin-top: 16px; background: #F4F1EA; border: 1px solid #E4DFD5; border-radius: 10px; cursor: pointer; font-weight: 700; }
        .primary-button { margin-top: 18px; padding: 11px 28px; background: linear-gradient(135deg, #0A7F6E, #0d9488); border: none; border-radius: 10px; color: #ffffff; cursor: pointer; font-weight: 700; }
        .profile-row { display: flex; justify-content: space-between; gap: 10px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .profile-row span { font-size: 10.5px; color: #64748b; font-weight: 600; } .profile-row strong { font-size: 12px; color: #0f172a; font-weight: 600; text-align: right; word-break: break-word; }
        @keyframes csw-fadein { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1023px) { .csw-stats { grid-template-columns: repeat(2, 1fr); } .csw-main-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .csw-stats { grid-template-columns: 1fr; } .csw-main-grid { grid-template-columns: 1fr; } .dashboard-main { padding: 16px 10px 30px; } .dashboard-header { padding: 18px 10px; } .header-subtitle { padding: 0 35px; font-size: 11px; } }
      `}</style>
    </div>
  );
};

export default UserDashboard;