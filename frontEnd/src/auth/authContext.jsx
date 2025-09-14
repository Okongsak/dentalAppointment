import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { AuthContext } from "./useAuth.jsx";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  const login = async (tokenValue) => {
    setToken(tokenValue);
    setUsername(localStorage.getItem("username"));
    setIsLoggedIn(true);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }

  useEffect(() => {
    // เช็กว่าใน localStorage มี token หรือไม่
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    // ถ้ามี token และ name อยู่ใน localStorage แสดงว่า login
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // เช็กแค่ครั้งเดียวตอนเริ่มต้น

  const contextValue = {
    isLoggedIn,
    token,
    username,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// กำหนด PropTypes
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
