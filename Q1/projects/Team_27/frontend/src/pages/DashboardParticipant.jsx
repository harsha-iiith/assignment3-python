import React, { useEffect, useState } from "react";
import { getMySessions } from "../api/sessionApi";
import { getUpdates } from "../api/updateApi";
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function DashboardParticipant() {
  const { user, logout } = useAuthContext();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMySessions();
        
        // For each completed session, check if there are unseen updates
        const sessionsWithUpdates = await Promise.all(
          data.map(async (session) => {
            if (session.status === 'completed') {
              try {
                const updates = await getUpdates(session.sessionId);
                return {
                  ...session,
                  hasUpdates: updates.updates && updates.updates.length > 0
                };
              } catch (err) {
                console.warn("Could not fetch updates for session", session.sessionId, err);
                return { ...session, hasUpdates: false };
              }
            }
            return { ...session, hasUpdates: false };
          })
        );
        
        setSessions(sessionsWithUpdates);
      } catch (e) {
        console.error("Error loading sessions:", e);
        alert("Failed to load sessions. Please refresh the page.");
      }
    })();
  }, []);

  return (
    <div className="container fade-in">
      <div className="text-center mb-8">
        <h1>Welcome Back, {user?.name}!</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
          Your Learning Sessions
        </p>
      </div>

      <section>
        <div className="card-header">
          <h2 className="card-title">Active Sessions</h2>
          <p className="card-subtitle">Enrolled courses and TA sessions</p>
        </div>
        
        {sessions.length === 0 ? (
          <div className="card text-center">
            <div style={{ padding: "var(--space-8)" }}>
              <div style={{ 
                fontSize: "3rem", 
                color: "var(--text-muted)", 
                marginBottom: "var(--space-4)" 
              }}>
                📚
              </div>
              <h3 style={{ color: "var(--text-muted)" }}>No Sessions Available</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                You're not enrolled in any sessions yet. Check back later or contact your instructor.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {sessions.map(s => (
              <div key={s.sessionId} className="card">
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "var(--space-4)"
                }}>
                  <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <h3 className="card-title" style={{ margin: 0, marginBottom: "var(--space-2)" }}>
                        {s.courseName}
                      </h3>
                      {/* Update indicator for completed sessions with new content */}
                      {s.status === 'completed' && s.hasUpdates && (
                        <div style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "var(--error-color)",
                          animation: "pulse 2s infinite",
                          marginLeft: "var(--space-1)"
                        }} title="New updates since your last visit"></div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                      <span style={{
                        background: s.status === 'active' ? 'var(--success-color)' : 'var(--text-muted)',
                        color: 'white',
                        padding: "var(--space-1) var(--space-3)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        textTransform: "capitalize"
                      }}>
                        {s.status}
                      </span>
                      {/* Show update badge for sessions with new content */}
                      {s.status === 'completed' && s.hasUpdates && (
                        <span style={{
                          background: "var(--error-color)",
                          color: "white",
                          padding: "var(--space-1) var(--space-2)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}>
                          🔔 NEW
                        </span>
                      )}
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                        📅 {new Date(s.startAt).toLocaleDateString()} at {new Date(s.startAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Link 
                      to={`/session/${s.sessionId}`}
                      style={{
                        textDecoration: "none",
                        background: s.status === 'live' ? "var(--primary-gradient)" : 
                                   s.status === 'active' ? "var(--info-color)" : 
                                   "var(--text-secondary)",
                        color: "white",
                        padding: "var(--space-2) var(--space-4)",
                        borderRadius: "var(--radius-md)",
                        fontWeight: "500",
                        transition: "var(--transition-normal)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-2)"
                      }}
                      onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                      onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                    >
                      {s.status === 'live' ? '🔴 Join Live Session' :
                       s.status === 'active' ? '📅 Join Session' :
                       s.status === 'completed' ? '📚 View Archive' : 
                       '👁️ View Session'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
