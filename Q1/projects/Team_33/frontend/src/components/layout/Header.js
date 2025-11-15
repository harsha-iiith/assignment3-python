import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/dashboard" className="header-title">
            VidyaVichara
          </Link>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name || user?.email}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button onClick={() => {
            if (onLogout) {
              onLogout();
            }
          }} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
