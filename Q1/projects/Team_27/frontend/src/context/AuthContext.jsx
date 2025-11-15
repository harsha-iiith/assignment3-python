import React, { createContext, useState, useEffect, useContext } from "react";
import { login as apiLogin } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("vv_token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("vv_user") || "null"));
  const [loading, setLoading] = useState(false);
  const [inSession, setInSession] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem("vv_token", token);
    else localStorage.removeItem("vv_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("vv_user", JSON.stringify(user));
    else localStorage.removeItem("vv_user");
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { token: t, user: u } = await apiLogin(email, password);
      setToken(t);
      setUser(u);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const logout = () => {
    if (inSession) {
      if (!window.confirm("You are currently in an active session. Are you sure you want to logout? This will disconnect you from the session.")) {
        return;
      }
    }
    setToken(null);
    setUser(null);
    setInSession(false);
  };

  const setSessionState = (isInSession) => {
    setInSession(isInSession);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, inSession, setSessionState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
