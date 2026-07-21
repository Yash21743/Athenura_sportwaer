import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../services/api";

const Card = ({ children }) => {
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
        boxShadow:
          "0 15px 35px -8px rgba(10, 127, 110, 0.08), 0 4px 12px -5px rgba(0, 0, 0, 0.04)",
        animation: "csw-fadein 0.45s ease both"
      }}
    >
      {children}
    </div>
  );
};

const MyCart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // LOAD CART FROM BACKEND
  // ===============================

  const loadCart = async () => {
    try {
      setLoading(true);

      const res = await API.get("/cart");

      const items = res.data?.data || [];

      setCartItems(items);

      // Sync backend cart with AddToBag checkout flow
      localStorage.setItem(
        "csw_cart_items",
        JSON.stringify(
          items.map((item) => ({
            _id: item.product,
            name: item.name,
            code: item.code || "",
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            size: item.size || "",
            color: item.color || "",
            image: item.image || ""
          }))
        )
      );
    } catch (err) {
      console.error("Failed to load cart:", err);
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ===============================
  // UPDATE QUANTITY
  // ===============================

  const handleQuantityChange = async (
    productId,
    size,
    color,
    newQuantity
  ) => {
    const quantity = Number(newQuantity);

    if (!Number.isFinite(quantity) || quantity < 1) {
      return;
    }

    try {
      await API.put("/cart", {
        productId,
        size,
        color,
        quantity
      });

      setCartItems((previousItems) =>
        previousItems.map((item) =>
          item.product === productId &&
          item.size === size &&
          item.color === color
            ? {
                ...item,
                quantity
              }
            : item
        )
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Quantity update failed:", err);
      toast.error("Failed to update quantity.");
    }
  };

  // ===============================
  // REMOVE ITEM
  // ===============================

  const handleRemove = async (
    productId,
    size,
    color
  ) => {
    try {
      await API.delete("/cart", {
        data: {
          productId,
          size,
          color
        }
      });

      const updatedItems = cartItems.filter(
        (item) =>
          !(
            item.product === productId &&
            item.size === size &&
            item.color === color
          )
      );

      setCartItems(updatedItems);

      localStorage.setItem(
        "csw_cart_items",
        JSON.stringify(
          updatedItems.map((item) => ({
            _id: item.product,
            name: item.name,
            code: item.code || "",
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            size: item.size || "",
            color: item.color || "",
            image: item.image || ""
          }))
        )
      );

      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Removed from cart.");
    } catch (err) {
      console.error("Remove failed:", err);
      toast.error("Failed to remove item.");
    }
  };

  // ===============================
  // GO TO CHECKOUT
  // ===============================

  const handleGoToCheckout = () => {
    // Ensure latest backend cart is available
    localStorage.setItem(
      "csw_cart_items",
      JSON.stringify(
        cartItems.map((item) => ({
          _id: item.product,
          name: item.name,
          code: item.code || "",
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
          size: item.size || "",
          color: item.color || "",
          image: item.image || ""
        }))
      )
    );

    // Go to dashboard checkout route
    navigate("/dashboard/checkout");
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <Card>
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#64748b",
            fontSize: "12px"
          }}
        >
          Loading your cart...
        </div>
      </Card>
    );
  }

  // ===============================
  // EMPTY CART
  // ===============================

  if (cartItems.length === 0) {
    return (
      <Card>
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <ShoppingBag
            size={48}
            style={{
              color: "#94a3b8",
              marginBottom: "16px"
            }}
          />

          <h3
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              color: "#0f172a",
              margin: 0
            }}
          >
            Your Shopping Cart is empty
          </h3>

          <p
            style={{
              color: "#64748b",
              fontSize: "12px",
              marginTop: "6px",
              marginBottom: "20px"
            }}
          >
            Explore our high performance sportswear collection.
          </p>

          <Link
            to="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              background:
                "linear-gradient(135deg, #0A7F6E, #0d9488)",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              textDecoration: "none"
            }}
          >
            Shop Collection
            <ArrowRight size={13} />
          </Link>
        </div>
      </Card>
    );
  }

  // ===============================
  // CART UI
  // ===============================

  return (
    <div
      style={{
        animation: "csw-fadein 0.45s ease both",
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        {cartItems.map((item, index) => {
          // ✅ FIX: Replaced template literal with string concatenation to avoid Vite/oxc parse error
          const itemKey = item.product + "-" + (item.size || "") + "-" + (item.color || "") + "-" + index;

          return (
            <div
              key={itemKey}
              style={{
                background: "#ffffff",
                border:
                  "3px solid rgba(10, 127, 110, 0.22)",
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
                boxShadow:
                  "0 15px 35px -8px rgba(10, 127, 110, 0.08)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "20px",
                  flex: "1 1 auto",
                  minWidth: 0
                }}
              >
                <div
                  className="cart-item-img-wrapper"
                  style={{
                    borderRadius: "12px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    flexShrink: 0
                  }}
                >
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150"
                    }
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: "14.5px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 5px"
                    }}
                  >
                    {item.name}
                  </h4>

                  <p
                    style={{
                      fontSize: "11px",
                      color: "#0A7F6E",
                      fontWeight: 700,
                      margin: "0 0 8px"
                    }}
                  >
                    {item.code || "N/A"}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "11.5px"
                    }}
                  >
                    <span>
                      Size:{" "}
                      <strong>
                        {item.size || "M"}
                      </strong>
                    </span>

                    <span>
                      Color:{" "}
                      <strong>
                        {item.color || "N/A"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px"
                }}
              >
                {/* QUANTITY */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid #dbe5e2",
                    borderRadius: "8px",
                    padding: "4px"
                  }}
                >
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product,
                        item.size,
                        item.color,
                        Number(item.quantity || 1) - 1
                      )
                    }
                    disabled={item.quantity <= 1}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor:
                        item.quantity <= 1
                          ? "not-allowed"
                          : "pointer"
                    }}
                  >
                    <Minus size={14} />
                  </button>

                  <strong>
                    {item.quantity || 1}
                  </strong>

                  <button
                    onClick={() =>
                      handleQuantityChange(
                        item.product,
                        item.size,
                        item.color,
                        Number(item.quantity || 1) + 1
                      )
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* PRICE */}

                <div
                  style={{
                    textAlign: "right"
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#64748b",
                      display: "block"
                    }}
                  >
                    ITEM PRICE
                  </span>

                  <strong
                    style={{
                      fontSize: "15px",
                      color: "#0f172a"
                    }}
                  >
                    ₹
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: "#0A7F6E"
                    }}
                  >
                    ₹
                    {Number(item.price || 0).toLocaleString(
                      "en-IN"
                    )}{" "}
                    each
                  </span>
                </div>

                {/* REMOVE */}

                <button
                  onClick={() =>
                    handleRemove(
                      item.product,
                      item.size,
                      item.color
                    )
                  }
                  style={{
                    background:
                      "rgba(255,59,48,0.06)",
                    border: "none",
                    borderRadius: "10px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#ef4444"
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {/* CHECKOUT SUMMARY */}

        <div
          style={{
            background: "#ffffff",
            border:
              "3px solid rgba(10, 127, 110, 0.22)",
            borderRadius: "16px",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11.5px",
                color: "#0f172a",
                textTransform: "uppercase",
                fontWeight: 700
              }}
            >
              Total Items ({totalItems})
            </span>

            <p
              style={{
                fontSize: "11.5px",
                color: "#334155",
                margin: "4px 0 0"
              }}
            >
              Proceed to checkout for delivery and payment.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px"
            }}
          >
            <div
              style={{
                textAlign: "right"
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: "#64748b",
                  display: "block"
                }}
              >
                SUBTOTAL
              </span>

              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#0A7F6E",
                  margin: 0
                }}
              >
                ₹{totalPrice.toLocaleString("en-IN")}
              </p>
            </div>

            <button
              onClick={handleGoToCheckout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 24px",
                background:
                  "linear-gradient(135deg, #0A7F6E, #0d9488)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow:
                  "0 4px 12px rgba(10,127,110,0.15)"
              }}
            >
              Go To Checkout
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

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