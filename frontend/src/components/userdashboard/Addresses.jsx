import React, { useState } from "react";
import { MapPin, Plus, Trash2, Pencil, X, Home, Briefcase, Phone, User } from "lucide-react";

// Reusable card container matching clean light design
const Card = ({ children, title, sub, action, accent }) => {
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
          <div>
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "15px", color: "#0f172a", letterSpacing: "0.3px", margin: 0 }}>
              {title}
            </h3>
            {sub && <p style={{ color: "#64748b", fontSize: "11px", fontFamily: "'Poppins', sans-serif", marginTop: "2px", margin: 0 }}>{sub}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

const Addresses = ({ addresses, setAddresses }) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    fullName: "",
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
    phone: ""
  });

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.addressLine || !newAddress.city || !newAddress.pinCode) return;
    
    if (editingAddressId) {
      setAddresses(addresses.map(addr => addr.id === editingAddressId ? { ...addr, ...newAddress } : addr));
      setEditingAddressId(null);
    } else {
      setAddresses([
        ...addresses,
        {
          id: Date.now(),
          isDefault: addresses.length === 0,
          ...newAddress
        }
      ]);
    }
    setShowAddressForm(false);
    setNewAddress({ type: "Home", fullName: "", addressLine: "", city: "", state: "", pinCode: "", phone: "" });
  };

  const handleEditClick = (addr) => {
    setEditingAddressId(addr.id);
    setNewAddress({
      type: addr.type,
      fullName: addr.fullName,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      phone: addr.phone
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div style={{ animation: "csw-fadein 0.45s ease both", fontFamily: "'Poppins', sans-serif" }}>
      {/* Top action block with Add Address button (Hidden when form is open) */}
      {!showAddressForm && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button
            onClick={() => {
              setEditingAddressId(null);
              setNewAddress({ type: "Home", fullName: "", addressLine: "", city: "", state: "", pinCode: "", phone: "" });
              setShowAddressForm(true);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              background: "linear-gradient(135deg, #0A7F6E, #0d9488)",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              cursor: "pointer",
              transition: "all 0.22s ease",
              boxShadow: "0 4px 12px rgba(10,127,110,0.15)",
            }}
          >
            <Plus size={14} /> Add Address
          </button>
        </div>
      )}

      {/* Add/Edit Address Form */}
      {showAddressForm && (
        <Card 
          title={editingAddressId ? "Edit Address" : "Add New Address"} 
          sub={editingAddressId ? "Modify shipping coordinates" : "Configure shipping coordinates"} 
          accent="#0A7F6E" 
          action={
            <button 
              type="button" 
              onClick={() => {
                setShowAddressForm(false);
                setEditingAddressId(null);
              }}
              style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
            >
              <X size={18} />
            </button>
          }
        >
          <form onSubmit={handleAddAddress} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="max-sm:!grid-cols-1">
              <div>
                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newAddress.fullName}
                  onChange={e => setNewAddress({...newAddress, fullName: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={newAddress.phone}
                  onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div style={{ gridColumn: "span 2" }} className="max-sm:!grid-column-auto">
                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>Address Line</label>
                <input 
                  type="text" 
                  required
                  value={newAddress.addressLine}
                  onChange={e => setNewAddress({...newAddress, addressLine: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  placeholder="House No., Building, Street Name"
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>City</label>
                <input 
                  type="text" 
                  required
                  value={newAddress.city}
                  onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  placeholder="City"
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>State</label>
                <input 
                  type="text" 
                  required
                  value={newAddress.state}
                  onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  placeholder="State"
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>PIN Code</label>
                <input 
                  type="text" 
                  required
                  value={newAddress.pinCode}
                  onChange={e => setNewAddress({...newAddress, pinCode: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                  placeholder="Pin Code"
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>Address Type</label>
                <select 
                  value={newAddress.type}
                  onChange={e => setNewAddress({...newAddress, type: e.target.value})}
                  style={{
                    width: "100%",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    color: "#0f172a",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "'Poppins', sans-serif",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "10px" }}>
              <button
                type="button"
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddressId(null);
                }}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  color: "#475569",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(135deg, #0A7F6E, #0d9488)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(10,127,110,0.2)"
                }}
              >
                {editingAddressId ? "Save Changes" : "Save Address"}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Address Cards Grid */}
      <div className="csw-stats" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        {addresses.map((addr) => (
          <div 
            key={addr.id} 
            style={{
              background: "#ffffff",
              border: addr.isDefault 
                ? "3px solid #0A7F6E" 
                : "3px solid rgba(10, 127, 110, 0.15)",
              borderRadius: "16px",
              padding: "24px 24px 20px 24px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 15px 35px -8px rgba(10, 127, 110, 0.08), 0 4px 12px -5px rgba(0, 0, 0, 0.04)",
              transition: "transform 0.22s ease, box-shadow 0.22s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 20px 40px -8px rgba(10, 127, 110, 0.12), 0 6px 16px -5px rgba(0, 0, 0, 0.06)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 15px 35px -8px rgba(10, 127, 110, 0.08), 0 4px 12px -5px rgba(0, 0, 0, 0.04)";
            }}
          >
            {/* Left vertical theme indicator line */}
            <div 
              style={{ 
                position: "absolute", 
                left: 0, 
                top: 0, 
                bottom: 0, 
                width: "4px", 
                background: addr.isDefault ? "#0A7F6E" : "rgba(10, 127, 110, 0.15)"
              }} 
            />

            {/* Card Header with Icon, Type and Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(10, 127, 110, 0.18)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div 
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: addr.type === "Home" ? "rgba(10,127,110,0.08)" : addr.type === "Office" ? "rgba(59,130,246,0.08)" : "rgba(245,158,11,0.08)",
                    color: addr.type === "Home" ? "#0A7F6E" : addr.type === "Office" ? "#3B82F6" : "#F59E0B"
                  }}
                >
                  {addr.type === "Home" && <Home size={16} />}
                  {addr.type === "Office" && <Briefcase size={16} />}
                  {addr.type !== "Home" && addr.type !== "Office" && <MapPin size={16} />}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#0A7F6E", letterSpacing: "0.2px", marginTop: "1px" }}>
                      PRIMARY ADDRESS
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {!addr.isDefault && (
                  <button 
                    onClick={() => handleSetDefaultAddress(addr.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#0A7F6E",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      cursor: "pointer",
                      marginRight: "6px",
                      fontFamily: "'Poppins', sans-serif"
                    }}
                  >
                    Set Default
                  </button>
                )}
                
                {/* Edit Button */}
                <button 
                  onClick={() => handleEditClick(addr)}
                  title="Edit Address"
                  style={{
                    background: "rgba(10,127,110,0.06)",
                    border: "none",
                    borderRadius: "8px",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#0A7F6E",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(10,127,110,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,127,110,0.06)"; }}
                >
                  <Pencil size={13} />
                </button>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteAddress(addr.id)}
                  title="Delete Address"
                  style={{
                    background: "rgba(255,59,48,0.05)",
                    border: "none",
                    borderRadius: "8px",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#ef4444",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,59,48,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,59,48,0.05)"; }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Address Details Body */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              {/* Full Name */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={14} style={{ color: "#0A7F6E", flexShrink: 0 }} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", fontFamily: "'Montserrat', sans-serif" }}>
                  {addr.fullName}
                </span>
              </div>
              
              {/* Address details */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <MapPin size={14} style={{ color: "#64748b", flexShrink: 0, marginTop: "2px" }} />
                <div style={{ fontSize: "12.5px", color: "#334155", lineHeight: "1.4" }}>
                  <p style={{ margin: 0 }}>{addr.addressLine}</p>
                  <p style={{ margin: 0, fontWeight: 600 }}>{addr.city}, {addr.state} - {addr.pinCode}</p>
                </div>
              </div>

              {/* Phone number */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid rgba(10, 127, 110, 0.18)", paddingTop: "8px", marginTop: "4px" }}>
                <Phone size={13} style={{ color: "#64748b", flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: "#475569" }}>
                  Phone: <strong style={{ color: "#0f172a" }}>{addr.phone}</strong>
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
