import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [stylists, setStylists] = useState([]);
  const [selectedStylistId, setSelectedStylistId] = useState('');
  const [selectedStylistData, setSelectedStylistData] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/stylist/all')
      .then(response => setStylists(response.data))
      .catch(err => console.error('Error fetching stylists:', err));
  }, []);

  const handleStylistChange = (e) => {
    const id = e.target.value;
    setSelectedStylistId(id);
    const found = stylists.find(s => String(s.id) === String(id));
    setSelectedStylistData(found || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      customerId: "CUST101",
      stylistId: selectedStylistId,
      ratingValue: ratingValue ? parseInt(ratingValue) : null,
      reviewText: reviewText
    };

    axios.post('http://localhost:8080/api/stylist/rating/submit', payload)
      .then(response => {
        setMessage(response.data.message);
        setRatingValue(0);
        setReviewText('');
      })
      .catch(err => {
        if (err.response && err.response.data) {
          setError(`Error (${err.response.data.error}): ${err.response.data.message}`);
        } else {
          setError('Server error. Make sure your Spring Boot backend is running.');
        }
      });
  };

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: '32px' }}>
        
        {/* Header */}
        <h2 style={{ color: '#1e293b', textAlign: 'center', marginTop: 0, marginBottom: '24px', fontSize: '24px' }}>
          ✨ Stylist Selection & Rating
        </h2>

        {/* Success & Error Banner Messages */}
        {message && (
          <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Stylist Dropdown */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '14px' }}>
              Select Stylist
            </label>
            <select 
              value={selectedStylistId} 
              onChange={handleStylistChange}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none' }}
            >
              <option value="">-- Choose Stylist --</option>
              {stylists.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Dynamic Stylist Info Card */}
          {selectedStylistData && (
            <div style={{ backgroundColor: '#f0f9ff', borderLeft: '4px solid #0284c7', padding: '14px 18px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#0369a1', fontSize: '16px' }}>{selectedStylistData.name}</h4>
              <p style={{ margin: '3px 0', fontSize: '13px', color: '#334155' }}>
                <strong>Specialization:</strong> {selectedStylistData.specialization}
              </p>
              <p style={{ margin: '3px 0', fontSize: '13px', color: '#334155' }}>
                <strong>Current Rating:</strong> <span style={{ color: '#d97706', fontWeight: 'bold' }}>★ {selectedStylistData.rating || 'N/A'}</span>
              </p>
            </div>
          )}

          {/* Star Rating Select */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '14px' }}>
              Rating (1 - 5 Stars)
            </label>
            <select 
              value={ratingValue} 
              onChange={(e) => setRatingValue(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none' }}
            >
              <option value={0}>-- Select Rating --</option>
              <option value={1}>⭐ 1 - Poor</option>
              <option value={2}>⭐⭐ 2 - Fair</option>
              <option value={3}>⭐⭐⭐ 3 - Average</option>
              <option value={4}>⭐⭐⭐⭐ 4 - Good</option>
              <option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option>
            </select>
          </div>

          {/* Review Comments */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '14px' }}>
              Review Comments
            </label>
            <textarea 
              rows="3" 
              value={reviewText} 
              onChange={(e) => setReviewText(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
              placeholder="Share your experience..."
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;