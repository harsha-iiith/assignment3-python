import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout, inSession } = useAuthContext();

  if (!user) return null;

  const getRoleName = (role) => {
    if (role === "instructor") return "Professor";
    if (role === "student") return "Student";
    return role;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          VidyaVichar
        </div>
        <div className="nav">
          <Link to="/profile" className="nav-link">
            👤 Profile
          </Link>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "1rem",
            color: "var(--text-secondary)"
          }}>
            <span style={{ 
              background: "var(--primary-gradient)",
              color: "white",
              padding: "0.25rem 0.75rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              fontWeight: "500"
            }}>
              {getRoleName(user.role)}
            </span>
            <strong style={{ color: "var(--text-primary)" }}>{user.name}</strong>
          </div>
          <button 
            onClick={logout} 
            className={inSession ? "btn-outline" : "btn-outline"}
            style={{ 
              opacity: inSession ? 0.6 : 1,
              cursor: inSession ? "not-allowed" : "pointer"
            }}
            title={inSession ? "Cannot logout while in an active session" : "Logout"}
          >
            {inSession ? "🔒 In Session" : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
