import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Navbar';
import Homepage from './components/Homepage';
import ContactUs from './components/ContactUs';
import TubingComparison from './components/TubingComparison';
import CompositePlates from './components/CompositePlates';
import Reinforcement from './components/Reinforcement';
import EpoxySystem from './components/EpoxySystem';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  if (isHomepage) {
    return children;
  }

  return (
    <div className="container mx-auto px-4 relative pt-2">
      <Header />
      <main className="mt-2">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/Composite-tubes" element={<TubingComparison />} />
            <Route path="/composite-plates" element={<CompositePlates />} />
            <Route path="/reinforcement" element={<Reinforcement />} />
            <Route path="/epoxy-system" element={<EpoxySystem />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  )
}

export default App
