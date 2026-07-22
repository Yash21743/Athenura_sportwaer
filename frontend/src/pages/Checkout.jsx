import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Truck,
  ArrowLeft,
  Mail,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // LOAD CART
  // ================================
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await API.get("/cart");

        const cartData =
          response.data?.data ||
          response.data?.cart ||
          response.data ||
          [];

        if (!Array.isArray(cartData) || cartData.length === 0) {
          toast.error("Your cart is empty!");

          navigate("/dashboard", {
            state: { tab: "cart" },
          });

          return;
        }

        const normalizedCart = cartData.map((item) => ({
          _id:
            item.product?._id ||
            item.product ||
            item._id,

          name:
            item.product?.name ||
            item.name ||
            "Product",

          price: Number(
            item.product?.price ||
              item.price ||
              0
          ),

          image:
            item.product?.image ||
            item.image ||
            "",

          code:
            item.product?.code ||
            item.code ||
            "",

          quantity: Number(
            item.quantity || 1
          ),

          size: item.size || "",

          color: item.color || "",
        }));

        setCartItems(normalizedCart);
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error.response?.data ||
            error.message
        );

        toast.error(
          "Failed to load cart data."
        );

        navigate("/dashboard", {
          state: { tab: "cart" },
        });
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate]);

  // ================================
  // PRICE CALCULATION
  // ================================
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  const shipping =
    subtotal > 999 ? 0 : 99;

  const total =
    subtotal + shipping;

  // ================================
  // CLEAR CART (backend + localStorage)
  // ================================
  const clearCartEverywhere = async (itemsToClear) => {
    // 1) Clear backend cart, item by item
    try {
      await Promise.all(
        itemsToClear.map((item) =>
          API.delete("/cart", {
            data: {
              productId: item._id,
              size: item.size,
              color: item.color,
            },
          })
        )
      );
    } catch (clearErr) {
      console.error(
        "Failed to clear backend cart:",
        clearErr.response?.data || clearErr.message
      );
    }

    // 2) Clear localStorage cache used by AddToBag.jsx
    localStorage.removeItem("csw_cart_items");

    // 3) Clear local state
    setCartItems([]);

    // 4) Notify navbar / MyCart / AddToBag to refresh
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ================================
  // PLACE ORDER
  // ================================
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error(
        "Your cart is empty!"
      );
      return;
    }

    const invalidProduct =
      cartItems.some(
        (item) => !item._id
      );

    if (invalidProduct) {
      toast.error(
        "Invalid product found in cart."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // IMPORTANT:
      // Backend schema/controller fields
      // must match exactly.

      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item._id,

          name: item.name,

          code: item.code || "",

          price: Number(item.price),

          size: item.size || "",

          color: item.color || "",

          qty: Number(item.quantity),

          image: item.image || "",
        })),

        subtotal: Number(subtotal),

        shippingCost: Number(shipping),

        discountAmount: 0,

        promoCode: null,

        total: Number(total),

        shippingAddress: {
          fullName:
            formData.fullName.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          addressLine:
            formData.address.trim(),

          city:
            formData.city.trim(),

          state:
            formData.state.trim(),

          pinCode:
            formData.pincode.trim(),
        },

        paymentMethod: "COD",
      };

      console.log(
        "FINAL ORDER PAYLOAD:",
        JSON.stringify(
          orderPayload,
          null,
          2
        )
      );

      const res =
        await API.post(
          "/orders",
          orderPayload
        );

      if (res.data?.success) {
        toast.success(
          "Order Placed Successfully!"
        );

        // ✅ FIX: clear cart from backend + localStorage
        // so "Continue Shopping" doesn't show old items again
        await clearCartEverywhere(cartItems);

        navigate(
          "/dashboard/order-success",
          {
            state: {
              orderId:
                res.data.data?._id,

              total,

              customerName:
                formData.fullName,
            },
          }
        );
      }
    } catch (error) {
      console.error(
        "ORDER ERROR:",
        error.response?.data ||
          error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <div className="checkout-loader">
        <div className="loader-spinner"></div>

        <p>
          Loading checkout...
        </p>
      </div>
    );
  }

  // ================================
  // UI
  // ================================
  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        .checkout-page {
          min-height: 100vh;
          padding: 30px 20px 60px;
          background: #f8fafc;
          font-family: 'Manrope', sans-serif;
          color: #111827;
        }

        .checkout-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          margin-bottom: 25px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .back-button:hover {
          color: #0a7f6e;
        }

        .checkout-heading {
          margin-bottom: 28px;
        }

        .checkout-heading h1 {
          margin: 0;
          color: #111827;
          font-size: 32px;
          font-weight: 900;
        }

        .checkout-heading p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.5fr)
            minmax(320px, 0.9fr);
          gap: 28px;
          align-items: start;
        }

        .checkout-card,
        .summary-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow:
            0 10px 35px
            rgba(15, 23, 42, 0.06);
        }

        .checkout-card {
          padding: 28px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 22px;
        }

        .section-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #ecfdf5;
          color: #0a7f6e;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .form-full {
          grid-column: span 2;
        }

        .input-wrapper label {
          display: block;
          margin-bottom: 7px;
          color: #475569;
          font-size: 12px;
          font-weight: 800;
        }

        .input-box {
          position: relative;
        }

        .input-box svg {
          position: absolute;
          top: 50%;
          left: 13px;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .input-box input {
          width: 100%;
          height: 46px;
          padding: 0 14px 0 42px;
          border: 1px solid #dbe1e8;
          border-radius: 10px;
          background: #ffffff;
          color: #111827;
          font-size: 14px;
          outline: none;
        }

        .input-box input:focus {
          border-color: #0a7f6e;
          box-shadow:
            0 0 0 3px
            rgba(10, 127, 110, 0.1);
        }

        .payment-section {
          margin-top: 30px;
          padding-top: 25px;
          border-top: 1px solid #eef2f7;
        }

        .payment-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid #0a7f6e;
          border-radius: 12px;
          background: #f0fdf9;
        }

        .payment-box input {
          width: 17px;
          height: 17px;
          accent-color: #0a7f6e;
        }

        .payment-box label {
          cursor: pointer;
          font-size: 14px;
          font-weight: 800;
        }

        .payment-box small {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 12px;
          font-weight: 500;
        }

        .place-order-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          height: 50px;
          margin-top: 25px;
          border: none;
          border-radius: 11px;
          background:
            linear-gradient(
              135deg,
              #0a7f6e,
              #0d9488
            );
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .place-order-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .summary-card {
          position: sticky;
          top: 25px;
          padding: 25px;
        }

        .summary-card h2 {
          margin: 0;
          padding-bottom: 18px;
          border-bottom: 1px solid #eef2f7;
          font-size: 19px;
          font-weight: 800;
        }

        .product-item {
          display: flex;
          gap: 13px;
          padding: 18px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .product-image {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          height: 68px;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #f8fafc;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-image span {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 800;
        }

        .product-info {
          flex: 1;
          min-width: 0;
        }

        .product-info h3 {
          margin: 0 0 5px;
          overflow: hidden;
          color: #111827;
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .product-info p {
          margin: 3px 0;
          color: #64748b;
          font-size: 12px;
        }

        .product-price {
          color: #111827;
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
        }

        .price-section {
          padding-top: 18px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 13px;
          font-size: 14px;
        }

        .price-row span {
          color: #64748b;
        }

        .price-row strong {
          color: #111827;
        }

        .total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 17px;
          padding-top: 17px;
          border-top: 1px solid #e5e7eb;
        }

        .total-row span {
          font-size: 17px;
          font-weight: 800;
        }

        .total-row strong {
          color: #0a7f6e;
          font-size: 23px;
          font-weight: 900;
        }

        .free-shipping {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          padding: 12px;
          border-radius: 9px;
          background: #ecfdf5;
          color: #047857;
          font-size: 12px;
          font-weight: 700;
        }

        .checkout-loader {
          display: flex;
          min-height: 60vh;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .loader-spinner {
          width: 38px;
          height: 38px;
          margin-bottom: 12px;
          border: 3px solid #e2e8f0;
          border-top-color: #0a7f6e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 850px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }

          .summary-card {
            position: static;
          }
        }

        @media (max-width: 600px) {
          .checkout-page {
            padding: 20px 12px 40px;
          }

          .checkout-heading h1 {
            font-size: 26px;
          }

          .checkout-card,
          .summary-card {
            padding: 20px;
            border-radius: 14px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-full {
            grid-column: span 1;
          }
        }

      `}</style>

      <div className="checkout-page">
        <div className="checkout-container">

          <button
            className="back-button"
            onClick={() =>
              navigate("/dashboard", {
                state: { tab: "cart" },
              })
            }
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <div className="checkout-heading">
            <h1>Checkout</h1>

            <p>
              Complete your details to place
              your order securely.
            </p>
          </div>

          <div className="checkout-layout">

            <div className="checkout-card">

              <div className="section-heading">
                <div className="section-icon">
                  <MapPin size={20} />
                </div>

                <h2>
                  Delivery Details
                </h2>
              </div>

              <form
                onSubmit={handlePlaceOrder}
              >
                <div className="form-grid">

                  <InputField
                    label="Full Name"
                    name="fullName"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    icon={
                      <User size={17} />
                    }
                  />

                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    icon={
                      <Mail size={17} />
                    }
                  />

                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    icon={
                      <Phone size={17} />
                    }
                  />

                  <InputField
                    label="Pincode"
                    name="pincode"
                    value={
                      formData.pincode
                    }
                    onChange={
                      handleChange
                    }
                    icon={
                      <MapPin size={17} />
                    }
                  />

                  <div className="form-full">

                    <InputField
                      label="Complete Address"
                      name="address"
                      value={
                        formData.address
                      }
                      onChange={
                        handleChange
                      }
                      icon={
                        <MapPin size={17} />
                      }
                    />

                  </div>

                  <InputField
                    label="City"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    icon={
                      <MapPin size={17} />
                    }
                  />

                  <InputField
                    label="State"
                    name="state"
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
                    icon={
                      <MapPin size={17} />
                    }
                  />

                </div>

                <div className="payment-section">

                  <div className="section-heading">

                    <div className="section-icon">
                      <Lock size={19} />
                    </div>

                    <h2>
                      Payment Method
                    </h2>

                  </div>

                  <div className="payment-box">

                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      defaultChecked
                    />

                    <label htmlFor="cod">

                      Cash on Delivery

                      <small>
                        Pay when your order arrives
                        at your doorstep.
                      </small>

                    </label>

                  </div>

                </div>

                <button
                  className="place-order-btn"
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                >
                  <Lock size={17} />

                  {isSubmitting
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

              </form>

            </div>

            <div className="summary-card">

              <h2>
                Order Summary
              </h2>

              {cartItems.map(
                (item) => (
                  <div
                    className="product-item"
                    key={`${item._id}-${item.size}-${item.color}`}
                  >

                    <div className="product-image">

                      {item.image ? (
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                        />
                      ) : (
                        <span>
                          JSY
                        </span>
                      )}

                    </div>

                    <div className="product-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.size ||
                          "Standard"}

                        {item.color &&
                          ` / ${item.color}`}
                      </p>

                      <p>
                        Qty:{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <div className="product-price">
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </div>

                  </div>
                )
              )}

              <div className="price-section">

                <div className="price-row">

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <div className="price-row">

                  <span>
                    Shipping
                  </span>

                  <strong>
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping}`}
                  </strong>

                </div>

                <div className="total-row">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

              {shipping === 0 && (
                <div className="free-shipping">

                  <Truck size={16} />

                  You got FREE shipping!

                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

// ================================
// INPUT FIELD
// ================================
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon,
}) => {
  return (
    <div className="input-wrapper">

      <label htmlFor={name}>
        {label}
      </label>

      <div className="input-box">

        {icon}

        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
        />

      </div>

    </div>
  );
};

export default Checkout;