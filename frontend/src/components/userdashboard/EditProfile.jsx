import React, { useState } from "react";
import { User, Settings, Mail, Phone, Lock } from "lucide-react";

// Reusable card container matching clean light design
const Card = ({ children, title, sub, icon, action, accent }) => {
  return (
    <div 
      style={{
        background: "#ffffff",
        border: "3px solid rgba(10, 127, 110, 0.22)",
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        marginBottom: "20px",
        boxShadow: "0 15px 35px -8px rgba(10, 127, 110, 0.08), 0 4px 12px -5px rgba(0, 0, 0, 0.04)",
        animation: "csw-fadein 0.45s ease both",
      }}
    >
      {accent && (
        <div 
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2.5px",
            background: `linear-gradient(90deg, ${accent}, transparent)`,
          }}
        />
      )}
      {title && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(10, 127, 110, 0.18)", paddingBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {icon && (
              <div 
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(10,127,110,0.08)",
                  color: "#0A7F6E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                {icon}
              </div>
            )}
            <div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "15.5px", color: "#0f172a", letterSpacing: "0.2px", margin: 0 }}>
                {title}
              </h3>
              {sub && <p style={{ color: "#334155", fontSize: "11.5px", fontFamily: "'Poppins', sans-serif", marginTop: "2px", margin: 0, fontWeight: 500 }}>{sub}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

const EditProfile = ({ profile, setProfile }) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfile({ ...profile, name, email, phone });
    alert("Profile details updated successfully!");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div style={{ animation: "csw-fadein 0.45s ease both", fontFamily: "'Poppins', sans-serif" }}>
      <div className="csw-main-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Profile Information */}
        <Card 
          title="Profile Details" 
          sub="Configure credentials" 
          icon={<User size={18} />} 
          accent="#0A7F6E"
        >
          <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "#0f172a", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex", alignItems: "center" }}>
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px 10px 40px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "#0f172a", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex", alignItems: "center" }}>
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px 10px 40px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "#0f172a", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone Number</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex", alignItems: "center" }}>
                  <Phone size={16} />
                </div>
                <input 
                  type="text" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px 10px 40px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="ep-submit-btn"
              style={{
                marginTop: "8px",
                padding: "11px 24px",
                background: "linear-gradient(135deg, #0A7F6E, #0d9488)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.22s ease",
                boxShadow: "0 4px 12px rgba(10,127,110,0.15)",
              }}
            >
              Save Changes
            </button>
          </form>
        </Card>

        {/* Password Management */}
        <Card 
          title="Change Password" 
          sub="Secure login details" 
          icon={<Lock size={18} />} 
          accent="#0A7F6E"
        >
          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "#0f172a", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Current Password</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex", alignItems: "center" }}>
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  required
                  value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px 10px 40px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "#0f172a", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>New Password</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex", alignItems: "center" }}>
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  required
                  value={passwords.new}
                  onChange={e => setPasswords({...passwords, new: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px 10px 40px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "#0f172a", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b", display: "flex", alignItems: "center" }}>
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  required
                  value={passwords.confirm}
                  onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px 10px 40px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="ep-submit-btn"
              style={{
                marginTop: "8px",
                padding: "11px 24px",
                background: "linear-gradient(135deg, #0A7F6E, #0d9488)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.22s ease",
                boxShadow: "0 4px 12px rgba(10,127,110,0.15)",
              }}
            >
              Change Password
            </button>
          </form>
        </Card>
      </div>

      {/* Embedded CSS rules for responsive button width */}
      <style>{`
        .ep-submit-btn {
          width: 100%;
        }
        @media (min-width: 640px) {
          .ep-submit-btn {
            width: fit-content !important;
            padding: 11px 36px !important;
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
