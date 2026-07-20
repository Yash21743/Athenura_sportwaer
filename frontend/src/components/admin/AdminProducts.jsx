import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../common/adminlayout/AdminSidebar";
import API from "../../services/api";

// ─── Constants ────────────────────────────────────────────────────────────────
const FALLBACK_CATEGORIES = [
  "Sports T-Shirts",
  "Performance Jerseys",
  "Team Uniforms",
  "Sports Shorts",
  "Track Pants",
  "Hoodies",
  "Tracksuits",
  "Custom Team Kits",
  "Accessories",
];

const GENDERS = ["Men", "Women", "Unisex"];

const DEFAULT_FORM = {
  name: "",
  code: "",
  category: "",
  gender: "Unisex",
  price: "",
  stock: "",
  sizes: [],
  colors: [],
  fabric: "",
  description: "",
};

// ─── Component ────────────────────────────────────────────────────────────────
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortBy, setSortBy] = useState("none");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageIn, setPageIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const activeSession = sessionStorage.getItem("csw_admin_session");
    if (activeSession !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Category options: prefer real categories from backend, fallback to static list
  const categoryOptions = apiCategories.length > 0
    ? apiCategories.map((c) => c.name)
    : FALLBACK_CATEGORIES;

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories/admin/all');
      if (res.data?.data) {
        setApiCategories(res.data.data);
      }
    } catch (err) {
      console.warn("Failed to fetch categories list.", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products/admin/all');
      const list = response.data?.data;
      if (list && Array.isArray(list)) {
        const normalized = list.map(p => ({
          ...p,
          id: p._id,
          code: p.productCode || p.code || '',
          category: typeof p.category === 'object' && p.category ? p.category.name : p.category,
          gender: p.gender || 'Unisex',
          stock: p.stock || 0,
          stockStatus: p.stockStatus || (p.inStock ? "In Stock" : "Out of Stock"),
          sizes: p.availableSizes || p.sizes || [],
          colors: p.availableColors || p.colors || [],
          fabric: p.fabricDetails || p.fabric || '',
          description: p.description || '',
          image: p.images && p.images.length > 0 ? (typeof p.images[0] === 'object' ? p.images[0].url : p.images[0]) : null
        }));
        setProducts(normalized);
      }
    } catch (err) {
      console.warn("Failed to fetch products from API.", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.openAddModal) {
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Detail View Modal State
  const [viewingProduct, setViewingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("desc"); // desc, chart, specs, shipping

  useEffect(() => {
    const t = setTimeout(() => setPageIn(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Filter & Sort Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesGender = genderFilter === "All" || p.gender === genderFilter;
    const matchesStock = stockFilter === "All" || p.stockStatus === stockFilter;
    return matchesSearch && matchesCategory && matchesGender && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "stock-asc") return a.stock - b.stock;
    if (sortBy === "stock-desc") return b.stock - a.stock;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  // Modal Handlers
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ ...DEFAULT_FORM, category: categoryOptions[0] || "" });
    setImagePreview(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product, e) => {
    e.stopPropagation(); 
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      category: product.category,
      gender: product.gender || "Unisex",
      price: product.price,
      stock: product.stock,
      sizes: product.sizes || [],
      colors: product.colors || [],
      fabric: product.fabric || "",
      description: product.description || "",
    });
    setImagePreview(product.image);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(DEFAULT_FORM);
    setImagePreview(null);
    setImageFile(null);
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, val) => {
    setFormData((prev) => {
      const current = prev[name];
      const updated = current.includes(val)
        ? current.filter((x) => x !== val)
        : [...current, val];
      return { ...prev, [name]: updated };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        toast.success("Product deleted successfully!");
        fetchProducts();
        if (viewingProduct?.id === id) setViewingProduct(null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete product.");
      }
    }
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price) || 0;
    const stockNum = parseInt(formData.stock, 10) || 0;

    if (!categoryId) {
      toast.error("Please select a valid category (categories are loaded from the backend).");
      return;
    }
    if (!formData.gender) {
      toast.error("Please select a gender (Men / Women / Unisex).");
      return;
    }

    let stockStatus = "In Stock";
    if (stockNum === 0) stockStatus = "Out of Stock";
    else if (stockNum <= 10) stockStatus = "Low Stock";

    const fields = {
      name: formData.name,
      productCode: formData.code,
      category: categoryId,
      gender: formData.gender,
      price: priceNum,
      stock: stockNum,
      stockStatus,
      availableSizes: formData.sizes.join(','),
      availableColors: formData.colors.join(','),
      fabricDetails: formData.fabric,
      description: formData.description,
      isFeatured: false,
      status: "active",
    };

    setSubmitting(true);
    try {
      let payload;
      let config = {};

      if (imageFile) {
        // New image selected -> send as multipart/form-data so backend (multer) receives the file
        const fd = new FormData();
        Object.entries(fields).forEach(([key, value]) => fd.append(key, value));
        fd.append('images', imageFile);
        payload = fd;
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
      } else {
        // No new image -> plain JSON is enough
        payload = fields;
      }

      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, payload, config);
        toast.success("Product updated successfully!");
      } else {
        await API.post('/products', payload, config);
        toast.success("Product created successfully!");
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070C0B; color: #DDDFD2; font-family: 'Poppins', sans-serif; }
        
        .csw-topbar {
          position: fixed; top: 0; left: ${sidebarCollapsed ? 72 : 260}px; right: 0; height: 64px;
          background: rgba(7, 12, 11, 0.92); backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; gap: 12px; z-index: 30;
          transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .csw-main {
          margin-left: ${sidebarCollapsed ? 72 : 260}px; padding: 80px 24px 40px; min-height: 100vh;
          transition: margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px; margin-top: 20px;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px; overflow: hidden;
          transition: all 0.3s ease; display: flex; flex-direction: column;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-4px);
          border-color: rgba(10, 127, 110, 0.3);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .product-card-image {
          width: 100%; height: 180px; background: rgba(255, 255, 255, 0.02);
          display: flex; align-items: center; justify-content: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06); position: relative;
        }

        .status-badge {
          position: absolute; top: 12px; right: 12px;
          padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 700;
        }

        .csw-input, .csw-select, .csw-textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff; border-radius: 10px; padding: 10px 14px;
          outline: none; transition: border-color 0.2s; font-family: 'Poppins', sans-serif;
          width: 100%;
        }
        .csw-input:focus, .csw-select:focus, .csw-textarea:focus {
          border-color: #0A7F6E;
        }

        .csw-select option {
          background-color: #0d1f35 !important;
          color: #ffffff !important;
          padding: 8px;
        }

        @media(max-width:768px){
          .csw-topbar { left: 0 !important; padding: 0 14px; }
          .csw-main { margin-left: 0 !important; padding: 76px 14px 32px; }
          .csw-hamburger { display: flex !important; }
        }

        .table-view { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table-view th {
          text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600;
          color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 0.8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }
        .table-view td {
          padding: 14px 16px; font-size: 13.5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .table-row { cursor: pointer; }
        .table-row:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .modal-body::-webkit-scrollbar { width: 4px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: rgba(10, 127, 110, 0.3); border-radius: 2px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#070C0B" }}>
        {/* ── Sidebar ── */}
        <AdminSidebar
          activeKey="products"
          isMobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onCollapsedChange={setSidebarCollapsed}
        />

        <header className="csw-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              className="csw-hamburger"
              onClick={() => setMobileOpen(true)}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "9px",
                width: "36px",
                height: "36px",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "16px", color: "#fff" }}>
                Comfy Sport Wear
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.4)" }}>Admin Panel</span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: "linear-gradient(135deg,#0A7F6E,#08695C)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: "14px",
                color: "#fff",
                boxShadow: "0 0 10px rgba(10,127,110,0.3)",
              }}
            >
              A
            </div>
          </div>
        </header>

        <main className="csw-main">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "24px",
              opacity: pageIn ? 1 : 0,
              transform: pageIn ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3px" }}>
                <div
                  style={{
                    width: "4px",
                    height: "22px",
                    background: "#0A7F6E",
                    borderRadius: "2px",
                    boxShadow: "0 0 10px rgba(10,127,110,0.5)",
                  }}
                />
                <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "20px", color: "#fff" }}>
                  Product Management
                </h2>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", paddingLeft: "14px" }}>
                Manage the corporate catalog, pricing, and stock levels.
              </p>
            </div>
            <button
              onClick={openAddModal}
              style={{
                background: "linear-gradient(135deg,#0A7F6E 0%,#08695C 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 16px rgba(10,127,110,0.3)",
                fontFamily: "'Poppins',sans-serif",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Product
            </button>
          </div>

          {/* Filters Bar - Removed Category Filter */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "16px",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: "1 1 240px",
                maxWidth: "360px",
              }}
            >
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", display: "flex" }}>
                <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                className="csw-input"
                style={{ paddingLeft: "38px", fontSize: "13px" }}
                placeholder="Search products by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flex: "1 1 auto", justifyContent: "flex-end" }}>
              {/* Gender Filter */}
              <div style={{ minWidth: "120px", flex: "1 1 120px", maxWidth: "150px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12px" }}
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="All">All Genders</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter Commented Out */}
              {/* <div style={{ minWidth: "150px", flex: "1 1 150px", maxWidth: "200px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12px" }}
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div> */}

              <div style={{ minWidth: "130px", flex: "1 1 130px", maxWidth: "160px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12px" }}
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option value="All">All Stock Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div style={{ minWidth: "150px", flex: "1 1 150px", maxWidth: "200px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12px" }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="none">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="stock-asc">Stock: Low to High</option>
                  <option value="stock-desc">Stock: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Desktop Table View (Removed Category Column) ── */}
          <div
            className="desktop-only"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              overflowX: "auto",
              display: window.innerWidth <= 768 ? "none" : "block",
            }}
          >
            {sortedProducts.length > 0 ? (
              <table className="table-view">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Code</th>
                    <th>Gender</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map((p) => {
                    const isLow = p.stockStatus === "Low Stock";
                    const isOut = p.stockStatus === "Out of Stock";
                    const statusColor = isOut ? "#FF3B30" : isLow ? "#F59E0B" : "#10B981";

                    return (
                      <tr key={p.id} className="table-row" onClick={() => setViewingProduct(p)}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "8px",
                                background: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                flexShrink: 0,
                              }}
                            >
                              {p.image ? (
                                <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, color: "#fff", margin: 0 }}>{p.name}</p>
                              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                                {p.fabric || "No fabric specified"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: "rgba(255,255,255,0.6)", fontFamily: "monospace", fontSize: "12px" }}>{p.code}</td>
                        <td>
                          <span style={{
                            fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px",
                            background: p.gender === "Men" ? "rgba(59,130,246,0.15)" : p.gender === "Women" ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.08)",
                            color: p.gender === "Men" ? "#3b82f6" : p.gender === "Women" ? "#ec4899" : "rgba(255,255,255,0.6)",
                          }}>
                            {p.gender || "Unisex"}
                          </span>
                        </td>
                        <td style={{ color: "rgba(255,255,255,0.55)" }}>{p.category}</td>
                        <td style={{ fontWeight: 700, fontFamily: "'Montserrat',sans-serif" }}>₹{p.price}</td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ fontWeight: 600 }}>{p.stock} units</span>
                            <span style={{ fontSize: "10px", fontWeight: 700, color: statusColor }}>
                              ● {p.stockStatus}
                            </span>
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                              onClick={(e) => openEditModal(p, e)}
                              style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "rgba(255,255,255,0.6)",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#0A7F6E")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => handleDelete(p.id, e)}
                              style={{
                                background: "rgba(10,127,110,0.06)",
                                border: "1px solid rgba(10,127,110,0.15)",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#0A7F6E",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(10,127,110,0.15)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(10,127,110,0.06)")}
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                No products found matching your filters.
              </div>
            )}
          </div>

          {/* ── Mobile/Tablet Grid View ── */}
          <div
            className="mobile-only"
            style={{
              display: window.innerWidth > 768 ? "none" : "block",
            }}
          >
            {sortedProducts.length > 0 ? (
              <div className="product-grid">
                {sortedProducts.map((p) => {
                  const isLow = p.stockStatus === "Low Stock";
                  const isOut = p.stockStatus === "Out of Stock";
                  const statusBg = isOut ? "rgba(255,59,48,0.15)" : isLow ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)";
                  const statusColor = isOut ? "#FF3B30" : isLow ? "#F59E0B" : "#10B981";

                  return (
                    <div key={p.id} className="product-card" onClick={() => setViewingProduct(p)}>
                      <div className="product-card-image">
                        <span className="status-badge" style={{ background: statusBg, color: statusColor }}>
                          {p.stockStatus}
                        </span>
                        {p.image ? (
                          <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <svg width="32" height="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        )}
                      </div>
                      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <div>
                            <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>{p.name}</h4>
                            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                              {p.code} · {p.gender || "Unisex"}
                            </span>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "#0A7F6E", fontFamily: "'Montserrat',sans-serif" }}>
                            ₹{p.price}
                          </span>
                        </div>

                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "0 0 12px", flex: 1 }}>
                          {p.description ? p.description.slice(0, 75) + "..." : "No description provided."}
                        </p>

                        <div
                          style={{
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                            paddingTop: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                            Stock: <strong style={{ color: "#fff" }}>{p.stock}</strong>
                          </span>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={(e) => openEditModal(p, e)}
                              style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "8px",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "rgba(255,255,255,0.6)",
                              }}
                            >
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => handleDelete(p.id, e)}
                              style={{
                                background: "rgba(10,127,110,0.06)",
                                border: "1px solid rgba(10,127,110,0.15)",
                                borderRadius: "8px",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#0A7F6E",
                              }}
                            >
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                No products found matching your filters.
              </div>
            )}
          </div>
        </main>

        {/* ── Add / Edit Product Modal ── */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                background: "#0a1526",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: "16px" }}>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={closeModal}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    fontSize: "20px",
                    display: "flex",
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="modal-body"
                style={{
                  padding: "20px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Image Upload Zone */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Product Image
                  </label>
                  <div
                    onClick={triggerFileInput}
                    style={{
                      border: "2px dashed rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      padding: "16px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: "rgba(255,255,255,0.01)",
                      position: "relative",
                      height: "140px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            background: "rgba(255,59,48,0.9)",
                            border: "none",
                            borderRadius: "50%",
                            width: "22px",
                            height: "22px",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <>
                        <svg width="24" height="24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" viewBox="0 0 24 24" style={{ marginBottom: "8px" }}>
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p style={{ fontSize: "12.5px", fontWeight: 500, margin: 0 }}>Click or Drag image to upload</p>
                        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>PNG, JPG or WEBP up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Name & Code */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Product Name *
                    </label>
                    <input
                      className="csw-input"
                      name="name"
                      required
                      placeholder="e.g. Pro Striker Jersey"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div style={{ flex: "1 1 160px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Product Code *
                    </label>
                    <input
                      className="csw-input"
                      name="code"
                      required
                      placeholder="e.g. CSW-JER-01"
                      value={formData.code}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Gender Selection */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                    Gender *
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {GENDERS.map((g) => {
                      const active = formData.gender === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, gender: g }))}
                          style={{
                            border: `1px solid ${active ? "#0A7F6E" : "rgba(255,255,255,0.12)"}`,
                            background: active ? "rgba(10,127,110,0.12)" : "transparent",
                            color: active ? "#fff" : "rgba(255,255,255,0.6)",
                            padding: "8px 18px",
                            borderRadius: "8px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category & Fabric */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  {/* Category Field Commented Out */}
                  {/* <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Category *
                    </label>
                    <select
                      className="csw-select"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select category</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div> */}
                  <div style={{ flex: "1 1 100%" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Fabric Details
                    </label>
                    <input
                      className="csw-input"
                      name="fabric"
                      placeholder="e.g. 100% Dry-Fit Polyester"
                      value={formData.fabric}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Fabric Details */}
                <div style={{ flex: "1 1 100%" }}>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Fabric Details
                  </label>
                  <input
                    className="csw-input"
                    name="fabric"
                    placeholder="e.g. 100% Dry-Fit Polyester"
                    value={formData.fabric}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Price & Stock */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Price (INR) *
                    </label>
                    <input
                      className="csw-input"
                      name="price"
                      type="number"
                      required
                      placeholder="e.g. 799"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div style={{ flex: "1 1 160px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Stock Quantity *
                    </label>
                    <input
                      className="csw-input"
                      name="stock"
                      type="number"
                      required
                      placeholder="e.g. 100"
                      value={formData.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Sizes Selection */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                    Available Sizes
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => {
                      const active = formData.sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleCheckboxChange("sizes", sz)}
                          style={{
                            border: `1px solid ${active ? "#0A7F6E" : "rgba(255,255,255,0.12)"}`,
                            background: active ? "rgba(10,127,110,0.12)" : "transparent",
                            color: active ? "#fff" : "rgba(255,255,255,0.6)",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors Selection */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                    Available Colors
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {["Black", "Athletic Red", "White", "Navy Blue", "Royal Blue", "Grey"].map((clr) => {
                      const active = formData.colors.includes(clr);
                      return (
                        <button
                          key={clr}
                          type="button"
                          onClick={() => handleCheckboxChange("colors", clr)}
                          style={{
                            border: `1px solid ${active ? "#0A7F6E" : "rgba(255,255,255,0.12)"}`,
                            background: active ? "rgba(10,127,110,0.12)" : "transparent",
                            color: active ? "#fff" : "rgba(255,255,255,0.6)",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {clr}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                    Product Description
                  </label>
                  <textarea
                    className="csw-textarea"
                    name="description"
                    rows="3"
                    placeholder="Provide a detailed description of features, materials, and fits..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Submit / Cancel Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: "16px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      background: "none",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.7)",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: "linear-gradient(135deg,#0A7F6E 0%,#08695C 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: submitting ? "not-allowed" : "pointer",
                      opacity: submitting ? 0.7 : 1,
                      boxShadow: "0 4px 16px rgba(10,127,110,0.35)",
                    }}
                  >
                    {submitting ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── View Product Details Modal (Removed Category Row) ── */}
        {viewingProduct && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              zIndex: 210,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              backdropFilter: "blur(5px)",
            }}
          >
            <div
              style={{
                background: "#0a1526",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "750px",
                maxHeight: "92vh",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "10.5px", color: "#0A7F6E", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                    Product Catalog Details
                  </span>
                  <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "18px", margin: "2px 0 0" }}>
                    {viewingProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => setViewingProduct(null)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    color: "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div
                className="modal-body"
                style={{
                  padding: "24px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  <div
                    style={{
                      flex: "1 1 240px",
                      height: "240px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {viewingProduct.image ? (
                      <img
                        src={viewingProduct.image}
                        alt={viewingProduct.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <svg width="48" height="48" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                  </div>

                  <div style={{ flex: "1.2 1 280px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Product Code</span>
                      <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "13px" }}>{viewingProduct.code}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Gender</span>
                      <span style={{ fontWeight: 600, fontSize: "13px" }}>{viewingProduct.gender || "Unisex"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Category</span>
                      <span style={{ fontWeight: 600, fontSize: "13px" }}>{viewingProduct.category}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Price</span>
                      <span style={{ fontWeight: 800, fontSize: "15px", color: "#0A7F6E", fontFamily: "'Montserrat',sans-serif" }}>₹{viewingProduct.price}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Inventory</span>
                      <span style={{ fontWeight: 600, fontSize: "13px" }}>
                        {viewingProduct.stock} units ({viewingProduct.stockStatus})
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Fabric Details</span>
                      <span style={{ fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>{viewingProduct.fabric || "Not specified"}</span>
                    </div>

                    <div style={{ marginTop: "4px" }}>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase" }}>Colors</p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {viewingProduct.colors && viewingProduct.colors.length > 0 ? (
                          viewingProduct.colors.map((c) => (
                            <span key={c} style={{ fontSize: "11px", background: "rgba(255,255,255,0.07)", padding: "4px 10px", borderRadius: "6px", fontWeight: 500 }}>
                              {c}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>None specified</span>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase" }}>Sizes</p>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {viewingProduct.sizes && viewingProduct.sizes.length > 0 ? (
                          viewingProduct.sizes.map((s) => (
                            <span key={s} style={{ fontSize: "11px", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "3px 8px", borderRadius: "5px", fontWeight: 700 }}>
                              {s}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>None specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", gap: "16px", marginBottom: "16px" }}>
                    {[
                      { id: "desc", label: "Description" },
                      { id: "chart", label: "Size Chart" },
                      { id: "specs", label: "Specifications" },
                      { id: "shipping", label: "Shipping & Returns" },
                    ].map((tab) => {
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          style={{
                            background: "none",
                            border: "none",
                            borderBottom: `2.5px solid ${active ? "#0A7F6E" : "transparent"}`,
                            color: active ? "#fff" : "rgba(255,255,255,0.4)",
                            padding: "8px 4px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "12.5px",
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ minHeight: "100px", padding: "4px" }}>
                    {activeTab === "desc" && (
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
                        {viewingProduct.description || "No description provided for this product catalog item."}
                      </p>
                    )}

                    {activeTab === "chart" && (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "320px" }}>
                          <thead>
                            <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                              {["Size", "Chest (inches)", "Waist (inches)", "Length (inches)"].map((th) => (
                                <th key={th} style={{ padding: "8px 12px", border: "1px solid rgba(255,255,255,0.08)", textAlign: "left", color: "rgba(255,255,255,0.4)" }}>
                                  {th}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { s: "XS", c: "32-34", w: "26-28", l: "26" },
                              { s: "S", c: "35-37", w: "29-31", l: "27" },
                              { s: "M", c: "38-40", w: "32-34", l: "28" },
                              { s: "L", c: "41-43", w: "35-37", l: "29" },
                              { s: "XL", c: "44-46", w: "38-40", l: "30" },
                              { s: "XXL", c: "47-49", w: "41-43", l: "31" },
                            ].map((row) => (
                              <tr key={row.s} style={{ background: viewingProduct.sizes.includes(row.s) ? "rgba(10,127,110,0.05)" : "transparent" }}>
                                <td style={{ padding: "8px 12px", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 700 }}>{row.s}</td>
                                <td style={{ padding: "8px 12px", border: "1px solid rgba(255,255,255,0.08)" }}>{row.c}</td>
                                <td style={{ padding: "8px 12px", border: "1px solid rgba(255,255,255,0.08)" }}>{row.w}</td>
                                <td style={{ padding: "8px 12px", border: "1px solid rgba(255,255,255,0.08)" }}>{row.l}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {activeTab === "specs" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "6px" }}>
                          <span style={{ width: "120px", color: "rgba(255,255,255,0.4)" }}>Material</span>
                          <span>{viewingProduct.fabric || "Dry-Fit Performance fabric"}</span>
                        </div>
                        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "6px" }}>
                          <span style={{ width: "120px", color: "rgba(255,255,255,0.4)" }}>Fit Type</span>
                          <span>Regular / Athletic Fit</span>
                        </div>
                        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "6px" }}>
                          <span style={{ width: "120px", color: "rgba(255,255,255,0.4)" }}>Wash Care</span>
                          <span>Machine wash cold, do not bleach, tumble dry low</span>
                        </div>
                      </div>
                    )}

                    {activeTab === "shipping" && (
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <p>
                          <strong>Shipping Info:</strong> Standard delivery takes 3-5 business days. Bulk orders or customized team jerseys may take 7-10 business days for custom print runs.
                        </p>
                        <p>
                          <strong>Return Policy:</strong> Since we manage corporate sportswear, returns are only accepted for manufacturing defects or size discrepancies within 7 days of delivery. Custom-printed products are non-returnable.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "18px" }}>
                  <button
                    onClick={(e) => {
                      setViewingProduct(null);
                      openEditModal(viewingProduct, e);
                    }}
                    style={{
                      background: "linear-gradient(135deg,#0A7F6E 0%,#08695C 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 22px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={(e) => {
                      handleDelete(viewingProduct.id, e);
                    }}
                    style={{
                      background: "rgba(10,127,110,0.06)",
                      border: "1px solid rgba(10,127,110,0.15)",
                      color: "#0A7F6E",
                      borderRadius: "10px",
                      padding: "10px 22px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProducts;