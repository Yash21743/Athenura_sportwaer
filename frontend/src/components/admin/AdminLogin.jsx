import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/comfy_logo3.png";
import API from "../../services/api";


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pageIn, setPageIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if session is already active
    const activeSession = sessionStorage.getItem("csw_admin_session");
    if (activeSession === "true") {
      navigate("/admin/dashboard");
    }
    const timer = setTimeout(() => setPageIn(true), 60);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await API.post("/auth/login", { email, password });
      if (response.data && response.data.token) {
        sessionStorage.setItem("csw_admin_token", response.data.token);
        sessionStorage.setItem("csw_admin_session", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials format returned from server.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email address or password."
      );
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000000; color: #fff; font-family: 'Poppins', sans-serif; }
        
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000;
          position: relative;
          padding: 20px;
          overflow: hidden;
        }

        .login-card {
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid #DDDFD2;
          backdrop-filter: blur(16px);
          border-radius: 24px;
          padding: 40px 32px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          z-index: 10;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(24px);
          opacity: 0;
        }

        .login-card.active {
          transform: translateY(0);
          opacity: 1;
        }

        .login-input {
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
        
        .login-input:focus {
          border-color: #0A7F6E;
          box-shadow: 0 0 0 3px rgba(10, 127, 110, 0.15);
        }

        .login-btn {
          background: linear-gradient(135deg, #0A7F6E 0%, #08695C 100%);
          border: none;
          color: #fff;
          border-radius: 12px;
          padding: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          width: 100%;
          box-shadow: 0 4px 16px rgba(10, 127, 110, 0.3);
          font-family: 'Poppins', sans-serif;
        }

        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(10, 127, 110, 0.45);
        }

        .login-btn:active {
          transform: translateY(1px);
        }

        .login-error {
          background: rgba(10, 127, 110, 0.12);
          border: 1px solid rgba(10, 127, 110, 0.25);
          color: #0A7F6E;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12.5px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .login-card {
          background: #000000ff;
            padding: 32px 20px;
          }
        }
      `}</style>

      <div className="login-container">
        {/* Decorative Background SVGs */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          {/* Radial Glow 1 */}
          <div style={{ position: "absolute", top: "-100px", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(10, 127, 110, 0.12) 0%, transparent 75%)", filter: "blur(50px)" }} />
          {/* Radial Glow 2 */}
          <div style={{ position: "absolute", bottom: "-100px", right: "10%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(10, 127, 110, 0.25) 0%, transparent 80%)", filter: "blur(60px)" }} />
          {/* Tech Grid Pattern */}
          <svg width="100%" height="100%" opacity="0.035" stroke="#fff" strokeWidth="1">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Login Card */}
        <div className={`login-card ${pageIn ? "active" : ""}`}>
          {/* Brand Logo Header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
            <img
            src={logo}
            alt="Athenura Logo"
            style={{
            width: "100px",
            height: "auto",
            objectFit: "contain",
            marginBottom: "15px",
      }}
    />
            <h2
         style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 800,
          fontSize: "18px",
          color: "#fff",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
            >
         COMFY SPORTSWEAR
          </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "2px" }}>
              Admin Access Panel
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="login-error">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", display: "flex", color: "rgba(255,255,255,0.35)" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                type="email"
                required
                className="login-input"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ position: "relative", marginBottom: "24px" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", display: "flex", color: "rgba(255,255,255,0.35)" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                style={{ paddingRight: "42px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  display: "flex",
                  padding: "4px",
                }}
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

            {/* Login Button */}
            <button type="submit" className="login-btn">
              Authenticate
            </button>
          </form>

          {/* Mock Credentials Card */}
          <div style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "12px",
            padding: "12px 14px",
            marginTop: "20px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.45)",
            lineHeight: "1.5"
          }}>
            <div style={{ fontWeight: 600, color: "#fff", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Mock Credentials for Review:
            </div>
            Email: <span style={{ color: "#0A7F6E", fontFamily: "monospace" }}>admin@comfysportwear.com</span><br/>
            Password: <span style={{ color: "#0A7F6E", fontFamily: "monospace" }}>admin123</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
