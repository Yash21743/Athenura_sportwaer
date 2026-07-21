import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Star, Truck, Info, Check,
  MessageSquare, Users, ChevronRight, FileText, Send, X, ArrowUpRight
} from 'lucide-react';
import RelatedProducts from '../components/products/RelatedProducts';
import { mockProducts } from '../services/mockProducts';
import API from '../services/api';

/* ─── B2B Form Constants ─── */
const PHONE_DISPLAY = "+91 XXXXXXXXXX";
const CATEGORIES = ["Male", "Female", "Kids", "Unisex"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const QUANTITY_RANGES = [
  { value: "50-100", label: "50 – 100 units", max: 100 },
  { value: "100-250", label: "100 – 250 units", max: 250 },
  { value: "250-500", label: "250 – 500 units", max: 500 },
  { value: "500-1000", label: "500 – 1,000 units", max: 1000 },
  { value: "1000+", label: "1,000+ units", max: Infinity },
];

const boStyles = `
.bo-required { color: #0A7F6E; }
.bo-form { display: flex; flex-direction: column; gap: 1rem; }
.bo-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 520px) { .bo-field-row { grid-template-columns: 1fr; } }
.bo-field { display: flex; flex-direction: column; gap: 0.3rem; }
.bo-label { font-size: 0.78rem; font-weight: 600; color: #444; letter-spacing: 0.05em; text-transform: uppercase; }
.bo-input, .bo-textarea, .bo-select {
  padding: 0.75rem 1rem; border: 1.5px solid #e5e5e5;
  border-radius: 0.625rem; font-size: 0.95rem; font-family: 'Inter', sans-serif;
  color: #111; background: #fafafa; outline: none; width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.bo-input:focus, .bo-textarea:focus, .bo-select:focus {
  border-color: #0A7F6E; box-shadow: 0 0 0 3px rgba(10,127,110,0.12); background: #fff;
}
.bo-textarea { resize: vertical; min-height: 110px; }
.bo-select {
  cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1rem; padding-right: 2.5rem;
}
.bo-radio-group { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.bo-radio-label {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.55rem 1rem; border-radius: 999px;
  border: 1.5px solid #e5e5e5; cursor: pointer; font-size: 0.88rem;
  font-weight: 500; color: #555; transition: border-color 0.2s, background 0.2s, color 0.2s;
  user-select: none;
}
.bo-radio-label input { display: none; }
.bo-radio-label.selected { border-color: #0A7F6E; background: rgba(10,127,110,0.07); color: #0A7F6E; font-weight: 600; }
.bo-size-grid { display: flex; gap: 1rem; flex-wrap: wrap; }
.bo-size-chip { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.bo-size-chip-label {
  display: flex; align-items: center; justify-content: center;
  width: 54px; height: 54px; border-radius: 50%;
  border: 1.5px solid #e5e5e5; background: #fff;
  font-size: 0.85rem; font-weight: 600; color: #555;
  cursor: pointer; user-select: none;
  transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.15s;
}
.bo-size-chip-label:hover { border-color: rgba(10,127,110,0.5); transform: translateY(-2px); }
.bo-size-chip.selected .bo-size-chip-label {
  border-color: #0A7F6E; background: #0A7F6E; color: #fff;
  box-shadow: 0 4px 14px rgba(10,127,110,0.3);
}
.bo-size-chip-label input { display: none; }
.bo-size-chip-qty {
  width: 54px; padding: 0.35rem 0.4rem; border: 1.5px solid #e5e5e5;
  border-radius: 0.5rem; font-size: 0.8rem; text-align: center;
  background: #fff; outline: none; transition: border-color 0.2s;
}
.bo-size-chip-qty:focus { border-color: #0A7F6E; }
.bo-size-status { font-size: 0.82rem; font-weight: 600; margin-top: 0.5rem; }
.bo-size-status-red { color: #e0433d; }
.bo-size-status-green { color: #148f6f; }
.bo-input[type="date"] { cursor: pointer; }
.bo-submit-btn {
  display: flex; align-items: center; justify-content: center; gap: 0.65rem;
  padding: 0.95rem 2rem; border-radius: 999px; background: #0A7F6E; color: #fff;
  font-size: 0.9rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  border: none; cursor: pointer; width: 100%;
  transition: transform 0.15s, background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(10,127,110,0.30);
}
.bo-submit-btn:hover { transform: translateY(-2px); background: #086053; box-shadow: 0 8px 24px rgba(10,127,110,0.35); }
.bo-submit-btn:active { transform: translateY(0); }
.bo-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.bo-disclaimer { font-size: 0.77rem; color: #aaa; text-align: center; line-height: 1.6; margin-top: 0.25rem; }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Page States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery States
  const [activeImage, setActiveImage] = useState('');

  // Customization selection states
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Size guide modal state
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Inquiry form states
  const [inquiryForm, setInquiryForm] = useState({
    fullName: "", orgName: "", phone: "", email: "",
    category: "", quantity: "", sizes: [], customPrinting: "", deliveryDate: "", requirements: "",
  });
  const [sizeQuantities, setSizeQuantities] = useState({});
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/products/${id}`);
        const apiData = response.data?.data;
        if (apiData && apiData._id) {
          // Normalize backend fields to frontend expectations
          const normalizedProduct = {
            ...apiData,
            code: apiData.productCode || apiData.code,
            sizes: apiData.availableSizes || apiData.sizes || [],
            colors: apiData.availableColors || apiData.colors || [],
            fabric: apiData.fabricDetails || apiData.fabric || '',
            images: (apiData.images || []).map(img => typeof img === 'object' ? img.url : img),
          };
          setProduct(normalizedProduct);
          if (normalizedProduct.images.length > 0) {
            setActiveImage(normalizedProduct.images[0]);
          }
          if (normalizedProduct.sizes.length > 0) {
            setSelectedSize(normalizedProduct.sizes[0]);
          }
        } else {
          throw new Error('Product not found in database');
        }
      } catch (err) {
        console.warn(`Product API fetch failed for ID: ${id}, falling back to mock details.`, err);
        const mockItem = mockProducts.find((p) => p._id === id);
        if (mockItem) {
          setProduct(mockItem);
          if (mockItem.images && mockItem.images.length > 0) {
            setActiveImage(mockItem.images[0]);
          }
          if (mockItem.sizes && mockItem.sizes.length > 0) {
            setSelectedSize(mockItem.sizes[0]);
          }
        } else {
          setError('Product not found. It may have been removed or the ID is invalid.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    setInquirySuccess(false);
  }, [id]);

  // Inquiry form handlers
  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const setInquiryPrinting = (val) => setInquiryForm((prev) => ({ ...prev, customPrinting: val }));

  const toggleInquirySize = (val) => {
    setInquiryForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(val)
        ? prev.sizes.filter((s) => s !== val)
        : [...prev.sizes, val],
    }));
    setSizeQuantities((prev) => {
      if (prev[val] !== undefined) {
        const next = { ...prev };
        delete next[val];
        return next;
      }
      return { ...prev, [val]: "" };
    });
  };

  const updateInquirySizeQty = (val, qty) => {
    setSizeQuantities((prev) => ({ ...prev, [val]: qty }));
  };

  const selectedRange = useMemo(
    () => QUANTITY_RANGES.find((q) => q.value === inquiryForm.quantity),
    [inquiryForm.quantity]
  );

  const totalSizeQty = useMemo(
    () => Object.values(sizeQuantities).reduce((sum, v) => sum + (parseInt(v, 10) || 0), 0),
    [sizeQuantities]
  );

  const sizeQtyExceeded = !!selectedRange && Number.isFinite(selectedRange.max) && totalSizeQty > selectedRange.max;
  const sizeQtyRemaining = selectedRange && Number.isFinite(selectedRange.max) ? selectedRange.max - totalSizeQty : null;

  // Handle Inquiry Form Submission
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.fullName || !inquiryForm.orgName || !inquiryForm.phone || !inquiryForm.email || !inquiryForm.category || !inquiryForm.quantity || !inquiryForm.customPrinting) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (sizeQtyExceeded) {
      toast.error("Please increase your quantity — size quantities exceed the selected range.");
      return;
    }

    try {
      setInquirySubmitting(true);

      const formattedSizes = inquiryForm.sizes.length > 0
        ? inquiryForm.sizes.map(sz => `${sz}: ${sizeQuantities[sz] || 0}`).join(', ')
        : 'None';

      const detailedMessage = `B2B Product Enquiry:\nProduct: ${product.name} (${product.code || 'N/A'})\nOrg: ${inquiryForm.orgName}\nGender: ${inquiryForm.category}\nQty Range: ${inquiryForm.quantity}\nSizes: ${formattedSizes}\nPrinting: ${inquiryForm.customPrinting}\nDelivery: ${inquiryForm.deliveryDate || 'Not specified'}\nNotes: ${inquiryForm.requirements || 'None'}`;

      const inquiryPayload = {
        product: product._id,
        productName: product.name,
        productCode: product.code,
        name: inquiryForm.fullName,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        mobileNumber: inquiryForm.phone,
        organization: inquiryForm.orgName,
        category: inquiryForm.category,
        quantityRange: inquiryForm.quantity,
        printing: inquiryForm.customPrinting,
        deliveryDate: inquiryForm.deliveryDate,
        additionalRequirements: inquiryForm.requirements,
        size: selectedSize,
        color: product.colorNames ? product.colorNames[selectedColorIndex] : 'Default',
        sizes: inquiryForm.sizes,
        sizeQuantities,
        message: detailedMessage.slice(0, 999)
      };

      try {
        const response = await API.post('/leads', inquiryPayload);
        if (response.data && response.data.success) {
          toast.success(response.data.message || 'Inquiry submitted successfully!');
        }
      } catch (apiErr) {
        console.warn('Sending inquiry through mock response flow.', apiErr);
      }

      setInquirySubmitting(false);
      setInquirySuccess(true);

    } catch (err) {
      setInquirySubmitting(false);
      toast.error('There was a problem submitting your inquiry. Please try again.');
    }
  };

  const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');

  const handleAddToCart = () => {
    if (!product) return;
    try {
      const cartKey = 'csw_cart_items';
      const stored = localStorage.getItem(cartKey);
      let cart = stored ? JSON.parse(stored) : [];

      const colorName = product.colorNames && product.colorNames[selectedColorIndex]
        ? product.colorNames[selectedColorIndex]
        : 'Default';
      const sizeName = selectedSize || (product.sizes && product.sizes[0]) || 'Default';

      const existingIndex = cart.findIndex(item =>
        item._id === product._id &&
        item.size === sizeName &&
        item.color === colorName
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          _id: product._id,
          name: product.name,
          code: product.code,
          price: product.price,
          image: activeImage || (product.images && product.images[0]) || '',
          size: sizeName,
          color: colorName,
          quantity: quantity
        });
      }

      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));

      toast.success(
        (t) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            <span>Added {quantity}x items to your bag!</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                const loggedIn = localStorage.getItem('csw_is_logged_in') === 'true';
                if (loggedIn) {
                  navigate('/cart');
                } else {
                  window.dispatchEvent(new Event('showCartLoginPopup'));
                }
              }}
              style={{ color: '#0A7F6E', fontWeight: 800, textDecoration: 'underline', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', padding: 0 }}
            >
              View Bag
            </button>
          </div>
        ),
        { duration: 4000 }
      );
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      toast.error('Could not add item to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#DDDFD2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '48px', height: '48px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(0,0,0,0.06)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderTopColor: '#0A7F6E', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: '#DDDFD2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(10,127,110,0.1)', color: '#0A7F6E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid rgba(10,127,110,0.25)' }}>
          <Info size={32} />
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#000', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>Product Not Found</h3>
        <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '14px', maxWidth: '400px', marginBottom: '24px' }}>{error || 'Unable to locate details.'}</p>
        <Link to="/products" style={{ padding: '12px 24px', background: '#0A7F6E', color: '#111111', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const stockConf = {
    'In Stock': { dot: '#16a34a', color: '#16a34a', label: 'In Stock' },
    'Limited Stock': { dot: '#d97706', color: '#d97706', label: 'Limited' },
    'Out of Stock': { dot: '#dc2626', color: '#dc2626', label: 'Sold Out' },
  };
  const stock = stockConf[product.stockStatus] || { dot: '#888', color: '#888', label: product.stockStatus };
  const cleanDescription = stripHtml(product.description);

  const styles = `
    .pd-wrap { min-height: 100vh; background: #DDDFD2; color: #000; padding-bottom: 80px; font-family: 'Poppins', sans-serif; }
    .pd-header { max-width: 1400px; margin: 0 auto; padding: 24px 48px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .pd-container { max-width: 1400px; margin: 0 auto; padding: 0 48px; }
    .pd-card { background: #EAEBE3; color: #111111; border-radius: 24px; border: 1px solid rgba(0,0,0,0.1); padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .pd-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 48px; }
    .pd-img-col { grid-column: span 5; display: flex; flex-direction: column; gap: 16px; }
    .pd-info-col { grid-column: span 7; display: flex; flex-direction: column; justify-content: space-between; }
    
    .pd-form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .pd-form-full { grid-column: span 2; }
    .pd-qty-box { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: #EAEBE3; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; margin: 4px 0; flex-wrap: wrap; gap: 12px; }
    
    .pd-action-btns { display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
    .pd-action-btns button { flex: 1; min-width: 140px; }
    
    .pd-price-box { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding: 20px 24px; background: #EAEBE3; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; flex-wrap: wrap; gap: 16px; }

    @media (max-width: 1100px) {
      .pd-header { padding: 24px 24px; }
      .pd-container { padding: 0 24px; }
      .pd-card { padding: 28px; }
      .pd-grid { display: flex; flex-direction: column; gap: 32px; }
      .pd-form-grid { display: flex; flex-direction: column; }
      .pd-info-col { max-width: 780px; width: 100%; margin: 0 auto; }
      .pd-img-col { max-width: 780px; width: 100%; margin: 0 auto; }
    }
    @media (max-width: 768px) {
      .pd-header { padding: 24px 16px; }
      .pd-container { padding: 0 16px; }
      .pd-card { padding: 20px; }
      .pd-info-col { max-width: 100%; }
      .pd-img-col { max-width: 100%; }
    }
    @media (max-width: 480px) {
      .pd-header { padding: 16px; flex-direction: column; align-items: flex-start; }
      .pd-container { padding: 0 16px; }
      .pd-card { padding: 16px; border-radius: 16px; }
      .pd-action-btns { flex-direction: column; }
      .pd-action-btns button { width: 100%; }
      .pd-price-box { flex-direction: column; align-items: flex-start; text-align: left; }
      .pd-price-box > div { text-align: left !important; }
    }
    
    .custom-radio-btn {
      padding: 12px 20px;
      border-radius: 30px;
      border: 1px solid rgba(0,0,0,0.15);
      background: #ffffff;
      color: #333333;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Poppins', sans-serif;
    }
    .custom-radio-btn.selected {
      border-color: #0A7F6E;
      color: #0A7F6E;
      background: rgba(10,127,110,0.05);
      font-weight: 600;
    }
    .custom-radio-btn:hover:not(.selected) {
      background: #f5f5f5;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="pd-wrap">

        {/* Navigation Breadcrumbs / Back button */}
        <div className="pd-header">
          <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(0,0,0,0.6)', fontWeight: 600, fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.2s', fontFamily: 'inherit' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0A7F6E'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(0,0,0,0.4)', fontWeight: 500, fontFamily: 'monospace' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>HOME</Link>
            <ChevronRight size={14} />
            <Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>PRODUCTS</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#000', fontWeight: 700 }}>{product.code}</span>
          </div>
        </div>

        {/* Main product card details */}
        <main className="pd-container">
          <div className="pd-card">

            <div className="pd-grid">

              {/* Column 1: Image Gallery (Span 5) */}
              <div className="pd-img-col">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', background: '#EAEBE3', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={activeImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.8)', color: '#ffffff', fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.15)' }}>
                    {product.code}
                  </span>
                </div>


                {/* Product Specifications */}
                <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#EAEBE3', border: '1px solid rgba(10,127,110,0.2)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#0A7F6E' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif' }}>Product Details</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {product.fabric && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={20} color="#0A7F6E" />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Fabric</div>
                            <div style={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>{product.fabric}</div>
                          </div>
                        </div>
                      )}
                      {product.sizes && product.sizes.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Users size={20} color="#0A7F6E" />
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Available Sizes</div>
                            <div style={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>{product.sizes.join(', ')}</div>
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Info size={20} color="#0A7F6E" />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Category</div>
                          <div style={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>{product.category}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlighting Activewear Features */}
                <div style={{ marginTop: '16px', padding: '20px', background: '#EAEBE3', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', fontSize: '12px', color: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Truck size={16} color="#0A7F6E" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <span style={{ fontWeight: 700, color: '#111111', display: 'block', marginBottom: '4px', fontFamily: 'Montserrat, sans-serif' }}>Custom & Bulk Shipping</span>
                      <span style={{ fontWeight: 300, lineHeight: 1.5 }}>Direct shipping across India. Custom printing adds 4-7 business days processing.</span>
                    </div>
                  </div>
                  <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <Info size={16} color="#0A7F6E" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <span style={{ fontWeight: 700, color: '#111111', display: 'block', marginBottom: '4px', fontFamily: 'Montserrat, sans-serif' }}>Team Customizations Available</span>
                      <span style={{ fontWeight: 300, lineHeight: 1.5 }}>Get sublimation numbers, logo embroidery, and player name prints custom configured.</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Column 2: Specs & Inquiry Details (Span 7) */}
              <div className="pd-info-col">

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, border: '1px solid rgba(0,0,0,0.15)', padding: '3px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: stock.color, background: 'rgba(0,0,0,0.05)' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stock.dot, display: 'inline-block' }} />
                      {stock.label}
                    </span>
                  </div>

                  <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#111111', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', lineHeight: 1.1 }}>
                    {product.name}
                  </h1>

                  {/* Rating & Code */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} style={{ fill: i < 4 ? '#fbbf24' : '#ffffff', color: i < 4 ? '#fbbf24' : '#ffffff' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '13px', color: '#111111', fontWeight: 700 }}>4.2</span>
                      <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}>(28 inquiries)</span>
                    </div>
                    <span style={{ color: 'rgba(0,0,0,0.15)' }}>|</span>
                    <span style={{ fontSize: '12px', color: 'rgba(0,0,0,0.35)', fontFamily: 'monospace' }}>Product ID: {product.code}</span>
                  </div>

                  {/* Price */}
                  <div className="pd-price-box">
                    <div>
                      <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', fontWeight: 700, marginBottom: '4px' }}>Standard Unit Price</span>
                      <span style={{ fontSize: '32px', fontWeight: 900, color: '#111111', lineHeight: 1 }}>₹{product.price}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10px', background: 'rgba(10,127,110,0.1)', color: '#0A7F6E', border: '1px solid rgba(10,127,110,0.2)', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', display: 'inline-block', marginBottom: '4px' }}>
                        Bulk Discount Available
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.35)', display: 'block' }}>Minimum order quantity: 10 units</span>
                    </div>
                  </div>

                  {/* Color Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#111111', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>
                        Available Colors: <span style={{ color: '#0A7F6E', fontWeight: 400 }}>{product.colorNames && product.colorNames[selectedColorIndex]}</span>
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {product.colors.map((colorHex, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedColorIndex(idx)}
                            style={{
                              width: '36px', height: '36px', borderRadius: '50%', border: selectedColorIndex === idx ? '2px solid #0A7F6E' : '2px solid rgba(0,0,0,0.15)',
                              backgroundColor: colorHex, cursor: 'pointer', transition: 'all 0.2s', padding: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: selectedColorIndex === idx ? '0 0 0 4px rgba(10,127,110,0.15)' : 'none'
                            }}
                            title={product.colorNames ? product.colorNames[idx] : `Color ${idx + 1}`}
                          >
                            {selectedColorIndex === idx && (
                              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colorHex.toLowerCase() === '#ffffff' ? '#111' : '#111111' }} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>
                          Select Size
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsSizeGuideOpen(true)}
                          style={{ fontSize: '11px', fontWeight: 700, color: '#0A7F6E', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Poppins, sans-serif' }}
                        >
                          Size Guide
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {product.sizes.map((size) => {
                          const isActive = selectedSize === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setSelectedSize(size)}
                              style={{
                                width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                                background: isActive ? '#0A7F6E' : 'transparent',
                                border: isActive ? '1px solid #0A7F6E' : '1px solid rgba(0,0,0,0.15)',
                                color: isActive ? '#111111' : 'rgba(0,0,0,0.4)'
                              }}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif', marginBottom: '12px' }}>
                      Quantity
                    </h3>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '12px', overflow: 'hidden', height: '48px', background: 'transparent' }}>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        style={{ width: '48px', height: '100%', background: '#ffffff', border: 'none', cursor: 'pointer', fontSize: '20px', fontWeight: 500, color: '#111111', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                      >
                        -
                      </button>
                      <div style={{ width: '60px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#111111', borderLeft: '1px solid rgba(0,0,0,0.1)', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                        {quantity}
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.min(5, q + 1))}
                        disabled={quantity >= 5}
                        style={{ width: '48px', height: '100%', background: '#ffffff', border: 'none', cursor: quantity >= 5 ? 'not-allowed' : 'pointer', fontSize: '20px', fontWeight: 500, color: quantity >= 5 ? '#ccc' : '#111111', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => { if (quantity < 5) e.currentTarget.style.background = '#f5f5f5' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Direct Purchase Actions */}
                  <div className="pd-action-btns">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      style={{ padding: '16px', background: '#EAEBE3', color: '#111111', border: '1px solid #0A7F6E', borderRadius: '16px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(10,127,110,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#EAEBE3'}
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Proceeding to checkout")}
                      style={{ padding: '16px', background: '#0A7F6E', color: '#111111', border: 'none', borderRadius: '16px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#086053'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#0A7F6E'}
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#111111', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>
                      Product Description
                    </h3>
                    <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '13px', lineHeight: 1.8, fontWeight: 300 }}>
                      {cleanDescription}
                    </p>
                  </div>

                  {/* Fabric Specifications */}
                  {product.fabric && (
                    <div style={{ marginBottom: '24px', background: '#EAEBE3', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '16px' }}>
                      <FileText size={20} color="#0A7F6E" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Fabric Composition</h4>
                        <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '13px', fontWeight: 300 }}>{product.fabric}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Inquiry Form */}
                <div style={{
                  marginTop: '32px',
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.04)',
                  borderRadius: '24px',
                  padding: '40px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #0A7F6E 0%, #22c55e 100%)' }} />

                  <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(10,127,110,0.1) 0%, rgba(34,197,94,0.1) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MessageSquare size={24} color="#0A7F6E" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#111111', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.02em' }}>
                        B2B ENQUIRY FORM
                      </h3>
                      <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', fontWeight: 400 }}>Fill in your details and our team will send you a custom quote.</p>
                    </div>
                  </div>

                  <style>{boStyles}</style>
                  <AnimatePresence mode="wait">
                    {inquirySuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.05) 0%, rgba(34,197,94,0.05) 100%)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '20px', padding: '40px 32px', textAlign: 'center', color: '#4ade80' }}
                      >
                        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 30px rgba(74,222,128,0.3)' }}>
                          <Check size={40} strokeWidth={3} />
                        </div>
                        <h4 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px', color: '#111111', fontFamily: 'Montserrat, sans-serif' }}>Quote Request Sent!</h4>
                        <p style={{ fontSize: '15px', color: 'rgba(0,0,0,0.6)', maxWidth: '420px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                          Thank you, <strong style={{ color: '#0A7F6E' }}>{inquiryForm.fullName || 'there'}</strong>! We've received your request. Our sales team will get back to you within 24 hours with a custom proposal.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setInquirySuccess(false);
                            setInquiryForm({ fullName: "", orgName: "", phone: "", email: "", category: "", quantity: "", sizes: [], customPrinting: "", deliveryDate: "", requirements: "" });
                            setSizeQuantities({});
                          }}
                          style={{ padding: '16px 32px', background: 'rgba(0,0,0,0.05)', color: '#111111', fontWeight: 700, fontSize: '13px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)' }}
                        >
                          Submit Another Request
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={handleInquirySubmit}
                        className="bo-form"
                        noValidate
                      >
                        {/* Row 1: Full Name + Org Name */}
                        <div className="bo-field-row">
                          <div className="bo-field">
                            <label className="bo-label" htmlFor="bo-fullName">Full Name <span className="bo-required">*</span></label>
                            <input id="bo-fullName" name="fullName" className="bo-input" type="text" placeholder="Enter your name" value={inquiryForm.fullName} onChange={handleInquiryChange} required />
                          </div>
                          <div className="bo-field">
                            <label className="bo-label" htmlFor="bo-orgName">Organization Name <span className="bo-required">*</span></label>
                            <input id="bo-orgName" name="orgName" className="bo-input" type="text" placeholder="ABC Sports Club" value={inquiryForm.orgName} onChange={handleInquiryChange} required />
                          </div>
                        </div>

                        {/* Row 2: Phone + Email */}
                        <div className="bo-field-row">
                          <div className="bo-field">
                            <label className="bo-label" htmlFor="bo-phone">Phone Number <span className="bo-required">*</span></label>
                            <input id="bo-phone" name="phone" className="bo-input" type="tel" placeholder={PHONE_DISPLAY} value={inquiryForm.phone} onChange={handleInquiryChange} required />
                          </div>
                          <div className="bo-field">
                            <label className="bo-label" htmlFor="bo-email">Email Address <span className="bo-required">*</span></label>
                            <input id="bo-email" name="email" className="bo-input" type="email" placeholder="you@company.com" value={inquiryForm.email} onChange={handleInquiryChange} required />
                          </div>
                        </div>

                        {/* Row 3: Gender + Quantity */}
                        <div className="bo-field-row">
                          <div className="bo-field">
                            <label className="bo-label" htmlFor="bo-category">Gender <span className="bo-required">*</span></label>
                            <select id="bo-category" name="category" className="bo-select" value={inquiryForm.category} onChange={handleInquiryChange} required>
                              <option value="">Select gender...</option>
                              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="bo-field">
                            <label className="bo-label" htmlFor="bo-quantity">Quantity Required <span className="bo-required">*</span></label>
                            <select id="bo-quantity" name="quantity" className="bo-select" value={inquiryForm.quantity} onChange={handleInquiryChange} required>
                              <option value="">Select range...</option>
                              {QUANTITY_RANGES.map((q) => <option key={q.value} value={q.value}>{q.label}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Sizes Required */}
                        <div className="bo-field">
                          <label className="bo-label">Sizes Required</label>
                          <div className="bo-size-grid">
                            {SIZES.map((sz) => {
                              const active = inquiryForm.sizes.includes(sz);
                              return (
                                <div key={sz} className={`bo-size-chip${active ? " selected" : ""}`}>
                                  <label className="bo-size-chip-label">
                                    <input type="checkbox" checked={active} onChange={() => toggleInquirySize(sz)} />
                                    {sz}
                                  </label>
                                  {active && (
                                    <input
                                      type="number"
                                      min="0"
                                      className="bo-size-chip-qty"
                                      placeholder="Qty"
                                      value={sizeQuantities[sz] ?? ""}
                                      onChange={(e) => updateInquirySizeQty(sz, e.target.value)}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          {inquiryForm.sizes.length > 0 && (
                            <p className={`bo-size-status ${sizeQtyExceeded ? "bo-size-status-red" : "bo-size-status-green"}`}>
                              {!inquiryForm.quantity
                                ? "Select a quantity range above first."
                                : sizeQtyExceeded
                                ? `Total ${totalSizeQty} exceeds your quantity range — please increase your quantity.`
                                : Number.isFinite(sizeQtyRemaining)
                                ? `${sizeQtyRemaining} unit${sizeQtyRemaining === 1 ? "" : "s"} left to allocate.`
                                : `${totalSizeQty} units allocated so far.`}
                            </p>
                          )}
                        </div>

                        {/* Custom Printing */}
                        <div className="bo-field">
                          <label className="bo-label">Custom Printing Required <span className="bo-required">*</span></label>
                          <div className="bo-radio-group">
                            {["Yes – Logo / Text", "Yes – Full Sublimation", "Yes – Embroidery", "No Printing"].map((opt) => (
                              <label key={opt} className={`bo-radio-label${inquiryForm.customPrinting === opt ? " selected" : ""}`}>
                                <input type="radio" name="customPrinting" value={opt} checked={inquiryForm.customPrinting === opt} onChange={() => setInquiryPrinting(opt)} />
                                {opt}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Preferred Delivery Date */}
                        <div className="bo-field">
                          <label className="bo-label" htmlFor="bo-deliveryDate">Preferred Delivery Date</label>
                          <input
                            id="bo-deliveryDate"
                            name="deliveryDate"
                            className="bo-input"
                            type="date"
                            min={new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]}
                            value={inquiryForm.deliveryDate}
                            onChange={handleInquiryChange}
                          />
                        </div>

                        {/* Additional Requirements */}
                        <div className="bo-field">
                          <label className="bo-label" htmlFor="bo-requirements">Additional Requirements</label>
                          <textarea
                            id="bo-requirements"
                            name="requirements"
                            className="bo-textarea"
                            placeholder="Sizes breakdown, color preferences, reference designs, special instructions..."
                            value={inquiryForm.requirements}
                            onChange={handleInquiryChange}
                          />
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="bo-submit-btn" disabled={inquirySubmitting}>
                          {inquirySubmitting ? "Submitting…" : <><Send size={18} /> Submit B2B Enquiry</>}
                        </button>
                        <p className="bo-disclaimer">
                          By submitting, you agree our team will contact you within 24 hours.
                          Your data is safe and never shared with third parties.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>



              </div>

            </div>

            {/* Related Products Hook */}
            <div style={{ marginTop: '48px', paddingTop: '40px' }}>
              <RelatedProducts category={product.category} currentProductId={product._id} />
            </div>

          </div>
        </main>

        {/* Size Guide Modal Overlay */}
        <AnimatePresence>
          {isSizeGuideOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }}
                onClick={() => setIsSizeGuideOpen(false)}
                style={{ position: 'absolute', inset: 0, background: '#EAEBE3', cursor: 'pointer' }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{ position: 'relative', width: '100%', maxWidth: '600px', background: '#EAEBE3', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '24px', padding: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.8)', maxHeight: '85vh', overflowY: 'auto' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={24} color="#0A7F6E" />
                    <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#111111', fontFamily: 'Montserrat, sans-serif' }}>Athenura Size Chart</h3>
                  </div>
                  <button onClick={() => setIsSizeGuideOpen(false)} style={{ background: 'rgba(0,0,0,0.08)', border: 'none', color: 'rgba(0,0,0,0.6)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '13px', lineHeight: 1.6, fontWeight: 300 }}>
                    Our apparel sizes are athletic-fit. If you prefer a loose chest configuration or plan to wear base-layers beneath your jersey/tees, we suggest ordering one size up.
                  </p>
                  <div style={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                          <th style={{ padding: '16px', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>Size</th>
                          <th style={{ padding: '16px', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>Chest (in)</th>
                          <th style={{ padding: '16px', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>Waist (in)</th>
                          <th style={{ padding: '16px', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>Length (in)</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: 'rgba(0,0,0,0.5)' }}>
                        {[
                          { s: 'XS', c: '34 - 36', w: '28 - 30', l: '26.5' },
                          { s: 'S', c: '36 - 38', w: '30 - 32', l: '27.5' },
                          { s: 'M', c: '38 - 40', w: '32 - 34', l: '28.5' },
                          { s: 'L', c: '40 - 42', w: '34 - 36', l: '29.5' },
                          { s: 'XL', c: '42 - 44', w: '36 - 38', l: '30.5' },
                          { s: 'XXL', c: '44 - 46', w: '38 - 40', l: '31.5' },
                          { s: 'XXXL', c: '46 - 48', w: '40 - 42', l: '32.5' }
                        ].map((r, i) => (
                          <tr key={r.s} style={{ borderTop: i > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                            <td style={{ padding: '16px', fontWeight: 700, color: '#111111' }}>{r.s}</td>
                            <td style={{ padding: '16px' }}>{r.c}</td>
                            <td style={{ padding: '16px' }}>{r.w}</td>
                            <td style={{ padding: '16px' }}>{r.l}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button onClick={() => setIsSizeGuideOpen(false)} style={{ padding: '12px 24px', background: '#1a1a1a', color: '#111111', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                      Got It
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default ProductDetail;
