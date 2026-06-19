import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Truck, Info, Check, 
  MessageSquare, Users, ChevronRight, FileText, Send, X 
} from 'lucide-react';
import RelatedProducts from '../components/products/RelatedProducts';
import { mockProducts } from '../services/mockProducts';
import API from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();

  // Page States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery States
  const [activeImage, setActiveImage] = useState('');
  
  // Customization selection states
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(15);

  // Size guide modal state
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryOrg, setInquiryOrg] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Fetch product detail
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(`/products/${id}`);
        if (response.data) {
          setProduct(response.data);
          if (response.data.images && response.data.images.length > 0) {
            setActiveImage(response.data.images[0]);
          }
          if (response.data.sizes && response.data.sizes.length > 0) {
            setSelectedSize(response.data.sizes[0]);
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

  // Handle Inquiry Form Submission
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setInquirySubmitting(true);
      const inquiryPayload = {
        product: product._id,
        productName: product.name,
        productCode: product.code,
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        organization: inquiryOrg,
        quantity: quantity,
        size: selectedSize,
        color: product.colorNames ? product.colorNames[selectedColorIndex] : 'Default',
        message: inquiryMsg
      };

      try {
        await API.post('/leads', inquiryPayload);
      } catch (apiErr) {
        console.log('Sending inquiry through mock response flow.', apiErr);
      }

      setTimeout(() => {
        setInquirySubmitting(false);
        setInquirySuccess(true);
        setInquiryMsg('');
      }, 1000);

    } catch (err) {
      setInquirySubmitting(false);
      alert('There was a problem submitting your inquiry. Please try again.');
    }
  };

  const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '48px', height: '48px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(255,255,255,0.06)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderTopColor: '#FF3B30', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontFamily: 'Poppins, sans-serif' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: '#000000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(255,59,48,0.1)', color: '#FF3B30', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '1px solid rgba(255,59,48,0.25)' }}>
          <Info size={32} />
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>Product Not Found</h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', maxWidth: '400px', marginBottom: '24px' }}>{error || 'Unable to locate details.'}</p>
        <Link to="/products" style={{ padding: '12px 24px', background: '#FF3B30', color: '#fff', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const stockConf = {
    'In Stock':      { dot: '#4ade80', color: '#4ade80', label: 'In Stock' },
    'Limited Stock': { dot: '#fbbf24', color: '#fbbf24', label: 'Limited' },
    'Out of Stock':  { dot: '#f87171', color: '#f87171', label: 'Sold Out' },
  };
  const stock = stockConf[product.stockStatus] || { dot: '#888', color: '#888', label: product.stockStatus };
  const cleanDescription = stripHtml(product.description);

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#FFFFFF', paddingBottom: '80px', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Navigation Breadcrumbs / Back button */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FF3B30'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            <ArrowLeft size={16} />
            <span>Back to Catalog</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 500, fontFamily: 'monospace' }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>HOME</Link>
            <ChevronRight size={14} />
            <Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>PRODUCTS</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#fff', fontWeight: 700 }}>{product.code}</span>
          </div>
        </div>
      </div>

      {/* Main product card details */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ background: '#0a0a0a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.07)', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '48px' }}>
            
            {/* Column 1: Image Gallery (Span 5) */}
            <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={activeImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '10px', fontFamily: 'monospace', fontWeight: 800, padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {product.code}
                </span>
              </div>

              {/* Gallery Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      style={{
                        width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#111', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s', padding: 0,
                        border: activeImage === img ? '2px solid #FF3B30' : '1px solid rgba(255,255,255,0.1)',
                        opacity: activeImage === img ? 1 : 0.6,
                      }}
                    >
                      <img src={img} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Highlighting Activewear Features */}
              <div style={{ marginTop: '16px', padding: '20px', background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Truck size={16} color="#FF3B30" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff', display: 'block', marginBottom: '4px', fontFamily: 'Montserrat, sans-serif' }}>Custom & Bulk Shipping</span>
                    <span style={{ fontWeight: 300, lineHeight: 1.5 }}>Direct shipping across India. Custom printing adds 4-7 business days processing.</span>
                  </div>
                </div>
                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Info size={16} color="#FF3B30" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff', display: 'block', marginBottom: '4px', fontFamily: 'Montserrat, sans-serif' }}>Team Customizations Available</span>
                    <span style={{ fontWeight: 300, lineHeight: 1.5 }}>Get sublimation numbers, logo embroidery, and player name prints custom configured.</span>
                  </div>
                </div>
              </div>

              {/* Product Specifications */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#111', border: '1px solid rgba(255,59,48,0.2)', borderRadius: '16px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#FF3B30' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif' }}>Product Details</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {product.fabric && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={20} color="#FF3B30" />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Fabric</div>
                          <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{product.fabric}</div>
                        </div>
                      </div>
                    )}
                    {product.sizes && product.sizes.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Users size={20} color="#FF3B30" />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Available Sizes</div>
                          <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{product.sizes.join(', ')}</div>
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Info size={20} color="#FF3B30" />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Category</div>
                        <div style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{product.category}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Specs & Inquiry Details (Span 7) */}
            <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontSize: '10px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>
                    {product.category}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: stock.color, background: 'rgba(255,255,255,0.03)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stock.dot, display: 'inline-block' }} />
                    {stock.label}
                  </span>
                </div>

                <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#fff', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  {product.name}
                </h1>

                {/* Rating & Code */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} style={{ fill: i < 4 ? '#fbbf24' : '#2a2a2a', color: i < 4 ? '#fbbf24' : '#2a2a2a' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>4.2</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>(28 inquiries)</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>Product ID: {product.code}</span>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '24px', padding: '20px 24px', background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', fontWeight: 700, marginBottom: '4px' }}>Standard Unit Price</span>
                    <span style={{ fontSize: '32px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>₹{product.price}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', background: 'rgba(255,59,48,0.1)', color: '#FF3B30', border: '1px solid rgba(255,59,48,0.2)', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', display: 'inline-block', marginBottom: '4px' }}>
                      Bulk Discount Available
                    </span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', display: 'block' }}>Minimum order quantity: 10 units</span>
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>
                    Product Description
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.8, fontWeight: 300 }}>
                    {cleanDescription}
                  </p>
                </div>

                {/* Fabric Specifications */}
                {product.fabric && (
                  <div style={{ marginBottom: '24px', background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '16px' }}>
                    <FileText size={20} color="#FF3B30" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Fabric Composition</h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 300 }}>{product.fabric}</p>
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>
                      Available Colors: <span style={{ color: '#FF3B30', fontWeight: 400 }}>{product.colorNames && product.colorNames[selectedColorIndex]}</span>
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {product.colors.map((colorHex, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColorIndex(idx)}
                          style={{
                            width: '36px', height: '36px', borderRadius: '50%', border: selectedColorIndex === idx ? '2px solid #FF3B30' : '2px solid rgba(255,255,255,0.1)',
                            backgroundColor: colorHex, cursor: 'pointer', transition: 'all 0.2s', padding: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: selectedColorIndex === idx ? '0 0 0 4px rgba(255,59,48,0.15)' : 'none'
                          }}
                          title={product.colorNames ? product.colorNames[idx] : `Color ${idx + 1}`}
                        >
                          {selectedColorIndex === idx && (
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: colorHex.toLowerCase() === '#ffffff' ? '#111' : '#fff' }} />
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
                      <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>
                        Select Size
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        style={{ fontSize: '11px', fontWeight: 700, color: '#FF3B30', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Poppins, sans-serif' }}
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
                              background: isActive ? '#FF3B30' : 'transparent',
                              border: isActive ? '1px solid #FF3B30' : '1px solid rgba(255,255,255,0.1)',
                              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)'
                            }}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Direct Purchase Actions */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                  <button 
                    type="button" 
                    onClick={() => alert("Added to cart")}
                    style={{ flex: 1, padding: '16px', background: '#111', color: '#fff', border: '1px solid #FF3B30', borderRadius: '16px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,59,48,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
                  >
                    Add to Cart
                  </button>
                  <button 
                    type="button" 
                    onClick={() => alert("Proceeding to checkout")}
                    style={{ flex: 1, padding: '16px', background: '#FF3B30', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#cc2e25'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#FF3B30'}
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Inquiry Form */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <MessageSquare size={20} color="#FF3B30" />
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
                    Request a Custom Quote
                  </h3>
                </div>

                <AnimatePresence mode="wait">
                  {inquirySuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center', color: '#4ade80' }}
                    >
                      <div style={{ width: '48px', height: '48px', background: '#4ade80', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Check size={24} strokeWidth={3} />
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>Inquiry Submitted Successfully!</h4>
                      <p style={{ fontSize: '12px', color: 'rgba(74,222,128,0.8)', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                        Thank you, {inquiryName}! We received your request for <strong style={{ color: '#fff' }}>{quantity}x</strong> {product.name} ({selectedSize}, {product.colorNames ? product.colorNames[selectedColorIndex] : 'Default'}). Our team will get back to you within 24 hours.
                      </p>
                      <button
                        type="button"
                        onClick={() => setInquirySuccess(false)}
                        style={{ padding: '10px 20px', background: '#4ade80', color: '#000', fontWeight: 700, fontSize: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
                      >
                        Submit Another Request
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleInquirySubmit}
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}
                    >
                      {/* Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Full Name <span style={{ color: '#FF3B30' }}>*</span>
                        </label>
                        <input type="text" required value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} placeholder="Your Name"
                          style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Email Address <span style={{ color: '#FF3B30' }}>*</span>
                        </label>
                        <input type="email" required value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} placeholder="you@example.com"
                          style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Phone Number <span style={{ color: '#FF3B30' }}>*</span>
                        </label>
                        <input type="tel" required value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)} placeholder="Mobile / Office number"
                          style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }}
                        />
                      </div>

                      {/* Organization */}
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Team / Organization
                        </label>
                        <input type="text" value={inquiryOrg} onChange={(e) => setInquiryOrg(e.target.value)} placeholder="Club, school or company"
                          style={{ width: '100%', padding: '12px 16px', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif' }}
                        />
                      </div>

                      {/* Quantity Selector */}
                      <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', marginTop: '4px', marginBottom: '4px' }}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '2px' }}>Required Quantity</span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Order at least 10 units for customization</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 5))} style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 700 }}>-</button>
                          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} style={{ width: '50px', textAlign: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Poppins, sans-serif' }} />
                          <button type="button" onClick={() => setQuantity(quantity + 5)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 700 }}>+</button>
                        </div>
                      </div>

                      {/* Message */}
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                          Custom Message & Printing Requirements
                        </label>
                        <textarea rows="3" value={inquiryMsg} onChange={(e) => setInquiryMsg(e.target.value)} placeholder="Include custom logo detail requests, names, specific sizing configurations, colors, or deadlines..."
                          style={{ width: '100%', padding: '16px', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif', resize: 'vertical' }}
                        />
                      </div>

                      {/* Submit */}
                      <div style={{ gridColumn: 'span 2', marginTop: '8px' }}>
                        <button type="submit" disabled={inquirySubmitting}
                          style={{ width: '100%', padding: '16px', background: '#FF3B30', color: '#fff', borderRadius: '16px', fontSize: '14px', fontWeight: 800, border: 'none', cursor: inquirySubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'background 0.2s', opacity: inquirySubmitting ? 0.7 : 1 }}
                        >
                          {inquirySubmitting ? (
                            <span>Submitting Lead...</span>
                          ) : (
                            <>
                              <Send size={16} /> Submit Bulk Inquiry
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

          {/* Related Products Hook */}
          <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
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
              style={{ position: 'absolute', inset: 0, background: '#000', cursor: 'pointer' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: '600px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.8)', maxHeight: '85vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={24} color="#FF3B30" />
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>Athenura Size Chart</h3>
                </div>
                <button onClick={() => setIsSizeGuideOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.5)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, fontWeight: 300 }}>
                  Our apparel sizes are athletic-fit. If you prefer a loose chest configuration or plan to wear base-layers beneath your jersey/tees, we suggest ordering one size up.
                </p>
                <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '16px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Size</th>
                        <th style={{ padding: '16px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Chest (in)</th>
                        <th style={{ padding: '16px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Waist (in)</th>
                        <th style={{ padding: '16px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Length (in)</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {[
                        { s: 'XS', c: '34 - 36', w: '28 - 30', l: '26.5' },
                        { s: 'S', c: '36 - 38', w: '30 - 32', l: '27.5' },
                        { s: 'M', c: '38 - 40', w: '32 - 34', l: '28.5' },
                        { s: 'L', c: '40 - 42', w: '34 - 36', l: '29.5' },
                        { s: 'XL', c: '42 - 44', w: '36 - 38', l: '30.5' },
                        { s: 'XXL', c: '44 - 46', w: '38 - 40', l: '31.5' },
                        { s: 'XXXL', c: '46 - 48', w: '40 - 42', l: '32.5' }
                      ].map((r, i) => (
                        <tr key={r.s} style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                          <td style={{ padding: '16px', fontWeight: 700, color: '#fff' }}>{r.s}</td>
                          <td style={{ padding: '16px' }}>{r.c}</td>
                          <td style={{ padding: '16px' }}>{r.w}</td>
                          <td style={{ padding: '16px' }}>{r.l}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button onClick={() => setIsSizeGuideOpen(false)} style={{ padding: '12px 24px', background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                    Got It
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductDetail;
