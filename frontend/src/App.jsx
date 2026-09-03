import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Subcategories from './pages/Subcategories';
import Stylists from './pages/Stylists';
import StylistProfile from './pages/StylistProfile';
import Cart from './pages/Cart';
import Bookings from './pages/Bookings';

import Feedback from './pages/Feedback';
import VerifyOtp from './pages/VerifyOtp';

const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  // Also hide nav completely on login/register/otp pages to keep them clean
  const isAuthPage = ['/', '/register', '/verify-otp'].includes(location.pathname);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  return (
    <div className="app-shell">
      {!isAuthPage && (
        <header className="app-header">
          <a className="brand-mark" href="/home">
            <span>KS</span>
            <div><strong>Kiranmai</strong><small>STUDIO &amp; SALON</small></div>
          </a>
          <nav className="desktop-nav">
            {!isHomePage && <a href="/home">Explore</a>}
            <a href="/stylists">Stylists</a>
            <a href="/bookings">Bookings</a>
            <a href="/feedback">Feedback</a>
            <button 
              onClick={() => setIsDark(!isDark)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginLeft: '10px' }}
              title="Toggle Dark Mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </nav>
          {!isHomePage && (
            <a className="header-action" href="/home">Book a service <span>↗</span></a>
          )}
        </header>
      )}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/subcategories" element={<Subcategories />} />
        <Route path="/stylists" element={<Stylists />} />
        <Route path="/stylist-profile" element={<StylistProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      
      {!isAuthPage && (
        <footer className="app-footer">Kiranmai Studio <span>•</span> Personal care, thoughtfully curated</footer>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
