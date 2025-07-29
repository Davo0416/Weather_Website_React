// @mui material components
import Grid from "@mui/material/Grid";
import Weather from "layouts/weather/components/Weather";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Planned from "layouts/plan/components/Planned";
import NotificationBox from "layouts/notifications/NotificationBox";

// Context Imports
import { useWeather } from "context/WeatherContext";
import { useRoutes } from "context/RoutesContext";
import { useMaterialUIController } from "context";
import { useUnits } from "context/UnitsContext";

import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";

function Dashboard() {
  const { weatherState } = useWeather();
  const { imperialUnits } = useUnits();

  const [location, setLocation] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [weather, setWeather] = useState("");
  const [timezone, setTimezone] = useState(0);
  const [countryCode, setCountryCode] = useState("");
  const [graphData, setGraphData] = useState({ labels: [], datasets: { label: "", data: [] } });
  const [updated, setUpdated] = useState(0);

  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;
  const { routesState } = useRoutes();
  const routes = routesState.routes;

  // Helper conversion and label functions
  const tempUnitLabel = imperialUnits ? "F" : "C";
  const convertTemp = useCallback(
    (celsius) => (imperialUnits ? (celsius * 9) / 5 + 32 : celsius),
    [imperialUnits]
  );

  const tempData = useMemo(
    () => ({
      labels: graphData.labels,
      datasets: {
        label: tempUnitLabel,
        data: graphData.datasets.data.map((t) => convertTemp(t)),
      },
    }),
    [graphData, tempUnitLabel, convertTemp]
  );

  // Update data on weather state change
  useEffect(() => {
    if (weatherState) {
      console.log("Dashboard Weather:", weatherState);
      setLocation(weatherState.location);
      setTemperature(weatherState.temperature);
      setWeather(weatherState.weather);
      setTimezone(weatherState.timezone);
      setCountryCode(weatherState.countryCode);
      setUpdated(weatherState.updated);
      if (weatherState.forecastData && weatherState.forecastData.length > 0) {
        setGraphData({
          labels: weatherState.forecastData[0].dayTimes,
          datasets: { label: "", data: weatherState.forecastData[0].dayTemps },
        });
      }
    }
  }, [weatherState]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Planned plannedRoutes={routes} noEdit={true} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Weather
              color={sidenavColor}
              location={location}
              countryCode={countryCode}
              temperature={convertTemp(temperature)}
              unit={tempUnitLabel}
              timezone={timezone}
              weatherCondition={weather}
              tempData={tempData}
              updated={updated}
            />
            <MDBox mt={1}>
              <Card>
                <MDBox p={2}>
                  <MDTypography variant="h5">Notifications</MDTypography>
                </MDBox>
                <NotificationBox></NotificationBox>
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
