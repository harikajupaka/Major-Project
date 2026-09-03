import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlaceholderImage from '../components/PlaceholderImage';

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract state passed from StylistProfile
  const { selectedServices = [], stylist = null, appointmentId = null } = location.state || {};

  const [date, setDate] = useState('2024-05-10');
  const [time, setTime] = useState('09:30');
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi there! I am the Kiranmai Studio bot. How can I help you with your booking today?' }
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'user', text: chatInput };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    
    // Simulate bot reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'bot', text: "Thanks for reaching out! This is a demo bot, so I can't actually do anything yet, but your message was received." }]);
    }, 1000);
  };

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
      const servicesJson = encodeURIComponent(JSON.stringify(displayServices));
      const response = await fetch(`/api/appointments/${appointmentId}/confirm?dateAndTime=${date} ${time}&servicesJson=${servicesJson}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        alert('Request sent successfully!');
        navigate('/feedback', { state: { fromCheckout: true } });
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
      <p onClick={() => navigate('/stylist-profile?id=' + (displayStylist.id || '1'), { state: location.state })} style={{ textAlign: 'right', color: '#ff6600', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Add more ...</p>
      
      <h4 style={{ fontSize: '14px', marginTop: '20px', marginBottom: '10px' }}>Booking details</h4>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '10px', color: '#ff6600' }}>Appointment date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '10px', color: '#ff6600' }}>Appointment Time</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
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
        <button 
          onClick={() => setIsChatOpen(true)}
          style={{ flex: 1, padding: '10px', backgroundColor: '#ff9933', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          💬 Chat
        </button>
      </div>

      {isChatOpen && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', width: '300px', height: '400px',
          backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 100
        }}>
          <div style={{ backgroundColor: '#ff6600', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>🤖 Support Bot</span>
            <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>✕</button>
          </div>
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f9f9f9' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                backgroundColor: msg.sender === 'bot' ? '#e0e0e0' : '#ff9933',
                color: msg.sender === 'bot' ? '#333' : 'white',
                padding: '8px 12px', borderRadius: '15px', maxWidth: '80%', fontSize: '13px'
              }}>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..." 
              style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '20px', outline: 'none' }} 
            />
            <button onClick={handleSendMessage} style={{ background: '#ff6600', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer' }}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
