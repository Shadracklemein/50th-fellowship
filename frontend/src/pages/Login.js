import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        setSuccess('Login successful!');
        setTimeout(() => {
          navigate('/members');
        }, 1000);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 300 }}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
      </form>
    </div>
  );
}

export default Login; 