import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerify = () => {
    // Call backend API here
    if (otp.length === 6) {
      navigate('/home');
    } else {
      alert('Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', marginTop: '50px' }}>
      <h2>Enter your OTP</h2>
      <p style={{ color: '#666' }}>Enter the code we sent to your number</p>
      
      <div style={{ margin: '30px 0' }}>
        <input 
          type="text" 
          placeholder="000000" 
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ padding: '10px', fontSize: '24px', letterSpacing: '10px', width: '200px', textAlign: 'center', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <p style={{ color: '#ff6600', cursor: 'pointer', textAlign: 'left', marginLeft: '10%' }}>Resend</p>
      
      <button 
        onClick={handleVerify}
        style={{
          padding: '12px 24px',
          backgroundColor: '#ffd9b3',
          color: '#ff6600',
          border: 'none',
          borderRadius: '24px',
          marginTop: '20px',
          cursor: 'pointer',
          width: '80%',
          maxWidth: '300px',
          fontWeight: 'bold'
        }}
      >
        Verifying
      </button>
    </div>
  );
};

export default VerifyOtp;
