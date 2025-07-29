import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import ForecastCard from "layouts/weather/components/ForecastCard";

import PropTypes from "prop-types";

// Functional component for displaying the weather forecast data
function Forecast({ color, forecastData, updated, callFunction, selectedNum }) {
  if (!forecastData || forecastData.length == 0) {
    return (
      <Card>
        <MDBox p={2} pt={1}>
          <MDTypography variant="h4" fontWeight="medium">
            Forecast
          </MDTypography>
          <MDTypography variant="h6" fontWeight="medium">
            Loading Forecast ...
          </MDTypography>
        </MDBox>
      </Card>
    );
  }
  return (
    <Card>
      <MDBox p={2} pt={1}>
        <MDTypography variant="h4" fontWeight="medium">
          Forecast
        </MDTypography>
        <MDBox
          mt={1}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            pb: 1,
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <ForecastCard
              key={i}
              color={color}
              forecast={forecastData[i]}
              callFunction={callFunction}
              num={i}
              selectedNum={selectedNum}
            />
          ))}
        </MDBox>
        <MDBox display="flex" alignItems="center" mt={2}>
          <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
            <Icon>schedule</Icon>
          </MDTypography>
          <MDTypography variant="button" color="text" fontWeight="light">
            updated {updated} ago
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Props typechecking
Forecast.propTypes = {
  forecastData: PropTypes.array.isRequired,
  updated: PropTypes.string.isRequired,
  callFunction: PropTypes.func.isRequired,
  selectedNum: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default Forecast;
