import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Subcategories from './pages/Subcategories';
import Stylists from './pages/Stylists';
import StylistProfile from './pages/StylistProfile';
import Cart from './pages/Cart';

import Feedback from './pages/Feedback';
import VerifyOtp from './pages/VerifyOtp';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <a className="brand-mark" href="/home">
            <span>KS</span>
            <div><strong>Kiranmai</strong><small>STUDIO &amp; SALON</small></div>
          </a>
          <nav className="desktop-nav">
            <a href="/home">Explore</a>
            <a href="/stylists">Stylists</a>
            <a href="/cart">Bookings</a>
            <a href="/feedback">Feedback</a>
          </nav>
          <a className="header-action" href="/home">Book a service <span>↗</span></a>
        </header>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/subcategories" element={<Subcategories />} />
          <Route path="/stylists" element={<Stylists />} />
          <Route path="/stylist-profile" element={<StylistProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
        <footer className="app-footer">Kiranmai Studio <span>•</span> Personal care, thoughtfully curated</footer>
      </div>
    </Router>
  );
}

export default App;
