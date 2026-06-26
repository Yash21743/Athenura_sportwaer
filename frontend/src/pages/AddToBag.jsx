import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Check, 
  Tag, ChevronRight, CreditCard, ArrowRight, Truck, Info, 
  MapPin, ShoppingCart, Calendar
} from 'lucide-react';

const AddToBag = () => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'shipping', 'success'
  
  // Checkout Form States
  const [addressForm, setAddressForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Load cart initially
  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem('csw_cart_items');
        if (stored) {
          setCartItems(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load cart items from localStorage:', err);
      }
    };

    loadCart();

    // Listen to custom update event from product detail
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('csw_cart_items', JSON.stringify(items));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (id, size, color, newQty) => {
    if (newQty < 1) return;
    const updated = cartItems.map(item => 
      (item._id === id && item.size === size && item.color === color)
        ? { ...item, quantity: Math.max(1, newQty) }
        : item
    );
    saveCart(updated);
  };

  const removeItem = (id, size, color) => {
    const updated = cartItems.filter(item => 
      !(item._id === id && item.size === size && item.color === color)
    );
    saveCart(updated);
  };

  const applyPromoCode = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    
    if (promoCode.trim().toUpperCase() === 'ATHENURA10') {
      setDiscountPercent(10);
      setPromoSuccess('10% discount applied successfully!');
    } else if (promoCode.trim()) {
      setPromoError('Invalid promo code. Try "ATHENURA10".');
      setDiscountPercent(0);
    }
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingCost = subtotal >= 2000 || subtotal === 0 ? 0 : 150;
  const gstAmount = Math.round((subtotal - discountAmount) * 0.12); // 12% GST
  const total = subtotal - discountAmount + shippingCost;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingOrder(true);

    // Simulate server request
    setTimeout(() => {
      const generatedId = `ATH-${Math.floor(100000 + Math.random() * 900000)}-${addressForm.zip || 'IN'}`;
      setOrderId(generatedId);
      setIsSubmittingOrder(false);
      setCheckoutStep('success');
      
      // Clear cart
      saveCart([]);
    }, 1500);
  };

  const handleFormChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value
    });
  };

  // Styles injected for styling the layout
  const localStyles = `
    /* ── Base Reset ── */
    .cart-wrap * { box-sizing: border-box; }
    .cart-wrap { min-height: 100vh; background: #ffffff; color: #111111; padding-bottom: 20px; font-family: 'Poppins', sans-serif; overflow-x: hidden; width: 100%; max-width: 100vw; }

    /* ── Header ── */
    .cart-header { max-width: 1200px; margin: 0 auto; padding: 24px 16px 12px; }

    /* ── Two-column layout (desktop) ── */
    .cart-layout { max-width: 1200px; margin: 0 auto; padding: 0 16px 0; display: grid; grid-template-columns: 1fr 360px; gap: 28px; }

    /* ── Left column ── */
    .cart-list-sec { display: flex; flex-direction: column; gap: 14px; min-width: 0; }

    /* ── Cart item card (row layout on desktop) ── */
    .cart-item-card { display: flex; flex-direction: row; gap: 14px; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 16px; position: relative; transition: border-color 0.3s; color: #fff; width: 100%; overflow: hidden; }
    .cart-item-card:hover { border-color: rgba(255,59,48,0.4); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

    /* ── Card image (fixed square on desktop) ── */
    .cart-item-img { width: 100px; height: 100px; min-width: 100px; border-radius: 10px; object-fit: cover; background: #111; border: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; display: block; max-width: 100%; }

    /* ── Card details ── */
    .cart-item-details { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }

    /* ── Qty + Price row ── */
    .item-bottom-row { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px; gap: 8px; flex-wrap: wrap; }
    .item-price-block { text-align: right; flex-shrink: 0; }

    /* ── Code / Size / Color meta row ── */
    .item-meta-list { display: flex; flex-wrap: wrap; gap: 8px 12px; margin-top: 6px; font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 300; }

    /* ── Promo form ── */
    .promo-form { display: flex; gap: 8px; margin-bottom: 24px; }
    .promo-input { flex: 1; min-width: 0; padding: 10px 14px; background: #000; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: #fff; font-size: 12px; outline: none; }
    .promo-btn { padding: 0 18px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; }
    .promo-btn:hover { background: rgba(255,255,255,0.15); }

    /* ── Quantity selector ── */
    .qty-select { display: flex; align-items: center; gap: 4px; background: #000; padding: 2px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); width: fit-content; flex-shrink: 0; }
    .qty-btn { width: 28px; height: 28px; border-radius: 7px; border: none; background: transparent; color: #fff; cursor: pointer; display: grid; place-items: center; font-weight: 700; transition: background 0.2s; flex-shrink: 0; }
    .qty-btn:hover { background: rgba(255,255,255,0.1); }
    .qty-input { width: 38px; min-width: 38px; text-align: center; background: transparent; border: none; color: #fff; font-weight: 700; font-size: 13px; outline: none; }

    /* ── Summary card (right) ── */
    .summary-card { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.08); border-radius: 22px; padding: 22px; height: fit-content; position: sticky; top: 90px; box-shadow: 0 12px 36px rgba(0,0,0,0.18); color: #fff; width: 100%; }

    /* ── Empty state ── */
    .empty-state { text-align: center; padding: 60px 16px; max-width: 600px; margin: 0 auto; }
    .explore-btn { display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg,#FF3B30 0%,#ff6b00 100%); color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 14px; font-weight: 800; font-family: 'Montserrat',sans-serif; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.3s; box-shadow: 0 8px 20px rgba(255,59,48,0.35); }
    .explore-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(255,59,48,0.45); }

    /* ── Checkout form ── */
    .checkout-form-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
    .form-col-full { grid-column: span 2; }
    .input-field { width: 100%; padding: 11px 14px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: #fff; font-size: 13px; outline: none; transition: border-color 0.2s; font-family: inherit; }
    .input-field:focus { border-color: #FF3B30; background: rgba(255,59,48,0.03); }

    /* ═BREAKPOINT══ */

  
    @media (max-width: 992px) {
      .cart-layout { grid-template-columns: 1fr; gap: 18px; }
      .summary-card { position: static; }
    }

   
    @media (max-width: 600px) {
      .cart-header { padding: 14px 12px 8px; }
      .cart-layout { padding: 0 12px; gap: 14px; }
      .cart-item-card { flex-direction: column; gap: 0; padding: 14px; border-radius: 16px; }
      .cart-item-img { width: 100%; min-width: unset; height: 170px; border-radius: 10px; margin-bottom: 12px; }
      .summary-card { padding: 16px; border-radius: 16px; }
      .checkout-form-grid { display: flex; flex-direction: column; gap: 12px; }
      .form-col-full { grid-column: span 1; }
    }

  
    @media (max-width: 420px) {
      .cart-header { padding: 12px 10px 6px; }
      .cart-layout { padding: 0 10px; gap: 10px; }
      .cart-item-card { padding: 12px; border-radius: 14px; }
      .cart-item-img { height: 150px; border-radius: 8px; margin-bottom: 10px; }
      .summary-card { padding: 14px; border-radius: 14px; }
      .qty-btn { width: 26px; height: 26px; }
      .qty-input { width: 26px; font-size: 12px; }
      .item-bottom-row { flex-direction: row; }
      .empty-state { padding: 36px 8px; }
    }

    
    @media (max-width: 350px) {
      .cart-header { padding: 10px 8px 6px; }
      .cart-layout { padding: 0 8px; gap: 8px; }
      .cart-item-card { padding: 10px; border-radius: 12px; }
      .cart-item-img { height: 130px; margin-bottom: 8px; }
      .summary-card { padding: 12px; border-radius: 12px; }
      .item-bottom-row { flex-direction: column; align-items: flex-start; gap: 10px; }
      .item-price-block { text-align: left; width: 100%; }
      .qty-btn { width: 26px; height: 26px; }
      .qty-input { width: 36px; min-width: 36px; font-size: 12px; }
    }

    
    @media (max-width: 316px) {
      .item-meta-list { flex-direction: column; gap: 4px; }
      .promo-form { flex-direction: column; gap: 8px; }
      .promo-input { width: 100%; padding: 10px 12px; }
      .promo-btn { width: 100%; padding: 10px 12px; text-align: center; }
    }
  `;

  return (
    <>
      <style>{localStyles}</style>
      <div className="cart-wrap">
        
        {/* Header & Breadcrumb */}
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'rgba(0, 0, 0, 0.45)', fontWeight: 600, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>HOME</Link>
            <ChevronRight size={12} />
            <Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>PRODUCTS</Link>
            <ChevronRight size={12} />
            <span style={{ color: '#FF3B30', fontWeight: 800 }}>SHOPPING BAG</span>
          </div>
          
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 42px)', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#111', marginBottom: '8px' }}>
            {checkoutStep === 'success' ? 'Order Confirmed' : checkoutStep === 'shipping' ? 'Shipping Details' : 'Your Shopping Bag'}
          </h1>
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <p style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', fontWeight: 300 }}>
              You have <strong style={{ color: '#000' }}>{itemsCount}</strong> {itemsCount === 1 ? 'item' : 'items'} in your bag.
            </p>
          )}
        </div>

        {/* Dynamic Pages Logic */}
        <AnimatePresence mode="wait">
          {/* STEP 1: Empty Cart */}
          {checkoutStep === 'cart' && cartItems.length === 0 && (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="empty-state"
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255, 59, 48, 0.08)', color: '#FF3B30', display: 'grid', placeItems: 'center', margin: '0 auto 24px', border: '1px solid rgba(255, 59, 48, 0.2)' }}>
                <ShoppingBag size={38} />
              </div>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: '12px', textTransform: 'uppercase', color: '#111' }}>
                Your Bag is Empty
              </h2>
              <p style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', lineHeight: 1.6, marginBottom: '36px', fontWeight: 300 }}>
                Athletic performance begins with the right gear. Browse our premium collection and customize your fit.
              </p>
              
              <Link to="/products" className="explore-btn">
                <span>Explore Products</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          )}

          {/* STEP 2: Items in Cart (Shopping Page View) */}
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <motion.div
              key="active-cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="cart-layout"
            >
              {/* Left Column: Cart items list */}
              <div className="cart-list-sec">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item._id}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.9, transition: { duration: 0.2 } }}
                      className="cart-item-card"
                    >
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-details">
                        {/* Title & Remove */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <Link to={`/products/${item._id}`} style={{ textDecoration: 'none' }}>
                              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', fontFamily: 'Montserrat, sans-serif', transition: 'color 0.2s', textTransform: 'uppercase' }} className="hover:text-[#FF3B30]">{item.name}</h3>
                            </Link>
                            <button
                              onClick={() => removeItem(item._id, item.size, item.color)}
                              style={{ border: 'none', background: 'transparent', color: 'rgba(255, 255, 255, 0.35)', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#FF3B30'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)'}
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          
                          <div className="item-meta-list">
                            <span>Code: <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{item.code}</strong></span>
                            <span>Size: <strong style={{ color: '#fff' }}>{item.size || 'N/A'}</strong></span>
                            <span>Color: <strong style={{ color: '#fff' }}>{item.color || 'N/A'}</strong></span>
                          </div>
                        </div>

                        {/* Quantity selector & Price subtotal */}
                        <div className="item-bottom-row">
                          <div className="qty-select">
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="qty-btn"
                              style={{ opacity: item.quantity <= 1 ? 0.3 : 1 }}
                            >
                              <Minus size={11} />
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => updateQuantity(item._id, item.size, item.color, Number(e.target.value))}
                              className="qty-input" 
                            />
                            <button 
                              type="button" 
                              onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}
                              className="qty-btn"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          
                          <div className="item-price-block">
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block', whiteSpace: 'nowrap' }}>₹{item.price} each</span>
                            <span style={{ fontSize: '15px', fontWeight: 900, color: '#fff', whiteSpace: 'nowrap' }}>₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Back Link */}
                <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(0, 0, 0, 0.55)', fontSize: '13px', textDecoration: 'none', fontWeight: 600, marginTop: '12px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#000'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0, 0, 0, 0.55)'}>
                  <ArrowLeft size={16} />
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Right Column: Order Summary */}
              <div className="summary-card">
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '20px', color: '#fff' }}>
                  Order Summary
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={applyPromoCode} className="promo-form">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)} 
                    className="promo-input"
                  />
                  <button 
                    type="submit" 
                    className="promo-btn"
                  >
                    Apply
                  </button>
                </form>
                {promoError && <p style={{ fontSize: '11px', color: '#FF3B30', marginTop: '-18px', marginBottom: '18px', fontWeight: 500 }}>{promoError}</p>}
                {promoSuccess && <p style={{ fontSize: '11px', color: '#4ade80', marginTop: '-18px', marginBottom: '18px', fontWeight: 500 }}>{promoSuccess}</p>}

                {/* Prices Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 300, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Bag Subtotal</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>₹{subtotal}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={12} /> Promo Discount</span>
                      <span style={{ fontWeight: 600 }}>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Estimated Shipping</span>
                    <span style={{ color: shippingCost === 0 ? '#4ade80' : '#fff', fontWeight: shippingCost === 0 ? 600 : 500 }}>
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                    </span>
                  </div>
                  
                  {shippingCost > 0 && (
                    <p style={{ fontSize: '10px', color: '#FF3B30', marginTop: '-6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Info size={10} /> Add ₹{2000 - subtotal} more for free shipping
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (12% Included)</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>₹{gstAmount}</span>
                  </div>
                </div>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Order Total</span>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>₹{total}</span>
                </div>

                {/* Proceed button */}
                <button
                  onClick={() => setCheckoutStep('shipping')}
                  style={{
                    width: '100%', padding: '16px', 
                    background: 'linear-gradient(135deg, #FF3B30 0%, #ff6b00 100%)', 
                    color: '#fff', borderRadius: '14px', fontSize: '13px', fontWeight: 800, border: 'none', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                    fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', 
                    transition: 'all 0.3s ease', boxShadow: '0 8px 20px rgba(255, 59, 48, 0.3)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(255, 59, 48, 0.45)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 59, 48, 0.3)'; }}
                >
                  <span>Proceed to Shipping</span>
                  <CreditCard size={16} />
                </button>

                {/* Safety Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 300, justifyContent: 'center' }}>
                  <Truck size={14} color="#FF3B30" />
                  <span>Secure checkout. High quality athletic fabric guaranteed.</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Checkout Shipping Form */}
          {checkoutStep === 'shipping' && (
            <motion.div
              key="checkout-shipping"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="cart-layout"
            >
              {/* Left Column: Form Details */}
              <div style={{ background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '32px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)', color: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
                  <MapPin size={20} color="#FF3B30" />
                  <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '18px', textTransform: 'uppercase', color: '#fff' }}>
                    Shipping Address
                  </h2>
                </div>

                <form onSubmit={handleCheckoutSubmit} className="checkout-form-grid">
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                    <input type="text" required name="name" value={addressForm.name} onChange={handleFormChange} placeholder="Enter full name" className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                    <input type="email" required name="email" value={addressForm.email} onChange={handleFormChange} placeholder="you@example.com" className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                    <input type="tel" required name="phone" value={addressForm.phone} onChange={handleFormChange} placeholder="+91 xxxxx xxxxx" className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Pincode / ZIP *</label>
                    <input type="text" required name="zip" value={addressForm.zip} onChange={handleFormChange} placeholder="e.g. 110001" className="input-field" />
                  </div>
                  <div className="form-col-full">
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Street Address *</label>
                    <input type="text" required name="address" value={addressForm.address} onChange={handleFormChange} placeholder="House, apartment number, area" className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>City *</label>
                    <input type="text" required name="city" value={addressForm.city} onChange={handleFormChange} placeholder="Enter City" className="input-field" />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>State *</label>
                    <input type="text" required name="state" value={addressForm.state} onChange={handleFormChange} placeholder="Enter State" className="input-field" />
                  </div>

                  <div className="form-col-full" style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      style={{ padding: '14px 24px', background: 'transparent', color: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', flex: 1 }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                    >
                      Back to Bag
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmittingOrder}
                      style={{
                        padding: '14px 28px', 
                        background: isSubmittingOrder ? '#555' : 'linear-gradient(135deg, #FF3B30 0%, #ff6b00 100%)', 
                        color: '#fff', borderRadius: '12px', fontSize: '12px', fontWeight: 800, border: 'none', 
                        cursor: isSubmittingOrder ? 'not-allowed' : 'pointer', flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { if(!isSubmittingOrder) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={(e) => { if(!isSubmittingOrder) e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      {isSubmittingOrder ? 'Placing Order...' : 'Place Order (Simulated)'}
                      {!isSubmittingOrder && <Check size={16} />}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Order Summary details */}
              <div className="summary-card">
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '20px', color: '#fff' }}>
                  Items Summary
                </h3>

                {/* Items loop */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '200px', overflowY: 'auto', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', scrollbarWidth: 'thin' }}>
                  {cartItems.map(item => (
                    <div key={`${item._id}-${item.size}-${item.color}`} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, fontSize: '12px' }}>
                        <h4 style={{ fontWeight: 700, color: '#fff', textTransform: 'uppercase', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</h4>
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: 300 }}>Qty: {item.quantity} &middot; Sz: {item.size}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Summary totals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span style={{ color: '#fff' }}>₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                      <span>Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping</span>
                    <span style={{ color: '#fff' }}>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                  </div>
                </div>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Total Amount</span>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>₹{total}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Success View */}
          {checkoutStep === 'success' && (
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                maxWidth: '640px', margin: '40px auto 0', background: '#0a0a0a', 
                border: '1px solid rgba(74, 222, 128, 0.2)', borderRadius: '24px', 
                padding: '48px 32px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
              }}
            >
              {/* Success Ring */}
              <div style={{ 
                width: '76px', height: '76px', 
                background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', 
                color: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', 
                margin: '0 auto 24px', boxShadow: '0 10px 25px rgba(74, 222, 128, 0.2)' 
              }}>
                <Check size={38} strokeWidth={3} />
              </div>

              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: '24px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Order Placed!
              </h2>
              <p style={{ color: '#4ade80', fontSize: '13px', fontWeight: 700, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Confirmation Code: {orderId}
              </p>
              
              <p style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '14px', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 36px', fontWeight: 300 }}>
                Thank you for your purchase, <strong style={{ color: '#fff' }}>{addressForm.name}</strong>. A receipt and shipping details have been sent to <strong style={{ color: '#fff' }}>{addressForm.email}</strong>. 
                Your athletic gear will reach you in 4-6 business days.
              </p>

              {/* Order Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: '#000000', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '16px', marginBottom: '40px', fontSize: '12px', textAlign: 'left' }}>
                <div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)', display: 'block', marginBottom: '4px' }}>Shipping Method</span>
                  <strong style={{ color: '#fff', fontWeight: 600 }}>Standard Ground</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)', display: 'block', marginBottom: '4px' }}>Delivery Date</span>
                  <strong style={{ color: '#fff', fontWeight: 600 }}>{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} (Est.)</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)', display: 'block', marginBottom: '4px' }}>Payment Mode</span>
                  <strong style={{ color: '#fff', fontWeight: 600 }}>Simulated UPI</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link to="/products" className="explore-btn" style={{ padding: '14px 28px', fontSize: '12px' }}>
                  <span>Continue Shopping</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default AddToBag;
