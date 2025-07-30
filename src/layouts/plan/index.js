import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";

import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";

import Map from "components/Map";
import Planned from "layouts/plan/components/Planned";
import React, { useState, useEffect } from "react";

// Import contexts for data management
import { useRoutes } from "context/RoutesContext";
import { useAlert } from "context/AlertContext";
import { useUnits } from "context/UnitsContext";

import { useMaterialUIController } from "context";

// Page for planning travel routes
function Plan() {
  const [editIndex, setEditIndex] = useState(null);
  const [settings, setSettings] = useState({});
  const [doUpdate, setDoUpdate] = useState(false);
  const [deleted, setDeleted] = useState({ id: 0, routes: [] });
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { routesState, setRoutesState } = useRoutes();
  const routes = routesState.routes;
  const currentRoute = routesState.currentRoute;
  const { addAlert } = useAlert();
  const { imperialUnits } = useUnits();
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // Reset route map on load
  useEffect(() => {
    setSelectedId(null);
    setRoutesState((prev) => ({
      ...prev,
      currentRoute: null,
    }));
  }, []);

  // Update route display and map on route delete
  useEffect(() => {
    if (deleted.routes.length === 0) {
      setSettings({ route: null });
      setSelectedId(null);
      setDoUpdate(false);
    } else {
      let selectId = deleted.id;
      if (selectId > deleted.routes.length - 1) selectId = deleted.routes.length - 1;
      setSelectedId(selectId);
      setSettings({ route: deleted.routes[selectId] ?? null, imperialUnits: imperialUnits });
      setDoUpdate(false);
    }
  }, [deleted]);

  // Update Map on unit change
  useEffect(() => {
    setSettings({ ...settings, imperialUnits: imperialUnits });
  }, [imperialUnits]);

  // Fetch forecast for a given city from the backend
  const getForecast = async (loc) => {
    const url = `${process.env.REACT_APP_API_URL}/api/forecast?city=${encodeURIComponent(loc)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const forecasts = data.list;

      const forecast = {
        coord: data.city.coord,
        city: data.city.name,
        dates: [],
        temperature: [],
        humidity: [],
        pressure: [],
        windSpeed: [],
        windDirection: [],
        weatherDescription: [],
        weatherIcon: [],
      };

      forecasts.forEach((entry) => {
        forecast.dates.push(entry.dt_txt);
        forecast.temperature.push(entry.main.temp);
        forecast.humidity.push(entry.main.humidity);
        forecast.windSpeed.push(entry.wind.speed);
        forecast.windDirection.push(entry.wind.deg);
        forecast.weatherDescription.push(entry.weather[0].description);
      });

      return forecast;
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      return null;
    }
  };

  // Add route function
  async function addRoute(route) {
    setLoading(true);
    const points = route.route.split("-");

    const forecasts = [];
    for (let i = 0; i < points.length; i++) {
      const forecast = await getForecast(points[i]);
      if (forecast) {
        forecasts.push(forecast);
      } else {
        console.error(`Failed to get forecast for ${points[i]}`);
        return;
      }
    }

    const dateAndTime = route.date.split(" ");
    const newSettings = {
      route: {
        points: forecasts.map((forecast, index) => ({
          date: dateAndTime[0],
          dates: forecast.dates,
          departureTime: index === 0 ? dateAndTime[1] : null,
          city: forecast.city,
          lat: forecast.coord.lat,
          lon: forecast.coord.lon,
          temperature: forecast.temperature,
          humidity: forecast.humidity,
          windSpeed: forecast.windSpeed,
          windDirection: forecast.windDirection,
          weatherDescription: forecast.weatherDescription,
        })),
      },
      imperialUnits: imperialUnits,
    };
    setDoUpdate(true);
    setSettings(newSettings);
    console.log("b");
    setRoutesState((prev) => ({
      ...prev,
      currentRoute: route,
    }));
  }

  // Select route by ID
  function selectRoute(id) {
    const selected = routes[id];
    if (
      currentRoute &&
      currentRoute.route === selected.route &&
      currentRoute.date === selected.date
    ) {
      return;
    }

    setSelectedId(id);

    setRoutesState((prev) => ({
      ...prev,
      currentRoute: selected,
    }));

    setDoUpdate(false);
    console.log("c");
    setSettings({
      route: selected,
      imperialUnits: imperialUnits,
    });
  }

  // Mark edit index when editing a route
  function startEditRoute(index) {
    setEditIndex(index);
  }

  // Function for recieving route data back from the map
  function setLength(distance, time, inbetweenPoints, description) {
    const enrichedRoute = {
      ...currentRoute,
      weather: description,
      points: settings.route.points,
      inbetweenPoints: inbetweenPoints,
      distance: distance,
      time: time,
    };

    if (editIndex !== null) {
      const updatedRoutes = [...routes];
      updatedRoutes[editIndex] = enrichedRoute;
      setRoutesState((prev) => ({
        ...prev,
        routes: updatedRoutes,
        currentRoute: enrichedRoute,
      }));
      setEditIndex(null);
    } else {
      const updated = [...routes, enrichedRoute];
      setRoutesState((prev) => ({
        ...prev,
        routes: updated,
        currentRoute: enrichedRoute,
      }));
      setSelectedId(routes.length);
    }

    setSettings({
      route: enrichedRoute,
      imperialUnits: imperialUnits,
    });

    setLoading(false);
    // Add alert on successfull route creation
    addAlert({
      text: "Successfully added the route " + enrichedRoute.route,
      color: "success",
      icon: "notifications",
    });
  }

  // Delete route function
  const deleteRoute = (routeToDelete) => {
    const id = routes.findIndex(
      (route) => route.route === routeToDelete.route && route.date === routeToDelete.date
    );

    const updatedRoutes = routes.filter(
      (route) => route.route !== routeToDelete.route || route.date !== routeToDelete.date
    );

    const isCurrent =
      currentRoute &&
      currentRoute.route === routeToDelete.route &&
      currentRoute.date === routeToDelete.date;

    setRoutesState((prev) => ({
      ...prev,
      routes: updatedRoutes,
      currentRoute: isCurrent ? null : prev.currentRoute,
    }));

    setDeleted({ id: id, routes: updatedRoutes });

    if (isCurrent) {
      setSettings({ route: null });
      setSelectedId(null);
    }
  };

  // Defining the loading screen to be displayed during route construction
  const loadingScreen = loading && (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "2rem",
        fontWeight: "bold",
      }}
    >
      Constructing Route...
    </div>
  );

  return (
    <>
      {loadingScreen}
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox>
          <MDBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Planned
                  plannedRoutes={routes}
                  addRoute={addRoute}
                  deleteRoute={deleteRoute}
                  editIndex={editIndex}
                  startEditRoute={startEditRoute}
                  selectRouteMap={selectRoute}
                  selectedId={selectedId}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Map
                  settings={settings}
                  setLength={setLength}
                  doUpdate={doUpdate}
                  doRoute={true}
                  color={sidenavColor}
                />
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default Plan;
