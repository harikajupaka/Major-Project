import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Subcategories from './pages/Subcategories';
import Stylists from './pages/Stylists';
import StylistProfile from './pages/StylistProfile';
import Cart from './pages/Cart';

import Feedback from './pages/Feedback';

function App() {
  return (
    <Router>
      <div style={{ maxWidth: '400px', margin: '0 auto', minHeight: '100vh', border: '1px solid #ddd', backgroundColor: '#fff', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/subcategories" element={<Subcategories />} />
          <Route path="/stylists" element={<Stylists />} />
          <Route path="/stylist-profile" element={<StylistProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
