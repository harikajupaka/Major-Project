import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../api/apiUrl';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const pendingLogin = JSON.parse(sessionStorage.getItem('pendingLogin') || 'null');

  const handleResend = async () => {
    if (!pendingLogin) {
      navigate('/');
      return;
    }
    setResending(true);
    setError('');
    setNotice('');
    try {
      const response = await fetch(apiUrl('/api/auth/otp/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: pendingLogin.mobileNumber })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'Could not resend OTP.');
        return;
      }
      sessionStorage.setItem('pendingLogin', JSON.stringify({ ...pendingLogin, debugCode: data.debugCode }));
      setNotice(data.debugCode ? `Development OTP: ${data.debugCode}` : 'A new OTP was sent by SMS.');
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (!pendingLogin || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(apiUrl('/api/auth/otp/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: pendingLogin.mobileNumber, otp })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || 'OTP verification failed.');
        return;
      }
      localStorage.setItem('token', pendingLogin.token);
      localStorage.setItem('user', JSON.stringify({ name: pendingLogin.name, mobileNumber: pendingLogin.mobileNumber }));
      sessionStorage.removeItem('pendingLogin');
      navigate('/home');
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', marginTop: '50px' }}>
      <h2>Enter your OTP</h2>
      <p style={{ color: '#666' }}>Enter the code we sent to your number</p>
      {pendingLogin?.debugCode && <p style={{ color: '#666' }}>Development OTP: {pendingLogin.debugCode}</p>}
      {notice && <p style={{ color: '#3d4936' }}>{notice}</p>}
      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      
      <div style={{ margin: '30px 0' }}>
        <input 
          type="text" 
          placeholder="000000" 
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          style={{ padding: '10px', fontSize: '24px', letterSpacing: '10px', width: '200px', textAlign: 'center', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        style={{ background: 'none', border: 0, color: '#ff6600', cursor: 'pointer', textAlign: 'left', padding: 0 }}
      >
        {resending ? 'Sending...' : 'Resend OTP'}
      </button>
      
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
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
};

export default VerifyOtp;
