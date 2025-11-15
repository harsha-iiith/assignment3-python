import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { authService } from '../services/authService';

const SignupPage = () => {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Get role from location state if available
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const register = async (userData, role) => {
    try {
      let result;
      if (role === 'student') {
        result = await authService.registerStudent(userData);
      } else {
        result = await authService.registerTeacher(userData);
      }
      if (result.success) {
        // Optionally, you can dispatch loginSuccess(result.data) to auto-login
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (role === 'student' && !rollNumber.trim()) {
      setError('Please enter your roll number');
      setLoading(false);
      return;
    }

    const userData = role === 'student' 
      ? { name: name.trim(), email: email.trim(), password, rollNumber: rollNumber.trim() }
      : { name: name.trim(), email: email.trim(), password };

    const result = await register(userData, role);
    
    if (result.success) {
      // Registration successful, redirect to login
      navigate('/login', { 
        state: { role },
        replace: true 
      });
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Join VidyaVichara
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
            Register as:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`btn ${role === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
            >
              👨‍🏫 Teacher
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          {role === 'student' && (
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                className="form-input"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your roll number"
                required
                disabled={loading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={loading || !name.trim() || !email.trim() || !password.trim() || (role === 'student' && !rollNumber.trim())}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" state={{ role }} style={{ color: '#667eea', textDecoration: 'none' }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
