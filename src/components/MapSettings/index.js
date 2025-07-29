import PropTypes, { func } from "prop-types";
import Card from "@mui/material/Card";
import React, { useState, useEffect } from "react";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";

// Functional component for editing the interactive maps settings
function MapSettings({ callFunction, color }) {
  const [selectedMap, setSelectedMap] = useState("standard");
  const [clouds, setClouds] = useState(false);
  const [precipitation, setPrecipitation] = useState(false);
  const [rain, setRain] = useState(false);
  const [snow, setSnow] = useState(false);
  const [temperature, setTemperature] = useState(false);
  const [windSpeed, setWindSpeed] = useState(false);
  const [pressure, setPressure] = useState(false);
  const [contour, setContour] = useState(false);
  const [cities, setCities] = useState(false);
  const [windRose, setWindRose] = useState(false);

  // Handle map type change
  const handleChange = (event) => {
    setSelectedMap(event.target.value);
  };

  // Handle overlay toggles
  const handleClouds = (event) => {
    setClouds(event.target.checked);
  };

  const handlePrecipitation = (event) => {
    setPrecipitation(event.target.checked);
  };

  const handleRain = (event) => {
    setRain(event.target.checked);
  };

  const handleSnow = (event) => {
    setSnow(event.target.checked);
  };

  const handleTemperature = (event) => {
    setTemperature(event.target.checked);
  };

  const handleWindSpeed = (event) => {
    setWindSpeed(event.target.checked);
  };

  const handlePressure = (event) => {
    setPressure(event.target.checked);
  };

  const handleContour = (event) => {
    setContour(event.target.checked);
  };

  const handleCities = (event) => {
    setCities(event.target.checked);
  };

  const handleWindRose = (event) => {
    setWindRose(event.target.checked);
  };

  // Update map settings on change
  useEffect(() => {
    var settings = {
      clouds: clouds,
      precipitation: precipitation,
      rain: rain,
      snow: snow,
      temperature: temperature,
      windSpeed: windSpeed,
      pressure: pressure,
      contour: contour,
      selectedMap: selectedMap,
      cities: cities,
      windRose: windRose,
      location: null,
    };
    callFunction(settings);
  }, [
    clouds,
    precipitation,
    rain,
    snow,
    temperature,
    windSpeed,
    pressure,
    contour,
    selectedMap,
    cities,
    windRose,
  ]);

  return (
    <Card>
      <MDBox p={2} pb={0}>
        <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize">
          Map Settings
        </MDTypography>
      </MDBox>
      <MDBox p={2} variant="gradient" bgColor={color} borderRadius="lg" m={2}>
        <MDTypography variant="h5" fontWeight="medium" color="white">
          Maps
        </MDTypography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Standard
              </MDTypography>
              <Radio
                checked={selectedMap === "standard"}
                onChange={handleChange}
                value="standard"
                name="radio-buttons"
                color="white"
              />
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Humanitarian
              </MDTypography>
              <Radio
                checked={selectedMap === "humanitarian"}
                onChange={handleChange}
                value="humanitarian"
                name="radio-buttons"
                color="white"
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox p={2} variant="gradient" bgColor={color} borderRadius="lg" m={2} mt={0}>
        <MDTypography variant="h5" fontWeight="medium" color="white">
          Layers
        </MDTypography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Clouds
              </MDTypography>
              <Switch color="white" checked={clouds} onChange={handleClouds} />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Precipitation
              </MDTypography>
              <Switch color="white" checked={precipitation} onChange={handlePrecipitation} />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Rain
              </MDTypography>
              <Switch color="white" checked={rain} onChange={handleRain} />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Snow
              </MDTypography>
              <Switch color="white" checked={snow} onChange={handleSnow} />
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Temperature
              </MDTypography>
              <Switch color="white" checked={temperature} onChange={handleTemperature} />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Wind Speed
              </MDTypography>
              <Switch color="white" checked={windSpeed} onChange={handleWindSpeed} />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Pressure
              </MDTypography>
              <Switch color="white" checked={pressure} onChange={handlePressure} />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Contour
              </MDTypography>
              <Switch color="white" checked={contour} onChange={handleContour} />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox p={2} variant="gradient" bgColor={color} borderRadius="lg" m={2} mt={0}>
        <MDTypography variant="h5" fontWeight="medium" color="white">
          Current Weather
        </MDTypography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Cities
              </MDTypography>
              <Switch color="white" checked={cities} onChange={handleCities} />
            </MDBox>
          </Grid>
          <Grid item xs={6}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="regular" color="white">
                Wind Rose
              </MDTypography>
              <Switch color="white" checked={windRose} onChange={handleWindRose} />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

//Props typechecking
MapSettings.propTypes = {
  callFunction: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
};

export default MapSettings;
