import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceholderImage from '../components/PlaceholderImage';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const searchableItems = [
    { id: '1', type: 'stylist', name: 'Rahul', desc: 'Expert in Hair cut, Herbal facial' },
    { id: '2', type: 'stylist', name: 'Henna', desc: 'Expert in Head massage, Sandwich massage' },
    { id: '3', type: 'stylist', name: 'Putin', desc: 'Expert in French beard trim, Hair coloring' },
    { id: 'Men', type: 'category', name: 'Men Services', desc: 'Haircare, Bodycare, Beardcare' },
    { id: 'Women', type: 'category', name: 'Women Services', desc: 'Haircare, Bodycare, Makeup' },
    { id: 'Children', type: 'category', name: 'Children Services', desc: 'Haircare, Bodycare' }
  ];

  const handleCategorySelect = async (category) => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userStr || !token) {
      alert("Please login first");
      navigate('/');
      return;
    }
    const user = JSON.parse(userStr);

    try {
      const response = await fetch(`/api/appointments/category?customerId=${user.mobileNumber}&mainCategory=${category}&subCategory=General`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        navigate(`/subcategories?mainCategory=${category}`); // They can still explore subcategories
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStylistClick = async (stylistId) => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userStr || !token) {
      alert("Please login first");
      navigate('/');
      return;
    }
    const user = JSON.parse(userStr);

    try {
      // 1. Create appointment
      const res1 = await fetch(`/api/appointments/category?customerId=${user.mobileNumber}&mainCategory=General&subCategory=DirectSearch`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res1.ok) return;
      const data = await res1.json();
      const appointmentId = data.id;

      // 2. Select Stylist
      const res2 = await fetch(`/api/appointments/${appointmentId}/stylist?stylistId=S${stylistId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res2.ok) {
        navigate(`/stylist-profile?id=${stylistId}&appointmentId=${appointmentId}&category=General`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchResultClick = (item) => {
    if (item.type === 'stylist') {
      handleStylistClick(item.id);
    } else if (item.type === 'category') {
      handleCategorySelect(item.id);
    }
  };

  const filteredItems = searchableItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchActive(e.target.value.length > 0);
          }}
          onFocus={() => {
            if (searchQuery.length > 0) setIsSearchActive(true);
          }}
          onBlur={() => {
            setIsSearchActive(false);
          }}
        />
        
        {isSearchActive && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, 
            backgroundColor: 'var(--input-bg, white)', borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10,
            marginTop: '5px', maxHeight: '200px', overflowY: 'auto',
            border: '1px solid var(--input-border, #ddd)'
          }}>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div 
                  key={item.id + item.type}
                  onMouseDown={() => handleSearchResultClick(item)}
                  style={{ padding: '12px 15px', borderBottom: '1px solid var(--input-border, #f0f0f0)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--card-title, #333)' }}>{item.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--card-subtitle, #777)' }}>{item.desc}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '15px', textAlign: 'center', color: 'var(--card-subtitle, #999)', fontSize: '13px' }}>
                No stylists or treatments found.
              </div>
            )}
          </div>
        )}
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
          <div className="section-heading"><h3>Explore by category</h3></div>
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
          <span style={{ cursor: 'pointer', color: '#ff6600' }} onClick={() => navigate('/stylists')}>View all stylists ↗</span>
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
