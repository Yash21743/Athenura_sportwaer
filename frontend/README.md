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

---

##  Project Completion Status & Main Features

**EVERYTHING IS COMPLETED!** 🎉
The frontend website is fully ready with a complete design system, dynamic pages, state management, animations, and public-admin workflow. Below is a list of all pages and the key features implemented in each:

### 🖥️ Public Pages & Main Features

*   **🏠 Home Page (`pages/Home.jsx`)**
    *   **Hero Section**: Full screen dynamic banner with a sporty background image overlay and call-to-action buttons.
    *   **Featured Categories**: Grid layouts for sportswear categories (T-Shirts, Hoodies, Tracks, etc.) using clean custom cards.
    *   **Why Choose Us**: Brand highlights section showcasing premium quality, custom branding, fast delivery, and affordable rates.
    *   **Featured Products**: Responsive product slider/grid displaying currently trending items.
    *   **Testimonials Section**: Highlights of corporate customer reviews.
    *   **Bulk Order CTA**: Banner encouraging companies to place athletic team orders.

*   **👔 About Us (`pages/About.jsx`)**
    *   **Interactive Brand Timeline**: A step-by-step tracker showing the brand's journey.
    *   **Mission & Vision Sections**: Clean layouts outlining organizational goals.
    *   **Stats Section**: Real-time counter layouts showcasing numbers of happy clients, products, and years of experience.
    *   **Our Team Grid**: Creative team profiles with hover animation effects.

*   **🛍️ Products & Catalog (`pages/Products.jsx`)**
    *   **Advanced Filtering**: Category tabs, responsive price-range slider, size selector, and stock availability checkboxes.
    *   **Dynamic Search**: Live search input to filter products by name, tag, or SKU.
    *   **Sorting Selector**: Dropdown to sort products by price (low-to-high / high-to-low), name, or featured status.
    *   **Dynamic Load More**: Interactive button to load extra items with automated scrolling targets.
    *   **Mock Fallback Data**: Automated integration with a local mock database when the backend API fails.

*   **🔍 Product Detail (`pages/ProductDetail.jsx`)**
    *   **Image Zoom & Gallery**: Interactive thumbnail selection with zoomed preview display.
    *   **Configurable Sportswear Options**: Selection options for sizes, colors, and order quantities.
    *   **Detail Information Tabs**: Toggle tabs for Product Description, Size Chart, and Shipping policies.
    *   **Related Products Grid**: Carousel-like display of related active apparel.

*   **📦 Bulk Orders (`pages/BulkOrder.jsx`)**
    *   **Custom Bulk Inquiry Form**: Detailed form fields for organization name, quantity request, branding type, and custom designs description.
    *   **Volume Discount Matrix**: Pricing tier charts based on order quantity.
    *   **Inquiry Success Toast**: Notification showing the inquiry reference details once submitted.

*   **🛒 Shopping Bag (`pages/AddToBag.jsx`)**
    *   **Cart Items Matrix**: Visual list of selected items, pricing details, selected sizes, and quantity adjusters.
    *   **Live Total Pricing Calculation**: Interactive calculation of base values, shipping costs, and final totals.
    *   **Checkout Trigger**: Clean validation forms with user redirection features.

*   **⭐ Testimonials (`pages/Testimonials.jsx`)**
    *   **Categorized Reviews Grid**: Clean layouts for corporate, sports team, and individual reviews.
    *   **Review Submission Form**: Form allowing users to input feedback and star ratings.

*   **❓ FAQ Accordion (`pages/FAQ.jsx`)**
    *   **Animated Accordions**: Collapsible Q&A blocks with smooth CSS height transitions.
    *   **Category Filtering & Search**: Instant lookup of questions by keywords.

*   **📞 Contact Us (`pages/Contact.jsx`)**
    *   **Interactive Contact Form**: Forms that directly send messages/leads to the Admin panel.
    *   **Google Map Embed**: Responsive location map placeholder.
    *   **Contact Info Cards**: Interactive cards for quick phone call, email, and location.

---

### 🔐 Admin Panel & Main Features

*   **🔑 Admin Login (`components/admin/AdminLogin.jsx`)**
    *   Secure layout containing credentials check and toaster notifications.

*   **📊 Admin Dashboard (`components/admin/AdminDashboard.jsx`)**
    *   **KPI Cards**: Summarized widgets showing total active products, user leads, pending bulk orders, and testimonials.
    *   **Quick Links**: Instant links to jump to different administrative sub-sections.

*   **🛍️ Products Manage (`components/admin/AdminProducts.jsx`)**
    *   Full CRUD UI to add, update, search, delete, and manage active status of the sportswear catalog.

*   **📂 Categories Manage (`components/admin/AdminCategories.jsx`)**
    *   Listing of existing item groups with add category forms.

*   **📋 Leads / Contact Inbox (`components/admin/AdminLeads.jsx`)**
    *   Central control hub for emails and general contact messages sent from the frontend.

*   **📦 Bulk Orders Inbox (`components/admin/AdminBulkOrders.jsx`)**
    *   Corporate bulk order queue monitor. Details include size distribution, quantities, and request status.

*   **⭐ Testimonials Moderation (`components/admin/AdminTestimonials.jsx`)**
    *   Controls to approve, delete, or hide testimonials from public display.

---

### ⚙️ Core Libraries & Utilities Used

1.  **React Router DOM**: Client-side route mapping with automated `ScrollToTop` helper on route changes.
2.  **Tailwind CSS**: Custom styling, layout setups, responsive breakpoints, flex/grid systems, and interactive hover transitions.
3.  **Framer Motion**: Page transitions and element mounting animation effects.
4.  **React Icons**: Used extensively across all public and admin UI pages.
5.  **Axios API Service**: Global setup in `services/api.js` for clean CRUD server communication.
6.  **React Hot Toast**: Instant pop-up alert notifications for user-interactive alerts.
