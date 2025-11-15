import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from '../store/slices/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to={'/'} className="logo">
            VidyaVichara
          </Link>
          
          <nav className="nav-links">
            <div className="user-info">
              <span>
                {isAuthenticated && user ? `Welcome, ${user.name}` : 'Welcome, Guest'}
              </span>
            </div>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
