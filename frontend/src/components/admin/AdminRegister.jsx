import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/images/comfy_logo2.jpeg";
import API from "../../services/api";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageIn, setPageIn] = useState(false);
  const [fieldsReady, setFieldsReady] = useState(false);
  const [footerReady, setFooterReady] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(password);
  const isPasswordTooWeak = password.length > 0 && passwordStrength < 2;

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "#EF4444";
    if (passwordStrength <= 2) return "#F97316";
    if (passwordStrength <= 3) return "#EAB308";
    if (passwordStrength === 4) return "#22C55E";
    return "#16A34A";
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    if (passwordStrength === 4) return "Strong";
    return "Very Strong";
  };

  useEffect(() => {
    const activeSession = sessionStorage.getItem("csw_admin_session");
    if (activeSession === "true") {
      navigate("/admin/dashboard");
    }
    const t1 = setTimeout(() => setPageIn(true), 60);
    return () => clearTimeout(t1);
  }, [navigate]);

  useEffect(() => {
    if (pageIn) {
      const t2 = setTimeout(() => setFieldsReady(true), 350);
      const t3 = setTimeout(() => setFooterReady(true), 700);
      return () => { clearTimeout(t2); clearTimeout(t3); };
    }
  }, [pageIn]);

  const validateForm = () => {
    if (!name.trim()) {
      setError("Full name is required.");
      return false;
    }
    if (!email.trim()) {
      setError("Email address is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!setupKey.trim()) {
      setError("Setup key is required.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (passwordStrength < 2) {
      setError("Password is too weak. Use uppercase, lowercase, numbers, or symbols.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/setup", {
        setupKey,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      });

      if (response.data && response.data.token) {
        sessionStorage.setItem("csw_admin_token", response.data.token);
        sessionStorage.setItem("csw_admin_session", "true");
        setSuccess("Admin account created successfully. Redirecting...");
        setTimeout(() => navigate("/admin/dashboard"), 1200);
      } else {
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Could not create admin account. Please verify your setup key and try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fieldData = [
    {
      id: "reg-name", label: "Full Name", key: "name", type: "text",
      placeholder: "John Doe", value: name, onChange: setName,
      autoComplete: "name",
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "reg-email", label: "Email Address", key: "email", type: "email",
      placeholder: "you@comfysportswear.com", value: email, onChange: setEmail,
      autoComplete: "email",
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      id: "reg-pw", label: "Password", key: "password", type: "password",
      placeholder: "Min. 8 characters", value: password, onChange: setPassword,
      autoComplete: "new-password",
      hasToggle: true, hasStrength: true,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ),
    },
    {
      id: "reg-cpw", label: "Confirm Password", key: "confirm", type: "password",
      placeholder: "Re-enter password", value: confirmPassword, onChange: setConfirmPassword,
      autoComplete: "new-password",
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: "reg-key", label: "Setup Key", key: "key", type: "password",
      placeholder: "Enter your setup key", value: setupKey, onChange: setSetupKey,
      autoComplete: "off",
      isLast: true,
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      ),
    },
  ];

  const isSubmitDisabled = loading || isPasswordTooWeak;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070C0B; color: #DDDFD2; font-family: 'Manrope', sans-serif; }

        .reg-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #070C0B;
          position: relative;
          padding: 20px;
          overflow: hidden;
        }

        .reg-card {
          background: rgba(10, 20, 18, 0.6);
          border: 1px solid rgba(221, 223, 210, 0.15);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 20px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.55);
          z-index: 10;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(30px) scale(0.97);
          opacity: 0;
          position: relative;
          overflow: hidden;
        }

        .reg-card.active { transform: translateY(0) scale(1); opacity: 1; }

        .reg-accent-line {
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #0A7F6E, transparent);
          border-radius: 0 0 2px 2px;
          filter: blur(0.5px);
          animation: regPulseGlow 3s ease-in-out infinite;
        }

        @keyframes regPulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .reg-inner { padding: 36px 32px; }

        .reg-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
          opacity: 0;
          transform: translateY(-12px);
        }

        .reg-header.visible { opacity: 1; transform: translateY(0); }

        .reg-logo-badge {
          flex-shrink: 0;
          width: 70px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reg-logo-badge img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .reg-pulse-divider {
          width: 100%;
          height: 22px;
          margin-bottom: 22px;
          display: block;
          transition: opacity 0.5s ease 0.2s;
          opacity: 0;
        }

        .reg-pulse-divider.visible { opacity: 1; }

        .reg-pulse-path {
          fill: none;
          stroke: url(#regPulseGradient);
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 6 10;
          animation: regPulseFlow 3.2s linear infinite;
        }

        @keyframes regPulseFlow {
          to { stroke-dashoffset: -160; }
        }

        .reg-msg {
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 12.5px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: regSlideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .reg-msg--error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #F87171;
        }

        .reg-msg--success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: #4ADE80;
        }

        @keyframes regSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reg-field {
          margin-bottom: 15px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .reg-field.visible { opacity: 1; transform: translateY(0); }

        .reg-field-label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(221, 223, 210, 0.4);
          margin-bottom: 6px;
          transition: color 0.25s ease;
        }

        .reg-field-label.focused { color: #0A7F6E; }

        .reg-field-wrap { position: relative; }

        .reg-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          color: rgba(221, 223, 210, 0.35);
          pointer-events: none;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        .reg-field-icon.focused {
          color: #0A7F6E;
          transform: translateY(-50%) scale(1.1);
        }

        .reg-input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(221, 223, 210, 0.15);
          color: #DDDFD2;
          border-radius: 10px;
          padding: 11px 14px 11px 40px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          font-family: 'Manrope', sans-serif;
          width: 100%;
          font-size: 13.5px;
          box-sizing: border-box;
        }

        .reg-input::placeholder {
          color: rgba(221, 223, 210, 0.22);
        }

        .reg-input:focus {
          background: rgba(10, 127, 110, 0.04);
          border-color: #0A7F6E;
          box-shadow: 0 0 0 3px rgba(10, 127, 110, 0.15);
        }

        .reg-input:-webkit-autofill,
        .reg-input:-webkit-autofill:hover,
        .reg-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #DDDFD2 !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(10, 20, 18, 0.95) inset !important;
          border-color: #0A7F6E !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .reg-input:focus-visible {
          outline: 2px solid #0A7F6E;
          outline-offset: 1px;
        }

        .reg-input--has-toggle { padding-right: 42px; }

        .reg-toggle-vis {
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

        .reg-toggle-vis:hover {
          color: #0A7F6E;
          transform: translateY(-50%) scale(1.15);
        }

        .reg-toggle-vis.active { color: #0A7F6E; }

        .reg-toggle-vis:focus-visible {
          outline: 2px solid #0A7F6E;
          outline-offset: 2px;
        }

        .reg-strength-bar {
          height: 3px;
          border-radius: 2px;
          margin-top: 6px;
          background: rgba(221, 223, 210, 0.1);
          overflow: hidden;
        }

        .reg-strength-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .reg-strength-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-top: 4px;
          transition: color 0.3s ease;
        }

        .reg-btn-wrap {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .reg-btn-wrap.visible { opacity: 1; transform: translateY(0); }

        .reg-btn {
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
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease, opacity 0.25s ease;
          width: 100%;
          box-shadow: 0 4px 16px rgba(10, 127, 110, 0.25);
          position: relative;
          overflow: hidden;
          opacity: 1;
          transform: translateY(0);
        }

        .reg-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(10, 127, 110, 0.45);
        }

        .reg-btn:active:not(:disabled) {
          transform: translateY(1px);
        }

        .reg-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .reg-btn:focus-visible {
          outline: 2px solid #0A7F6E;
          outline-offset: 2px;
        }

        .reg-btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.18) 50%, transparent 100%);
          border-radius: 10px;
          animation: regShimmer 1.8s ease-in-out infinite;
        }

        @keyframes regShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes regSpin {
          to { transform: rotate(360deg); }
        }

        .reg-btn-spinner {
          animation: regSpin 1s linear infinite;
        }

        .reg-footer {
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

        .reg-footer.visible { opacity: 1; transform: translateY(0); }

        .reg-footer-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(221, 223, 210, 0.3);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .reg-secure-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #0A7F6E;
          display: inline-block;
          animation: regDotPulse 2s ease-in-out infinite;
        }

        .reg-secure-dot:nth-child(2) { animation-delay: 0.3s; }
        .reg-secure-dot:nth-child(3) { animation-delay: 0.6s; }

        @keyframes regDotPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }

        .reg-footer-link {
          font-family: 'Manrope', sans-serif;
          font-size: 12px;
          color: rgba(221, 223, 210, 0.5);
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }

        .reg-footer-link:hover {
          color: #0A7F6E;
          transform: translateX(-2px);
        }

        .reg-footer-link:focus-visible {
          outline: 2px solid #0A7F6E;
          outline-offset: 2px;
        }

        @keyframes regFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(25px, -18px) scale(1.05); }
          66% { transform: translate(-15px, 10px) scale(0.97); }
        }

        @keyframes regFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-20px, 22px) scale(0.95); }
          66% { transform: translate(18px, -12px) scale(1.04); }
        }

        .reg-blob-1 { animation: regFloat1 12s ease-in-out infinite; }
        .reg-blob-2 { animation: regFloat2 15s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 480px) {
          .reg-inner { padding: 28px 20px; }
        }

        @media (max-height: 780px) {
          .reg-inner { padding: 24px 24px; }
          .reg-field { margin-bottom: 11px; }
          .reg-pulse-divider { margin-bottom: 14px; }
          .reg-header { margin-bottom: 14px; }
        }

        @media (max-height: 680px) {
          .reg-inner { padding: 18px 20px; }
          .reg-field { margin-bottom: 8px; }
          .reg-header { margin-bottom: 10px; }
        }
      `}</style>

      <div className="reg-shell">
        {/* Ambient background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          <div className="reg-blob-1" style={{
            position: "absolute", top: "-120px", left: "8%",
            width: "420px", height: "420px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(10, 127, 110, 0.12) 0%, transparent 72%)",
            filter: "blur(50px)",
          }} />
          <div className="reg-blob-2" style={{
            position: "absolute", bottom: "-140px", right: "6%",
            width: "460px", height: "460px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(221, 223, 210, 0.08) 0%, transparent 78%)",
            filter: "blur(60px)",
          }} />
          <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
            <ellipse cx="200" cy="700" rx="500" ry="320" fill="none" stroke="#0A7F6E" strokeWidth="2" />
            <ellipse cx="200" cy="700" rx="420" ry="260" fill="none" stroke="#DDDFD2" strokeWidth="2" />
            <ellipse cx="1050" cy="80" rx="480" ry="300" fill="none" stroke="#0A7F6E" strokeWidth="2" />
          </svg>
        </div>

        {/* Card */}
        <div className={`reg-card ${pageIn ? "active" : ""}`}>
          <div className="reg-accent-line" />

          <div className="reg-inner">
            {/* Header */}
            <div className={`reg-header ${pageIn ? "visible" : ""}`}>
              <div className="reg-logo-badge">
                <img src={logo} alt="Comfy Sportswear" />
              </div>
            </div>

            {/* Pulse Divider */}
            <svg className={`reg-pulse-divider ${pageIn ? "visible" : ""}`} viewBox="0 0 400 22" preserveAspectRatio="none">
              <defs>
                <linearGradient id="regPulseGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0A7F6E" stopOpacity="0" />
                  <stop offset="30%" stopColor="#0A7F6E" stopOpacity="1" />
                  <stop offset="50%" stopColor="#DDDFD2" stopOpacity="1" />
                  <stop offset="70%" stopColor="#0A7F6E" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0A7F6E" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="reg-pulse-path" d="M0,11 L60,11 L75,3 L90,19 L105,11 L340,11 L355,3 L370,19 L385,11 L400,11" />
            </svg>

            {/* Error */}
            {error && (
              <div className="reg-msg reg-msg--error" role="alert">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="reg-msg reg-msg--success" role="status">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} noValidate>
              {fieldData.map((field, idx) => {
                const isFocused = focusedField === field.key;
                const inputType = (field.key === "password" || field.key === "confirm") && showPassword
                  ? "text"
                  : field.type;

                return (
                  <div
                    key={field.key}
                    className={`reg-field ${fieldsReady ? "visible" : ""}`}
                    style={{
                      marginBottom: field.isLast ? "22px" : undefined,
                      transitionDelay: `${idx * 0.07}s`,
                    }}
                  >
                    <label
                      htmlFor={field.id}
                      className={`reg-field-label ${isFocused ? "focused" : ""}`}
                    >
                      {field.label}
                    </label>
                    <div className="reg-field-wrap">
                      <span className={`reg-field-icon ${isFocused ? "focused" : ""}`} aria-hidden="true">
                        {field.icon}
                      </span>
                      <input
                        id={field.id}
                        type={inputType}
                        autoComplete={field.autoComplete}
                        className={`reg-input ${field.hasToggle ? "reg-input--has-toggle" : ""}`}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => { field.onChange(e.target.value); setError(""); }}
                        onFocus={() => setFocusedField(field.key)}
                        onBlur={() => setFocusedField(null)}
                      />
                      {field.hasToggle && (
                        <button
                          type="button"
                          className={`reg-toggle-vis ${showPassword ? "active" : ""}`}
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Password Strength Indicator */}
                    {field.hasStrength && password && (
                      <div>
                        <div className="reg-strength-bar">
                          <div
                            className="reg-strength-fill"
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`,
                              backgroundColor: getStrengthColor(),
                            }}
                          />
                        </div>
                        <div className="reg-strength-text" style={{ color: getStrengthColor() }}>
                          {getStrengthLabel()}
                          {passwordStrength <= 2 && " • Use uppercase, numbers, or symbols"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit Button */}
              <div className={`reg-btn-wrap ${fieldsReady ? "visible" : ""}`} style={{ transitionDelay: `${fieldData.length * 0.07}s` }}>
                <button
                  type="submit"
                  className="reg-btn"
                  disabled={isSubmitDisabled}
                >
                  {loading && <div className="reg-btn-shimmer" />}
                  <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    {loading && (
                      <svg className="reg-btn-spinner" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2a10 10 0 0110 10" />
                      </svg>
                    )}
                    {loading ? "Creating Account…" : "Create Admin Account"}
                  </span>
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className={`reg-footer ${footerReady ? "visible" : ""}`}>
              <span className="reg-footer-text">
                <span className="reg-secure-dot" />
                <span className="reg-secure-dot" />
                <span className="reg-secure-dot" />
                Secure setup
              </span>
              <Link to="/admin" className="reg-footer-link">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegister;