import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlaceholderImage from '../components/PlaceholderImage';

const StylistProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stylistId = queryParams.get('id') || '1';
  const appointmentId = queryParams.get('appointmentId') || 'dummy-123';
  const category = queryParams.get('category') || 'Men';

  const [activeTab, setActiveTab] = useState('services'); // 'services' or 'profile'
  const [selectedServices, setSelectedServices] = useState(location.state?.selectedServices || []);

  // Dummy data based on ID
  const getStylistDetails = () => {
    const stylists = {
      '1': { id: '1', name: 'Rahul', img: 'stylist_1.jpg', location: 'RR Nagar, Bangalore', exp: '5 Years', bio: 'Expert in modern fades and beard trims. Uses premium organic products.' },
      '2': { id: '2', name: 'Henna', img: 'stylist_2.jpg', location: 'Jayanagar, Bangalore', exp: '8 Years', bio: 'Specializes in bridal makeup, hair coloring, and keratin treatments.' },
      '3': { id: '3', name: 'Putin', img: 'stylist_3.jpg', location: 'Indiranagar, Bangalore', exp: '10 Years', bio: 'Master hair stylist with international experience in cutting-edge styles.' }
    };
    const categoryStylists = {
      Women: {
        '1': { id: '1', name: 'Ananya', img: 'women_stylist_1.jpg', location: 'Koramangala, Bangalore', exp: '7 Years', bio: 'Specialist in bridal makeup, hair styling, and occasion-ready beauty looks.' },
        '2': { id: '2', name: 'Meera', img: 'women_stylist_2.jpg', location: 'Jayanagar, Bangalore', exp: '6 Years', bio: 'Known for beautiful hair color, skin care rituals, and relaxed salon experiences.' },
        '3': { id: '3', name: 'Riya', img: 'women_stylist_3.jpg', location: 'Indiranagar, Bangalore', exp: '5 Years', bio: 'Creates polished facials, nail care, and everyday styling tailored to each guest.' }
      },
      Children: {
        '1': { id: '1', name: 'Aarav', img: 'children_stylist_1.jpg', location: 'Whitefield, Bangalore', exp: '5 Years', bio: 'A patient kids stylist who makes haircuts comfortable, calm, and fun.' },
        '2': { id: '2', name: 'Sia', img: 'children_stylist_2.jpg', location: 'HSR Layout, Bangalore', exp: '4 Years', bio: 'Specializes in gentle hair care and playful styles for young guests.' },
        '3': { id: '3', name: 'Kabir', img: 'children_stylist_3.jpg', location: 'Indiranagar, Bangalore', exp: '6 Years', bio: 'Experienced in comfort-first cuts, washes, and easy-to-maintain kids styles.' }
      }
    };
    return categoryStylists[category]?.[stylistId] || stylists[stylistId] || stylists['1'];
  };

  const stylist = getStylistDetails();

  const servicesList = [
    { id: 'srv1', name: 'Classic Hair Cut', duration: '30 mins', price: 250 },
    { id: 'srv2', name: 'Fade & Beard Trim', duration: '45 mins', price: 400 },
    { id: 'srv3', name: 'Hair Coloring', duration: '1.5 hours', price: 1200 },
    { id: 'srv4', name: 'Keratin Spa', duration: '1 hour', price: 850 },
  ];

  const toggleService = (service) => {
    const exists = selectedServices.find(s => s.id === service.id);
    if (exists) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const getTotalRate = () => {
    return selectedServices.reduce((total, s) => total + s.price, 0);
  };

  const handleProceed = () => {
    navigate('/cart', { 
      state: { 
        selectedServices, 
        stylist, 
        appointmentId 
      } 
    });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: selectedServices.length > 0 ? '80px' : '20px', position: 'relative' }}>
      {/* Top Half */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', margin: '0 0 20px 0' }}>
          <span style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(-1)}>←</span>
          Stylist Profile
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <PlaceholderImage name={stylist.img} width="100px" height="100px" style={{ borderRadius: '50%', border: '3px solid #ff6600', marginBottom: '15px' }} />
          <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#333' }}>{stylist.name}</h2>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '5px' }}>📍</span> {stylist.location}
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
             <button style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#ff6600', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>Book Now</button>
             <button style={{ padding: '8px 20px', borderRadius: '20px', border: '1px solid #ff6600', backgroundColor: 'white', color: '#ff6600', fontSize: '12px', fontWeight: 'bold' }}>Message</button>
          </div>
        </div>
      </div>

      {/* Bottom Half Tabs */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '10px', padding: '5px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <div 
            onClick={() => setActiveTab('services')}
            style={{ 
              flex: 1, textAlign: 'center', padding: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px',
              backgroundColor: activeTab === 'services' ? '#ff6600' : 'transparent',
              color: activeTab === 'services' ? 'white' : '#666'
            }}>
            Services
          </div>
          <div 
            onClick={() => setActiveTab('profile')}
            style={{ 
              flex: 1, textAlign: 'center', padding: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px',
              backgroundColor: activeTab === 'profile' ? '#ff6600' : 'transparent',
              color: activeTab === 'profile' ? 'white' : '#666'
            }}>
            Profile
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'services' ? (
          <div>
            <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '15px' }}>Popular Services</h3>
            {servicesList.map((service) => {
              const isSelected = selectedServices.find(s => s.id === service.id);
              return (
                <div key={service.id} style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.03)', border: isSelected ? '1px solid #ff6600' : '1px solid transparent' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#333' }}>{service.name}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{service.duration}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#ff6600', fontWeight: 'bold' }}>₹{service.price}</p>
                    <button 
                      onClick={() => toggleService(service)}
                      style={{ 
                        padding: '4px 12px', 
                        border: '1px solid #ff6600', 
                        backgroundColor: isSelected ? '#ff6600' : 'transparent', 
                        color: isSelected ? 'white' : '#ff6600', 
                        borderRadius: '4px', 
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      {isSelected ? 'REMOVE' : 'ADD'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', color: '#333', marginTop: 0 }}>About {stylist.name}</h3>
            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '15px' }}>{stylist.bio}</p>
            
            <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '5px' }}>Experience</h4>
            <p style={{ fontSize: '13px', color: '#666', marginTop: 0 }}>{stylist.exp} in professional grooming.</p>
            
            <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '5px' }}>Languages</h4>
            <p style={{ fontSize: '13px', color: '#666', marginTop: 0 }}>English, Hindi, Kannada</p>
          </div>
        )}
      </div>

      {/* Floating Proceed Bar */}
      {selectedServices.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '400px', margin: '0 auto', backgroundColor: '#fff', padding: '15px 20px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{selectedServices.length} items added</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Total: ₹{getTotalRate()}</p>
          </div>
          <button 
            onClick={handleProceed}
            style={{ backgroundColor: '#ff6600', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Proceed to Book
          </button>
        </div>
      )}

    </div>
  );
};

export default StylistProfile;
