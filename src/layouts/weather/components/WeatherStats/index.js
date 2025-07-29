import Grid from "@mui/material/Grid";
import ArrowCard from "components/Cards/InfoCards/ArrowCard";
import AnimCard from "components/Cards/InfoCards/AnimCard";
import Precipitation from "components/Cards/InfoCards/Precipitation";
import PropTypes from "prop-types";
import { useUnits } from "context/UnitsContext";

import { useMaterialUIController } from "context";

// Functional component for displaying the weather stats data
function WeatherStats({
  windSpeed,
  windDir,
  pressure,
  humidity,
  coverage,
  temperature,
  visibility,
  precipitationData,
  tempUnitLabel,
  speedUnitLabel,
  pressureUnitLabel,
  visibilityUnitLabel,
}) {
  const { imperialUnits } = useUnits();
  const [controller] = useMaterialUIController();
  const { sidenavColor } = controller;

  // A classic remap function
  const remap = (value, low1, high1, low2, high2) => {
    if (value == null) return null;
    else if (value < low1) return low2;
    else if (value > high1) return high2;
    else return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
  };

  // Temperature and pressure unit conversion functions
  const convertTemp = (celsius) => (imperialUnits ? (celsius * 9) / 5 + 32 : celsius);
  const convertPressure = (hPa) => (imperialUnits ? Math.round(hPa * 0.0145038 * 10) / 10 : hPa);

  return (
    <Grid item xs={12} container spacing={2}>
      <Grid item xs={6} sm={4} lg={6} xl={6}>
        <ArrowCard
          image="Temperature"
          arrow="PressureArrow"
          color={sidenavColor}
          dir={remap(temperature, -20, 40, 15, 275)}
          title="Temperature"
          description="Air Temperature"
          value={convertTemp(temperature) + "°" + tempUnitLabel}
        />
      </Grid>
      <Grid item xs={6} sm={4} lg={6} xl={6}>
        <ArrowCard
          image="Compass"
          arrow="Compass_Arrow"
          color={sidenavColor}
          title="Wind"
          dir={windDir}
          description="Wind Speed"
          value={windSpeed + " " + speedUnitLabel}
        />
      </Grid>
      <Grid item xs={6} sm={4} lg={6} xl={6}>
        <ArrowCard
          image="Humidity"
          arrow="HumidityArrow"
          color={sidenavColor}
          dir={remap(humidity, 0, 100, 0, 290)}
          title="Humidity"
          description="Air Humidity"
          value={humidity + "%"}
        />
      </Grid>
      <Grid item xs={6} sm={4} lg={6} xl={6}>
        <ArrowCard
          image="Cloudiness"
          title="Clouds"
          arrow="HumidityArrow"
          color={sidenavColor}
          dir={remap(coverage, 0, 100, 0, 290)}
          description="Cloud Coverage"
          value={coverage + "%"}
        />
      </Grid>
      <Grid item xs={6} sm={4} lg={6} xl={6}>
        <ArrowCard
          image={imperialUnits ? "PressureMeterImperial" : "PressureMeter"}
          arrow="PressureArrow"
          color={sidenavColor}
          title="Pressure"
          dir={remap(pressure, 900, 1100, 0, 290)}
          description="Air Pressure"
          value={convertPressure(pressure) + " " + pressureUnitLabel}
        />
      </Grid>
      <Grid item xs={6} sm={4} lg={6} xl={6}>
        <AnimCard
          image="Visibility"
          color={sidenavColor}
          title="Visibility"
          description="Visibility Distance"
          value={Math.round(visibility / 100) / 10 + " " + visibilityUnitLabel}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={12} xl={12}>
        <Precipitation
          image="Beaker"
          title="Precipitation"
          precipitationData={precipitationData}
          color={sidenavColor}
        />
      </Grid>
    </Grid>
  );
}

// Props typechecking
WeatherStats.propTypes = {
  windSpeed: PropTypes.number.isRequired,
  windDir: PropTypes.number.isRequired,
  pressure: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  coverage: PropTypes.number.isRequired,
  temperature: PropTypes.number.isRequired,
  visibility: PropTypes.number.isRequired,
  precipitationData: PropTypes.object.isRequired,
  tempUnitLabel: PropTypes.string.isRequired,
  speedUnitLabel: PropTypes.string.isRequired,
  pressureUnitLabel: PropTypes.string.isRequired,
  visibilityUnitLabel: PropTypes.string.isRequired,
};

export default WeatherStats;
