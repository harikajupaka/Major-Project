import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderImage from '../components/PlaceholderImage';

const Home = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    navigate(`/subcategories?mainCategory=${category}`);
  };

  const handleStylistClick = (stylistId) => {
    navigate(`/stylist-profile?id=${stylistId}`);
  };

  return (
    <div className="home-page">
      <div className="home-intro">
        <div className="home-eyebrow">Your beauty destination</div>
        <h1 className="home-title">A little time for yourself.</h1>
        <p className="home-subtitle">Discover trusted stylists and thoughtful treatments, all in one place.</p>
      </div>
      <div className="home-search">
        <input 
          type="text" 
          placeholder="Search your stylist or treatment"
        />
      </div>
      <div className="home-grid">
      <div className="promo-panel">
        <h3 style={{ margin: '0 0 10px 0', color: '#ff6600' }}>30% Off</h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>on 1st service</p>
        <button style={{ backgroundColor: '#ff6600', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '10px' }}>SEE MORE</button>
        <div style={{ position: 'absolute' }}>
            <PlaceholderImage name="banner_model.jpg" width="80px" height="80px" style={{ borderRadius: '50%' }} />
        </div>
      </div>
      <div className="category-panel">
      <div className="section-heading"><h3>Explore by category</h3><span>View all</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0' }}>
        <div style={{ textAlign: 'center', cursor: 'pointer', padding: '5px', borderRadius: '10px' }} onClick={() => handleCategorySelect('Men')}>
          <PlaceholderImage name="men.jpg" width="60px" height="60px" style={{ borderRadius: '50%', margin: '0 auto' }} />
          <p style={{ fontSize: '12px', marginTop: '5px' }}>Men</p>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer', padding: '5px', borderRadius: '10px' }} onClick={() => handleCategorySelect('Women')}>
          <PlaceholderImage name="women.jpg" width="60px" height="60px" style={{ borderRadius: '50%', margin: '0 auto' }} />
          <p style={{ fontSize: '12px', marginTop: '5px' }}>Women</p>
        </div>
        <div style={{ textAlign: 'center', cursor: 'pointer', padding: '5px', borderRadius: '10px' }} onClick={() => handleCategorySelect('Children')}>
          <PlaceholderImage name="children.jpg" width="60px" height="60px" style={{ borderRadius: '50%', margin: '0 auto' }} />
          <p style={{ fontSize: '12px', marginTop: '5px' }}>Children</p>
        </div>
      </div>
      </div>
      </div>
      
      <div className="stylists-section">
      <div className="section-heading">
        <h3>Popular in your city</h3>
        <span>View all stylists ↗</span>
      </div>
      
      <div className="stylist-grid">
        <div className="stylist-card" style={{ cursor: 'pointer' }} onClick={() => handleStylistClick('1')}>
          <PlaceholderImage name="stylist_1.jpg" width="100%" height="100px" style={{ borderRadius: '8px' }} />
          <p style={{ fontSize: '12px', margin: '5px 0 0 0', fontWeight: 'bold' }}>Rahul</p>
          <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>4.8 ★</p>
        </div>
        <div className="stylist-card" style={{ cursor: 'pointer' }} onClick={() => handleStylistClick('2')}>
          <PlaceholderImage name="stylist_2.jpg" width="100%" height="100px" style={{ borderRadius: '8px' }} />
          <p style={{ fontSize: '12px', margin: '5px 0 0 0', fontWeight: 'bold' }}>Henna</p>
          <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>4.5 ★</p>
        </div>
        <div className="stylist-card" style={{ cursor: 'pointer' }} onClick={() => handleStylistClick('3')}>
          <PlaceholderImage name="stylist_3.jpg" width="100%" height="100px" style={{ borderRadius: '8px' }} />
          <p style={{ fontSize: '12px', margin: '5px 0 0 0', fontWeight: 'bold' }}>Putin</p>
          <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>4.9 ★</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;
