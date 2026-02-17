import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );

  // Attach token to axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // 🔥 LOGIN FUNCTION
  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', {
      email,
      password
    });

    const loggedInUser = response.data.user;

    setUser(loggedInUser);
    setToken(response.data.token);

    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', response.data.token);

    console.log("Logged user:", loggedInUser); // ✅ now inside function

    return loggedInUser;
  };

  // 🔥 LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Custom Hook (Fixes AdminRoute error)
export const useUser = () => {
  return useContext(UserContext);
};
