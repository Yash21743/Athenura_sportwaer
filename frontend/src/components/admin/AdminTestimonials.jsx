import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../common/adminlayout/AdminSidebar";
import API from "../../services/api";

// ─── Hooks ─────────────────────────────────────────────────────────────────
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

// ─── StatCard Subcomponent ───────────────────────────────────────────────
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

// ─── Star Renderer Helper ─────────────────────────────────────────────────
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        width="13"
        height="13"
        fill={i <= rating ? "#F59E0B" : "none"}
        stroke="#F59E0B"
        strokeWidth="2"
        viewBox="0 0 24 24"
        style={{ marginRight: "2px", display: "inline-block", verticalAlign: "middle" }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  return <div style={{ display: "inline-flex", alignItems: "center" }}>{stars}</div>;
};

// ─── Status mapping helpers ────────────────────────────────────────────────
// 🔧 The backend model (based on the GET normalizer below) stores status as
// "active" / "inactive". The UI shows three states (Approved / Pending /
// Rejected) but the backend only really has two. "Rejected" is treated the
// same as "Pending" (inactive) on the backend — if you need a real third
// state, the backend model needs a "status" enum with 3 values instead of 2.
const toBackendStatus = (uiStatus) => (uiStatus === "Approved" ? "active" : "inactive");
const toUiStatus = (backendStatus) => (backendStatus === "active" ? "Approved" : "Pending");

const DEFAULT_NEW_TESTIMONIAL = {
  name: "",
  org: "",
  rating: 5,
  status: "Approved", // Defaults to Approved under Option A (live instantly)
  review: "",
  time: "Just now"
};

// ─── Component ──────────────────────────────────────────────────────────────
const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [savingAdd, setSavingAdd] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchTestimonials = async () => {
    try {
      setLoadingList(true);
      let list = [];
      try {
        const response = await API.get('/testimonials/admin/all');
        list = response.data?.data || [];
      } catch (adminErr) {
        console.warn("Failed to fetch admin testimonials, attempting public endpoint fallback.", adminErr);
        const fallbackRes = await API.get('/testimonials');
        list = fallbackRes.data?.data || [];
      }

      if (Array.isArray(list)) {
        const normalized = list.map(t => ({
          ...t,
          id: t._id || t.id,
          name: t.customerName || t.name || 'Anonymous Customer',
          org: t.organization || t.org || '',
          rating: t.rating || 5,
          status: (t.status === 'active' || t.status === 'Approved') ? 'Approved' : 'Pending',
          review: t.review || '',
          time: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : (t.time || 'Recently'),
          img: t.image || t.img || ''
        }));
        setTestimonials(normalized);
      }
    } catch (err) {
      console.warn("Failed to fetch testimonials from API.", err);
      toast.error("Could not load testimonials from the server.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
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

  useEffect(() => {
    const t = setTimeout(() => setPageIn(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Modals state
  const [viewingTestimonial, setViewingTestimonial] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [addingTestimonial, setAddingTestimonial] = useState(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState(null);

  // Stats Counters
  const totalReviews = testimonials.length;
  const approvedReviews = testimonials.filter((t) => t.status === "Approved").length;
  const pendingReviews = testimonials.filter((t) => t.status === "Pending").length;
  const averageRating =
    totalReviews > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews).toFixed(1)
      : "0.0";

  // Filter & Sort Testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.review.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesRating = ratingFilter === "All" || t.rating === parseInt(ratingFilter, 10);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    if (sortBy === "rating-desc") return b.rating - a.rating;
    if (sortBy === "rating-asc") return a.rating - b.rating;
    if (sortBy === "newest") return String(b.id).localeCompare(String(a.id));
    return 0;
  });

  // ── Status change: PUT to backend, then refetch ──
  const handleStatusChange = async (id, newStatus) => {
    const apiStatus = toBackendStatus(newStatus);
    try {
      await API.put(`/testimonials/${id}`, { status: apiStatus });
      toast.success("Testimonial status updated!");
      if (viewingTestimonial && viewingTestimonial.id === id) {
        setViewingTestimonial((prev) => ({ ...prev, status: newStatus }));
      }
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status on server.");
    }
  };

  // ── Delete: DELETE on backend, then refetch ──
  const confirmDelete = async () => {
    if (!deletingTestimonial) return;
    const id = deletingTestimonial.id;
    try {
      await API.delete(`/testimonials/${id}`);
      toast.success("Testimonial deleted successfully!");
      if (viewingTestimonial?.id === id) setViewingTestimonial(null);
      if (editingTestimonial?.id === id) setEditingTestimonial(null);
      setDeletingTestimonial(null);
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete testimonial from server.");
    }
  };

  const handleDelete = (idOrObj, e) => {
    if (e) e.stopPropagation();
    const item = typeof idOrObj === "object" ? idOrObj : testimonials.find((t) => t.id === idOrObj);
    if (item) setDeletingTestimonial(item);
    else if (idOrObj) setDeletingTestimonial({ id: idOrObj, name: "Testimonial" });
  };

  // ── Edit: PUT to backend (was previously local-state only — now fixed) ──
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await API.put(`/testimonials/${editingTestimonial.id}`, {
        customerName: editingTestimonial.name,
        organization: editingTestimonial.org,
        rating: editingTestimonial.rating,
        review: editingTestimonial.review,
        status: toBackendStatus(editingTestimonial.status),
      });
      toast.success("Testimonial updated!");
      if (viewingTestimonial?.id === editingTestimonial.id) {
        setViewingTestimonial({ ...viewingTestimonial, ...editingTestimonial });
      }
      setEditingTestimonial(null);
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save changes to the server.");
    } finally {
      setSavingEdit(false);
    }
  };

  // ── Add: POST to backend (was previously local-state only — now fixed) ──
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSavingAdd(true);
    try {
      await API.post('/testimonials', {
        customerName: addingTestimonial.name,
        organization: addingTestimonial.org,
        rating: addingTestimonial.rating,
        review: addingTestimonial.review,
        status: toBackendStatus(addingTestimonial.status),
      });
      toast.success("Testimonial recorded!");
      setAddingTestimonial(null);
      await fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save testimonial to the server.");
    } finally {
      setSavingAdd(false);
    }
  };

  // Excel / PDF Exports
  const exportToExcel = () => {
    const csvContent =
      "ID,Name,Organization,Rating,Status,Time,Review Content\n" +
      testimonials
        .map((t) =>
          `"${t.id}","${t.name}","${t.org}","${t.rating}","${t.status}","${t.time}","${t.review.replace(/"/g, '""')}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `comfy_sport_wear_testimonials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    const printContent = `
      <html>
        <head>
          <title>Comfy Sport Wear - Testimonials Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; padding: 24px; }
            h2 { color: #0A7F6E; margin-bottom: 4px; }
            p { color: #666; font-size: 13px; margin: 0 0 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; border-bottom: 2px solid #ddd; text-transform: uppercase; }
            td { padding: 10px; font-size: 12.5px; border-bottom: 1px solid #eee; }
            .rating { color: #F59E0B; font-weight: bold; }
            .status { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Comfy Sport Wear</h2>
          <p>Customer Testimonials Summary - Generated on ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Customer / Org</th>
                <th>Rating</th>
                <th>Review Feedback</th>
                <th>Status</th>
                <th>Date Received</th>
              </tr>
            </thead>
            <tbody>
              ${testimonials
                .map(
                  (t) => `
                <tr>
                  <td><strong>${t.name}</strong><br/>${t.org || "Individual Customer"}</td>
                  <td class="rating">${t.rating} Stars</td>
                  <td>"${t.review}"</td>
                  <td class="status">${t.status}</td>
                  <td>${t.time}</td>
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
        body { background: #070C0B; color: #DDDFD2; font-family: 'Poppins', sans-serif; }
        
        .csw-topbar {
          position: fixed; top: 0; left: ${sidebarCollapsed ? 72 : 260}px; right: 0; height: 64px;
          background: rgba(7, 12, 11, 0.92); backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; gap: 12px; z-index: 30;
          transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .csw-main {
          margin-left: ${sidebarCollapsed ? 72 : 260}px; padding: 80px 24px 40px; min-height: 100vh;
          transition: margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .review-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 20px; margin-top: 20px;
        }

        .review-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px; padding: 18px;
          transition: all 0.3s ease; display: flex; flex-direction: column;
          cursor: pointer;
        }
        .review-card:hover {
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
          border-color: #0A7F6E;
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
          .review-grid { grid-template-columns: 1fr !important; }
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

      <div style={{ minHeight: "100vh", background: "#070C0B", position: "relative", overflow: "hidden" }}>
        {/* Decorative Background SVGs */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "600px", pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-100px", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255, 59, 48, 0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", top: "200px", right: "5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(10, 37, 64, 0.3) 0%, transparent 80%)", filter: "blur(50px)" }} />
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
          activeKey="testimonials"
          isMobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* ── Topbar ── */}
        <header className="csw-topbar">
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

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.4)" }}>Admin Panel</span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: "linear-gradient(135deg,#0A7F6E,#08695C)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: "14px",
                color: "#fff",
                boxShadow: "0 0 10px rgba(10,127,110,0.3)",
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="csw-main" style={{ position: "relative", zIndex: 1 }}>
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
                    background: "#0A7F6E",
                    borderRadius: "2px",
                    boxShadow: "0 0 10px rgba(10,127,110,0.5)",
                  }}
                />
                <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff" }}>
                  Testimonials Moderation
                </h2>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", paddingLeft: "14px" }}>
                Approve, reject, edit, or manually upload client testimonials (Option A active: reviews display immediately).
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setAddingTestimonial(DEFAULT_NEW_TESTIMONIAL)}
                style={{
                  background: "linear-gradient(135deg,#0A7F6E 0%,#08695C 100%)",
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
                  boxShadow: "0 4px 12px rgba(10,127,110,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(10,127,110,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(10,127,110,0.25)";
                }}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add Testimonial
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
                  background: "rgba(10,127,110,0.08)",
                  border: "1px solid rgba(10,127,110,0.25)",
                  color: "#0A7F6E",
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
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(10,127,110,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(10,127,110,0.08)")}
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
              title="Total Testimonials"
              value={totalReviews}
              accent="#3B82F6"
              delay={0}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              }
            />
            <StatCard
              title="Approved (Live)"
              value={approvedReviews}
              accent="#10B981"
              delay={0.05}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              }
            />
            <StatCard
              title="Pending Approval"
              value={pendingReviews}
              accent="#F59E0B"
              delay={0.1}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              }
            />
            <StatCard
              title="Average Rating"
              value={`${averageRating} / 5.0`}
              accent="#0A7F6E"
              delay={0.15}
              icon={
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
                placeholder="Search by reviewer name, organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flex: "1 1 auto", justifyContent: "flex-end" }}>
              <div style={{ minWidth: "140px", flex: "1 1 140px", maxWidth: "160px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12.5px" }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div style={{ minWidth: "130px", flex: "1 1 130px", maxWidth: "150px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12.5px" }}
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="All">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div style={{ minWidth: "150px", flex: "1 1 150px", maxWidth: "180px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12.5px" }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="rating-asc">Rating: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {loadingList ? (
            <div style={{ padding: "60px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
              Loading testimonials...
            </div>
          ) : (
            <>
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
                {sortedTestimonials.length > 0 ? (
                  <table className="table-view">
                    <thead>
                      <tr>
                        <th>Customer Info</th>
                        <th>Rating</th>
                        <th>Review Content</th>
                        <th>Status</th>
                        <th>Received</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTestimonials.map((t) => {
                        const isApp = t.status === "Approved";
                        const statusColor = isApp ? "#10B981" : "#F59E0B";
                        const statusBg = isApp ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)";

                        return (
                          <tr key={t.id} className="table-row" onClick={() => setViewingTestimonial(t)}>
                            <td>
                              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ fontWeight: 600, color: "#fff" }}>{t.name}</span>
                                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{t.org || "Individual Customer"}</span>
                              </div>
                            </td>
                            <td>{renderStars(t.rating)}</td>
                            <td>
                              <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.7)" }}>
                                {t.review.length > 55 ? `"${t.review.slice(0, 55)}..."` : `"${t.review}"`}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: "10.5px", fontWeight: 700, color: statusColor, background: statusBg, padding: "3px 9px", borderRadius: "20px" }}>
                                {t.status}
                              </span>
                            </td>
                            <td style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>{t.time}</td>
                            <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                                <button
                                  onClick={() => setEditingTestimonial(t)}
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
                                  onClick={(e) => handleDelete(t.id, e)}
                                  style={{
                                    background: "rgba(10,127,110,0.07)",
                                    border: "1px solid rgba(10,127,110,0.2)",
                                    borderRadius: "8px",
                                    width: "32px",
                                    height: "32px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    color: "#0A7F6E",
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
                    No testimonials found matching your search filters.
                  </div>
                )}
              </div>

              {/* ── Mobile/Tablet Grid View ── */}
              <div className="mobile-only">
                {sortedTestimonials.length > 0 ? (
                  <div className="review-grid">
                    {sortedTestimonials.map((t, idx) => {
                      const isApp = t.status === "Approved";
                      const statusColor = isApp ? "#10B981" : "#F59E0B";
                      const statusBg = isApp ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)";

                      return (
                        <div
                          key={t.id}
                          className="review-card"
                          onClick={() => setViewingTestimonial(t)}
                          style={{
                            opacity: pageIn ? 1 : 0,
                            transform: pageIn ? "translateY(0)" : "translateY(16px)",
                            transition: `opacity 0.4s ease ${idx * 0.05}s, transform 0.4s ease ${idx * 0.05}s`,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div>
                              <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "#fff", margin: 0 }}>{t.name}</h4>
                              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{t.org || "Individual"}</span>
                            </div>
                            <span style={{ fontSize: "10px", fontWeight: 700, background: statusBg, color: statusColor, padding: "3px 9px", borderRadius: "20px" }}>
                              {t.status}
                            </span>
                          </div>

                          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px", marginBottom: "14px" }}>
                            <div style={{ marginBottom: "6px" }}>{renderStars(t.rating)}</div>
                            <p style={{ fontSize: "12.5px", fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>
                              "{t.review.length > 90 ? `${t.review.slice(0, 90)}...` : t.review}"
                            </p>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }} onClick={(e) => e.stopPropagation()}>
                            <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.3)" }}>{t.time}</span>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button
                                onClick={() => setEditingTestimonial(t)}
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
                                onClick={(e) => handleDelete(t.id, e)}
                                style={{
                                  background: "rgba(10,127,110,0.05)",
                                  border: "1px solid rgba(10,127,110,0.15)",
                                  borderRadius: "8px",
                                  width: "30px",
                                  height: "30px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  color: "#0A7F6E",
                                }}
                              >
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
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
                    No testimonials found matching your search filters.
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* ── View Testimonial Detail Modal ── */}
        {viewingTestimonial && (
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
                  padding: "18px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "10px", color: "#0A7F6E", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                    Testimonial Moderation Panel
                  </span>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "16px", margin: "2px 0 0" }}>
                    Review Details
                  </h3>
                </div>
                <button
                  onClick={() => setViewingTestimonial(null)}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "12px", borderRadius: "10px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Live Status</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["Approved", "Pending"].map((st) => {
                      const active = viewingTestimonial.status === st;
                      const activeColors = {
                        Approved: "#10B981",
                        Pending: "#F59E0B",
                      };
                      return (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(viewingTestimonial.id, st)}
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "16px" }}>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Reviewer Name</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingTestimonial.name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Organization</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingTestimonial.org || "Individual Customer"}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Rating Given</p>
                    <div style={{ marginTop: "3px" }}>{renderStars(viewingTestimonial.rating)} ({viewingTestimonial.rating} Stars)</div>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600 }}>Received</p>
                    <p style={{ fontSize: "13.5px", fontWeight: 600 }}>{viewingTestimonial.time}</p>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>Testimonial Text</p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: "1.6", fontStyle: "italic", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)", padding: "14px", borderRadius: "10px" }}>
                    "{viewingTestimonial.review}"
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", marginTop: "8px" }}>
                  <button
                    onClick={() => {
                      setViewingTestimonial(null);
                      setEditingTestimonial(viewingTestimonial);
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
                    Edit Info
                  </button>
                  <button
                    onClick={(e) => handleDelete(viewingTestimonial.id, e)}
                    style={{
                      background: "rgba(10,127,110,0.07)",
                      border: "1px solid rgba(10,127,110,0.25)",
                      color: "#0A7F6E",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Testimonial Modal ── */}
        {editingTestimonial && (
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
                maxWidth: "500px",
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
                  Edit Testimonial Details
                </h3>
                <button
                  onClick={() => setEditingTestimonial(null)}
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
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Customer Name *
                  </label>
                  <input
                    className="csw-input"
                    required
                    value={editingTestimonial.name}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Organization / Club Name
                  </label>
                  <input
                    className="csw-input"
                    value={editingTestimonial.org}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, org: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Star Rating *
                  </label>
                  <select
                    className="csw-select"
                    required
                    value={editingTestimonial.rating}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value, 10) || 5 })}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Testimonial Content *
                  </label>
                  <textarea
                    className="csw-textarea"
                    rows="4"
                    required
                    value={editingTestimonial.review}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, review: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    disabled={savingEdit}
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
                    disabled={savingEdit}
                    style={{
                      background: "linear-gradient(135deg,#0A7F6E 0%,#08695C 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: savingEdit ? "not-allowed" : "pointer",
                      opacity: savingEdit ? 0.7 : 1,
                      boxShadow: "0 4px 16px rgba(10,127,110,0.35)",
                    }}
                  >
                    {savingEdit ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Add Testimonial Modal ── */}
        {addingTestimonial && (
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
                maxWidth: "500px",
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
                  Record Offline Testimonial
                </h3>
                <button
                  onClick={() => setAddingTestimonial(null)}
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
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Customer Name *
                  </label>
                  <input
                    className="csw-input"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={addingTestimonial.name}
                    onChange={(e) => setAddingTestimonial({ ...addingTestimonial, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Organization / Club Name
                  </label>
                  <input
                    className="csw-input"
                    placeholder="e.g. Mumbai Football Academy"
                    value={addingTestimonial.org}
                    onChange={(e) => setAddingTestimonial({ ...addingTestimonial, org: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Star Rating *
                  </label>
                  <select
                    className="csw-select"
                    required
                    value={addingTestimonial.rating}
                    onChange={(e) => setAddingTestimonial({ ...addingTestimonial, rating: parseInt(e.target.value, 10) || 5 })}
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Fair)</option>
                    <option value="1">1 Star (Poor)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Testimonial Content *
                  </label>
                  <textarea
                    className="csw-textarea"
                    rows="4"
                    required
                    placeholder="Enter review received via Google, Email, or WhatsApp..."
                    value={addingTestimonial.review}
                    onChange={(e) => setAddingTestimonial({ ...addingTestimonial, review: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", marginTop: "8px" }}>
                  <button
                    type="button"
                    onClick={() => setAddingTestimonial(null)}
                    disabled={savingAdd}
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
                    disabled={savingAdd}
                    style={{
                      background: "linear-gradient(135deg,#0A7F6E 0%,#08695C 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: savingAdd ? "not-allowed" : "pointer",
                      opacity: savingAdd ? 0.7 : 1,
                      boxShadow: "0 4px 16px rgba(10,127,110,0.35)",
                    }}
                  >
                    {savingAdd ? "Saving..." : "Record Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Custom Delete Confirmation Modal ── */}
        {deletingTestimonial && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              zIndex: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              backdropFilter: "blur(6px)",
            }}
            onClick={() => setDeletingTestimonial(null)}
          >
            <div
              style={{
                background: "#0d1b2a",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "420px",
                padding: "24px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                Delete Testimonial?
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>
                Are you sure you want to delete testimonial by <strong>"{deletingTestimonial.name}"</strong>? This action cannot be undone.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  onClick={() => setDeletingTestimonial(null)}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "9px 20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    border: "none",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "9px 20px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTestimonials;