import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../common/adminlayout/AdminSidebar";

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

// ─── Default New Lead ────────────────────────────────────────────────────────
const DEFAULT_NEW_LEAD = {
  name: "",
  org: "",
  email: "",
  phone: "",
  product: "Jerseys",
  qty: 10,
  status: "New",
  time: "Just now",
  message: "",
};


// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_LEADS = [
  {
    id: 1,
    name: "Rahul Sharma",
    org: "City FC",
    email: "rahul@cityfc.com",
    phone: "+91 98765 43210",
    product: "Jerseys",
    qty: 50,
    status: "New",
    time: "2 min ago",
    message: "Looking for 50 custom-printed home jerseys with sublimation print for our junior squad.",
  },
  {
    id: 2,
    name: "Priya Mehta",
    org: "DY Patil Academy",
    email: "priya.m@dypatil.edu",
    phone: "+91 91234 56789",
    product: "Track Pants",
    qty: 120,
    status: "Follow Up",
    time: "18 min ago",
    message: "Need price quotation for 120 slim-fit training track pants in dark navy blue.",
  },
  {
    id: 3,
    name: "Amit Verma",
    org: "Pune Cricket",
    email: "amit@punecricket.org",
    phone: "+91 88888 77777",
    product: "Custom Kits",
    qty: 30,
    status: "Converted",
    time: "1 hr ago",
    message: "Confirmed order. Need the logos size check details before final printing.",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    org: "St. Xavier College",
    email: "sneha.k@stxaviers.in",
    phone: "+91 77777 66666",
    product: "Hoodies",
    qty: 80,
    status: "New",
    time: "3 hr ago",
    message: "Inquiry about 80 cotton pullover hoodies with school badge embroidery.",
  },
  {
    id: 5,
    name: "Vikram Singh",
    org: "FitZone Gym",
    email: "vikram@fitzone.co.in",
    phone: "+91 99999 88888",
    product: "Sports T-Shirts",
    qty: 200,
    status: "Pending",
    time: "Yesterday",
    message: "Request for fabric swatches of sports dry-fit polyester before ordering 200 t-shirts.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const AdminLeads = () => {
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem("csw_admin_leads");
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

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
  const [viewingLead, setViewingLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [addingLead, setAddingLead] = useState(null);

  // Stats Counters
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const followUpLeads = leads.filter((l) => l.status === "Follow Up").length;
  const convertedLeads = leads.filter((l) => l.status === "Converted").length;

  useEffect(() => {
    const t = setTimeout(() => setPageIn(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem("csw_admin_leads", JSON.stringify(leads));
  }, [leads]);

  // Filter & Sort Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === "qty-desc") return b.qty - a.qty;
    if (sortBy === "qty-asc") return a.qty - b.qty;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "newest") return b.id - a.id; // Simulated chronological ordering
    return 0;
  });

  // Action handlers
  const handleStatusChange = (id, newStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    if (viewingLead && viewingLead.id === id) {
      setViewingLead((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleToggleFollowUp = (id, e) => {
    e.stopPropagation();
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const toggledStatus = l.status === "Follow Up" ? "New" : "Follow Up";
          return { ...l, status: toggledStatus };
        }
        return l;
      })
    );
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (viewingLead?.id === id) setViewingLead(null);
      if (editingLead?.id === id) setEditingLead(null);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLeads((prev) =>
      prev.map((l) => (l.id === editingLead.id ? { ...l, ...editingLead } : l))
    );
    if (viewingLead?.id === editingLead.id) {
      setViewingLead({ ...viewingLead, ...editingLead });
    }
    setEditingLead(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newId = leads.length > 0 ? Math.max(...leads.map((l) => l.id)) + 1 : 1;
    const leadToAdd = {
      ...addingLead,
      id: newId,
      time: "Just now",
    };
    setLeads((prev) => [leadToAdd, ...prev]);
    setAddingLead(null);
  };

  // Workable Simulated Export Features
  const exportToExcel = () => {
    const csvContent =
      "ID,Name,Organization,Email,Phone,Product,Qty,Status,Time,Message\n" +
      leads
        .map((l) =>
          `"${l.id}","${l.name}","${l.org}","${l.email}","${l.phone}","${l.product}","${l.qty}","${l.status}","${l.time}","${l.message.replace(/"/g, '""')}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `comfy_sport_wear_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Open a print-friendly window
    const printWindow = window.open("", "_blank");
    const printContent = `
      <html>
        <head>
          <title>Comfy Sport Wear - Leads Report</title>
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
          <p>Leads Report Summary - Generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Organization</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Inquiry Time</th>
              </tr>
            </thead>
            <tbody>
              ${leads
                .map(
                  (l) => `
                <tr>
                  <td><strong>${l.name}</strong><br/>${l.email}</td>
                  <td>${l.org}</td>
                  <td>${l.product}</td>
                  <td><strong>${l.qty}</strong></td>
                  <td class="status">${l.status}</td>
                  <td>${l.time}</td>
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

        .lead-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 20px; margin-top: 20px;
        }

        .lead-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px; padding: 18px;
          transition: all 0.3s ease; display: flex; flex-direction: column;
          cursor: pointer;
        }
        .lead-card:hover {
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
          .lead-grid { grid-template-columns: 1fr !important; }
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
          activeKey="leads"
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
                  Lead Management
                </h2>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", paddingLeft: "14px" }}>
                Track and convert customer bulk inquiries, orders, and leads.
              </p>
            </div>

            {/* Export and Add buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setAddingLead(DEFAULT_NEW_LEAD)}
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
                Add Lead
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
              title="Total Inquiries"
              value={totalLeads}
              accent="#3B82F6"
              delay={0}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              }
            />
            <StatCard
              title="New Inquiries"
              value={newLeads}
              accent="#FF3B30"
              delay={0.05}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              }
            />
            <StatCard
              title="In Follow-Up"
              value={followUpLeads}
              accent="#F59E0B"
              delay={0.1}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              }
            />
            <StatCard
              title="Converted"
              value={convertedLeads}
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
                placeholder="Search leads by name, org or product..."
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
                  <option value="Follow Up">Follow Up</option>
                  <option value="Converted">Converted</option>
                  <option value="Pending">Pending</option>
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
            {sortedLeads.length > 0 ? (
              <table className="table-view">
                <thead>
                  <tr>
                    <th>Lead Info</th>
                    <th>Inquiry Details</th>
                    <th>Status</th>
                    <th>Time Received</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeads.map((l) => {
                    const isNew = l.status === "New";
                    const isFollow = l.status === "Follow Up";
                    const isConv = l.status === "Converted";
                    const isPend = l.status === "Pending";
                    const statusColor = isConv ? "#10B981" : isNew ? "#3B82F6" : isFollow ? "#F59E0B" : "#9CA3AF";
                    const statusBg = isConv ? "rgba(16,185,129,0.15)" : isNew ? "rgba(59,130,246,0.15)" : isFollow ? "rgba(245,158,11,0.15)" : "rgba(156,163,175,0.15)";

                    return (
                      <tr key={l.id} className="table-row" onClick={() => setViewingLead(l)}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontWeight: 600, color: "#fff" }}>{l.name}</span>
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{l.org}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span><strong>{l.qty}</strong> units of <strong>{l.product}</strong></span>
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                              {l.message ? l.message.slice(0, 48) + "..." : ""}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: "10.5px", fontWeight: 700, color: statusColor, background: statusBg, padding: "3px 9px", borderRadius: "20px" }}>
                            {l.status}
                          </span>
                        </td>
                        <td style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>{l.time}</td>
                        <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                              onClick={(e) => handleToggleFollowUp(l.id, e)}
                              style={{
                                background: isFollow ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.06)",
                                border: `1px solid ${isFollow ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.1)"}`,
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: isFollow ? "#F59E0B" : "rgba(255,255,255,0.5)",
                                transition: "all 0.2s",
                              }}
                              title={isFollow ? "Unflag Follow Up" : "Flag Follow Up"}
                            >
                              <svg width="14" height="14" fill={isFollow ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                <line x1="4" y1="22" x2="4" y2="15" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setEditingLead(l)}
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
                              onClick={() => handleDelete(l.id)}
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
                No corporate leads found matching your search.
              </div>
            )}
          </div>

          {/* ── Mobile/Tablet Grid View ── */}
          <div className="mobile-only">
            {sortedLeads.length > 0 ? (
              <div className="lead-grid">
                {sortedLeads.map((l, idx) => {
                  const isNew = l.status === "New";
                  const isFollow = l.status === "Follow Up";
                  const isConv = l.status === "Converted";
                  const statusBg = isConv ? "rgba(16,185,129,0.15)" : isNew ? "rgba(59,130,246,0.15)" : isFollow ? "rgba(245,158,11,0.15)" : "rgba(156,163,175,0.15)";
                  const statusColor = isConv ? "#10B981" : isNew ? "#3B82F6" : isFollow ? "#F59E0B" : "#9CA3AF";

                  return (
                    <div
                      key={l.id}
                      className="lead-card"
                      onClick={() => setViewingLead(l)}
                      style={{
                        opacity: pageIn ? 1 : 0,
                        transform: pageIn ? "translateY(0)" : "translateY(16px)",
                        transition: `opacity 0.4s ease ${idx * 0.05}s, transform 0.4s ease ${idx * 0.05}s`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div>
                          <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "#fff", margin: 0 }}>{l.name}</h4>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{l.org}</span>
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: 700, background: statusBg, color: statusColor, padding: "3px 9px", borderRadius: "20px" }}>
                          {l.status}
                        </span>
                      </div>

                      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px", marginBottom: "14px" }}>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", margin: "0 0 4px" }}>Inquiry:</p>
                        <p style={{ fontSize: "12.5px", fontWeight: 500 }}>
                          <strong>{l.qty} units</strong> of <strong>{l.product}</strong>
                        </p>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }} onClick={(e) => e.stopPropagation()}>
                        <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.3)" }}>{l.time}</span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={(e) => handleToggleFollowUp(l.id, e)}
                            style={{
                              background: isFollow ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)",
                              border: `1px solid ${isFollow ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.08)"}`,
                              borderRadius: "8px",
                              width: "30px",
                              height: "30px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: isFollow ? "#F59E0B" : "rgba(255,255,255,0.5)",
                            }}
                          >
                            <svg width="12" height="12" fill={isFollow ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                              <line x1="4" y1="22" x2="4" y2="15" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditingLead(l)}
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
                            onClick={() => handleDelete(l.id)}
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
                No corporate leads found matching your search.
              </div>
            )}
          </div>
        </main>

        {/* ── View Lead Detail Modal ── */}
        {viewingLead && (
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
            {/* Modal Container */}
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
                    Lead Information Detail
                  </span>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "16px", margin: "2px 0 0" }}>
                    Inquiry from {viewingLead.name}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingLead(null)}
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
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["New", "Follow Up", "Converted", "Pending"].map((st) => {
                      const active = viewingLead.status === st;
                      const activeColors = {
                        New: "#3B82F6",
                        "Follow Up": "#F59E0B",
                        Converted: "#10B981",
                        Pending: "#9CA3AF",
                      };
                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(viewingLead.id, st)}
                          style={{
                            border: "none",
                            background: active ? activeColors[st] : "rgba(255,255,255,0.05)",
                            color: active ? "#fff" : "rgba(255,255,255,0.5)",
                            padding: "4px 10px",
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
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingLead.org || "Individual Inquiry"}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Requested Product</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingLead.product}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Order Quantity</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingLead.qty} units</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Time Received</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingLead.time}</p>
                  </div>
                </div>

                {/* Contact information */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "16px" }}>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Contact Information</p>
                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <a href={`mailto:${viewingLead.email}`} style={{ color: "#FF3B30", fontSize: "13px", textDecoration: "none" }}>{viewingLead.email}</a>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      <a href={`tel:${viewingLead.phone}`} style={{ color: "#fff", fontSize: "13px", textDecoration: "none" }}>{viewingLead.phone}</a>
                    </div>
                  </div>
                </div>

                {/* Inquiry message */}
                <div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>Message / Requirements</p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: "1.55", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)", padding: "14px", borderRadius: "10px" }}>
                    "{viewingLead.message || "No custom message or specific requirements provided."}"
                  </p>
                </div>

                {/* Footer buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", marginTop: "8px" }}>
                  <button
                    onClick={() => {
                      setViewingLead(null);
                      setEditingLead(viewingLead);
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
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Edit Info
                  </button>
                  <button
                    onClick={() => handleDelete(viewingLead.id)}
                    style={{
                      background: "rgba(255,59,48,0.07)",
                      border: "1px solid rgba(255,59,48,0.25)",
                      color: "#FF3B30",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Delete Lead
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Lead Modal ── */}
        {editingLead && (
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
            {/* Modal Container */}
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
              {/* Header */}
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
                  Edit Lead Information
                </h3>
                <button
                  onClick={() => setEditingLead(null)}
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

              {/* Form Body */}
              <form
                onSubmit={handleEditSubmit}
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Name & Organization */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Lead Name *
                    </label>
                    <input
                      className="csw-input"
                      required
                      value={editingLead.name}
                      onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Organization
                    </label>
                    <input
                      className="csw-input"
                      value={editingLead.org}
                      onChange={(e) => setEditingLead({ ...editingLead, org: e.target.value })}
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
                      value={editingLead.email}
                      onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Phone Number
                    </label>
                    <input
                      className="csw-input"
                      value={editingLead.phone}
                      onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Product & Qty */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Product
                    </label>
                    <input
                      className="csw-input"
                      value={editingLead.product}
                      onChange={(e) => setEditingLead({ ...editingLead, product: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 120px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Quantity *
                    </label>
                    <input
                      className="csw-input"
                      type="number"
                      required
                      value={editingLead.qty}
                      onChange={(e) => setEditingLead({ ...editingLead, qty: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Message / Requirements
                  </label>
                  <textarea
                    className="csw-textarea"
                    rows="3"
                    value={editingLead.message}
                    onChange={(e) => setEditingLead({ ...editingLead, message: e.target.value })}
                  />
                </div>

                {/* Submit / Cancel Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: "16px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setEditingLead(null)}
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
                    Save Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Add Lead Modal ── */}
        {addingLead && (
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
            {/* Modal Container */}
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
              {/* Header */}
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
                  Add New Corporate Lead
                </h3>
                <button
                  onClick={() => setAddingLead(null)}
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

              {/* Form Body */}
              <form
                onSubmit={handleAddSubmit}
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Name & Organization */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Lead Name *
                    </label>
                    <input
                      className="csw-input"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={addingLead.name}
                      onChange={(e) => setAddingLead({ ...addingLead, name: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Organization
                    </label>
                    <input
                      className="csw-input"
                      placeholder="e.g. City FC"
                      value={addingLead.org}
                      onChange={(e) => setAddingLead({ ...addingLead, org: e.target.value })}
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
                      placeholder="e.g. rahul@cityfc.com"
                      value={addingLead.email}
                      onChange={(e) => setAddingLead({ ...addingLead, email: e.target.value })}
                    />
                  </div>
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Phone Number *
                    </label>
                    <input
                      className="csw-input"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={addingLead.phone}
                      onChange={(e) => setAddingLead({ ...addingLead, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Product & Qty */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Product *
                    </label>
                    <select
                      className="csw-select"
                      required
                      value={addingLead.product}
                      onChange={(e) => setAddingLead({ ...addingLead, product: e.target.value })}
                    >
                      <option value="Jerseys">Jerseys</option>
                      <option value="Track Pants">Track Pants</option>
                      <option value="Custom Kits">Custom Kits</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Sports T-Shirts">Sports T-Shirts</option>
                    </select>
                  </div>
                  <div style={{ flex: "1 1 120px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Quantity *
                    </label>
                    <input
                      className="csw-input"
                      type="number"
                      required
                      min="1"
                      value={addingLead.qty}
                      onChange={(e) => setAddingLead({ ...addingLead, qty: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Message / Requirements
                  </label>
                  <textarea
                    className="csw-textarea"
                    rows="3"
                    placeholder="Describe custom design, colors, delivery timeline..."
                    value={addingLead.message}
                    onChange={(e) => setAddingLead({ ...addingLead, message: e.target.value })}
                  />
                </div>

                {/* Submit / Cancel Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: "16px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAddingLead(null)}
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
                    Add Lead
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

export default AdminLeads;
