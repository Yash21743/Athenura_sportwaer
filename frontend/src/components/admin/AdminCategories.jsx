import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../common/adminlayout/AdminSidebar";

// ─── SVG Icon Components for Categories ──────────────────────────────────────
const CategoryIcon = ({ type, size = 24, color = "currentColor" }) => {
  const icons = {
    shirt: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 4L18 8V12C18 15.31 15.31 18 12 18C8.69 18 6 15.31 6 12V8L12 4Z" />
        <path d="M12 4V18" />
        <path d="M9 8H15" />
      </svg>
    ),
    jersey: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 4L9 7H15L18 4L21 8L18 10V20H6V10L3 8L6 4Z" />
        <path d="M10 7V13H14V7" />
      </svg>
    ),
    pants: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M8 2H16V22L12 18L8 22V2z" />
        <path d="M12 2V18" />
      </svg>
    ),
    hoodie: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 12V21H20V12" />
        <path d="M12 3C8.5 3 6 5.5 6 9H18C18 5.5 15.5 3 12 3Z" />
        <path d="M12 9V21" />
        <path d="M9 13H15" />
      </svg>
    ),
    jacket: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M5 3L8 6V20H16V6L19 3L21 6V21H3V6L5 3Z" />
        <path d="M12 3V20" />
      </svg>
    ),
    kits: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M18 14V20" />
        <path d="M15 17H21" />
      </svg>
    ),
    accessories: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3V21" />
        <path d="M3 12H21" />
        <path d="M8 8L16 16" />
        <path d="M16 8L8 16" />
      </svg>
    ),
    generic: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  };
  return icons[type] || icons.generic;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_CATEGORIES = [
  { id: 1, name: "Sports T-Shirts", slug: "sports-t-shirts", desc: "Performance dry-fit t-shirts for training and running.", iconType: "shirt", count: 24, status: "Active" },
  { id: 2, name: "Performance Jerseys", slug: "performance-jerseys", desc: "Custom and team sublimation jerseys for professional games.", iconType: "jersey", count: 18, status: "Active" },
  { id: 3, name: "Team Uniforms", slug: "team-uniforms", desc: "Complete matched apparel sets for soccer, cricket, and school leagues.", iconType: "kits", count: 12, status: "Active" },
  { id: 4, name: "Sports Shorts", slug: "sports-shorts", desc: "Lightweight and flexible shorts with internal lining.", iconType: "generic", count: 15, status: "Active" },
  { id: 5, name: "Track Pants", slug: "track-pants", desc: "Athletic fit and high-stretch joggers and lower track apparel.", iconType: "pants", count: 32, status: "Active" },
  { id: 6, name: "Hoodies", slug: "hoodies", desc: "Heavyweight fleece and winter pre-workout pullover hoodies.", iconType: "hoodie", count: 10, status: "Active" },
  { id: 7, name: "Tracksuits", slug: "tracksuits", desc: "Premium matching warmup jackets and track trousers.", iconType: "jacket", count: 9, status: "Active" },
  { id: 8, name: "Custom Team Kits", slug: "custom-team-kits", desc: "Sublimated and customized sports jerseys with logo and printing options.", iconType: "kits", count: 6, status: "Active" },
  { id: 9, name: "Accessories", slug: "accessories", desc: "Sports wristbands, compression socks, and athletic equipment gear.", iconType: "accessories", count: 14, status: "Active" },
];

const DEFAULT_FORM = {
  name: "",
  desc: "",
  iconType: "generic",
  status: "Active",
};

// ─── Component ────────────────────────────────────────────────────────────────
const AdminCategories = () => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("csw_admin_categories");
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageIn, setPageIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const activeSession = sessionStorage.getItem("csw_admin_session");
    if (activeSession !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  useEffect(() => {
    const t = setTimeout(() => setPageIn(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem("csw_admin_categories", JSON.stringify(categories));
  }, [categories]);

  // Filters Categories
  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Modal Handlers
  const openAddModal = () => {
    setEditingCategory(null);
    setFormData(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      desc: cat.desc,
      iconType: cat.iconType,
      status: cat.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(DEFAULT_FORM);
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category? Products in this category will remain, but will lose their category association.")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const updatedData = {
      name: formData.name,
      slug,
      desc: formData.desc,
      iconType: formData.iconType,
      status: formData.status,
    };

    if (editingCategory) {
      // Edit
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updatedData } : c))
      );
    } else {
      // Add
      const newCategory = {
        id: Date.now(),
        count: 0,
        ...updatedData,
      };
      setCategories((prev) => [newCategory, ...prev]);
    }
    closeModal();
  };

  return (
    <>
      {/* ── Stylesheet Overrides ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050e1a; color: #fff; font-family: 'Poppins', sans-serif; }
        
        .csw-topbar {
          position: fixed; top: 0; left: 256px; right: 0; height: 64px;
          background: rgba(5, 14, 26, 0.92); backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; gap: 12px; z-index: 30;
          transition: left 0.32s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .csw-main {
          margin-left: 256px; padding: 80px 24px 40px; min-height: 100vh;
          transition: margin-left 0.32s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-grid {
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px; margin-top: 20px;
        }

        .category-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px; padding: 20px;
          transition: all 0.3s ease; display: flex; flex-direction: column;
          position: relative;
        }
        .category-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 59, 48, 0.3);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
        }

        .category-icon-wrapper {
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(255, 59, 48, 0.08); border: 1px solid rgba(255, 59, 48, 0.2);
          display: flex; align-items: center; justify-content: center;
          color: #FF3B30; margin-bottom: 16px;
        }

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
          background-color: #0d1f35 !important;
          color: #ffffff !important;
        }

        /* ── Responsive breakpoints ── */
        @media (max-width: 768px) {
          .csw-topbar { left: 0 !important; padding: 0 14px; }
          .csw-main { margin-left: 0 !important; padding: 76px 14px 32px; }
          .csw-hamburger { display: flex !important; }
        }

        @media (max-width: 480px) {
          .category-grid {
            grid-template-columns: 1fr !important;
          }
          .csw-main {
            padding: 76px 12px 24px;
          }
        }

        @keyframes csw-dropdown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#050e1a" }}>
        {/* ── Sidebar ── */}
        <AdminSidebar
          activeKey="categories"
          isMobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* ── Topbar ── */}
        <header className="csw-topbar">
          {/* Left: Mobile Toggle + Page Title */}
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
        <main className="csw-main">
          {/* Page Header */}
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
                  Category Management
                </h2>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", paddingLeft: "14px" }}>
                Configure and structure sportswear catalogs and slugs.
              </p>
            </div>
            <button
              onClick={openAddModal}
              style={{
                background: "linear-gradient(135deg,#FF3B30 0%,#cc2e25 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 16px rgba(255,59,48,0.3)",
                fontFamily: "'Poppins',sans-serif",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Category
            </button>
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
                placeholder="Search categories by name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div style={{ minWidth: "150px" }}>
              <select
                className="csw-select"
                style={{ fontSize: "12px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="category-grid">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((c, idx) => {
                const isActive = c.status === "Active";
                return (
                  <div
                    key={c.id}
                    className="category-card"
                    style={{
                      opacity: pageIn ? 1 : 0,
                      transform: pageIn ? "translateY(0)" : "translateY(18px)",
                      transition: `opacity 0.4s ease ${idx * 0.05}s, transform 0.4s ease ${idx * 0.05}s`,
                    }}
                  >
                    {/* Status Badge */}
                    <span
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: isActive ? "rgba(16,185,129,0.15)" : "rgba(255,59,48,0.15)",
                        color: isActive ? "#10B981" : "#FF3B30",
                      }}
                    >
                      {c.status}
                    </span>

                    {/* Icon and Title */}
                    <div className="category-icon-wrapper">
                      <CategoryIcon type={c.iconType} size={20} />
                    </div>

                    <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                      {c.name}
                    </h3>
                    <span style={{ fontSize: "11px", color: "#FF3B30", fontFamily: "monospace", display: "block", marginBottom: "10px" }}>
                      /{c.slug}
                    </span>

                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: "1.5", flex: 1, marginBottom: "16px" }}>
                      {c.desc || "No description provided."}
                    </p>

                    {/* Footer Actions */}
                    <div
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        paddingTop: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                        Products: <strong style={{ color: "#fff" }}>{c.count || 0}</strong>
                      </span>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => openEditModal(c)}
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
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                        >
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          style={{
                            background: "rgba(255,59,48,0.06)",
                            border: "1px solid rgba(255,59,48,0.15)",
                            borderRadius: "8px",
                            width: "30px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#FF3B30",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,59,48,0.15)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,59,48,0.06)")}
                        >
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                No categories found matching your filters.
              </div>
            )}
          </div>
        </main>

        {/* ── Add / Edit Category Modal ── */}
        {isModalOpen && (
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
                maxWidth: "500px",
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
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  onClick={closeModal}
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
                onSubmit={handleSubmit}
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Category Name */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Category Name *
                  </label>
                  <input
                    className="csw-input"
                    name="name"
                    required
                    placeholder="e.g. Sports T-Shirts"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Description
                  </label>
                  <textarea
                    className="csw-textarea"
                    name="desc"
                    rows="3"
                    placeholder="Short description detailing product catalog fits..."
                    value={formData.desc}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Icon Type & Status Selection */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  {/* Icon Selector */}
                  <div style={{ flex: "1 1 180px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Icon Type
                    </label>
                    <select
                      className="csw-select"
                      name="iconType"
                      value={formData.iconType}
                      onChange={handleInputChange}
                    >
                      <option value="generic">Box / Generic</option>
                      <option value="shirt">T-Shirt Icon</option>
                      <option value="jersey">Jersey Icon</option>
                      <option value="pants">Trousers Icon</option>
                      <option value="hoodie">Hoodie Icon</option>
                      <option value="jacket">Jacket/Tracksuit Icon</option>
                      <option value="kits">Sublimation Kit Icon</option>
                      <option value="accessories">Accessories Icon</option>
                    </select>
                  </div>

                  {/* Status Selector */}
                  <div style={{ flex: "1 1 140px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Catalog Status
                    </label>
                    <select
                      className="csw-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
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
                    onClick={closeModal}
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
                    {editingCategory ? "Save Changes" : "Create Category"}
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

export default AdminCategories;
