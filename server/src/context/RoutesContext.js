import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Context setup
const RoutesContext = createContext();
import { useUser } from "context/UserContext";

export function RoutesProvider({ children }) {
  const [routesState, setRoutesState] = useState({
    routes: [],
    currentRoute: null,
  });
  const [hasLoadedRoutes, setHasLoadedRoutes] = useState(false);

  // Import user to get the current users id
  const { user } = useUser();

  // Load from DB
  useEffect(() => {
    const loadRoutes = async () => {
      // Check for user and send a get request to the backend
      if (user?._id) {
        try {
          const res = await fetch(`http://localhost:5000/api/user/routes/${user._id}`);
          if (res.ok) {
            const data = await res.json();
            if (data) {
              setRoutesState(data);
              setHasLoadedRoutes(true); // <-- only allow saving after this
            }
          }
        } catch (err) {
          console.error("Error loading routesState:", err);
        }
      }
    };

    loadRoutes();
  }, [user]);

  // Save to DB when changed, but only after loading
  useEffect(() => {
    const saveRoutes = async () => {
      // Check for user and post new routes to the backend
      if (user?._id && hasLoadedRoutes) {
        try {
          await fetch(`http://localhost:5000/api/user/routes/${user._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ routesState }),
          });
        } catch (err) {
          console.error("Error saving routesState:", err);
        }
      }
    };

    saveRoutes();
  }, [routesState, user, hasLoadedRoutes]);

  return (
    <RoutesContext.Provider value={{ routesState, setRoutesState }}>
      {children}
    </RoutesContext.Provider>
  );
}

//Props typechecking
RoutesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Export context
export function useRoutes() {
  return useContext(RoutesContext);
}
