import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlaceholderImage from '../components/PlaceholderImage';

const Stylists = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get('appointmentId');
  const category = queryParams.get('category') || 'Men';
  const [loading, setLoading] = useState(false);

  const stylistSets = {
    Women: [
      { id: 'S1', name: 'Ananya', img: 'women_stylist_1.jpg', specialty: 'Bridal makeup, Hair styling', exp: '7 years', rating: 4.9 },
      { id: 'S2', name: 'Meera', img: 'women_stylist_2.jpg', specialty: 'Hair coloring, Skin care', exp: '6 years', rating: 4.8 },
      { id: 'S3', name: 'Riya', img: 'women_stylist_3.jpg', specialty: 'Facials, Nail care', exp: '5 years', rating: 4.7 }
    ],
    Children: [
      { id: 'S1', name: 'Aarav', img: 'children_stylist_1.jpg', specialty: 'Gentle haircuts, Kids styling', exp: '5 years', rating: 4.8 },
      { id: 'S2', name: 'Sia', img: 'children_stylist_2.jpg', specialty: 'Kids hair care, Fun styling', exp: '4 years', rating: 4.7 },
      { id: 'S3', name: 'Kabir', img: 'children_stylist_3.jpg', specialty: 'Comfort cuts, Hair wash', exp: '6 years', rating: 4.9 }
    ],
    Men: [
      { id: 'S1', name: 'Rahul', img: 'stylist_1.jpg', specialty: 'Hair cut, Herbal facial', exp: '4 years', rating: 4.0 },
      { id: 'S2', name: 'Putin', img: 'stylist_3.jpg', specialty: 'French beard trim, Hair coloring', exp: '3 years', rating: 4.5 },
      { id: 'S3', name: 'Henna', img: 'stylist_2.jpg', specialty: 'Head massage, Hair spa', exp: '6 years', rating: 4.2 }
    ]
  };

  const stylists = stylistSets[category] || stylistSets.Men;

  const selectStylist = async (stylistId) => {
    if (!appointmentId) {
      navigate('/cart');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login first");
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/stylist?stylistId=${stylistId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const profileId = stylistId.replace('S', '');
        navigate(`/stylist-profile?id=${profileId}&appointmentId=${appointmentId}&category=${category}`);
      } else {
        alert("Failed to select stylist");
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
      <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
        <span style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(-1)}>←</span>
        {category} Stylists {loading && <span style={{marginLeft: '10px', fontSize: '12px', color: 'gray'}}>(Loading...)</span>}
      </h2>
      
      <div style={{ display: 'flex', gap: '10px', margin: '15px 0', overflowX: 'auto' }}>
        <button style={{ padding: '5px 10px', borderRadius: '15px', border: '1px solid #ff6600', backgroundColor: 'white', color: '#ff6600' }}>Sort by</button>
        <button style={{ padding: '5px 10px', borderRadius: '15px', border: '1px solid #ccc', backgroundColor: 'white' }}>city</button>
        <button style={{ padding: '5px 10px', borderRadius: '15px', border: '1px solid #ccc', backgroundColor: 'white' }}>language</button>
      </div>
      
      <div>
        {stylists.map((s) => (
          <div key={s.id} onClick={() => selectStylist(s.id)} style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px', cursor: 'pointer' }}>
            <div style={{ marginRight: '15px' }}>
              <PlaceholderImage name={s.img} width="60px" height="60px" style={{ borderRadius: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{s.name}</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>{s.specialty}</p>
              <p style={{ margin: '0 0 5px 0', fontSize: '10px', color: '#999' }}>{s.exp}</p>
              <div style={{ color: '#ff9900', fontSize: '12px' }}>{'★'.repeat(Math.floor(s.rating))}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                style={{ backgroundColor: 'white', color: '#ff6600', border: 'none', cursor: 'pointer', fontSize: '12px' }}
              >
                select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stylists;
