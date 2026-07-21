import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Tag,
  ChevronRight,
  CreditCard,
  ArrowRight,
  Truck
} from 'lucide-react';

const AddToBag = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [showLoginWall, setShowLoginWall] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('csw_is_logged_in') === 'true';
  });

  // ===============================
  // LOAD CART
  // ===============================

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    const handleUserLogin = () => {
      const loggedIn =
        localStorage.getItem('csw_is_logged_in') === 'true';

      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        setShowLoginWall(false);
      }
    };

    const handleShowLoginPopup = () => {
      setShowLoginWall(true);
    };

    window.addEventListener(
      'cartUpdated',
      handleCartUpdate
    );

    window.addEventListener(
      'storage',
      handleCartUpdate
    );

    window.addEventListener(
      'userLoggedIn',
      handleUserLogin
    );

    window.addEventListener(
      'showCartLoginPopup',
      handleShowLoginPopup
    );

    return () => {
      window.removeEventListener(
        'cartUpdated',
        handleCartUpdate
      );

      window.removeEventListener(
        'storage',
        handleCartUpdate
      );

      window.removeEventListener(
        'userLoggedIn',
        handleUserLogin
      );

      window.removeEventListener(
        'showCartLoginPopup',
        handleShowLoginPopup
      );
    };
  }, []);

  // ===============================
  // LOAD CART
  // ===============================

  const loadCart = () => {
    try {
      const storedCart =
        localStorage.getItem('csw_cart_items');

      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Cart loading error:', error);
      setCartItems([]);
    }
  };

  // ===============================
  // SAVE CART
  // ===============================

  const saveCart = (items) => {
    setCartItems(items);

    localStorage.setItem(
      'csw_cart_items',
      JSON.stringify(items)
    );

    window.dispatchEvent(
      new Event('cartUpdated')
    );
  };

  // ===============================
  // UPDATE QUANTITY
  // ===============================

  const updateQuantity = (
    id,
    size,
    color,
    newQuantity
  ) => {
    const quantity = Number(newQuantity);

    if (
      !Number.isFinite(quantity) ||
      quantity < 1
    ) {
      return;
    }

    const updatedItems = cartItems.map((item) => {
      if (
        item._id === id &&
        item.size === size &&
        item.color === color
      ) {
        return {
          ...item,
          quantity
        };
      }

      return item;
    });

    saveCart(updatedItems);
  };

  // ===============================
  // REMOVE ITEM
  // ===============================

  const removeItem = (
    id,
    size,
    color
  ) => {
    const updatedItems = cartItems.filter(
      (item) =>
        !(
          item._id === id &&
          item.size === size &&
          item.color === color
        )
    );

    saveCart(updatedItems);
  };

  // ===============================
  // PROMO
  // ===============================

  const applyPromoCode = (event) => {
    event.preventDefault();

    setPromoError('');
    setPromoSuccess('');

    const code =
      promoCode.trim().toUpperCase();

    if (code === 'ATHENURA10') {
      setDiscountPercent(10);

      setPromoSuccess(
        '10% discount applied successfully!'
      );
    } else {
      setDiscountPercent(0);

      setPromoError(
        'Invalid promo code. Try ATHENURA10.'
      );
    }
  };

  // ===============================
  // CALCULATIONS
  // ===============================

  const itemsCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const discountAmount = Math.round(
    (subtotal * discountPercent) / 100
  );

  const shippingCost = 0;

  const total =
    subtotal -
    discountAmount +
    shippingCost;

  // ===============================
  // GO TO CHECKOUT
  // ===============================

  const handleGoToCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginWall(true);
      return;
    }

    navigate('/dashboard', {
  state: {
    activeTab: 'checkout'
  }
});
  };

  return (
    <>
      <style>{`

        .cart-wrap {
          min-height: 100vh;
          background: #ffffff;
          color: #111111;
          padding-bottom: 40px;
          font-family: 'Poppins', sans-serif;
        }

        .cart-header {
          max-width: 1200px;
          margin: auto;
          padding: 24px 16px;
        }

        .cart-layout {
          max-width: 1200px;
          margin: auto;
          padding: 0 16px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
        }

        .cart-list-sec {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cart-item-card {
          display: flex;
          gap: 14px;
          background: #0c1f1b;
          border-radius: 18px;
          padding: 16px;
          color: #fff;
        }

        .cart-item-img {
          width: 110px;
          height: 110px;
          border-radius: 12px;
          object-fit: cover;
        }

        .cart-item-details {
          flex: 1;
        }

        .item-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .qty-select {
          display: flex;
          align-items: center;
          background: #dddfd2;
          border-radius: 10px;
          padding: 3px;
        }

        .qty-btn {
          width: 30px;
          height: 30px;
          border: none;
          background: transparent;
          color: #0a7f6e;
          cursor: pointer;
        }

        .qty-input {
          width: 40px;
          text-align: center;
          border: none;
          background: transparent;
          color: #053d35;
          font-weight: bold;
        }

        .summary-card {
          background: #0c1f1b;
          color: white;
          border-radius: 22px;
          padding: 22px;
          height: fit-content;
          position: sticky;
          top: 90px;
        }

        .promo-form {
          display: flex;
          gap: 8px;
          margin: 20px 0;
        }

        .promo-input {
          flex: 1;
          padding: 12px;
          background: #000;
          color: white;
          border: 1px solid #444;
          border-radius: 8px;
        }

        .promo-btn {
          padding: 0 15px;
          background: #333;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .checkout-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(
            135deg,
            #0a7f6e,
            #14a38f
          );
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0a7f6e;
          color: white;
          text-decoration: none;
          padding: 14px 25px;
          border-radius: 12px;
        }

        @media(max-width: 992px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }

          .summary-card {
            position: static;
          }
        }

        @media(max-width: 600px) {
          .cart-item-card {
            flex-direction: column;
          }

          .cart-item-img {
            width: 100%;
            height: 240px;
          }

          .item-bottom-row {
            flex-wrap: wrap;
            gap: 15px;
          }
        }

      `}</style>

      <div className="cart-wrap">

        <div className="cart-header">

          <div
            style={{
              display: 'flex',
              gap: 8,
              fontSize: 12,
              color: '#777'
            }}
          >
            <Link
              to="/"
              style={{
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              HOME
            </Link>

            <ChevronRight size={14} />

            <span>
              SHOPPING BAG
            </span>
          </div>

          <h1
            style={{
              color: '#0a7f6e',
              fontWeight: 900
            }}
          >
            YOUR SHOPPING BAG
          </h1>

          {cartItems.length > 0 && (
            <p>
              You have{' '}
              <strong>
                {itemsCount}
              </strong>{' '}
              items in your bag.
            </p>
          )}

        </div>

        {cartItems.length === 0 ? (

          <div className="empty-state">

            <ShoppingBag
              size={70}
              color="#0a7f6e"
            />

            <h2>
              Your Bag is Empty
            </h2>

            <p>
              Browse our premium collection.
            </p>

            <Link
              to="/products"
              className="explore-btn"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>

          </div>

        ) : (

          <div className="cart-layout">

            {/* CART ITEMS */}

            <div className="cart-list-sec">

              {cartItems.map((item) => (

                <div
                  key={`${item._id}-${item.size}-${item.color}`}
                  className="cart-item-card"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />

                  <div className="cart-item-details">

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >

                      <h3>
                        {item.name}
                      </h3>

                      <button
                        onClick={() =>
                          removeItem(
                            item._id,
                            item.size,
                            item.color
                          )
                        }
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                    <div
                      style={{
                        color: '#aaa',
                        fontSize: 13
                      }}
                    >
                      Code: {item.code || 'N/A'}
                      <br />
                      Size: {item.size || 'N/A'}
                      <br />
                      Color: {item.color || 'N/A'}
                    </div>

                    <div className="item-bottom-row">

                      <div className="qty-select">

                        <button
                          className="qty-btn"
                          disabled={
                            item.quantity <= 1
                          }
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus size={14} />
                        </button>

                        <input
                          className="qty-input"
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(
                              item._id,
                              item.size,
                              item.color,
                              event.target.value
                            )
                          }
                        />

                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus size={14} />
                        </button>

                      </div>

                      <strong>
                        ₹
                        {Number(item.price) *
                          Number(item.quantity)}
                      </strong>

                    </div>

                  </div>

                </div>

              ))}

              <Link
                to="/products"
                style={{
                  color: '#111',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>

            </div>

            {/* SUMMARY */}

            <div className="summary-card">

              <h2>
                Order Summary
              </h2>

              <form
                onSubmit={applyPromoCode}
                className="promo-form"
              >

                <input
                  className="promo-input"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(event) =>
                    setPromoCode(
                      event.target.value
                    )
                  }
                />

                <button
                  className="promo-btn"
                  type="submit"
                >
                  Apply
                </button>

              </form>

              {promoError && (
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: 12
                  }}
                >
                  {promoError}
                </p>
              )}

              {promoSuccess && (
                <p
                  style={{
                    color: '#4ade80',
                    fontSize: 12
                  }}
                >
                  {promoSuccess}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 20
                }}
              >
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹{subtotal}
                </strong>
              </div>

              {discountAmount > 0 && (

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#4ade80',
                    marginTop: 15
                  }}
                >
                  <span>
                    <Tag size={13} />
                    Discount
                  </span>

                  <strong>
                    -₹{discountAmount}
                  </strong>
                </div>

              )}

              <hr
                style={{
                  margin: '20px 0'
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 20
                }}
              >
                <strong>
                  Total
                </strong>

                <strong
                  style={{
                    fontSize: 24
                  }}
                >
                  ₹{total}
                </strong>
              </div>

              {showLoginWall ? (

                <div
                  style={{
                    border: '1px solid #14a889',
                    padding: 20,
                    borderRadius: 12,
                    textAlign: 'center'
                  }}
                >

                  <h3>
                    Login Required
                  </h3>

                  <p
                    style={{
                      fontSize: 13,
                      color: '#aaa'
                    }}
                  >
                    Please login to continue checkout.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: 10
                    }}
                  >

                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent(
                            'openSignIn'
                          )
                        );

                        setShowLoginWall(false);
                      }}
                      style={{
                        flex: 1,
                        padding: 12
                      }}
                    >
                      Sign In
                    </button>

                    <button
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent(
                            'openRegister'
                          )
                        );

                        setShowLoginWall(false);
                      }}
                      style={{
                        flex: 1,
                        padding: 12
                      }}
                    >
                      Register
                    </button>

                  </div>

                </div>

              ) : (

                <button
                  className="checkout-btn"
                  onClick={handleGoToCheckout}
                >
                  Go To Checkout
                  <CreditCard size={18} />
                </button>

              )}

              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 20,
                  fontSize: 12,
                  color: '#aaa'
                }}
              >
                <Truck size={15} />
                Secure checkout
              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );
};

export default AddToBag;