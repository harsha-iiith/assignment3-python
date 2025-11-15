import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const res = await axios.post(`${API}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (res.data?.success) {
        login({
          email: formData.email,
          role: formData.role,
          isAuthenticated: true,
          token: res.data.token
        });

        const redirectPath = formData.role === 'student' ? '/' : `/${formData.role}`;
        navigate(redirectPath, { replace: true });
      } else {
        setError(res.data?.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };
 
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>VidhyaVichaar Login</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>User Id:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <div className="role-selection">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleInputChange}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="ta"
                  checked={formData.role === 'ta'}
                  onChange={handleInputChange}
                />
                TA
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={formData.role === 'teacher'}
                  onChange={handleInputChange}
                />
                Teacher
              </label>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
