import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Import user to get the current users id
import { useUser } from "context/UserContext";

// Context setup
const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weatherState, setWeatherStateLocal] = useState(null);
  const { user } = useUser();

  // Set weather state to given state to save it
  const setWeatherState = async (newWeather) => {
    const updatedWeather = typeof newWeather === "function" ? newWeather(weatherState) : newWeather;

    //console.log("Weather Saved:", updatedWeather);
    setWeatherStateLocal(updatedWeather);

    // Check for user and post the new weather to the backend
    if (user?._id) {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/api/user/weather/${user._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, weather: updatedWeather }),
        });
      } catch (err) {
        console.error("Error saving weather:", err);
      }
    }
  };

  //Load users weather state on user change
  useEffect(() => {
    const loadWeather = async () => {
      // Check for user and send a get request to the backend
      if (user?._id) {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/weather/${user._id}`);
          if (res.ok) {
            const data = await res.json();
            if (data) setWeatherStateLocal(data);
          }
        } catch (err) {
          console.error("Error loading weather:", err);
        }
      }
    };

    loadWeather();
  }, [user]);

  return (
    <WeatherContext.Provider value={{ weatherState, setWeatherState }}>
      {children}
    </WeatherContext.Provider>
  );
};

// Props typechecking
WeatherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Export context
export const useWeather = () => useContext(WeatherContext);
