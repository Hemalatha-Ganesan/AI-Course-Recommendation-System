import React, { createContext, useState, useContext } from 'react';
import API from '../api/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );

  // Token is handled by API interceptor in api.js
  // No need to manually set headers here

  // ── LOGIN ──────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      // Handle both success: true and direct user response formats
      const loggedInUser = response.data.user || response.data;
      const token = response.data.token;

      if (!loggedInUser || !token) {
        throw new Error('Invalid response from server');
      }

      setUser(loggedInUser);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token);

      return { success: true, user: loggedInUser };

    } catch (error) {
      console.error('Login error:', error);
      // Return a proper error object so Login.jsx can show the message
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  };

  // ── REGISTER ───────────────────────────────────────────
  const register = async (username, email, password) => {
    try {
      const response = await API.post('/auth/register', {
        username, email, password
      });
      
      // Handle both success: true and direct user response formats
      const newUser = response.data.user || response.data;
      const token = response.data.token;

      if (!newUser || !token) {
        throw new Error('Invalid response from server');
      }

      setUser(newUser);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);

      return { success: true, user: newUser };

    } catch (error) {
      console.error('Registration error:', error);
      // Better error handling for network errors
      let message = 'Registration failed. Please try again.';
      
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      return { success: false, error: message };
    }
  };

  // ── LOGOUT ─────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Token removal is handled by API interceptor
  };

  return (
    <UserContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Custom Hook
export const useUser = () => {
  return useContext(UserContext);
};