import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

// ===============================
// LAYOUT
// ===============================
import Navbar from "./components/common/layout/Navbar";
import Footer from "./components/common/layout/Footer";

// ===============================
// PUBLIC PAGES
// ===============================
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import WomensProducts from "./pages/WomensProducts";
import KidsProducts from "./pages/KidsProducts";
import ProductDetail from "./pages/ProductDetail";
import BulkOrder from "./pages/BulkOrder";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import NotFound from "./pages/NotFound";

// ===============================
// CART & CHECKOUT
// ===============================
import AddToBag from "./pages/AddToBag";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

// ===============================
// ADMIN
// ===============================
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProducts from "./components/admin/AdminProducts";
import AdminCategories from "./components/admin/AdminCategories";
import AdminLeads from "./components/admin/AdminLeads";
import AdminBulkOrders from "./components/admin/AdminBulkOrders";
import AdminTestimonials from "./components/admin/AdminTestimonials";
import AdminRegister from "./components/admin/AdminRegister";
import AdminUsers from "./components/admin/AdminUsers";

// ===============================
// USER DASHBOARD
// ===============================
import UserDashboard from "./components/userdashboard/UserDashboard";

// ===============================
// SCROLL TO TOP
// ===============================
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

// ===============================
// PUBLIC LAYOUT
// ===============================
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />

      <main>{children}</main>

      <Footer />
    </>
  );
}

// ===============================
// APP
// ===============================
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />

        <Route
          path="/products"
          element={
            <PublicLayout>
              <Products />
            </PublicLayout>
          }
        />

        <Route
          path="/women"
          element={
            <PublicLayout>
              <WomensProducts />
            </PublicLayout>
          }
        />

        <Route
          path="/kids"
          element={
            <PublicLayout>
              <KidsProducts />
            </PublicLayout>
          }
        />

        <Route
          path="/products/:id"
          element={
            <PublicLayout>
              <ProductDetail />
            </PublicLayout>
          }
        />

        <Route
          path="/bulk-orders"
          element={
            <PublicLayout>
              <BulkOrder />
            </PublicLayout>
          }
        />

        <Route
          path="/testimonials"
          element={
            <PublicLayout>
              <Testimonials />
            </PublicLayout>
          }
        />

        <Route
          path="/faq"
          element={
            <PublicLayout>
              <FAQ />
            </PublicLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <PublicLayout>
              <PrivacyPolicy />
            </PublicLayout>
          }
        />

        <Route
          path="/terms-and-conditions"
          element={
            <PublicLayout>
              <TermsAndConditions />
            </PublicLayout>
          }
        />

        {/* =========================
            PUBLIC CART
        ========================== */}

        <Route
          path="/cart"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/add-to-bag"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* =========================
            PUBLIC CHECKOUT
        ========================== */}

        <Route
          path="/checkout"
          element={
            <PublicLayout>
              <Checkout />
            </PublicLayout>
          }
        />

        <Route
          path="/order-success"
          element={
            <PublicLayout>
              <OrderSuccess />
            </PublicLayout>
          }
        />

        {/* =========================
            ADMIN ROUTES
        ========================== */}

        <Route path="/admin" element={<AdminLogin />} />

        <Route
          path="/admin/register"
          element={<AdminRegister />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin/categories"
          element={<AdminCategories />}
        />

        <Route
          path="/admin/leads"
          element={<AdminLeads />}
        />

        <Route
          path="/admin/bulk-orders"
          element={<AdminBulkOrders />}
        />

        <Route
          path="/admin/testimonials"
          element={<AdminTestimonials />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        {/* =========================
            USER DASHBOARD
        ========================== */}

        <Route
          path="/dashboard"
          element={<UserDashboard />}
        >

          {/* Dashboard checkout */}
          <Route
            path="checkout"
            element={<Checkout />}
          />

          {/* Dashboard order success */}
          <Route
            path="order-success"
            element={<OrderSuccess />}
          />

        </Route>

        {/* =========================
            404
        ========================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;