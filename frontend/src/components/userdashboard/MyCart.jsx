import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { mockProducts } from "../../services/mockProducts";

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

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem("csw_cart_items");
      if (stored) {
        try {
          setCartItems(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadCart();
  }, []);

  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("csw_cart_items", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Compute total price
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  // Fetch product specifications from database
  const getProductDetails = (item) => {
    const prod = mockProducts.find(
      p => p._id === item.id || p.name.toLowerCase() === item.name.toLowerCase()
    );
    if (prod) {
      return {
        fabric: prod.fabric || "Moisture Wicking Polyester",
        code: prod.code || "ATH-JY-001",
        description: prod.description ? prod.description.substring(0, 85) + "..." : "High performance athletic fit sportswear."
      };
    }
    return {
      fabric: "Moisture Wicking Polyester",
      code: "ATH-JY-001",
      description: "Premium athletic fit jersey designed for comfort and high performance."
    };
  };

  return (
    <div style={{ animation: "csw-fadein 0.45s ease both", fontFamily: "'Poppins', sans-serif" }}>
      {cartItems.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <ShoppingBag size={48} className="mx-auto" style={{ color: "#94a3b8", marginBottom: "16px" }} />
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "16px", color: "#0f172a", margin: 0 }}>Your Shopping Cart is empty</h3>
            <p style={{ color: "#64748b", fontSize: "12px", fontFamily: "'Poppins', sans-serif", marginTop: "6px", marginBottom: "20px" }}>
              Explore our high performance sportswear collection to add products.
            </p>
            <Link 
              to="/products" 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                background: "linear-gradient(135deg, #0A7F6E, #0d9488)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                textDecoration: "none",
                transition: "all 0.22s ease",
                boxShadow: "0 4px 12px rgba(10,127,110,0.15)",
              }}
            >
              Shop Collection <ArrowRight size={13} />
            </Link>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {cartItems.map((item) => {
            const details = getProductDetails(item);
            return (
              <div 
                key={item.id}
                style={{
                  background: "#ffffff",
                  border: "3px solid rgba(10, 127, 110, 0.22)",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 15px 35px -8px rgba(10, 127, 110, 0.08), 0 4px 12px -5px rgba(0, 0, 0, 0.04)",
                  flexWrap: "wrap"
                }}
              >
                {/* Green left accent bar */}
                <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "3.5px", height: "50%", background: "linear-gradient(180deg, #0A7F6E, #0d9488)", borderRadius: "0 4px 4px 0" }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flex: "1 1 auto", minWidth: 0 }} className="pl-3">
                  <div className="cart-item-img-wrapper" style={{ borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", overflow: "hidden", flexShrink: 0 }}>
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150&auto=format&fit=crop"} 
                      alt={item.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "#0f172a", fontFamily: "'Montserrat', sans-serif", margin: "0 0 3px 0" }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: "11px", color: "#0f172a", margin: "0 0 6px 0", fontFamily: "'Poppins', sans-serif" }}>
                      <span style={{ fontWeight: 700, color: "#0A7F6E" }}>{details.code}</span>
                      <span style={{ margin: "0 6px", color: "#cbd5e1" }}>|</span>
                      <span style={{ fontWeight: 500 }}>{details.fabric}</span>
                    </p>
                    <p style={{ fontSize: "11.5px", color: "#1e293b", margin: "0 0 8px 0", lineHeight: "1.45", maxWidth: "480px", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                      {details.description}
                    </p>
                    <div style={{ display: "flex", gap: "16px", fontSize: "11.5px", color: "#0f172a", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                      <span>Size: <strong style={{ color: "#0f172a", fontWeight: 700 }}>{item.size || "M"}</strong></span>
                      <span>Qty: <strong style={{ color: "#0f172a", fontWeight: 700 }}>{item.quantity || 1}</strong></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "10px", color: "#64748b", display: "block", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Item Price</span>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", fontFamily: "'Montserrat', sans-serif", display: "block" }}>
                      ₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                    </span>
                    <span style={{ fontSize: "11px", color: "#0A7F6E", display: "block", marginTop: "2px", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                      ₹{item.price.toLocaleString("en-IN")} each
                    </span>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    style={{
                      background: "rgba(255,59,48,0.06)",
                      border: "none",
                      borderRadius: "10px",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#ef4444",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,59,48,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,59,48,0.06)"; }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Cart Total Block */}
          <div 
            style={{
              background: "#ffffff",
              border: "3px solid rgba(10, 127, 110, 0.22)",
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              boxShadow: "0 15px 35px -8px rgba(10, 127, 110, 0.08), 0 4px 12px -5px rgba(0, 0, 0, 0.04)",
              gap: "16px"
            }}
          >
            <div>
              <span style={{ fontSize: "11.5px", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                Total Items ({cartItems.length})
              </span>
              <p style={{ fontSize: "11.5px", color: "#334155", margin: "4px 0 0", fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                Proceed to checkout for delivery and payments.
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "10px", color: "#64748b", display: "block" }}>Subtotal</span>
                <p style={{ fontSize: "18px", fontWeight: 800, color: "#0A7F6E", fontFamily: "'Montserrat', sans-serif", margin: 0 }}>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </p>
              </div>
              
              <Link 
                to="/cart"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 24px",
                  background: "linear-gradient(135deg, #0A7F6E, #0d9488)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  textDecoration: "none",
                  transition: "all 0.22s ease",
                  boxShadow: "0 4px 12px rgba(10,127,110,0.15)",
                }}
              >
                Go To Checkout <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS rules for responsive image */}
      <style>{`
        .cart-item-img-wrapper {
          width: 76px;
          height: 76px;
        }
        @media (min-width: 640px) {
          .cart-item-img-wrapper {
            width: 100px;
            height: 100px;
          }
        }
        @media (min-width: 1024px) {
          .cart-item-img-wrapper {
            width: 110px;
            height: 110px;
          }
        }
      `}</style>
    </div>
  );
};

export default MyCart;
