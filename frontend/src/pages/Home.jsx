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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search ur stylist" 
          style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
        />
      </div>
      
      <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '8px', marginBottom: '20px', position: 'relative' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ff6600' }}>30% Off</h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>on 1st service</p>
        <button style={{ backgroundColor: '#ff6600', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '10px' }}>SEE MORE</button>
        <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
            <PlaceholderImage name="banner_model.jpg" width="80px" height="80px" style={{ borderRadius: '50%' }} />
        </div>
      </div>
      
      <h3>Categories</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '14px' }}>popular in your city</h3>
        <span style={{ fontSize: '12px', color: '#666' }}>View all</span>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
        <div style={{ minWidth: '100px', cursor: 'pointer' }} onClick={() => handleStylistClick('1')}>
          <PlaceholderImage name="stylist_1.jpg" width="100%" height="100px" style={{ borderRadius: '8px' }} />
          <p style={{ fontSize: '12px', margin: '5px 0 0 0', fontWeight: 'bold' }}>Rahul</p>
          <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>4.8 ★</p>
        </div>
        <div style={{ minWidth: '100px', cursor: 'pointer' }} onClick={() => handleStylistClick('2')}>
          <PlaceholderImage name="stylist_2.jpg" width="100%" height="100px" style={{ borderRadius: '8px' }} />
          <p style={{ fontSize: '12px', margin: '5px 0 0 0', fontWeight: 'bold' }}>Henna</p>
          <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>4.5 ★</p>
        </div>
        <div style={{ minWidth: '100px', cursor: 'pointer' }} onClick={() => handleStylistClick('3')}>
          <PlaceholderImage name="stylist_3.jpg" width="100%" height="100px" style={{ borderRadius: '8px' }} />
          <p style={{ fontSize: '12px', margin: '5px 0 0 0', fontWeight: 'bold' }}>Putin</p>
          <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>4.9 ★</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
