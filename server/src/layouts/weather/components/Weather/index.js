import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Time from "layouts/weather/components/Time";
import ReportsLineChart from "components/Charts/LineCharts/ReportsLineChart";
import PropTypes from "prop-types";
import React from "react";

// Functional component for displaying the weather data
function Weather({
  color,
  location,
  day,
  countryCode,
  temperature,
  unit,
  timezone,
  weatherCondition,
  tempData,
  updated,
}) {
  if (!location || location === "") {
    return (
      <Card>
        <MDBox p={2}>
          <MDTypography variant="h4" fontWeight="medium">
            Weather
          </MDTypography>
          <MDTypography variant="h6" fontWeight="medium">
            Loading Weather ...
          </MDTypography>
        </MDBox>
      </Card>
    );
  }

  return (
    <Card>
      <MDBox p={2}>
        <MDBox display="flex" alignItems="center" justifyContent="space-between">
          <MDBox display="flex" alignItems="center">
            <MDTypography
              variant="h4"
              fontWeight="medium"
              sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" } }}
            >
              {location} {countryCode}
            </MDTypography>
            <MDBox
              ml={1}
              component="img"
              src={process.env.PUBLIC_URL + "/Flags/" + countryCode + ".png"}
              alt={"title"}
              borderRadius="sm"
              shadow="md"
              sx={{
                height: { xs: "0.9rem", sm: "1.2rem" },
                width: { xs: "1.5rem", sm: "2rem" },
              }}
            />
          </MDBox>
          <MDBox>
            <MDTypography
              variant="h4"
              fontWeight="medium"
              sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" } }}
            >
              Weather
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Weather Icon + Temperature + Time */}
        <MDBox display="flex" alignItems="center" justifyContent="space-between" mt={2}>
          <MDBox display="flex" alignItems="center">
            <MDBox
              component="img"
              src={process.env.PUBLIC_URL + "/Weather_Icons/" + weatherCondition + ".png"}
              alt={"title"}
              borderRadius="md"
              bgColor="transparent"
              sx={{
                width: { xs: "3.5rem", sm: "4.5rem", md: "5rem" },
              }}
              position="relative"
              zIndex={1}
            />
            <MDTypography
              variant="h1"
              fontWeight="medium"
              ml={1}
              sx={{
                fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
              }}
            >
              {temperature}°{unit}
            </MDTypography>
          </MDBox>

          <MDBox textAlign="right">
            <Time timezone={timezone} dayVal={day} />
            <MDTypography
              variant="h6"
              fontWeight="medium"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
              }}
            >
              {weatherCondition}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Chart Section */}
      <MDBox mt={2}>
        <ReportsLineChart color={color} title="temperature" date={updated} chart={tempData} />
      </MDBox>
    </Card>
  );
}

// Props typechecking
Weather.propTypes = {
  location: PropTypes.string.isRequired,
  day: PropTypes.string,
  countryCode: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  timezone: PropTypes.number.isRequired,
  weatherCondition: PropTypes.string.isRequired,
  tempData: PropTypes.object.isRequired,
  updated: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default Weather;
