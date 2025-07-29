import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Context setup
const UserContext = createContext();

// User Provider
export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  // Update localStorage on user change
  const setUser = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(userData);
  };

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

// Props typechecking
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Export context
export const useUser = () => useContext(UserContext);
