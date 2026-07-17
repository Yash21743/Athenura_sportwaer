import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/common/layout/Navbar';
import Footer from './components/common/layout/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import BulkOrder from './pages/BulkOrder';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import FAQ from './pages/FAQ';
import AddToBag from './pages/AddToBag';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './components/admin/AdminLogin';
import AdminRegister from './components/admin/AdminRegister';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminCategories from './components/admin/AdminCategories';
import AdminLeads from './components/admin/AdminLeads';
import AdminBulkOrders from './components/admin/AdminBulkOrders';
import AdminTestimonials from './components/admin/AdminTestimonials';
import AdminRegister from './components/admin/AdminRegister';


// User Dashboard
import UserDashboard from './components/userdashboard/UserDashboard';




function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" />

      <Routes>
        {/* ── Public Routes (with Navbar + Footer) ── */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/"                element={<Home />} />
                  <Route path="/about"           element={<About />} />
                  <Route path="/products"        element={<Products />} />
                  <Route path="/products/:id"    element={<ProductDetail />} />
                  <Route path="/bulk-orders"     element={<BulkOrder />} />
                  <Route path="/testimonials"    element={<Testimonials />} />
                  <Route path="/faq"             element={<FAQ />} />
                  <Route path="/contact"         element={<Contact />} />
                  <Route path="/cart"            element={<AddToBag />} />
                  <Route path="/add-to-bag"      element={<AddToBag />} />
                  <Route path="*"                element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />

        {/* ── Admin Routes (NO Navbar/Footer) ── */}
        <Route path="/admin"                   element={<AdminLogin />} />
        <Route path="/admin/register"          element={<AdminRegister />} />
        <Route path="/admin/dashboard"         element={<AdminDashboard />} />
        <Route path="/admin/products"          element={<AdminProducts />} />
        <Route path="/admin/categories"        element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/leads"             element={<AdminLeads />} />
        <Route path="/admin/bulk-orders"       element={<AdminBulkOrders />} />
        <Route path="/admin/testimonials"      element={<AdminTestimonials />} />
        {/* ── User Dashboard Route (NO Navbar/Footer) ── */}
        <Route path="/dashboard"               element={<UserDashboard />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
