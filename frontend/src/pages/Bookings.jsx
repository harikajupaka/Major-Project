import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('/api/appointments/my-bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>My Bookings</h2>
      
      {loading ? (
        <p>Loading your appointments...</p>
      ) : bookings.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>You have no confirmed bookings yet.</p>
          <button 
            onClick={() => navigate('/home')}
            style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#ff6600', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
          >
            Explore Services
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {bookings.map((booking) => {
            const stylistMap = {
              '1': { id: '1', name: 'Rahul/Ananya/Aarav', img: 'stylist_1.jpg' },
              '2': { id: '2', name: 'Henna/Meera/Sia', img: 'stylist_2.jpg' },
              '3': { id: '3', name: 'Putin/Riya/Kabir', img: 'stylist_3.jpg' }
            };
            const mockStylist = stylistMap[booking.stylistId] || { id: '1', name: 'Stylist', img: 'stylist_1.jpg' };
            
            let storedServices = [];
            if (booking.servicesJson) {
              try {
                storedServices = JSON.parse(booking.servicesJson);
              } catch(e) {}
            }
            
            return (
              <div 
                key={booking.id} 
                onClick={() => navigate('/cart', { state: { appointmentId: booking.id, stylist: mockStylist, selectedServices: storedServices } })}
                style={{ backgroundColor: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '4px solid #ff6600', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Booking #{booking.id.substring(0,8)}</span>
                  <span style={{ fontSize: '12px', color: '#ff6600', fontWeight: 'bold', backgroundColor: '#fff3e0', padding: '3px 8px', borderRadius: '10px' }}>Confirmed</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
                    <strong>Date & Time:</strong> {booking.dateAndTime}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
                    <strong>Category:</strong> {booking.mainCategory} &gt; {booking.subCategory}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
