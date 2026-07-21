import React from "react";
import { CheckCircle, Truck, Clock } from "lucide-react";

// Reusable card container matching UserDashboard clean light design
const Card = ({ children, title, sub, action, accent }) => {
  return (
    <div 
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        marginBottom: "20px",
        boxShadow: "0 15px 35px -8px rgba(0, 0, 0, 0.12), 0 4px 12px -5px rgba(0, 0, 0, 0.04)",
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

// ✅ Formats an ISO date string (order.createdAt) into "Jul 12, 2026"
const formatOrderDate = (isoDate) => {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const OrderHistory = ({ orders }) => {
  return (
    <div style={{ animation: "csw-fadein 0.45s ease both" }}>
      {orders.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Clock size={48} style={{ color: "#94a3b8", marginBottom: "16px", display: "block", margin: "0 auto 16px" }} />
            <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "16px", color: "#0f172a", margin: 0 }}>No orders found</h3>
            <p style={{ color: "#64748b", fontSize: "12px", fontFamily: "'Poppins', sans-serif", marginTop: "6px", margin: 0 }}>
              You haven't placed any orders yet.
            </p>
          </div>
        </Card>
      ) : (
        orders.map((order) => {
          const accent = order.status === "Delivered" ? "#10B981" : order.status === "In Transit" ? "#3B82F6" : "#F59E0B";
          // ✅ FIX: real orders have _id (Mongo ObjectId) and orderNumber (e.g. "#CS-82049"),
          // not the flat `order.id` the mock data used.
          const orderKey = order._id;
          const orderLabel = order.orderNumber || order._id;

          return (
            <div 
              key={orderKey}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "20px 24px",
                position: "relative",
                overflow: "hidden",
                marginBottom: "14px",
                boxShadow: "0 15px 35px -8px rgba(0, 0, 0, 0.12), 0 4px 12px -5px rgba(0, 0, 0, 0.04)",
                animation: "csw-fadein 0.45s ease both",
              }}
            >
              {/* Top Accent line */}
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

              {/* Order Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
                <div>
                  <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "14.5px", color: "#0f172a", letterSpacing: "0.2px", margin: 0 }}>
                    Order {orderLabel}
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "11px", fontFamily: "'Poppins', sans-serif", marginTop: "2px", margin: 0 }}>
                    {/* ✅ FIX: format the real ISO date instead of relying on a pre-formatted mock string */}
                    Placed on {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    background:
                      order.status === "Delivered"
                        ? "rgba(16,185,129,0.08)"
                        : order.status === "In Transit"
                        ? "rgba(59,130,246,0.08)"
                        : "rgba(245,158,11,0.08)",
                    color: accent,
                    border: `1px solid ${
                      order.status === "Delivered"
                        ? "rgba(16,185,129,0.2)"
                        : order.status === "In Transit"
                        ? "rgba(59,130,246,0.2)"
                        : "rgba(245,158,11,0.2)"
                    }`,
                    fontFamily: "'Poppins', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {order.status === "Delivered" && <CheckCircle size={11} />}
                  {order.status === "In Transit" && <Truck size={11} />}
                  {order.status === "Processing" && <Clock size={11} />}
                  {order.status}
                </span>
              </div>

              {/* Order Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {order.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      gap: "16px",
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: "1 1 auto", minWidth: 0 }}>
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="oh-item-img"
                          style={{ 
                            objectFit: "cover", 
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            flexShrink: 0
                          }} 
                        />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <h4 className="oh-item-title" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "0.1px" }}>
                          {item.name}
                        </h4>
                        <div className="oh-item-details" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", color: "#64748b", fontFamily: "'Poppins', sans-serif" }}>
                          <span>Size: <strong style={{ color: "#334155" }}>{item.size}</strong></span>
                          <span style={{ color: "#cbd5e1" }}>•</span>
                          <span>Qty: <strong style={{ color: "#334155" }}>{item.qty}</strong></span>
                          <span style={{ color: "#cbd5e1" }}>•</span>
                          {/* ✅ FIX: item.price is a plain number from the backend (e.g. 1299),
                              not a formatted string like "₹1,299" — format it here instead */}
                          <span>Price: <strong style={{ color: "#334155" }}>₹{item.price.toLocaleString("en-IN")}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Dotted connector to bridge the empty space */}
                    <div className="oh-connector" style={{ flex: "1 1 auto", borderBottom: "2px dotted #0A7F6E", margin: "0 16px", height: "1px", opacity: 0.6 }} />

                    {/* Calculated Line Item Price */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {/* ✅ FIX: item.price is already a number — no need to strip currency
                          symbols with .replace(), which crashed on a non-string value */}
                      <span className="oh-item-total" style={{ fontWeight: 700, color: "#0f172a", fontFamily: "'Montserrat', sans-serif" }}>
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Tracking & Meta Information to fill space */}
              <div 
                style={{ 
                  marginTop: "20px", 
                  padding: "12px 18px", 
                  background: "#f8fafc", 
                  borderRadius: "12px", 
                  border: "1px dashed #e2e8f0",
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  boxSizing: "border-box"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11.5px", color: "#64748b", fontFamily: "'Poppins', sans-serif" }}>Shipping:</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#0A7F6E", fontFamily: "'Poppins', sans-serif", background: "rgba(10,127,110,0.08)", border: "1px solid rgba(10,127,110,0.15)", padding: "2px 8px", borderRadius: "6px" }}>
                    Standard Delivery
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11.5px", color: "#64748b", fontFamily: "'Poppins', sans-serif" }}>Est. Arrival:</span>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#334155", fontFamily: "'Poppins', sans-serif" }}>
                    {order.status === "Delivered" ? "Delivered Successfully" : "3-4 Business Days"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "11.5px", color: "#64748b", fontFamily: "'Poppins', sans-serif" }}>Tracking ID:</span>
                  <code style={{ fontSize: "11px", fontWeight: 700, color: "#475569", fontFamily: "monospace", background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px" }}>
                    {/* ✅ FIX: order.id doesn't exist on real orders — use _id (last 6 chars for brevity) */}
                    ATH-TRK-{order._id.slice(-6).toUpperCase()}
                  </code>
                </div>
              </div>

              {/* Order Total Footer */}
              <div 
                style={{ 
                  marginTop: "16px",
                  paddingTop: "14px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span style={{ fontSize: "10.5px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                  Total Paid Amount
                </span>
                {/* ✅ FIX: order.total is a plain number from the backend, not a pre-formatted string */}
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#0A7F6E", fontFamily: "'Montserrat', sans-serif" }}>
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })
      )}

      {/* Responsive order card styles */}
      <style>{`
        /* Phone View (Default) */
        .oh-item-img {
          width: 64px;
          height: 64px;
          border-radius: 10px;
        }
        .oh-item-title {
          font-size: 13.5px;
        }
        .oh-item-details {
          font-size: 11px;
        }
        .oh-item-total {
          font-size: 13px;
        }
        .oh-connector {
          display: none;
        }

        /* Pad/Tablet View */
        @media (min-width: 640px) {
          .oh-item-img {
            width: 80px;
            height: 80px;
            border-radius: 12px;
          }
          .oh-item-title {
            font-size: 15.5px;
          }
          .oh-item-details {
            font-size: 12.5px;
          }
          .oh-item-total {
            font-size: 15px;
          }
          .oh-connector {
            display: block;
          }
        }

        /* Desktop View */
        @media (min-width: 1024px) {
          .oh-item-img {
            width: 90px;
            height: 90px;
            border-radius: 14px;
          }
          .oh-item-title {
            font-size: 17px;
          }
          .oh-item-details {
            font-size: 13.5px;
          }
          .oh-item-total {
            font-size: 16.5px;
          }
          .oh-connector {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderHistory;