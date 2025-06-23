import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import ContactUs from './components/ContactUs';
import TubingComparison from './components/TubingComparison';
import CompositePlates from './components/CompositePlates';
import Reinforcement from './components/Reinforcement';
import EpoxySystem from './components/EpoxySystem';
import Login from './components/Login';
import Signup from './components/Signup';
import UserDashboard from './components/UserDashboard';
import Cart from './components/Cart';
// import AuthDebug from './components/AuthDebug';
import { CartProvider } from './context/myState';
import PrivateRoute from './components/PrivateRoute';

const Layout = ({ children }) => {
  const location = useLocation();
  const isFullWidthPage = location.pathname === '/reinforcement'; // Add other full-width routes here if needed

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
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

const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/Composite-tubes" element={<TubingComparison />} />
              <Route path="/composite-plates" element={<CompositePlates />} />
              <Route path="/reinforcement" element={<Reinforcement />} />
              <Route path="/epoxy-system" element={<EpoxySystem />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* <Route path="/debug" element={<AuthDebug />} /> */}
              <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
