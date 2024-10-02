import React, { createContext, useState, useEffect } from "react";
import Auth from "./auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(Auth.loggedIn());

  useEffect(() => {
    // Check if the user is logged in on mount
    const loggedIn = Auth.loggedIn();
    setIsLoggedIn(loggedIn);
  }, []);

  const login = () => {
    setIsLoggedIn(Auth.loggedIn());
  };

  const logout = () => {
    setIsLoggedIn(Auth.loggedIn());
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
