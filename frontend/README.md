# 🏃 Comfy Sport Wear — Frontend

> **Developed by Athenura Technologies**  
> React + Vite + Tailwind CSS | Corporate Sportswear Brand Website

---

## 🚀 Project Start Kaise Karein

```bash
cd Athenura_sportwear/frontend
npm install
npm run dev
```

> Browser mein kholo: **http://localhost:5173/**

---

## 🌐 Public Pages — Routes

| Browser mein kya likho | Page | File |
|------------------------|------|------|
| `http://localhost:5173/` | 🏠 Home | `src/pages/Home.jsx` |
| `http://localhost:5173/about` | 👔 About Us | `src/pages/About.jsx` |
| `http://localhost:5173/products` | 🛍️ Products | `src/pages/Products.jsx` |
| `http://localhost:5173/products/1` | 🔍 Product Detail | `src/pages/ProductDetail.jsx` |
| `http://localhost:5173/bulk-orders` | 📦 Bulk Order | `src/pages/BulkOrder.jsx` |
| `http://localhost:5173/testimonials` | ⭐ Testimonials | `src/pages/Testimonials.jsx` |
| `http://localhost:5173/faq` | ❓ FAQ | `src/pages/FAQ.jsx` |
| `http://localhost:5173/contact` | 📞 Contact Us | `src/pages/Contact.jsx` |
| `http://localhost:5173/xyz` | 🚫 404 Not Found | `src/pages/NotFound.jsx` |

---

## 🔐 Admin Pages — Routes

> ⚠️ Admin pages pe **Navbar aur Footer nahi aata** — sirf Sidebar hota hai

| Browser mein kya likho | Page | File |
|------------------------|------|------|
| `http://localhost:5173/admin` | 🔑 Admin Login | `src/components/admin/AdminLogin.jsx` |
| `http://localhost:5173/admin/dashboard` | 📊 Dashboard | `src/components/admin/AdminDashboard.jsx` |
| `http://localhost:5173/admin/products` | 🛍️ Products Manage | `src/components/admin/AdminProducts.jsx` |
| `http://localhost:5173/admin/categories` | 📂 Categories | `src/components/admin/AdminCategories.jsx` |
| `http://localhost:5173/admin/leads` | 📋 Leads/Inquiries | `src/components/admin/AdminLeads.jsx` |
| `http://localhost:5173/admin/bulk-orders` | 📦 Bulk Orders | `src/components/admin/AdminBulkOrders.jsx` |
| `http://localhost:5173/admin/testimonials` | ⭐ Testimonials | `src/components/admin/AdminTestimonials.jsx` |

---

## 📁 Folder Structure

```
frontend/
└── src/
    │
    ├── App.jsx                        ← Main routing file (mat chhedo)
    ├── main.jsx                       ← Entry point (mat chhedo)
    ├── index.css                      ← Global CSS + Tailwind + Fonts
    │
    ├── pages/                         ← 🖥️ Public Pages (yahan kaam karo)
    │   ├── Home.jsx                   ← / route
    │   ├── About.jsx                  ← /about route
    │   ├── Products.jsx               ← /products route
    │   ├── ProductDetail.jsx          ← /products/:id route
    │   ├── BulkOrder.jsx              ← /bulk-orders route
    │   ├── Testimonials.jsx           ← /testimonials route
    │   ├── FAQ.jsx                    ← /faq route
    │   ├── Contact.jsx                ← /contact route
    │   └── NotFound.jsx               ← 404 route
    │
    ├── components/
    │   │
    │   ├── home/                      ← 🏠 Home Page Sections
    │   │   ├── HeroSection.jsx        ← Banner + headline + buttons
    │   │   ├── FeaturedCategories.jsx ← Category cards grid
    │   │   ├── WhyChooseUs.jsx        ← 6 brand strength points
    │   │   ├── FeaturedProducts.jsx   ← Best products grid
    │   │   ├── TestimonialsSection.jsx← Reviews preview (3-4)
    │   │   └── BulkOrderCTA.jsx       ← Team order conversion banner
    │   │
    │   ├── products/                  ← 🛍️ Product Components
    │   │   ├── SearchBar.jsx          ← Search input
    │   │   ├── ProductFilter.jsx      ← Category filter buttons
    │   │   ├── ProductSorting.jsx     ← Sort dropdown
    │   │   ├── ProductGrid.jsx        ← Products grid layout
    │   │   ├── ProductCard.jsx        ← Single product card (ProductGrid ke andar)
    │   │   └── RelatedProducts.jsx    ← ProductDetail page ke end mein
    │   │
    │   ├── admin/                     ← 🔐 Admin Pages
    │   │   ├── AdminLogin.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminProducts.jsx
    │   │   ├── AdminCategories.jsx
    │   │   ├── AdminLeads.jsx
    │   │   ├── AdminBulkOrders.jsx
    │   │   └── AdminTestimonials.jsx
    │   │
    │   └── common/
    │       ├── layout/                ← 🌐 Public Layout
    │       │   ├── Navbar.jsx         ← Top navigation bar
    │       │   └── Footer.jsx         ← Bottom footer
    │       └── adminlayout/           ← 🔐 Admin Layout
    │           └── AdminSidebar.jsx   ← Left sidebar (Admin pages mein)
    │
    ├── assets/
    │   ├── images/                    ← Product/Brand images yahan daalo
    │   └── icons/                     ← SVG icons yahan daalo
    │
    ├── context/                       ← React Context (global state)
    ├── hooks/                         ← Custom React hooks
    ├── services/
    │   └── api.js                     ← Axios — Backend API calls
    └── utils/                         ← Helper functions
```

---

## 🎨 Design System (PDF Point 15)

| Element | Value |
|---------|-------|
| Primary Font | `Poppins` |
| Secondary Font | `Montserrat` |
| Colors | Team decide karegi |

---

## 📦 Installed Packages

| Package | Kaam |
|---------|------|
| `react-router-dom` | Page routing |
| `axios` | API calls to backend |
| `tailwindcss` | CSS styling |
| `framer-motion` | Animations |
| `react-icons` | Icons library |
| `swiper` | Sliders/carousels |
| `react-hot-toast` | Notifications |

---

## 👥 Team ke liye Rules

1. **Apni assigned `.jsx` file kholo**
2. **Upar zaruri imports likho** (`useState`, `axios`, etc.)
3. **Placeholder code hataao**
4. **Real design/code likho**
5. **Kisi aur ki file mat chhuo!**

> ⚠️ `App.jsx` aur `main.jsx` mat chhona — routing already set hai!

---

## 📌 Component Kahan Use Hoga — Quick Reference

| Component | Kis Page mein use hoga |
|-----------|------------------------|
| `ProductCard.jsx` | `ProductGrid.jsx` ke **andar** |
| `ProductGrid.jsx` | `pages/Products.jsx` |
| `RelatedProducts.jsx` | `pages/ProductDetail.jsx` |
| `HeroSection.jsx` | `pages/Home.jsx` |
| `FeaturedProducts.jsx` | `pages/Home.jsx` |
| `AdminSidebar.jsx` | Sab Admin pages mein (already added) |
| `Navbar.jsx` | Sab Public pages mein (App.jsx mein already added) |
| `Footer.jsx` | Sab Public pages mein (App.jsx mein already added) |
