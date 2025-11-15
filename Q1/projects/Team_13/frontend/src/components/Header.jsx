import React from 'react';

const Header = ({ title, subtitle, showBackButton = false, onBackClick }) => {
  return (
    <div className="header">
      <div className="container">
        <div className="header-main">
          <div className="header-content">
            {showBackButton && (
              <button 
                className="btn btn-secondary"
                onClick={onBackClick}
                style={{ marginBottom: '15px' }}
              >
                ← Back to Dashboard
              </button>
            )}
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
