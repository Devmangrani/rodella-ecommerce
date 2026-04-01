import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/myState";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

// Lazy load components for better performance
const Homepage = lazy(() => import("./components/Homepage"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const TubingComparison = lazy(() => import("./components/TubingComparison"));
const CompositePlates = lazy(() => import("./components/CompositePlates"));
const Reinforcement = lazy(() => import("./components/Reinforcement"));
const CoreMaterial = lazy(() => import("./components/CoreMaterial"));
const EpoxySystem = lazy(() => import("./components/EpoxySystem"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const UserDashboard = lazy(() => import("./components/UserDashboard"));
const Cart = lazy(() => import("./components/Cart"));

// Admin components
const AdminLogin = lazy(() => import("./components/AdminLogin"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.includes("admin");

  // Don't show header/footer for admin pages
  if (isAdminPage) {
    return children;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
};

// Component to handle scroll-to-top on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const MainApp = () => {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-black text-white">
            <ScrollToTop />
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/Composite-tubes" element={<TubingComparison />} />
                  <Route path="/composite-plates" element={<CompositePlates />} />
                  <Route path="/reinforcement" element={<Reinforcement />} />
                  <Route path="/core-material" element={<CoreMaterial />} />
                  <Route path="/epoxy-system" element={<EpoxySystem />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <UserDashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    }
                  />

                  {/* Secret Admin Routes - Hidden from regular users */}
                  <Route path="/rodella-admin-access" element={<AdminLogin />} />
                  <Route
                    path="/rodella-admin-dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </Layout>
          </div>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
};

export default MainApp;
