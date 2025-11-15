import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      gap: '8px',
      backgroundColor: 'white',
      padding: '12px 20px',
      borderRadius: '25px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      border: '2px solid #e5e7eb',
      alignItems: 'center'
    }}>
      <span style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#667eea',
        marginRight: '8px'
      }}>
        {user?.email} ({user?.role})
      </span>
      
      <button
        onClick={handleLogout}
        style={{ 
          padding: '10px 16px', 
          fontSize: '14px',
          fontWeight: '600',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
      >
        Logout
      </button>
      
    </div>
  );
};

export default Navigation;
