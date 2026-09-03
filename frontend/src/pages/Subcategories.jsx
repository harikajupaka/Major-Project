import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlaceholderImage from '../components/PlaceholderImage';

const Subcategories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mainCategory = queryParams.get('mainCategory') || 'Men';
  const [loading, setLoading] = useState(false);

  // Dynamic subcategories based on Main Category
  const getSubcategories = () => {
    switch (mainCategory) {
      case 'Women':
        return ['Haircare', 'Bodycare', 'Makeup', 'Skincare'];
      case 'Children':
        return ['Haircare', 'Bodycare'];
      case 'Men':
      default:
        return ['Haircare', 'Bodycare', 'Beardcare', 'Makeup'];
    }
  };

  const subcategories = getSubcategories();

  const handleSubcategorySelect = async (subCategory) => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      alert("Please login first");
      navigate('/');
      return;
    }
    
    const user = JSON.parse(userStr);

    setLoading(true);
    try {
      // Create initial appointment doc as per flow requirements
      const response = await fetch(`/api/appointments/category?customerId=${user.mobileNumber}&mainCategory=${mainCategory}&subCategory=${subCategory}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Passing dummy-123 for now since backend currently returns a string msg instead of JSON id
        navigate(`/stylists?category=${mainCategory}&subCategory=${subCategory}&appointmentId=dummy-123`);
      } else {
        alert("Failed to initialize appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(-1)}>←</span>
        {mainCategory} Services
      </h2>

      {loading && <p style={{ color: '#ff6600', fontSize: '14px', textAlign: 'center' }}>Loading...</p>}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {subcategories.map((sub, idx) => (
          <div 
            key={idx}
            onClick={() => handleSubcategorySelect(sub)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '15px', 
              borderRadius: '12px', 
              backgroundColor: '#fff', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              border: '1px solid #f0f0f0'
            }}
          >
            <PlaceholderImage 
              name={`${mainCategory.toLowerCase()}_${sub.toLowerCase()}_icon.jpg`}
              width="50px" 
              height="50px" 
              style={{ borderRadius: '8px', marginRight: '15px' }} 
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{sub}</h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>
                Explore {sub.toLowerCase()} services for {mainCategory.toLowerCase()}
              </p>
            </div>
            <span style={{ color: '#ff6600', fontWeight: 'bold' }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subcategories;
