import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token,
            user,
          },
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token was removed from another tab, logout this tab too
        dispatch({ type: 'LOGOUT' });
      } else if (e.key === 'user' && e.newValue) {
        // User data was updated from another tab
        try {
          const user = JSON.parse(e.newValue);
          const token = localStorage.getItem('token');
          if (token) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                token,
                user,
              },
            });
          }
        } catch (error) {
          console.error('Error parsing updated user data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authAPI.login(credentials);
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
          token: data.token,
        },
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await authAPI.register(userData);
      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: userData.name,
        email: data.email,
        role: userData.role || 'student',
      }));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            _id: data._id,
            name: userData.name,
            email: data.email,
            role: userData.role || 'student',
          },
          token: data.token,
        },
      });

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    // Check if user is in a class
    const currentPath = window.location.pathname;
    const isInClass = currentPath.includes('/class/');
    
    if (isInClass) {
      // Show exit message
      const confirmed = window.confirm('You are currently in a class. Are you sure you want to exit? You can join later.');
      if (!confirmed) {
        return; // Don't logout if user cancels
      }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'token',
      newValue: null,
      oldValue: localStorage.getItem('token')
    }));
    dispatch({ type: 'LOGOUT' });
    // Redirect to login page
    window.location.href = '/login';
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
