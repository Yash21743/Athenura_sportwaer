import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/comfy_logo2.jpeg";
import API from "../../services/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageIn, setPageIn] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const activeSession = sessionStorage.getItem("csw_admin_session");
    if (activeSession === "true") {
      navigate("/admin/dashboard");
    }
    const timer = setTimeout(() => setPageIn(true), 60);
    return () => clearTimeout(timer);
  }, [navigate]);

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email address is required.");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setError("");
      setLoading(true);
      const response = await API.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password,
      });

      if (response.data && response.data.token) {
        sessionStorage.setItem("csw_admin_token", response.data.token);
        sessionStorage.setItem("csw_admin_session", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Invalid email address or password. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070C0B; color: #DDDFD2; font-family: 'Manrope', sans-serif; }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes pulseFlow {
          to { stroke-dashoffset: -160; }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }

        .auth-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #070C0B;
          position: relative;
          padding: 20px;
          overflow: hidden;
        }

        .auth-card {
          background: rgba(10, 20, 18, 0.6);
          border: 1px solid rgba(221, 223, 210, 0.15);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 20px;
          padding: 36px 32px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.55);
          z-index: 10;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(20px);
          opacity: 0;
          position: relative;
          overflow: hidden;
        }

        .auth-card.active { transform: translateY(0); opacity: 1; }

        .accent-line-top {
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #0A7F6E, transparent);
          border-radius: 0 0 2px 2px;
          filter: blur(0.5px);
          animation: pulseGlow 3s ease-in-out infinite;
        }

        .auth-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
        }

        .auth-header.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .auth-header.hidden {
          opacity: 0;
          transform: translateY(-12px);
        }

        .logo-badge {
          flex-shrink: 0;
          width: 70px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-badge img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .pulse-divider {
          width: 100%;
          height: 22px;
          margin-bottom: 22px;
          display: block;
          transition: opacity 0.5s ease 0.2s;
        }

        .pulse-divider.visible { opacity: 1; }
        .pulse-divider.hidden { opacity: 0; }

        .pulse-path {
          fill: none;
          stroke: url(#pulseGradient);
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 6 10;
          animation: pulseFlow 3.2s linear infinite;
        }

        .field-group {
          margin-bottom: 15px;
          transition: opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1);
        }

        .field-group.visible { opacity: 1; transform: translateY(0); }
        .field-group.hidden { opacity: 0; transform: translateY(14px); }

        .field-label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(221, 223, 210, 0.4);
          margin-bottom: 6px;
          transition: color 0.25s ease;
        }

        .field-label.focused { color: #0A7F6E; }

        .field-wrap { position: relative; }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          color: rgba(221, 223, 210, 0.35);
          pointer-events: none;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        .field-icon.focused {
          color: #0A7F6E;
          transform: translateY(-50%) scale(1.1);
        }

        .auth-input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(221, 223, 210, 0.15);
          color: #DDDFD2;
          border-radius: 10px;
          padding: 11px 14px;
          padding-left: 40px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          font-family: 'Manrope', sans-serif;
          width: 100%;
          font-size: 13.5px;
          box-sizing: border-box;
        }

        .auth-input::placeholder { color: rgba(221, 223, 210, 0.22); }

        .auth-input:focus {
          background: rgba(10, 127, 110, 0.04);
          border-color: #0A7F6E;
          box-shadow: 0 0 0 3px rgba(10, 127, 110, 0.15);
        }

        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:hover,
        .auth-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #DDDFD2 !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(10, 20, 18, 0.95) inset !important;
          border-color: #0A7F6E !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }

        .toggle-visibility {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(221, 223, 210, 0.4);
          cursor: pointer;
          display: flex;
          padding: 4px;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .toggle-visibility:hover {
          color: #0A7F6E;
          transform: translateY(-50%) scale(1.15);
        }

        .toggle-visibility.active { color: #0A7F6E; }

        .toggle-visibility:focus-visible {
          outline: 2px solid #0A7F6E;
          outline-offset: 2px;
        }

        .auth-btn {
          background: linear-gradient(135deg, #0A7F6E 0%, #064E44 100%);
          border: none;
          color: #DDDFD2;
          border-radius: 10px;
          padding: 13px;
          font-weight: 700;
          font-size: 12.5px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          font-family: 'Manrope', sans-serif;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease, opacity 0.3s ease;
          width: 100%;
          box-shadow: 0 4px 16px rgba(10, 127, 110, 0.25);
          margin-top: 6px;
          position: relative;
          overflow: hidden;
        }

        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(10, 127, 110, 0.45);
        }

        .auth-btn:active:not(:disabled) { transform: translateY(1px); }

        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-btn:focus-visible {
          outline: 2px solid #0A7F6E;
          outline-offset: 2px;
        }

        .auth-btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
          border-radius: 10px;
          animation: shimmer 1.8s ease-in-out infinite;
        }

        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #F87171;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12.5px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .footer-tag {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 22px;
          padding-top: 16px;
          border-top: 1px dashed rgba(221, 223, 210, 0.15);
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .footer-tag.visible { opacity: 1; transform: translateY(0); }

        .footer-tag-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(221, 223, 210, 0.3);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .secure-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #0A7F6E;
          display: inline-block;
          animation: dotPulse 2s ease-in-out infinite;
        }

        .secure-dot:nth-child(2) { animation-delay: 0.3s; }
        .secure-dot:nth-child(3) { animation-delay: 0.6s; }

        .footer-link {
          font-family: 'Manrope', sans-serif;
          font-size: 12px;
          color: rgba(221, 223, 210, 0.5);
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }

        .footer-link:hover {
          color: #0A7F6E;
          transform: translateX(-2px);
        }

        .footer-link:focus-visible {
          outline: 2px solid #0A7F6E;
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px; }
        }
      `}</style>

      <div className="auth-shell">
        {/* Ambient background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          <div style={{
            position: "absolute", top: "-120px", left: "8%", width: "420px", height: "420px",
            borderRadius: "50%", background: "radial-gradient(circle, rgba(10, 127, 110, 0.12) 0%, transparent 72%)",
            filter: "blur(50px)",
          }} />
          <div style={{
            position: "absolute", bottom: "-140px", right: "6%", width: "460px", height: "460px",
            borderRadius: "50%", background: "radial-gradient(circle, rgba(221, 223, 210, 0.08) 0%, transparent 78%)",
            filter: "blur(60px)",
          }} />
          <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
            <ellipse cx="200" cy="700" rx="500" ry="320" fill="none" stroke="#0A7F6E" strokeWidth="2" />
            <ellipse cx="200" cy="700" rx="420" ry="260" fill="none" stroke="#DDDFD2" strokeWidth="2" />
            <ellipse cx="1050" cy="80" rx="480" ry="300" fill="none" stroke="#0A7F6E" strokeWidth="2" />
          </svg>
        </div>

        <div className={`auth-card ${pageIn ? "active" : ""}`}>
          <div className="accent-line-top" />

          <div className={`auth-header ${pageIn ? "visible" : "hidden"}`}>
            <div className="logo-badge">
              <img src={logo} alt="Comfy Sportswear" />
            </div>
          </div>

          <svg className={`pulse-divider ${pageIn ? "visible" : "hidden"}`} viewBox="0 0 400 22" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pulseGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0A7F6E" stopOpacity="0" />
                <stop offset="30%" stopColor="#0A7F6E" stopOpacity="1" />
                <stop offset="50%" stopColor="#DDDFD2" stopOpacity="1" />
                <stop offset="70%" stopColor="#0A7F6E" stopOpacity="1" />
                <stop offset="100%" stopColor="#0A7F6E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="pulse-path" d="M0,11 L60,11 L75,3 L90,19 L105,11 L340,11 L355,3 L370,19 L385,11 L400,11" />
          </svg>

          {error && (
            <div className="auth-error">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className={`field-group ${pageIn ? "visible" : "hidden"}`} style={{ transitionDelay: "0.35s" }}>
              <label className={`field-label ${focusedField === "email" ? "focused" : ""}`} htmlFor="email">Email address</label>
              <div className="field-wrap">
                <span className={`field-icon ${focusedField === "email" ? "focused" : ""}`}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  className="auth-input"
                  placeholder="you@comfysportswear.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div className={`field-group ${pageIn ? "visible" : "hidden"}`} style={{ marginBottom: "20px", transitionDelay: "0.42s" }}>
              <label className={`field-label ${focusedField === "password" ? "focused" : ""}`} htmlFor="password">Password</label>
              <div className="field-wrap">
                <span className={`field-icon ${focusedField === "password" ? "focused" : ""}`}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  style={{ paddingRight: "42px" }}
                />
                <button
                  type="button"
                  className={`toggle-visibility ${showPassword ? "active" : ""}`}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading && <div className="auth-btn-shimmer" />}
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading && (
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M12 2a10 10 0 0110 10" />
                  </svg>
                )}
                {loading ? "Authenticating…" : "Sign in"}
              </span>
            </button>
          </form>

          <div className={`footer-tag ${pageIn ? "visible" : ""}`} style={{ transitionDelay: "0.7s" }}>
            <span className="footer-tag-text">
              <span className="secure-dot" />
              <span className="secure-dot" />
              <span className="secure-dot" />
              Secure session
            </span>
            <Link to="/admin/register" className="footer-link">First time? Create account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;