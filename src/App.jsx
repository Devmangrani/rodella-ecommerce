import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Navbar';
import ContactUs from './components/ContactUs';
import TubingComparison from './components/TubingComparison';
import CompositePlates from './components/CompositePlates';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 h-screen relative pt-2">
          <Header />
          <main className="mt-2">
            <Routes>
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/Composite-tubes" element={<TubingComparison />} />
              <Route path="/composite-plates" element={<CompositePlates />} />
              {/* Add other routes here */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
