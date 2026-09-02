import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide a rating!");
      return;
    }
    // Simulate API call for feedback
    alert("Thank you for your valuable feedback!");
    navigate('/home');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '350px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Rate Your Experience</h2>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>How was your appointment booking process?</p>

        {/* Star Rating */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star} 
              onClick={() => setRating(star)}
              style={{ fontSize: '30px', cursor: 'pointer', color: star <= rating ? '#ffcc00' : '#e0e0e0' }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment Box */}
        <textarea 
          placeholder="Tell us what you liked or how we can improve..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', minHeight: '100px', boxSizing: 'border-box', marginBottom: '20px', fontFamily: 'sans-serif', fontSize: '13px' }}
        />

        <button 
          onClick={handleSubmit}
          style={{ width: '100%', padding: '12px', backgroundColor: '#ff6600', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Submit Feedback
        </button>
        
        <button 
          onClick={() => navigate('/home')}
          style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#666', border: 'none', marginTop: '10px', fontSize: '12px', cursor: 'pointer' }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default Feedback;
