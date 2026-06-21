import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../common/adminlayout/AdminSidebar";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
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

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Pro Striker Jersey",
    code: "CSW-JER-01",
    category: "Performance Jerseys",
    price: 799,
    stock: 148,
    stockStatus: "In Stock",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Athletic Red", "White", "Black"],
    fabric: "100% Interlock Dry-Fit Polyester",
    description: "Premium performance jersey designed for high endurance, extreme comfort, and sweat absorption.",
    image: null,
  },
  {
    id: 2,
    name: "FlexFit Track Pants",
    code: "CSW-TRP-02",
    category: "Track Pants",
    price: 1299,
    stock: 85,
    stockStatus: "In Stock",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Navy Blue", "Grey"],
    fabric: "88% Polyester, 12% Spandex Blend",
    description: "Highly stretchable and comfortable track pants for workouts, running, and outdoor sports.",
    image: null,
  },
  {
    id: 3,
    name: "Victory Hoodie",
    code: "CSW-HUD-03",
    category: "Hoodies",
    price: 1899,
    stock: 8,
    stockStatus: "Low Stock",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Grey", "Royal Blue"],
    fabric: "Fleece cotton-polyester blend",
    description: "Warm and cozy fleece hoodie with an athletic fit, perfect for pre-game warmups and cold climates.",
    image: null,
  },
  {
    id: 4,
    name: "Sprint Shorts",
    code: "CSW-SHR-04",
    category: "Sports Shorts",
    price: 549,
    stock: 210,
    stockStatus: "In Stock",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Royal Blue"],
    fabric: "Lightweight micro-fiber polyester",
    description: "Ultralight running shorts with zip pockets, elastic waistbands, and breathable mesh panels.",
    image: null,
  },
  {
    id: 5,
    name: "Champion Tracksuit",
    code: "CSW-TRK-05",
    category: "Tracksuits",
    price: 2499,
    stock: 0,
    stockStatus: "Out of Stock",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy Blue", "Black"],
    fabric: "Tricot knit polyester",
    description: "Full tracksuit set including zip-up jacket and matching athletic fit pants with premium pocket zippers.",
    image: null,
  },
];

const DEFAULT_FORM = {
  name: "",
  code: "",
  category: "Sports T-Shirts",
  price: "",
  stock: "",
  sizes: [],
  colors: [],
  fabric: "",
  description: "",
};

// ─── Component ────────────────────────────────────────────────────────────────
const AdminProducts = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("csw_admin_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
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
  const fileInputRef = useRef(null);

  // Detail View Modal State
  const [viewingProduct, setViewingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("desc"); // desc, chart, specs, shipping

  useEffect(() => {
    const t = setTimeout(() => setPageIn(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem("csw_admin_products", JSON.stringify(products));
  }, [products]);

  // Filter & Sort Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesStock = stockFilter === "All" || p.stockStatus === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
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
    setFormData(DEFAULT_FORM);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product, e) => {
    e.stopPropagation(); // Prevent opening detail view when clicking edit icon
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sizes: product.sizes || [],
      colors: product.colors || [],
      fabric: product.fabric || "",
      description: product.description || "",
    });
    setImagePreview(product.image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(DEFAULT_FORM);
    setImagePreview(null);
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
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = (id, e) => {
    e.stopPropagation(); // Prevent opening detail view
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (viewingProduct?.id === id) setViewingProduct(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price) || 0;
    const stockNum = parseInt(formData.stock, 10) || 0;

    let stockStatus = "In Stock";
    if (stockNum === 0) stockStatus = "Out of Stock";
    else if (stockNum <= 10) stockStatus = "Low Stock";

    const updatedData = {
      name: formData.name,
      code: formData.code,
      category: formData.category,
      price: priceNum,
      stock: stockNum,
      stockStatus,
      sizes: formData.sizes,
      colors: formData.colors,
      fabric: formData.fabric,
      description: formData.description,
      image: imagePreview,
    };

    if (editingProduct) {
      // Edit
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updatedData } : p))
      );
    } else {
      // Add
      const newProduct = {
        id: Date.now(),
        ...updatedData,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    closeModal();
  };

  return (
    <>
      {/* ── Stylesheet overrides ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050e1a; color: #fff; font-family: 'Poppins', sans-serif; }
        
        .csw-topbar {
          position: fixed; top: 0; left: ${sidebarCollapsed ? 72 : 260}px; right: 0; height: 64px;
          background: rgba(5, 14, 26, 0.92); backdrop-filter: blur(14px);
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
          transition: all 0.3s ease; display: flex; flexDirection: column;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 59, 48, 0.3);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .product-card-image {
          width: 100%; height: 180px; background: rgba(255, 255, 255, 0.02);
          display: flex; align-items: center; justify-content: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06); position: relative;
        }

        .status-badge {
          position: absolute; top: 12px; right: 12px;
          padding: 3px 9px; borderRadius: 20px; fontSize: 10px; fontWeight: 700;
        }

        /* ── Input & Select styling ── */
        .csw-input, .csw-select, .csw-textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff; border-radius: 10px; padding: 10px 14px;
          outline: none; transition: border-color 0.2s; font-family: 'Poppins', sans-serif;
          width: 100%;
        }
        .csw-input:focus, .csw-select:focus, .csw-textarea:focus {
          border-color: #FF3B30;
        }

        /* Explicit Select option dark mode fix */
        .csw-select option {
          background-color: #0d1f35 !important;
          color: #ffffff !important;
          padding: 8px;
        }

        /* ── Responsive ── */
        @media(max-width:768px){
          .csw-topbar { left: 0 !important; padding: 0 14px; }
          .csw-main { margin-left: 0 !important; padding: 76px 14px 32px; }
          .csw-hamburger { display: flex !important; }
        }

        .table-view { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table-view th {
          text-align: left; padding: 12px 16px; font-size: 11px; fontWeight: 600;
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

        /* Modal custom scroll */
        .modal-body::-webkit-scrollbar { width: 4px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: rgba(255, 59, 48, 0.3); border-radius: 2px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#050e1a" }}>
        {/* ── Sidebar ── */}
        <AdminSidebar
          activeKey="products"
          isMobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* ── Topbar ── */}
        <header className="csw-topbar">
          {/* Left: Mobile toggle + Page Title */}
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

          {/* Right Profile Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.4)" }}>Admin Panel</span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: "linear-gradient(135deg,#FF3B30,#cc2020)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 800,
                fontSize: "14px",
                color: "#fff",
                boxShadow: "0 0 10px rgba(255,59,48,0.3)",
              }}
            >
              A
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="csw-main">
          {/* Section Header */}
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
                    background: "#FF3B30",
                    borderRadius: "2px",
                    boxShadow: "0 0 10px rgba(255,59,48,0.5)",
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
                background: "linear-gradient(135deg,#FF3B30 0%,#cc2e25 100%)",
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
                boxShadow: "0 4px 16px rgba(255,59,48,0.3)",
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

          {/* Filters Bar */}
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
            {/* Search Input */}
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
              {/* Category Filter */}
              <div style={{ minWidth: "150px", flex: "1 1 150px", maxWidth: "200px" }}>
                <select
                  className="csw-select"
                  style={{ fontSize: "12px" }}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Status Filter */}
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

              {/* Sorting Filter */}
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

          {/* ── Desktop Table View ── */}
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
                            {/* Product Image Box */}
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
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B30")}
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
                                background: "rgba(255,59,48,0.07)",
                                border: "1px solid rgba(255,59,48,0.2)",
                                borderRadius: "8px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#FF3B30",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,59,48,0.15)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,59,48,0.07)")}
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
                              {p.code}
                            </span>
                          </div>
                          <span style={{ fontSize: "14px", fontWeight: 800, color: "#FF3B30", fontFamily: "'Montserrat',sans-serif" }}>
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
                                background: "rgba(255,59,48,0.06)",
                                border: "1px solid rgba(255,59,48,0.15)",
                                borderRadius: "8px",
                                width: "30px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#FF3B30",
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
            {/* Modal Container */}
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
                animation: "csw-dropdown 0.22s cubic-bezier(0.4,0,0.2,1) both",
              }}
            >
              {/* Header */}
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

              {/* Scrollable Form Body */}
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
                      transition: "border-color 0.2s",
                      position: "relative",
                      height: "140px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FF3B30")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
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

                {/* Category & Fabric */}
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Category
                    </label>
                    <select
                      className="csw-select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: "1 1 160px" }}>
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
                            border: `1px solid ${active ? "#FF3B30" : "rgba(255,255,255,0.12)"}`,
                            background: active ? "rgba(255,59,48,0.12)" : "transparent",
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
                            border: `1px solid ${active ? "#FF3B30" : "rgba(255,255,255,0.12)"}`,
                            background: active ? "rgba(255,59,48,0.12)" : "transparent",
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
                    style={{
                      background: "linear-gradient(135deg,#FF3B30 0%,#cc2e25 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(255,59,48,0.35)",
                    }}
                  >
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── View Product Details Modal ── */}
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
            {/* Modal Container */}
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
                animation: "csw-dropdown 0.25s cubic-bezier(0.4,0,0.2,1) both",
              }}
            >
              {/* Header */}
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
                  <span style={{ fontSize: "10.5px", color: "#FF3B30", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
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
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Modal Content */}
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
                {/* Product Core Details Row */}
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  {/* Left Column: Image Box */}
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

                  {/* Right Column: Spec Lists */}
                  <div style={{ flex: "1.2 1 280px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Product Code</span>
                      <span style={{ fontWeight: 600, fontFamily: "monospace", fontSize: "13px" }}>{viewingProduct.code}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Category</span>
                      <span style={{ fontWeight: 600, fontSize: "13px" }}>{viewingProduct.category}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Price</span>
                      <span style={{ fontWeight: 800, fontSize: "15px", color: "#FF3B30", fontFamily: "'Montserrat',sans-serif" }}>₹{viewingProduct.price}</span>
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

                    {/* Colors & Sizes display */}
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

                {/* Tabs bar */}
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
                            borderBottom: `2.5px solid ${active ? "#FF3B30" : "transparent"}`,
                            color: active ? "#fff" : "rgba(255,255,255,0.4)",
                            padding: "8px 4px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "12.5px",
                            fontFamily: "'Poppins',sans-serif",
                            transition: "all 0.15s",
                          }}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Contents */}
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
                              <tr key={row.s} style={{ background: viewingProduct.sizes.includes(row.s) ? "rgba(255,59,48,0.05)" : "transparent" }}>
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

                {/* Footer buttons inside details */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "18px" }}>
                  <button
                    onClick={(e) => {
                      setViewingProduct(null);
                      openEditModal(viewingProduct, e);
                    }}
                    style={{
                      background: "linear-gradient(135deg,#FF3B30 0%,#cc2e25 100%)",
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
                      background: "rgba(255,59,48,0.07)",
                      border: "1px solid rgba(255,59,48,0.25)",
                      color: "#FF3B30",
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
