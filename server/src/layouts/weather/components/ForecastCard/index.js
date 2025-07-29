import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import PropTypes from "prop-types";
import { useUnits } from "context/UnitsContext";

// Functional component for rendering a card with forecast data for a day
function ForecastCard({ color, forecast, callFunction, num, selectedNum }) {
  const borderColorKey = selectedNum === num ? "outlineDark" : "outline";
  const { imperialUnits } = useUnits();

  // Helper temperature conversion and unit functions
  const convertTemp = (celsius) => (imperialUnits ? Math.round((celsius * 9) / 5 + 32) : celsius);
  const tempUnitLabel = imperialUnits ? "F" : "C";

  return (
    <MDBox
      bgColor={color}
      borderRadius="xxl"
      variant="gradient"
      border={4}
      shadow="lg"
      onClick={() => callFunction(num)}
      sx={(theme) => ({
        borderColor: theme.palette.gradients[color]?.[borderColorKey],
      })}
    >
      <MDBox textAlign="center" pt={1}>
        <MDTypography variant="h4" fontWeight="medium" color="white">
          {forecast.day}
        </MDTypography>
        <MDBox
          mt={1}
          p={1}
          component="img"
          src={process.env.PUBLIC_URL + "/Weather_Icons/" + forecast.weather + ".png"}
          alt={"title"}
          borderRadius="xxl"
          bgColor="light"
          width={0.85}
          position="relative"
          variant="gradient"
        />
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox
            bgColor="cold"
            variant="gradient"
            borderRadius="lg"
            m={1}
            mt={0}
            mr={0.5}
            width={0.5}
          >
            <MDBox bgColor="colder" variant="gradient" borderRadius="lg" mt={0}>
              <MDTypography variant="h6" fontWeight="medium" color="white">
                Min
              </MDTypography>
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium" color="white">
              {convertTemp(forecast.minTemp)}°{tempUnitLabel}
            </MDTypography>
          </MDBox>
          <MDBox
            bgColor="hot"
            variant="gradient"
            borderRadius="lg"
            m={1}
            mt={0}
            ml={0.5}
            width={0.5}
          >
            <MDBox bgColor="hotter" variant="gradient" borderRadius="lg" mt={0}>
              <MDTypography variant="h6" fontWeight="medium" color="white">
                Max
              </MDTypography>
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium" color="white">
              {convertTemp(forecast.maxTemp)}°{tempUnitLabel}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Props typechecking
ForecastCard.propTypes = {
  forecast: PropTypes.object.isRequired,
  callFunction: PropTypes.func.isRequired,
  num: PropTypes.number.isRequired,
  selectedNum: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default ForecastCard;
