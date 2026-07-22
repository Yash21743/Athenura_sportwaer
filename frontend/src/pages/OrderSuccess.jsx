import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  ArrowRight,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import logo from "../assets/images/comfy_logo4.png";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    orderId,
    total,
    customerName,
  } = location.state || {};

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        .success-page {
          min-height: 100vh;
          padding: 30px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #f0fdf9 0%,
              #ffffff 50%,
              #ecfdf5 100%
            );
          font-family: "Manrope", sans-serif;
        }

        .success-card {
          width: 100%;
          max-width: 650px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #dfeeea;
          border-radius: 24px;
          box-shadow:
            0 25px 70px
            rgba(10, 127, 110, 0.14);
          text-align: center;
        }

        .success-header {
          padding: 32px 25px 25px;
          background:
            linear-gradient(
              135deg,
              #082c25,
              #0a7f6e
            );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .brand-logo {
          width: 160px;
          max-height: 70px;
          object-fit: contain;
          margin: 0 auto 22px auto;
          display: block;
        }

        .success-icon-wrapper {
          width: 92px;
          height: 92px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #ffffff;
          box-shadow:
            0 12px 30px
            rgba(0, 0, 0, 0.18);
        }

        .success-icon {
          color: #0a7f6e;
        }

        .success-content {
          padding: 35px 35px 40px;
        }

        .success-content h1 {
          margin: 0 0 10px;
          color: #10201d;
          font-size: 30px;
          font-weight: 900;
          letter-spacing: -0.8px;
        }

        .success-subtitle {
          margin: 0 auto 25px;
          max-width: 450px;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        .order-id-box {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 25px;
          padding: 11px 18px;
          border: 1px solid #b7e4d8;
          border-radius: 30px;
          background: #f0fdf9;
          color: #087563;
          font-size: 14px;
          font-weight: 800;
        }

        .customer-message {
          margin-bottom: 25px;
          color: #475569;
          font-size: 15px;
        }

        .customer-message strong {
          color: #111827;
        }

        .amount-box {
          margin: 25px 0;
          padding: 22px;
          border-radius: 16px;
          background: #f8fafc;
        }

        .amount-label {
          display: block;
          margin-bottom: 6px;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .amount {
          color: #0a7f6e;
          font-size: 32px;
          font-weight: 900;
        }

        .order-status {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 10px;
          margin: 25px 0;
        }

        .status-item {
          padding: 15px 8px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .status-item svg {
          margin-bottom: 7px;
          color: #0a7f6e;
        }

        .status-item span {
          display: block;
          color: #475569;
          font-size: 11px;
          font-weight: 800;
        }

        .dashboard-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 12px;
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
          transition: all 0.25s ease;
        }

        .dashboard-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 25px
            rgba(10, 127, 110, 0.25);
        }

        .footer-text {
          margin-top: 20px;
          color: #94a3b8;
          font-size: 12px;
        }

        @media (max-width: 600px) {

          .success-page {
            padding: 15px;
          }

          .success-content {
            padding: 28px 20px 30px;
          }

          .success-content h1 {
            font-size: 24px;
          }

          .order-status {
            gap: 6px;
          }

          .status-item {
            padding: 12px 5px;
          }

        }

      `}</style>

      <div className="success-page">

        <div className="success-card">

          {/* ================= HEADER ================= */}

          <div className="success-header">

            {/* LOGO */}

            <img
              src={logo}
              alt="Comfy Sport Wear"
              className="brand-logo"
            />

            <div className="success-icon-wrapper">

              <Check
                size={55}
                strokeWidth={3}
                className="success-icon"
              />

            </div>

          </div>

          {/* ================= CONTENT ================= */}

          <div className="success-content">

            <h1>
              Order Placed Successfully!
            </h1>

            <p className="success-subtitle">
              Thank you for shopping with
              <strong> Comfy Sport Wear</strong>.
              Your order has been received and is now
              being processed.
            </p>

            {/* ORDER ID */}

            <div className="order-id-box">

              <PackageCheck size={17} />

              Order ID:
              <strong>
                {orderId || "N/A"}
              </strong>

            </div>

            {/* CUSTOMER */}

            <p className="customer-message">

              Thank you for your purchase,

              <strong>
                {" "}
                {customerName || "Customer"}
              </strong>

            </p>

            {/* AMOUNT */}

            <div className="amount-box">

              <span className="amount-label">
                Total Amount
              </span>

              <div className="amount">
                ₹
                {Number(total || 0).toLocaleString(
                  "en-IN"
                )}
              </div>

            </div>

            {/* ORDER STATUS */}

            <div className="order-status">

              <div className="status-item">

                <PackageCheck size={22} />

                <span>
                  Order Confirmed
                </span>

              </div>

              <div className="status-item">

                <Truck size={22} />

                <span>
                  Processing
                </span>

              </div>

              <div className="status-item">

                <ShoppingBag size={22} />

                <span>
                  4-6 Days Delivery
                </span>

              </div>

            </div>

            {/* BUTTON */}

            <button
              className="dashboard-btn"
              onClick={() =>
                navigate("/dashboard")
              }
            >

              Continue Shopping

              <ArrowRight size={18} />

            </button>

            <p className="footer-text">

              Thank you for choosing
              <strong> Comfy Sport Wear</strong> 🏃‍♂️

            </p>

          </div>

        </div>

      </div>
    </>
  );
};

export default OrderSuccess;