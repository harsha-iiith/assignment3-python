import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#667eea' }}>
          VidyaVichara
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#666' }}>
          Interactive Classroom Q&A Board
        </p>
        <p style={{ marginBottom: '40px', lineHeight: '1.6' }}>
          Engage in real-time learning with our sticky note Q&A system. 
          Students can post questions during lectures, and instructors can 
          organize, mark, and manage them efficiently.
        </p>
        
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
            Go to Dashboard
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
              Get Started
            </Link>
          </div>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '50px' }}>
        <div className="card">
          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>🎓 For Students</h3>
          <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
            <li>Post questions during lectures</li>
            <li>Join classes with access codes</li>
            <li>View your question history</li>
            <li>Real-time interaction</li>
          </ul>
        </div>
        
        <div className="card">
          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>👨‍🏫 For Instructors</h3>
          <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
            <li>Create and manage classes</li>
            <li>Generate access codes</li>
            <li>Mark questions as answered</li>
            <li>Filter and organize questions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
