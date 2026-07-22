import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../common/adminlayout/AdminSidebar";
import API from "../../services/api"; // ✅ same API service used by EditProfile.jsx

// ─── useInView hook ──────────────────────────────────────────────────────────
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

// ─── StatCard ────────────────────────────────────────────────────────────────
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
        border: `1px solid ${hov ? accent + "55" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "16px",
        padding: "18px 20px",
        opacity: visible ? 1 : 0,
        transform: visible ? (hov ? "translateY(-4px)" : "translateY(0)") : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}s, transform 0.45s cubic-bezier(0.4, 0, 0.2, 1) ${visible ? 0 : delay}s, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease`,
        boxShadow: hov ? "0 10px 24px rgba(0,0,0,0.3)" : "none",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        flex: 1,
        minWidth: "140px",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2.5px", background: `linear-gradient(90deg, ${accent}, transparent)`, opacity: hov ? 1 : 0.6, transition: "opacity 0.25s ease" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.45)", fontFamily: "'Poppins', sans-serif" }}>{title}</span>
        <div style={{ color: accent, display: "flex", alignItems: "center" }}>{icon}</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span style={{ fontSize: "28px", fontWeight: 800, color: "#fff", fontFamily: "'Montserrat', sans-serif" }}>{value}</span>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminUsers = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null); // full user object to delete
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ── Auth guard ──
  useEffect(() => {
    const activeSession = sessionStorage.getItem("csw_admin_session");
    if (!activeSession) navigate("/admin");
  }, [navigate]);

  // ── Load users from the real backend ──
  // 🔧 NOTE: "/admin/users" is a best-guess endpoint based on your existing
  // "/user-auth/..." and "/users/me" routes. If your backend uses a different
  // path (e.g. "/users" or "/admin/all-users"), change the URL below to match.
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setLoadError("");
      const res = await API.get("/admin/users");
      const data = res.data?.data || res.data?.users || res.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
      setLoadError(
        err.response?.data?.message ||
        "Could not load users. Check that the admin users endpoint exists on the backend."
      );
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const confirmDeleteUser = async () => {
    if (!deleteConfirm) return;
    const user = deleteConfirm;
    const userId = user._id || user.id;
    setDeletingId(userId);
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully!");
      setUsers(prev => prev.filter(u => (u._id || u.id) !== userId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (user, e) => {
    if (e) e.stopPropagation();
    setDeleteConfirm(user);
  };

  // ── Filtered list ──
  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const todayStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const newToday = users.filter(u => {
    const joined = u.joinedOn || (u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null);
    return joined === todayStr;
  }).length;

  // ─── Styles ───────────────────────────────────────────────────────────────
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .au-root {
      display: flex;
      min-height: 100vh;
      background: #000;
      font-family: 'Poppins', sans-serif;
      color: #fff;
    }

    .au-main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      margin-left: ${sidebarCollapsed ? 72 : 260}px;
      transition: margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Top bar */
    .au-topbar {
      position: sticky;
      top: 0;
      z-index: 30;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding: 0 28px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .au-topbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .au-burger {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.6);
      padding: 4px;
    }

    .au-topbar-title {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 15px;
      color: #fff;
    }

    .au-topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: rgba(255,255,255,0.45);
    }

    .au-admin-badge {
      background: rgba(10,127,110,0.15);
      border: 1px solid rgba(10,127,110,0.3);
      color: #0A7F6E;
      border-radius: 8px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Content */
    .au-content {
      flex: 1;
      padding: 28px;
      overflow-x: hidden;
    }

    /* Page header */
    .au-page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .au-page-title-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .au-page-accent {
      width: 4px;
      height: 40px;
      background: linear-gradient(180deg, #0A7F6E, #14a38f);
      border-radius: 2px;
      flex-shrink: 0;
    }

    .au-page-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #fff;
      line-height: 1.2;
    }

    .au-page-subtitle {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      margin-top: 2px;
      font-weight: 400;
    }

    /* Stats row */
    .au-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    /* Search & filter bar */
    .au-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .au-search-wrap {
      position: relative;
      flex: 1;
      min-width: 200px;
    }

    .au-search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255,255,255,0.3);
      pointer-events: none;
    }

    .au-search {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      padding: 10px 14px 10px 38px;
      outline: none;
      transition: border-color 0.2s;
    }
    .au-search::placeholder { color: rgba(255,255,255,0.3); }
    .au-search:focus { border-color: rgba(10,127,110,0.5); }

    .au-refresh-btn {
      background: rgba(10,127,110,0.12);
      border: 1px solid rgba(10,127,110,0.3);
      color: #14a38f;
      border-radius: 10px;
      padding: 10px 16px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .au-refresh-btn:hover { background: rgba(10,127,110,0.2); }
    .au-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Table card */
    .au-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 18px;
      overflow: hidden;
    }

    .au-table-wrap {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .au-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 580px;
    }

    .au-table thead tr {
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .au-table thead th {
      padding: 13px 16px;
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      white-space: nowrap;
    }

    .au-table tbody tr {
      border-bottom: 1px solid rgba(255,255,255,0.04);
      transition: background 0.18s;
    }
    .au-table tbody tr:last-child { border-bottom: none; }
    .au-table tbody tr:hover { background: rgba(255,255,255,0.03); }

    .au-table tbody td {
      padding: 14px 16px;
      font-size: 13px;
      color: rgba(255,255,255,0.75);
      vertical-align: middle;
    }

    .au-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0a3d33, #14a889);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      color: #fff;
      flex-shrink: 0;
      font-family: 'Montserrat', sans-serif;
    }

    .au-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .au-name-text {
      font-weight: 600;
      color: #fff;
      font-size: 13px;
    }

    .au-delete-btn {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      color: #ef4444;
      border-radius: 8px;
      padding: 6px 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      transition: all 0.2s;
    }
    .au-delete-btn:hover {
      background: rgba(239,68,68,0.2);
      border-color: rgba(239,68,68,0.4);
    }
    .au-delete-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Empty / error / loading state */
    .au-empty {
      text-align: center;
      padding: 60px 20px;
    }

    .au-empty-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: rgba(10,127,110,0.1);
      border: 1px solid rgba(10,127,110,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .au-empty-icon.error {
      background: rgba(239,68,68,0.1);
      border-color: rgba(239,68,68,0.2);
    }

    .au-empty-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }

    .au-empty-sub {
      font-size: 12px;
      color: rgba(255,255,255,0.35);
    }

    /* Delete confirm modal */
    .au-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .au-modal {
      background: #111;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 28px;
      max-width: 380px;
      width: 100%;
      text-align: center;
    }

    .au-modal-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 8px;
    }

    .au-modal-sub {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .au-modal-btns {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .au-modal-cancel {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: transparent;
      color: rgba(255,255,255,0.6);
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .au-modal-cancel:hover { border-color: rgba(255,255,255,0.25); color: #fff; }

    .au-modal-confirm {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .au-modal-confirm:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(239,68,68,0.3); }
    .au-modal-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

    /* Responsive */
    @media (max-width: 768px) {
      .au-main { margin-left: 0 !important; }
      .au-burger { display: flex; }
      .au-content { padding: 16px; }
      .au-topbar { padding: 0 16px; }
      .au-page-title { font-size: 18px; }
      .au-stats { gap: 10px; }
      .au-topbar-right span { display: none; }
    }

    @media (max-width: 480px) {
      .au-stats { flex-direction: column; }
      .au-bar { flex-direction: column; align-items: stretch; }
      .au-search-wrap { min-width: unset; }
      .au-page-header { flex-direction: column; }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="au-modal-overlay" onClick={() => !deletingId && setDeleteConfirm(null)}>
          <div className="au-modal" onClick={e => e.stopPropagation()}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="22" height="22" fill="none" stroke="#ef4444" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>
            <div className="au-modal-title">Delete User?</div>
            <div className="au-modal-sub">Are you sure you want to remove <strong style={{ color: "#fff" }}>{deleteConfirm.name || deleteConfirm.email}</strong>? This cannot be undone.</div>
            <div className="au-modal-btns">
              <button className="au-modal-cancel" onClick={() => setDeleteConfirm(null)} disabled={!!deletingId}>Cancel</button>
              <button className="au-modal-confirm" onClick={confirmDeleteUser} disabled={!!deletingId}>
                {deletingId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="au-root">
        {/* Sidebar */}
        <AdminSidebar
          activeKey="users"
          onNavigate={() => {}}
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* Main */}
        <div className="au-main">

          {/* Top bar */}
          <div className="au-topbar">
            <div className="au-topbar-left">
              <button className="au-burger" onClick={() => setMobileSidebarOpen(true)}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <span className="au-topbar-title">Comfy Sport Wear</span>
            </div>
            <div className="au-topbar-right">
              <span>Admin Panel</span>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg,#0a3d33,#14a889)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", color: "#fff", fontFamily: "'Montserrat',sans-serif" }}>A</div>
            </div>
          </div>

          {/* Content */}
          <div className="au-content">

            {/* Page Header */}
            <div className="au-page-header">
              <div className="au-page-title-wrap">
                <div className="au-page-accent" />
                <div>
                  <div className="au-page-title">Registered Users</div>
                  <div className="au-page-subtitle">Manage all registered users from the backend</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="au-stats">
              <StatCard
                title="Total Users"
                value={users.length}
                accent="#0A7F6E"
                delay={0.05}
                icon={
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                }
              />
              <StatCard
                title="New Today"
                value={newToday}
                accent="#3B82F6"
                delay={0.1}
                icon={
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
                  </svg>
                }
              />
              <StatCard
                title="Showing"
                value={filtered.length}
                accent="#10B981"
                delay={0.15}
                icon={
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                }
              />
            </div>

            {/* Search bar */}
            <div className="au-bar">
              <div className="au-search-wrap">
                <span className="au-search-icon">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input
                  className="au-search"
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className="au-refresh-btn" onClick={loadUsers} disabled={loadingUsers}>
                {loadingUsers ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Table Card */}
            <div className="au-card">
              {loadingUsers ? (
                <div className="au-empty">
                  <div className="au-empty-icon">
                    <svg width="24" height="24" fill="none" stroke="#0A7F6E" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                  </div>
                  <div className="au-empty-title">Loading users...</div>
                  <div className="au-empty-sub">Fetching registered users from the server.</div>
                </div>
              ) : loadError ? (
                <div className="au-empty">
                  <div className="au-empty-icon error">
                    <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div className="au-empty-title">Couldn't load users</div>
                  <div className="au-empty-sub">{loadError}</div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="au-empty">
                  <div className="au-empty-icon">
                    <svg width="24" height="24" fill="none" stroke="#0A7F6E" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                  <div className="au-empty-title">
                    {search ? "No users found" : "No registered users yet"}
                  </div>
                  <div className="au-empty-sub">
                    {search ? "Try a different search term." : "Users will appear here once they register on the website."}
                  </div>
                </div>
              ) : (
                <div className="au-table-wrap">
                  <table className="au-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((user, i) => {
                        const userId = user._id || user.id || user.email;
                        const joined = user.joinedOn || (user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—");
                        return (
                          <tr key={userId}>
                            <td style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", width: "40px" }}>
                              {i + 1}
                            </td>
                            <td>
                              <div className="au-name-cell">
                                <div className="au-avatar">
                                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <span className="au-name-text">{user.name}</span>
                              </div>
                            </td>
                            <td style={{ color: "rgba(255,255,255,0.6)" }}>{user.email}</td>
                            <td style={{ color: "rgba(255,255,255,0.6)" }}>{user.phone || "—"}</td>
                            <td>
                              <span style={{
                                background: "rgba(10,127,110,0.12)",
                                border: "1px solid rgba(10,127,110,0.25)",
                                color: "#14a38f",
                                borderRadius: "6px",
                                padding: "3px 10px",
                                fontSize: "11px",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                              }}>
                                {joined}
                              </span>
                            </td>
                            <td>
                              <button
                                className="au-delete-btn"
                                onClick={(e) => handleDelete(user, e)}
                                disabled={deletingId === userId}
                                title="Delete user"
                              >
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                  <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                </svg>
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;