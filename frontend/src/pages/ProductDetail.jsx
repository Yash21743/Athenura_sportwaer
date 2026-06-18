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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#FF3B30]/30 border-t-[#FF3B30] rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-sm font-semibold">Loading product specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#070707] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mb-4 border border-rose-500/25">
          <Info className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 font-['Montserrat']">Product Not Found</h3>
        <p className="text-zinc-500 text-sm max-w-sm mb-6 font-['Poppins'] font-light">{error || 'Unable to locate details.'}</p>
        <Link
          to="/products"
          className="px-6 py-3 bg-[#FF3B30] hover:bg-[#cc2e25] text-white rounded-xl font-bold transition-all shadow-md font-['Poppins']"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Stock Badge Class helper
  const getStockBadgeClass = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'Limited Stock':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      case 'Out of Stock':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white pb-20 font-['Poppins']">
      
      {/* Navigation Breadcrumbs / Back button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#FF3B30] font-semibold text-sm transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Catalog</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-medium font-mono">
            <Link to="/" className="hover:text-zinc-300">HOME</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-750" />
            <Link to="/products" className="hover:text-zinc-300">PRODUCTS</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-750" />
            <span className="text-zinc-300 font-bold truncate max-w-[120px]">{product.code}</span>
          </div>
        </div>
      </div>

      {/* Main product card details */}
      <main className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-[#111] rounded-3xl border border-zinc-800/80 p-6 md:p-10 shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Column 1: Image Gallery (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-zinc-950/80 text-white text-[10px] font-mono tracking-wider font-extrabold px-3 py-1 rounded-md backdrop-blur-xs border border-zinc-800/40">
                  {product.code}
                </span>
              </div>

              {/* Gallery Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto py-1">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 rounded-xl overflow-hidden bg-zinc-900 border shrink-0 transition-all ${
                        activeImage === img
                          ? 'border-[#FF3B30] ring-2 ring-[#FF3B30]/20 scale-95'
                          : 'border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Highlighting Activewear Features */}
              <div className="mt-4 p-4.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-400 space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5 font-['Montserrat']">Custom & Bulk Shipping</span>
                    <span className="font-light">Direct shipping across India. Custom printing adds 4-7 business days processing.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-3 border-t border-zinc-800">
                  <Info className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5 font-['Montserrat']">Team Customizations Available</span>
                    <span className="font-light">Get sublimation numbers, logo embroidery, and player name prints custom configured.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Specs & Inquiry Details (Span 7) */}
            <div className="lg:col-span-7 lg:pl-8 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-500/10 text-[#FF3B30] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-['Montserrat']">
                    {product.category}
                  </span>
                  <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-md uppercase tracking-wider ${getStockBadgeClass(product.stockStatus)}`}>
                    {product.stockStatus}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3.5xl font-black text-white mb-2 font-['Montserrat'] tracking-tight leading-none uppercase">
                  {product.name}
                </h1>

                {/* Rating & Code */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-amber-400' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-white font-bold">4.2</span>
                    <span className="text-xs text-zinc-500 font-medium">(28 inquiries)</span>
                  </div>
                  <span className="text-zinc-800">|</span>
                  <span className="text-xs text-zinc-500 font-mono">Product ID: {product.code}</span>
                </div>

                {/* Price */}
                <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest block font-semibold">Standard Unit Price</span>
                    <span className="text-3xl font-black text-white">₹{product.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-red-500/10 text-[#FF3B30] border border-red-500/20 font-bold px-2.5 py-1 rounded-lg">
                      Bulk Discount Available
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-1">Minimum order quantity: 10 units</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-zinc-300 mb-2 uppercase tracking-wider font-['Montserrat']">
                    Product Description
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>

                {/* Fabric Specifications */}
                {product.fabric && (
                  <div className="mb-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3.5">
                    <FileText className="w-5 h-5 text-[#FF3B30] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Fabric Composition</h4>
                      <p className="text-zinc-400 text-sm font-light">{product.fabric}</p>
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-zinc-300 mb-2.5 uppercase tracking-wider font-['Montserrat']">
                      Available Colors: <span className="text-[#FF3B30] font-normal">{product.colorNames && product.colorNames[selectedColorIndex]}</span>
                    </h3>
                    <div className="flex items-center gap-3">
                      {product.colors.map((colorHex, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColorIndex(idx)}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedColorIndex === idx
                              ? 'border-[#FF3B30] ring-4 ring-[#FF3B30]/20'
                              : 'border-zinc-800 hover:scale-105'
                          }`}
                          style={{ backgroundColor: colorHex }}
                          title={product.colorNames ? product.colorNames[idx] : `Color ${idx + 1}`}
                        >
                          {selectedColorIndex === idx && (
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              colorHex.toLowerCase() === '#ffffff' ? 'bg-zinc-850' : 'bg-white'
                            }`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-['Montserrat']">
                        Select Size
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-xs font-bold text-[#FF3B30] hover:text-red-400 underline flex items-center gap-1 font-['Poppins']"
                      >
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {product.sizes.map((size) => {
                        const isActive = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 flex items-center justify-center font-bold text-sm rounded-xl border transition-all ${
                              isActive
                                ? 'bg-[#FF3B30] border-[#FF3B30] text-white shadow-md'
                                : 'bg-transparent border-zinc-800 text-zinc-300 hover:border-zinc-650'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Inquiry & Lead Submission Form */}
              <div className="border-t border-zinc-800 pt-8 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-[#FF3B30]" />
                  <h3 className="text-lg font-bold text-white font-['Montserrat']">
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
                      className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 text-center text-emerald-300"
                    >
                      <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/10">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <h4 className="text-base font-bold mb-1">Inquiry Submitted Successfully!</h4>
                      <p className="text-xs text-emerald-400 max-w-md mx-auto mb-4 font-light">
                        Thank you, {inquiryName}! We received your request for <span className="font-bold text-white">{quantity}x</span> {product.name} ({selectedSize}, {product.colorNames ? product.colorNames[selectedColorIndex] : 'Default'}). Our team will get back to you with custom pricing within 24 hours.
                      </p>
                      <button
                        type="button"
                        onClick={() => setInquirySuccess(false)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Submit Another Request
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleInquirySubmit}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-hidden focus:border-[#FF3B30] focus:bg-zinc-900/60 transition-all text-white font-medium"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-hidden focus:border-[#FF3B30] focus:bg-zinc-900/60 transition-all text-white font-medium"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="Mobile / Office number"
                          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-hidden focus:border-[#FF3B30] focus:bg-zinc-900/60 transition-all text-white font-medium"
                        />
                      </div>

                      {/* Organization / Team Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Team / Organization Name
                        </label>
                        <input
                          type="text"
                          value={inquiryOrg}
                          onChange={(e) => setInquiryOrg(e.target.value)}
                          placeholder="Club, school or company"
                          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-hidden focus:border-[#FF3B30] focus:bg-zinc-900/60 transition-all text-white font-medium"
                        />
                      </div>

                      {/* Quantity Selector */}
                      <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-4 border border-zinc-800 rounded-2xl my-1.5">
                        <div>
                          <span className="text-xs font-bold text-white block">Required Quantity</span>
                          <span className="text-[10px] text-zinc-500">Order at least 10 units for customization</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 5))}
                            className="w-8 h-8 rounded-lg bg-zinc-850 border border-zinc-800 flex items-center justify-center font-bold text-zinc-400 hover:border-zinc-600"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                            className="w-14 text-center font-bold text-white bg-transparent border-none focus:outline-hidden font-['Poppins']"
                          />
                          <button
                            type="button"
                            onClick={() => setQuantity(quantity + 5)}
                            className="w-8 h-8 rounded-lg bg-zinc-850 border border-zinc-800 flex items-center justify-center font-bold text-zinc-400 hover:border-zinc-600"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Message / Sublimation requirements */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Custom Message & Printing Requirements
                        </label>
                        <textarea
                          rows="3"
                          value={inquiryMsg}
                          onChange={(e) => setInquiryMsg(e.target.value)}
                          placeholder="Include custom logo detail requests, names, specific sizing configurations, colors, or deadlines..."
                          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-hidden focus:border-[#FF3B30] focus:bg-zinc-900/60 transition-all text-white font-light"
                        />
                      </div>

                      {/* Submit */}
                      <div className="sm:col-span-2 mt-2">
                        <button
                          type="submit"
                          disabled={inquirySubmitting}
                          className="w-full py-3 bg-[#FF3B30] hover:bg-[#cc2e25] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 group font-['Montserrat'] cursor-pointer"
                        >
                          {inquirySubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Submitting Lead...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              <span>Submit Bulk Inquiry</span>
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
          <RelatedProducts category={product.category} currentProductId={product._id} />

        </div>
      </main>

      {/* Size Guide Modal Overlay */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-10 md:top-24 max-w-xl mx-auto bg-[#111] border border-zinc-800 rounded-3xl p-6 shadow-2xl z-50 overflow-y-auto max-h-[85vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FF3B30]" />
                  <h3 className="text-lg font-black text-white font-['Montserrat']">Athenura Size Chart</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-400 text-xs leading-relaxed font-light">
                  Our apparel sizes are athletic-fit. If you prefer a loose chest configuration or plan to wear base-layers beneath your jersey/tees, we suggest ordering one size up.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-zinc-800 shadow-3xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-900 text-zinc-300 font-bold border-b border-zinc-800">
                        <th className="p-3">Size</th>
                        <th className="p-3">Chest (in)</th>
                        <th className="p-3">Waist (in)</th>
                        <th className="p-3">Length (in)</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-400 divide-y divide-zinc-800/60">
                      <tr>
                        <td className="p-3 font-bold text-white">XS</td>
                        <td className="p-3">34 - 36</td>
                        <td className="p-3">28 - 30</td>
                        <td className="p-3">26.5</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">S</td>
                        <td className="p-3">36 - 38</td>
                        <td className="p-3">30 - 32</td>
                        <td className="p-3">27.5</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">M</td>
                        <td className="p-3">38 - 40</td>
                        <td className="p-3">32 - 34</td>
                        <td className="p-3">28.5</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">L</td>
                        <td className="p-3">40 - 42</td>
                        <td className="p-3">34 - 36</td>
                        <td className="p-3">29.5</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">XL</td>
                        <td className="p-3">42 - 44</td>
                        <td className="p-3">36 - 38</td>
                        <td className="p-3">30.5</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">XXL</td>
                        <td className="p-3">44 - 46</td>
                        <td className="p-3">38 - 40</td>
                        <td className="p-3">31.5</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-white">XXXL</td>
                        <td className="p-3">46 - 48</td>
                        <td className="p-3">40 - 42</td>
                        <td className="p-3">32.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(false)}
                    className="px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold rounded-xl border border-zinc-800 cursor-pointer"
                  >
                    Got It
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductDetail;
