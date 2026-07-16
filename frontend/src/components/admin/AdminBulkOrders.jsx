import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../common/adminlayout/AdminSidebar";
import API from "../../services/api";

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── StatCard Subcomponent ───────────────────────────────────────────────────
const StatCard = ({ title, value, icon, accent, delay }) => {
  const [ref, visible] = useInView();
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hov ? "rgba(255, 59, 48, 0.35)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "16px",
        padding: "18px 20px",
        opacity: visible ? 1 : 0,
        transform: visible ? (hov ? "translateY(-4px)" : "translateY(0)") : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}s, transform 0.45s cubic-bezier(0.4, 0, 0.2, 1) ${visible ? 0 : delay}s, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease`,
        boxShadow: hov ? "0 10px 24px rgba(0,0,0,0.3)" : "none",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2.5px",
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          opacity: hov ? 1 : 0.6,
          transition: "opacity 0.25s ease",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.45)", fontFamily: "'Poppins', sans-serif" }}>
          {title}
        </span>
        <div style={{ color: accent, display: "flex", alignItems: "center" }}>
          {icon}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span style={{ fontSize: "28px", fontWeight: 800, color: "#fff", fontFamily: "'Montserrat', sans-serif" }}>
          {value}
        </span>
      </div>
    </div>
  );
};

// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_BULK_ORDERS = [
  {
    id: 1,
    name: "Vikram Malhotra",
    org: "Mumbai Indians Academy",
    phone: "+91 99887 76655",
    email: "vikram@mipromotions.com",
    category: "Jerseys",
    qty: 250,
    printing: "Yes - Sublimation printing of team logo, sponsor banner, and player numbers",
    deliveryDate: "2026-07-15",
    status: "New",
    requirements: "Need premium breathable mesh fabric. Standard fit. Sizes: 50S, 100M, 80L, 20XL.",
    time: "10 mins ago"
  },
  {
    id: 2,
    name: "Ananya Roy",
    org: "St. Xavier's Athletic Club",
    phone: "+91 88776 65544",
    email: "ananya.r@stxaviers.edu",
    category: "Hoodies",
    qty: 150,
    printing: "Yes - Front embroidery of college seal and back screen-print of 'ATHLETICS'",
    deliveryDate: "2026-08-01",
    status: "Quoted",
    requirements: "Heavyweight cotton fleece, black color. Requesting price quote with embroidery setup fees.",
    time: "2 hours ago"
  },
  {
    id: 3,
    name: "Rohan Das",
    org: "Techcorp Fitness Division",
    phone: "+91 77665 54433",
    email: "rohan@techcorp.in",
    category: "Sports T-Shirts",
    qty: 500,
    printing: "Yes - Single color logo print on left chest",
    deliveryDate: "2026-07-20",
    status: "Approved",
    requirements: "Dry-fit polyester fabric in navy blue. Half-sleeves. Confirming order for corporate sports day.",
    time: "Yesterday"
  },
  {
    id: 4,
    name: "Sanjay Singhania",
    org: "Elite Tennis Club Pune",
    phone: "+91 91122 33445",
    email: "sanjay@elitetennis.in",
    category: "Shorts",
    qty: 80,
    printing: "No - Plain white training shorts",
    deliveryDate: "2026-06-30",
    status: "Completed",
    requirements: "Lightweight quick-dry fabric. Elastic waistband with drawcords. Already dispatched.",
    time: "3 days ago"
  }
];

const DEFAULT_NEW_ORDER = {
  name: "",
  org: "",
  phone: "",
  email: "",
  category: "Jerseys",
  qty: 50,
  printing: "No",
  deliveryDate: "",
  status: "New",
  requirements: "",
  time: "Just now"
};

// ─── Component ────────────────────────────────────────────────────────────────
const AdminBulkOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/bulk-orders');
      const list = response.data?.data;
      if (list && Array.isArray(list)) {
        const normalized = list.map(o => ({
          ...o,
          id: o._id,
          name: o.fullName,
          org: o.organizationName || '',
          phone: o.phoneNumber,
          email: o.emailAddress,
          category: o.productCategory,
          qty: o.quantityRequired || 0,
          printing: o.customPrinting ? 'Yes' : 'No',
          deliveryDate: o.preferredDeliveryDate ? new Date(o.preferredDeliveryDate).toISOString().split('T')[0] : '',
          status: o.status === 'pending' ? 'New' : (o.status === 'quoted' ? 'Quoted' : 'Approved'),
          requirements: o.additionalRequirements || '',
          time: new Date(o.createdAt).toLocaleDateString() || 'Recently'
        }));
        setOrders(normalized);
      }
    } catch (err) {
      console.warn("Failed to fetch bulk orders from API, using mock/cached.", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageIn, setPageIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const activeSession = sessionStorage.getItem("csw_admin_session");
    if (activeSession !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Modals state
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [addingOrder, setAddingOrder] = useState(null);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("csw_admin_bulk_orders", JSON.stringify(orders));
    }
  }, [orders]);

  // Stats Counters
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === "New").length;
  const quotedOrders = orders.filter((o) => o.status === "Quoted").length;
  const approvedOrders = orders.filter((o) => o.status === "Approved").length;

  // Filter & Sort Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "qty-desc") return b.qty - a.qty;
    if (sortBy === "qty-asc") return a.qty - b.qty;
    if (sortBy === "delivery-asc") return new Date(a.deliveryDate || 9999999999999) - new Date(b.deliveryDate || 9999999999999);
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "newest") return b.id - a.id;
    return 0;
  });

  // Action handlers
  const handleStatusChange = async (id, newStatus) => {
    let apiStatus = 'pending';
    if (newStatus === 'Quoted') apiStatus = 'quoted';
    else if (newStatus === 'Approved') apiStatus = 'confirmed';

    try {
      await API.put(`/bulk-orders/${id}`, { status: apiStatus });
      toast.success("Order status updated!");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status on server.");
      // Fallback
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
      if (viewingOrder && viewingOrder.id === id) {
        setViewingOrder((prev) => ({ ...prev, status: newStatus }));
      }
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this bulk order request?")) {
      try {
        await API.delete(`/bulk-orders/${id}`);
        toast.success("Bulk order deleted!");
        fetchOrders();
        if (viewingOrder?.id === id) setViewingOrder(null);
        if (editingOrder?.id === id) setEditingOrder(null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete order from server.");
        setOrders((prev) => prev.filter((o) => o.id !== id));
        if (viewingOrder?.id === id) setViewingOrder(null);
        if (editingOrder?.id === id) setEditingOrder(null);
      }
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setOrders((prev) =>
      prev.map((o) => (o.id === editingOrder.id ? { ...o, ...editingOrder } : o))
    );
    if (viewingOrder?.id === editingOrder.id) {
      setViewingOrder({ ...viewingOrder, ...editingOrder });
    }
    setEditingOrder(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newId = orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
    const orderToAdd = {
      ...addingOrder,
      id: newId,
      time: "Just now",
    };
    setOrders((prev) => [orderToAdd, ...prev]);
    setAddingOrder(null);
  };

  // B2B Exports
  const exportToExcel = () => {
    const csvContent =
      "ID,Name,Organization,Phone,Email,Product Category,Quantity Required,Custom Printing,Preferred Delivery Date,Status,Time,Requirements\n" +
      orders
        .map((o) =>
          `"${o.id}","${o.name}","${o.org}","${o.phone}","${o.email}","${o.category}","${o.qty}","${o.printing.replace(/"/g, '""')}","${o.deliveryDate}","${o.status}","${o.time}","${o.requirements.replace(/"/g, '""')}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `comfy_sport_wear_bulk_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    const printContent = `
      <html>
        <head>
          <title>Comfy Sport Wear - B2B Bulk Orders Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; padding: 24px; }
            h2 { color: #FF3B30; margin-bottom: 4px; }
            p { color: #666; font-size: 13px; margin: 0 0 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; border-bottom: 2px solid #ddd; text-transform: uppercase; }
            td { padding: 10px; font-size: 12.5px; border-bottom: 1px solid #eee; }
            .status { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Comfy Sport Wear</h2>
          <p>B2B Bulk Orders Report - Generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Order Contact</th>
                <th>Organization</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Printing Required</th>
                <th>Delivery Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${orders
                .map(
                  (o) => `
                <tr>
                  <td><strong>${o.name}</strong><br/>${o.email}<br/>${o.phone}</td>
                  <td>${o.org || "N/A"}</td>
                  <td>${o.category}</td>
                  <td><strong>${o.qty}</strong></td>
                  <td>${o.printing}</td>
                  <td>${o.deliveryDate || "N/A"}</td>
                  <td class="status">${o.status}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <>
      {/* ── Stylesheet Overrides ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050e1a; color: #fff; font-family: 'Poppins', sans-serif; }
        
        .csw-topbar {
          position: fixed; top: 0; left: ${sidebarCollapsed ? 72 : 260}px; right: 0; height: 64px;
          background: rgba(5, 14, 26, 0.92); backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; gap: 12px; z-index: 30;
          transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .csw-main {
          margin-left: ${sidebarCollapsed ? 72 : 260}px; padding: 80px 24px 40px; min-height: 100vh;
          transition: margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .order-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 20px; margin-top: 20px;
        }

        .order-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px; padding: 18px;
          transition: all 0.3s ease; display: flex; flex-direction: column;
          cursor: pointer;
        }
        .order-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 59, 48, 0.3);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
        }

        /* ── Input styling ── */
        .csw-input, .csw-select, .csw-textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff; border-radius: 10px; padding: 10px 14px;
          outline: none; transition: border-color 0.2s; font-family: 'Poppins', sans-serif;
          width: 100%;
        }
        .csw-input:focus, .csw-select:focus, .csw-textarea:focus {
          border-color: #FF3B30;
        }

        .csw-select option {
          background-color: #0a1526 !important;
          color: #ffffff !important;
        }

        .mobile-only {
          display: none;
        }

        @keyframes csw-dropdown {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .csw-topbar { left: 0 !important; padding: 0 14px; }
          .csw-main { margin-left: 0 !important; padding: 76px 14px 32px; }
          .csw-hamburger { display: flex !important; }
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
        }

        @media (max-width: 480px) {
          .order-grid { grid-template-columns: 1fr !important; }
          .csw-main { padding: 76px 12px 24px; }
        }

        .table-view { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table-view th {
          text-align: left; padding: 12px 16px; font-size: 11px; fontWeight: 600;
          color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 0.8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .table-view td {
          padding: 14px 16px; font-size: 13px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .table-row { cursor: pointer; }
        .table-row:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .modal-body::-webkit-scrollbar { width: 4px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: rgba(255, 59, 48, 0.3); border-radius: 2px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#050e1a", position: "relative", overflow: "hidden" }}>
        {/* Decorative Background SVGs */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "600px", pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          {/* Radial Glow 1 */}
          <div style={{ position: "absolute", top: "-100px", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 59, 48, 0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
          {/* Radial Glow 2 */}
          <div style={{ position: "absolute", top: "200px", right: "5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(10, 37, 64, 0.3) 0%, transparent 80%)", filter: "blur(50px)" }} />
          {/* Tech Grid Pattern */}
          <svg width="100%" height="100%" opacity="0.03" stroke="#fff" strokeWidth="1">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* ── Sidebar ── */}
        <AdminSidebar
          activeKey="bulkorders"
          isMobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* ── Topbar ── */}
        <header className="csw-topbar">
          {/* Left: Hamburger + Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              className="csw-hamburger"
              onClick={() => setMobileOpen(true)}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "9px",
                width: "36px",
                height: "36px",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "16px", color: "#fff" }}>
                Comfy Sport Wear
              </h1>
            </div>
          </div>

          {/* Right Profile Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.4)" }}>Admin Panel</span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: "linear-gradient(135deg,#FF3B30,#cc2020)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: "14px",
                color: "#fff",
                boxShadow: "0 0 10px rgba(255,59,48,0.3)",
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="csw-main" style={{ position: "relative", zIndex: 1 }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "24px",
              opacity: pageIn ? 1 : 0,
              transform: pageIn ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3px" }}>
                <div
                  style={{
                    width: "4px",
                    height: "22px",
                    background: "#FF3B30",
                    borderRadius: "2px",
                    boxShadow: "0 0 10px rgba(255,59,48,0.5)",
                  }}
                />
                <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff" }}>
                  B2B Bulk Orders
                </h2>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", paddingLeft: "14px" }}>
                Manage high-volume institutional sales, club uniforms, and custom print bookings.
              </p>
            </div>

            {/* Export and Add buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setAddingOrder(DEFAULT_NEW_ORDER)}
                style={{
                  background: "linear-gradient(135deg,#FF3B30 0%,#cc2e25 100%)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "background 0.2s, transform 0.2s",
                  boxShadow: "0 4px 12px rgba(255,59,48,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(255,59,48,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,59,48,0.25)";
                }}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add B2B Order
              </button>
              <button
                onClick={exportToExcel}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Export Excel
              </button>
              <button
                onClick={exportToPDF}
                style={{
                  background: "rgba(255,59,48,0.08)",
                  border: "1px solid rgba(255,59,48,0.25)",
                  color: "#FF3B30",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,59,48,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,59,48,0.08)")}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M6 9V2h12v7" />
                  <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>

          {/* KPI Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
              opacity: pageIn ? 1 : 0,
              transform: pageIn ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
            }}
          >
            <StatCard
              title="Total B2B Requests"
              value={totalOrders}
              accent="#3B82F6"
              delay={0}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M16 2v2M8 2v2M3 10h18" />
                </svg>
              }
            />
            <StatCard
              title="New Requests"
              value={newOrders}
              accent="#FF3B30"
              delay={0.05}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              }
            />
            <StatCard
              title="Pending Quotes"
              value={quotedOrders}
              accent="#F59E0B"
              delay={0.1}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              }
            />
            <StatCard
              title="Approved Orders"
              value={approvedOrders}
              accent="#10B981"
              delay={0.15}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
          </div>

          {/* Filters Bar */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "16px",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            {/* Search Input */}
            <div
              style={{
                position: "relative",
                flex: "1 1 240px",
                maxWidth: "360px",
              }}
            >
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", display: "flex" }}>
                <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                className="csw-input"
                style={{ paddingLeft: "38px", fontSize: "13px" }}
                placeholder="Search by contact, organization, product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flex: "1 1 auto", justifyContent: "flex-end" }}>
              {/* Status Filter */}
              <div style={{ minWidth: "140px", flex: "1 1 140px", maxWidth: "180px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12.5px" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Sorting Filter */}
              <div style={{ minWidth: "150px", flex: "1 1 150px", maxWidth: "180px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12.5px" }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="qty-desc">Quantity: High to Low</option>
                  <option value="qty-asc">Quantity: Low to High</option>
                  <option value="delivery-asc">Delivery: Earliest First</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Desktop Table View ── */}
          <div
            className="desktop-only"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              overflowX: "auto",
            }}
          >
            {sortedOrders.length > 0 ? (
              <table className="table-view">
                <thead>
                  <tr>
                    <th>Contact & Org</th>
                    <th>Category & Qty</th>
                    <th>Custom Printing</th>
                    <th>Preferred Delivery</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((o) => {
                    const isNew = o.status === "New";
                    const isQuoted = o.status === "Quoted";
                    const isApproved = o.status === "Approved";
                    const isCompleted = o.status === "Completed";
                    const isCancelled = o.status === "Cancelled";
                    
                    const statusColor = isCompleted ? "#10B981" : isApproved ? "#3B82F6" : isQuoted ? "#F59E0B" : isCancelled ? "#EF4444" : "#9CA3AF";
                    const statusBg = isCompleted ? "rgba(16,185,129,0.15)" : isApproved ? "rgba(59,130,246,0.15)" : isQuoted ? "rgba(245,158,11,0.15)" : isCancelled ? "rgba(239,68,68,0.15)" : "rgba(156,163,175,0.15)";

                    return (
                      <tr key={o.id} className="table-row" onClick={() => setViewingOrder(o)}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontWeight: 600, color: "#fff" }}>{o.name}</span>
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{o.org || "Individual"}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span><strong>{o.qty}</strong> units of <strong>{o.category}</strong></span>
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                              {o.email}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                            {o.printing ? (o.printing.length > 30 ? o.printing.slice(0, 30) + "..." : o.printing) : "No"}
                          </span>
                        </td>
                        <td style={{ color: "rgba(255,255,255,0.7)", fontSize: "12.5px" }}>
                          {o.deliveryDate || "Not specified"}
                        </td>
                        <td>
                          <span style={{ fontSize: "10.5px", fontWeight: 700, color: statusColor, background: statusBg, padding: "3px 9px", borderRadius: "20px" }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                              onClick={() => setEditingOrder(o)}
                              style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "rgba(255,255,255,0.6)",
                                transition: "all 0.2s",
                              }}
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(o.id)}
                              style={{
                                background: "rgba(255,59,48,0.07)",
                                border: "1px solid rgba(255,59,48,0.2)",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#FF3B30",
                                transition: "all 0.2s",
                              }}
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                No corporate bulk orders found matching your search.
              </div>
            )}
          </div>

          {/* ── Mobile/Tablet Grid View ── */}
          <div className="mobile-only">
            {sortedOrders.length > 0 ? (
              <div className="order-grid">
                {sortedOrders.map((o, idx) => {
                  const isCompleted = o.status === "Completed";
                  const isApproved = o.status === "Approved";
                  const isQuoted = o.status === "Quoted";
                  const isCancelled = o.status === "Cancelled";

                  const statusColor = isCompleted ? "#10B981" : isApproved ? "#3B82F6" : isQuoted ? "#F59E0B" : isCancelled ? "#EF4444" : "#9CA3AF";
                  const statusBg = isCompleted ? "rgba(16,185,129,0.15)" : isApproved ? "rgba(59,130,246,0.15)" : isQuoted ? "rgba(245,158,11,0.15)" : isCancelled ? "rgba(239,68,68,0.15)" : "rgba(156,163,175,0.15)";

                  return (
                    <div
                      key={o.id}
                      className="order-card"
                      onClick={() => setViewingOrder(o)}
                      style={{
                        opacity: pageIn ? 1 : 0,
                        transform: pageIn ? "translateY(0)" : "translateY(16px)",
                        transition: `opacity 0.4s ease ${idx * 0.05}s, transform 0.4s ease ${idx * 0.05}s`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div>
                          <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "#fff", margin: 0 }}>{o.name}</h4>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{o.org || "Individual"}</span>
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: 700, background: statusBg, color: statusColor, padding: "3px 9px", borderRadius: "20px" }}>
                          {o.status}
                        </span>
                      </div>

                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px", marginBottom: "14px" }}>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 2px" }}>Order Details:</p>
                        <p style={{ fontSize: "12.5px", fontWeight: 500 }}>
                          <strong>{o.qty} units</strong> of <strong>{o.category}</strong>
                        </p>
                        {o.deliveryDate && (
                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                            Delivery: {o.deliveryDate}
                          </p>
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }} onClick={(e) => e.stopPropagation()}>
                        <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.3)" }}>{o.time}</span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => setEditingOrder(o)}
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              borderRadius: "8px",
                              width: "30px",
                              height: "30px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "rgba(255,255,255,0.6)",
                            }}
                          >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(o.id)}
                            style={{
                              background: "rgba(255,59,48,0.05)",
                              border: "1px solid rgba(255,59,48,0.15)",
                              borderRadius: "8px",
                              width: "30px",
                              height: "30px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "#FF3B30",
                            }}
                          >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M3 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                No corporate bulk orders found matching your search.
              </div>
            )}
          </div>
        </main>

        {/* ── View Order Detail Modal ── */}
        {viewingOrder && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                background: "#0a1526",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                overflow: "hidden",
                animation: "csw-dropdown 0.22s cubic-bezier(0.4,0,0.2,1) both",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "18px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "10px", color: "#FF3B30", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                    B2B Order Specification
                  </span>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "16px", margin: "2px 0 0" }}>
                    Bulk Request from {viewingOrder.name}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingOrder(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    fontSize: "20px",
                    display: "flex",
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div
                className="modal-body"
                style={{
                  padding: "20px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {/* Status bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "12px", borderRadius: "10px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Inquiry Status</span>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["New", "Quoted", "Approved", "Completed", "Cancelled"].map((st) => {
                      const active = viewingOrder.status === st;
                      const activeColors = {
                        New: "#9CA3AF",
                        Quoted: "#F59E0B",
                        Approved: "#3B82F6",
                        Completed: "#10B981",
                        Cancelled: "#EF4444"
                      };
                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(viewingOrder.id, st)}
                          style={{
                            border: "none",
                            background: active ? activeColors[st] : "rgba(255,255,255,0.05)",
                            color: active ? "#fff" : "rgba(255,255,255,0.5)",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grid details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "16px" }}>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Organization</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingOrder.org || "Individual Request"}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Category Required</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingOrder.category}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Order Quantity</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingOrder.qty} units</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Preferred Delivery</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingOrder.deliveryDate || "Not Specified"}</p>
                  </div>
                </div>

                {/* Contact information */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "16px" }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>B2B Contacts</p>
                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <a href={`mailto:${viewingOrder.email}`} style={{ color: "#FF3B30", fontSize: "13px", textDecoration: "none" }}>{viewingOrder.email}</a>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      <a href={`tel:${viewingOrder.phone}`} style={{ color: "#fff", fontSize: "13px", textDecoration: "none" }}>{viewingOrder.phone}</a>
                    </div>
                  </div>
                </div>

                {/* Printing requirements */}
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "16px" }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, marginBottom: "4px" }}>Custom Printing Required</p>
                  <p style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>
                    {viewingOrder.printing}
                  </p>
                </div>

                {/* Additional requirements */}
                <div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>Additional Requirements / Details</p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: "1.55", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)", padding: "14px", borderRadius: "10px" }}>
                    "{viewingOrder.requirements || "No additional requirements specified."}"
                  </p>
                </div>

                {/* Footer buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", marginTop: "8px" }}>
                  <button
                    onClick={() => {
                      setViewingOrder(null);
                      setEditingOrder(viewingOrder);
                    }}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Edit Order
                  </button>
                  <button
                    onClick={() => handleDelete(viewingOrder.id)}
                    style={{
                      background: "rgba(255,59,48,0.07)",
                      border: "1px solid rgba(255,59,48,0.25)",
                      color: "#FF3B30",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Delete Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Order Modal ── */}
        {editingOrder && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                background: "#0a1526",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "550px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                overflow: "hidden",
                animation: "csw-dropdown 0.22s cubic-bezier(0.4,0,0.2,1) both",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: "16px" }}>
                  Edit B2B Order Details
                </h3>
                <button
                  onClick={() => setEditingOrder(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    fontSize: "20px",
                    display: "flex",
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handleEditSubmit}
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Name & Org */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Contact Name *
                    </label>
                    <input
                      className="csw-input"
                      required
                      value={editingOrder.name}
                      onChange={(e) => setEditingOrder({ ...editingOrder, name: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Organization Name
                    </label>
                    <input
                      className="csw-input"
                      value={editingOrder.org}
                      onChange={(e) => setEditingOrder({ ...editingOrder, org: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Email Address *
                    </label>
                    <input
                      className="csw-input"
                      type="email"
                      required
                      value={editingOrder.email}
                      onChange={(e) => setEditingOrder({ ...editingOrder, email: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Phone Number *
                    </label>
                    <input
                      className="csw-input"
                      required
                      value={editingOrder.phone}
                      onChange={(e) => setEditingOrder({ ...editingOrder, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category & Qty */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Product Category *
                    </label>
                    <select
                      className="csw-select"
                      required
                      value={editingOrder.category}
                      onChange={(e) => setEditingOrder({ ...editingOrder, category: e.target.value })}
                    >
                      <option value="Sports T-Shirts">Sports T-Shirts</option>
                      <option value="Jerseys">Jerseys</option>
                      <option value="Track Pants">Track Pants</option>
                      <option value="Shorts">Shorts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Tracksuits">Tracksuits</option>
                      <option value="Team Uniforms">Team Uniforms</option>
                      <option value="Custom Team Kits">Custom Team Kits</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div style={{ flex: "1 1 120px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Quantity Required *
                    </label>
                    <input
                      className="csw-input"
                      type="number"
                      required
                      min="1"
                      value={editingOrder.qty}
                      onChange={(e) => setEditingOrder({ ...editingOrder, qty: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>

                {/* Printing & Delivery Date */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 240px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Custom Printing Required
                    </label>
                    <input
                      className="csw-input"
                      value={editingOrder.printing}
                      onChange={(e) => setEditingOrder({ ...editingOrder, printing: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Preferred Delivery Date
                    </label>
                    <input
                      className="csw-input"
                      type="date"
                      value={editingOrder.deliveryDate}
                      onChange={(e) => setEditingOrder({ ...editingOrder, deliveryDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Additional Requirements
                  </label>
                  <textarea
                    className="csw-textarea"
                    rows="3"
                    value={editingOrder.requirements}
                    onChange={(e) => setEditingOrder({ ...editingOrder, requirements: e.target.value })}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    style={{
                      background: "none",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.7)",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg,#FF3B30 0%,#cc2e25 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(255,59,48,0.35)",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Add Order Modal ── */}
        {addingOrder && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                background: "#0a1526",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "550px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                overflow: "hidden",
                animation: "csw-dropdown 0.22s cubic-bezier(0.4,0,0.2,1) both",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: "16px" }}>
                  Record New B2B Bulk Order
                </h3>
                <button
                  onClick={() => setAddingOrder(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    fontSize: "20px",
                    display: "flex",
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handleAddSubmit}
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Name & Org */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Contact Name *
                    </label>
                    <input
                      className="csw-input"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={addingOrder.name}
                      onChange={(e) => setAddingOrder({ ...addingOrder, name: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Organization Name
                    </label>
                    <input
                      className="csw-input"
                      placeholder="e.g. Techcorp Club"
                      value={addingOrder.org}
                      onChange={(e) => setAddingOrder({ ...addingOrder, org: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Email Address *
                    </label>
                    <input
                      className="csw-input"
                      type="email"
                      required
                      placeholder="e.g. contact@org.com"
                      value={addingOrder.email}
                      onChange={(e) => setAddingOrder({ ...addingOrder, email: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Phone Number *
                    </label>
                    <input
                      className="csw-input"
                      required
                      placeholder="e.g. +91 99887 76655"
                      value={addingOrder.phone}
                      onChange={(e) => setAddingOrder({ ...addingOrder, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category & Qty */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Product Category *
                    </label>
                    <select
                      className="csw-select"
                      required
                      value={addingOrder.category}
                      onChange={(e) => setAddingOrder({ ...addingOrder, category: e.target.value })}
                    >
                      <option value="Sports T-Shirts">Sports T-Shirts</option>
                      <option value="Jerseys">Jerseys</option>
                      <option value="Track Pants">Track Pants</option>
                      <option value="Shorts">Shorts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Tracksuits">Tracksuits</option>
                      <option value="Team Uniforms">Team Uniforms</option>
                      <option value="Custom Team Kits">Custom Team Kits</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div style={{ flex: "1 1 120px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Quantity Required *
                    </label>
                    <input
                      className="csw-input"
                      type="number"
                      required
                      min="1"
                      value={addingOrder.qty}
                      onChange={(e) => setAddingOrder({ ...addingOrder, qty: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>

                {/* Printing & Delivery Date */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 240px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Custom Printing Required
                    </label>
                    <input
                      className="csw-input"
                      placeholder="e.g. Back name/number printing"
                      value={addingOrder.printing}
                      onChange={(e) => setAddingOrder({ ...addingOrder, printing: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Preferred Delivery Date
                    </label>
                    <input
                      className="csw-input"
                      type="date"
                      value={addingOrder.deliveryDate}
                      onChange={(e) => setAddingOrder({ ...addingOrder, deliveryDate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Additional Requirements
                  </label>
                  <textarea
                    className="csw-textarea"
                    rows="3"
                    placeholder="Sizes breakdown, fabric type preference, logo swatches..."
                    value={addingOrder.requirements}
                    onChange={(e) => setAddingOrder({ ...addingOrder, requirements: e.target.value })}
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setAddingOrder(null)}
                    style={{
                      background: "none",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.7)",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg,#FF3B30 0%,#cc2e25 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(255,59,48,0.35)",
                    }}
                  >
                    Record Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBulkOrders;
