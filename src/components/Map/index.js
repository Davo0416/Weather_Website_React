import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import React, { useEffect, useRef } from "react";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// Import routes from routes context
import { useRoutes } from "context/RoutesContext";

// Functional component for rendering an interactive map
function Map({ settings, callCity, color, setLength, doUpdate, doRoute }) {
  const mapRef = useRef(null);
  const { routesState } = useRoutes();

  useEffect(() => {
    // Function to load js script
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    // Function to load css styles
    const loadCSS = (href) => {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
      });
    };

    // Load all scripts neccessary for the maps function
    const loadAllScripts = async () => {
      try {
        await loadScript("/scripts/leaflet/leaflet.js");
        await loadScript("/scripts/leaflet/Permalink.js");
        await loadScript("/scripts/leaflet/Permalink.Layer.js");
        await loadScript("/scripts/leaflet/Permalink.Overlay.js");
        await loadScript("/scripts/leaflet-openweathermap.js");
        await loadScript("/scripts/leaflet/leaflet_routing_machine.js");
        await loadScript("/scripts/leaflet/files/map.js");

        await loadCSS("/scripts/leaflet-openweathermap.css");
        await loadCSS("/scripts/leaflet/leaflet.css");
        await loadCSS("/scripts/leaflet/files/map.css");
        if (typeof window.initMap === "function") {
          window.initMap();
        } else {
          console.error("initMap function not found.");
        }
      } catch (error) {
        console.error("Error loading scripts:", error);
      }
    };

    loadAllScripts();
  }, []);

  // Function to call for a city from the map
  window.CallCity = function (id) {
    callCity(id);
  };

  useEffect(() => {
    // Map initialization
    const mapDiv = document.getElementById("map");

    if (window.L && window.L.map && window.L.DomUtil.get("map")?._leaflet_id) {
      window.L.DomUtil.get("map")._leaflet_id = null;
    }

    if (mapDiv && mapDiv.childNodes.length === 0 && typeof window.initMap === "function") {
      console.log("Reinitializing map after remount...");
      window.initMap();
    }

    // Calling map ovelay functions on settings change
    if (typeof window.Clouds === "function") window.Clouds(settings.clouds);
    if (typeof window.Precipitation === "function") window.Precipitation(settings.precipitation);
    if (typeof window.Rain === "function") window.Rain(settings.rain);
    if (typeof window.Snow === "function") window.Snow(settings.snow);
    if (typeof window.Temperature === "function") window.Temperature(settings.temperature);
    if (typeof window.WindSpeed === "function") window.WindSpeed(settings.windSpeed);
    if (typeof window.Pressure === "function") window.Pressure(settings.pressure);
    if (typeof window.Contour === "function") window.Contour(settings.contour);
    if (typeof window.SelectMap === "function") window.SelectMap(settings.selectedMap);
    if (typeof window.WindRose === "function") window.WindRose(settings.windRose);
    if (typeof window.Cities === "function") window.Cities(settings.cities);
    if (typeof window.foundLocation === "function" && settings.location != null) {
      window.foundLocation(settings.location);
    }
    if (typeof window.DarkMode === "function") window.DarkMode(settings.darkMode);
    if (typeof window.Imperial === "function") window.Imperial(settings.imperialUnits);

    // Add a route to the map if settings has one
    if (typeof window.Route === "function") {
      if (doRoute) {
        const routeToShow = settings.route || routesState.currentRoute;
        console.log(settings.route, routesState.currentRoute);
        if (doUpdate) {
          window.Route(routeToShow, setLength);
        } else {
          window.Route(routeToShow, null);
        }
      }
    }
  }, [settings, routesState.currentRoute]);

  return (
    <Card>
      <MDBox p={2} pb={0}>
        <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize">
          Map
        </MDTypography>
      </MDBox>
      <MDBox p={2} m={2} bgColor={color} variant="gradient" borderRadius="lg">
        <div id="map" ref={mapRef} style={{ height: "568px" }}></div>
      </MDBox>
    </Card>
  );
}

// Props typechecking
Map.propTypes = {
  settings: PropTypes.object.isRequired,
  callCity: PropTypes.func.isRequired,
  setLength: PropTypes.func,
  color: PropTypes.string.isRequired,
  doUpdate: PropTypes.bool,
  doRoute: PropTypes.bool,
};

export default Map;
