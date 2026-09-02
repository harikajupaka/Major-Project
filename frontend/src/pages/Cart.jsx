import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlaceholderImage from '../components/PlaceholderImage';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract state passed from StylistProfile
  const { selectedServices = [], stylist = null, appointmentId = null } = location.state || {};

  const [date, setDate] = useState('10/May/ 2024');
  const [time, setTime] = useState('9:30 AM');
  const [loading, setLoading] = useState(false);

  // Fallbacks if user reloads the page without state
  const displayStylist = stylist || { name: 'putin', img: 'putin_profile.jpg' };
  const displayServices = selectedServices.length > 0 ? selectedServices : [
    { name: 'Hair dye', duration: '50 min', price: 150 },
    { name: 'Hair cut', duration: '1 hour', price: 600 }
  ];

  const totalRate = displayServices.reduce((total, s) => total + (s.price || 0), 0);

  const confirmAppointment = async () => {
    if (!appointmentId) {
      alert("No appointment to confirm");
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
      const response = await fetch(`http://localhost:8080/api/appointments/${appointmentId}/confirm?dateAndTime=${date} ${time}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        alert('Request sent successfully!');
        navigate('/feedback');
      } else {
        alert("Failed to confirm appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', paddingBottom: '40px' }}>
      <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(-1)}>←</span>
        Service request
      </h2>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <PlaceholderImage name={displayStylist.img} width="60px" height="60px" style={{ borderRadius: '50%', marginRight: '15px' }} />
        <h3 style={{ margin: 0 }}>{displayStylist.name}</h3>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '14px', margin: '0 0 5px 0' }}>Service Address</h4>
        <p style={{ fontSize: '12px', color: '#666', margin: 0, display: 'flex', justifyContent: 'space-between' }}>
          <span>📍 RR nagar, Banglore</span>
          <span style={{ color: '#ff6600', cursor: 'pointer' }}>Change address</span>
        </p>
      </div>
      
      <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Selected Services</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <th style={{ textAlign: 'left', padding: '8px 0' }}>Services</th>
            <th style={{ textAlign: 'left', padding: '8px 0' }}>Duration</th>
            <th style={{ textAlign: 'left', padding: '8px 0' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {displayServices.map((service, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 0', color: '#333' }}>{service.name}</td>
              <td style={{ padding: '8px 0', color: '#666' }}>{service.duration}</td>
              <td style={{ padding: '8px 0', fontWeight: 'bold' }}>₹{service.price}</td>
            </tr>
          ))}
          <tr style={{ backgroundColor: '#fff3e0' }}>
            <td colSpan="2" style={{ padding: '12px 8px', fontWeight: 'bold', color: '#ff6600' }}>Total Amount</td>
            <td style={{ padding: '12px 0', fontWeight: 'bold', color: '#ff6600' }}>₹{totalRate}</td>
          </tr>
        </tbody>
      </table>
      <p style={{ textAlign: 'right', color: '#ff6600', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Add more ...</p>
      
      <h4 style={{ fontSize: '14px', marginTop: '20px', marginBottom: '10px' }}>Booking details</h4>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '10px', color: '#ff6600' }}>Appointment date</label>
          <input type="text" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '10px', color: '#ff6600' }}>Appointment Time</label>
          <input type="text" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
      </div>
      
      <button 
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#ccc' : '#ff6600',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: loading ? 'default' : 'pointer',
          marginBottom: '20px'
        }}
        onClick={confirmAppointment}
      >
        {loading ? 'Confirming...' : `Request for service (₹${totalRate})`}
      </button>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={{ flex: 1, padding: '10px', backgroundColor: '#ff9933', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>📞 Call</button>
        <button style={{ flex: 1, padding: '10px', backgroundColor: '#ff9933', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>💬 Chat</button>
      </div>
    </div>
  );
};

export default Cart;
