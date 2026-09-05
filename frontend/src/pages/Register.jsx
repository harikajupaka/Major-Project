import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../api/apiUrl';

function Register() {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: '',
    name: '',
    age: '',
    gender: 'Male'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10)
      };

      const response = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        navigate('/');
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-panel auth-panel-wide">
        <div className="auth-kicker">AURA Studio</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">A calmer, more personal way to book your care.</p>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <div>
            <label>Full name</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange} required
            />
          </div>
          <div>
            <label>Mobile number</label>
            <input 
              type="text" name="mobileNumber" placeholder="+919876543210" value={formData.mobileNumber} onChange={handleChange} required
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" name="password" value={formData.password} onChange={handleChange} required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label>Age</label>
              <input 
                type="number" name="age" value={formData.age} onChange={handleChange} required
              />
            </div>
            <div className="flex-1">
              <label>Gender</label>
              <select 
                name="gender" value={formData.gender} onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Children">Children</option>
              </select>
            </div>
          </div>
          <button className="auth-submit"
            type="submit" disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
