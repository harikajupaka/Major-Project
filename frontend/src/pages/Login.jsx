import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../api/apiUrl';

function Login() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, password })
      });

      const data = await response.json();
      if (data.success) {
        const otpResponse = await fetch(apiUrl('/api/auth/otp/send'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobileNumber })
        });
        const otpData = await otpResponse.json();
        if (!otpResponse.ok || !otpData.success) {
          setError(otpData.message || 'Could not send OTP.');
          return;
        }
        sessionStorage.setItem('pendingLogin', JSON.stringify({
          token: data.token,
          name: data.name,
          mobileNumber: data.mobileNumber,
          debugCode: otpData.debugCode
        }));
        navigate('/verify-otp');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-panel">
        <div className="auth-kicker">AURA Studio</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to discover your next salon experience.</p>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <label>
            <span>Mobile number</span>
            <input 
              type="text" 
              inputMode="tel"
              autoComplete="tel"
              maxLength={14}
              placeholder="+919876543210"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required 
            />
          </label>
          <label>
            <span>Password</span>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </label>
          <button className="auth-submit"
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          New to AURA? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
