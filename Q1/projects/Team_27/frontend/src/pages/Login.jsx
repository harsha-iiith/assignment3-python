import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const resp = await login(email, password);
    if (!resp.success) setErr(resp.message || "Login failed");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "var(--space-4)"
    }}>
      <div className="container fade-in" style={{ maxWidth: 420, margin: 0 }}>
        <div className="text-center mb-8">
          <h1>VidyaVichar</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.125rem" }}>
            Interactive Classroom Q&A Platform
          </p>
        </div>
        
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Enter your email address"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>
          
          {err && (
            <div className="toast error mb-4" style={{ 
              position: "static", 
              animation: "none",
              background: "rgba(239, 68, 68, 0.1)",
              color: "var(--error-color)",
              textAlign: "center"
            }}>
              {err}
            </div>
          )}
          
          <button type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <div className="spinner" style={{ width: 20, height: 20, margin: 0 }}></div>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="text-center mt-6 p-4" style={{ 
          background: "var(--background-secondary)", 
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)"
        }}>
          <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>
            <strong>Demo Accounts:</strong> No registration needed<br/>
            Use pre-seeded participant credentials
          </p>
        </div>
      </div>
    </div>
  );
}
