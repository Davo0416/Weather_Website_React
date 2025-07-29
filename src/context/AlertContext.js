import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import MDSnackbar from "components/MDSnackbar";
import { useUser } from "context/UserContext";

// Context setup
const AlertContext = createContext();
export const useAlert = () => useContext(AlertContext);

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [hasLoadedAlerts, setHasLoadedAlerts] = useState(false);

  // Import user to get the current users id
  const { user } = useUser();

  // Load alerts from DB
  useEffect(() => {
    const loadAlerts = async () => {
      // Check for user and send a get request to the backend
      if (user?._id) {
        try {
          const res = await fetch(`http://localhost:5000/api/user/notifications/${user._id}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setAlerts(data);
            // Allow saving after initial load
            setHasLoadedAlerts(true);
          }
        } catch (err) {
          console.error("Error loading alerts:", err);
        }
      }
    };

    loadAlerts();
  }, [user]);

  // Save alerts to DB only after loading is complete
  useEffect(() => {
    const saveAlerts = async () => {
      // Check for user and the load flag and post the new alerts to the backend
      if (user?._id && hasLoadedAlerts) {
        try {
          await fetch(`http://localhost:5000/api/user/notifications/${user._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alerts }),
          });
        } catch (err) {
          console.error("Error saving alerts:", err);
        }
      }
    };

    saveAlerts();
  }, [alerts, user, hasLoadedAlerts]);

  // Add a new alert
  const addAlert = ({ text, color = "info", icon = "notifications" }) => {
    const id = Date.now() + Math.random();
    setAlerts((prev) => [
      ...prev,
      {
        id,
        text,
        color,
        icon,
        open: true,
        title: "Sky Route",
        dateTime: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Close alert by id
  const closeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Set alerts
  const setAlertsTo = (alerts) => {
    setAlerts(alerts);
  };

  // Hide alert by id
  const hideAlert = (id) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, open: false } : alert)));
  };

  //Display the SnackBar alerts
  return (
    <AlertContext.Provider value={{ addAlert, alerts, closeAlert, setAlertsTo }}>
      {children}
      {alerts.map((alert) => (
        <MDSnackbar
          key={alert.id}
          color={alert.color}
          icon={alert.icon}
          title={alert.title}
          content={alert.text}
          dateTime={alert.dateTime}
          open={alert.open}
          close={() => hideAlert(alert.id)}
          onClose={() => hideAlert(alert.id)}
          bgWhite
        />
      ))}
    </AlertContext.Provider>
  );
}

// Props typechecking
AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
