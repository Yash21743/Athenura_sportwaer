import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/comfy_logo3.png";
import API from "../../services/api";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageIn, setPageIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Protection temporarily removed for UI testing
    // TODO: Uncomment below before going to production
    // const activeSession = sessionStorage.getItem("csw_admin_session");
    // if (activeSession !== "true") { navigate("/admin"); }
    const timer = setTimeout(() => setPageIn(true), 60);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (name.trim().length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register-admin", { name: name.trim(), email, password });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to create admin. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000000; color: #fff; font-family: 'Poppins', sans-serif; }

        .ar-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000;
          position: relative;
          padding: 20px;
          overflow: hidden;
        }

        .ar-card {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid #DDDFD2;
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 40px 32px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          z-index: 10;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(24px);
          opacity: 0;
        }

        .ar-card.active {
          transform: translateY(0);
          opacity: 1;
        }

        .ar-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 6px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .ar-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #DDDFD2;
          color: #fff;
          border-radius: 12px;
          padding: 12px 14px;
          padding-left: 42px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Poppins', sans-serif;
          width: 100%;
          font-size: 13.5px;
        }

        .ar-input::placeholder { color: rgba(255, 255, 255, 0.25); }

        .ar-input:focus {
          border-color: #0A7F6E;
          box-shadow: 0 0 0 3px rgba(10, 127, 110, 0.15);
        }

        .ar-field {
          margin-bottom: 16px;
        }

        .ar-input-wrap {
          position: relative;
        }

        .ar-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          color: rgba(255, 255, 255, 0.35);
          pointer-events: none;
          z-index: 1;
        }

        .ar-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          display: flex;
          padding: 4px;
          transition: color 0.2s;
        }
        .ar-eye-btn:hover { color: rgba(255,255,255,0.8); }

        .ar-btn {
          background: linear-gradient(135deg, #0A7F6E 0%, #08695C 100%);
          border: none;
          color: #fff;
          border-radius: 12px;
          padding: 13px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          width: 100%;
          box-shadow: 0 4px 16px rgba(10, 127, 110, 0.3);
          font-family: 'Poppins', sans-serif;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ar-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(10, 127, 110, 0.45);
        }
        .ar-btn:active:not(:disabled) { transform: translateY(1px); }
        .ar-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .ar-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12.5px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideIn 0.3s ease;
        }

        .ar-success {
          text-align: center;
          padding: 16px 0 8px;
        }
        .ar-success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(10, 127, 110, 0.15);
          border: 1.5px solid rgba(10, 127, 110, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ar-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .ar-back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 22px;
          font-size: 12.5px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: color 0.2s;
        }
        .ar-back-link:hover { color: #0A7F6E; }

        @media (max-width: 480px) {
          .ar-card {
            background: #000000ff;
            padding: 32px 20px;
          }
        }
      `}</style>

      <div className="ar-container">

        {/* Decorative Background */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-100px", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(10, 127, 110, 0.12) 0%, transparent 75%)", filter: "blur(50px)" }} />
          <div style={{ position: "absolute", bottom: "-100px", right: "10%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(10, 127, 110, 0.25) 0%, transparent 80%)", filter: "blur(60px)" }} />
          <svg width="100%" height="100%" opacity="0.035" stroke="#fff" strokeWidth="1">
            <defs>
              <pattern id="ar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ar-grid)" />
          </svg>
        </div>

        {/* Card */}
        <div className={`ar-card ${pageIn ? "active" : ""}`}>

          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
            <img
              src={logo}
              alt="Athenura Logo"
              style={{ width: "100px", height: "auto", objectFit: "contain", marginBottom: "15px" }}
            />
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "18px", color: "#fff", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
              COMFY SPORTSWEAR
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Register New Admin
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="ar-success">
              <div className="ar-success-icon">
                <svg width="28" height="28" fill="none" stroke="#0A7F6E" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Admin Created!</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginBottom: "24px", lineHeight: 1.6 }}>
                The new admin account has been created successfully. They can now log in with their credentials.
              </p>
              <button
                className="ar-btn"
                onClick={() => { setSuccess(false); setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); }}
              >
                Create Another Admin
              </button>
              <Link to="/admin" className="ar-back-link" style={{ marginTop: "14px" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {error && (
                <div className="ar-error">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRegister} noValidate>

                {/* Full Name */}
                <div className="ar-field">
                  <label className="ar-label" htmlFor="ar-name">Full Name</label>
                  <div className="ar-input-wrap">
                    <span className="ar-field-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="ar-name"
                      type="text"
                      required
                      className="ar-input"
                      placeholder="Enter full name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="ar-field">
                  <label className="ar-label" htmlFor="ar-email">Email Address</label>
                  <div className="ar-input-wrap">
                    <span className="ar-field-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      id="ar-email"
                      type="email"
                      required
                      className="ar-input"
                      placeholder="Enter email address"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="ar-field">
                  <label className="ar-label" htmlFor="ar-password">Password</label>
                  <div className="ar-input-wrap">
                    <span className="ar-field-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </span>
                    <input
                      id="ar-password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="ar-input"
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      style={{ paddingRight: "42px" }}
                    />
                    <button type="button" className="ar-eye-btn" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="ar-field" style={{ marginBottom: "24px" }}>
                  <label className="ar-label" htmlFor="ar-confirm">Confirm Password</label>
                  <div className="ar-input-wrap">
                    <span className="ar-field-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </span>
                    <input
                      id="ar-confirm"
                      type={showConfirm ? "text" : "password"}
                      required
                      className="ar-input"
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      style={{ paddingRight: "42px" }}
                    />
                    <button type="button" className="ar-eye-btn" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}>
                      {showConfirm ? (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="ar-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="ar-spinner" />
                      Creating Admin...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                      </svg>
                      Create Admin Account
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <Link to="/admin" className="ar-back-link">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Login
              </Link>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminRegister;
