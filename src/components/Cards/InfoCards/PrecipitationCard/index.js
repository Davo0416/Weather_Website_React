import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import { useUnits } from "context/UnitsContext";

// Functional component for rendering a card with precipitation data
function PrecipitationCard({ color, type, pop, volume, time }) {
  const { imperialUnits, setImperialUnits } = useUnits();

  const convertMM = (mm) => (imperialUnits ? Math.round((mm / 25.4) * 100) / 100 : mm);
  const precipUnitLabel = imperialUnits ? "in/h" : "mm/h";

  // Defining color based on precipitation probability
  var popColor = "error";
  if (pop < 30) popColor = "success";
  else if (pop < 60) popColor = "warning";

  // Defining intensity based on precipitation volume
  var intensity = "Heavy";
  if (volume < 0.5) intensity = "Light";
  else if (volume < 4) intensity = "Moderate";

  return (
    <MDBox
      bgColor={color}
      variant="gradient"
      shadow="md"
      borderRadius="lg"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      pl={1}
      m={1}
      mt={2}
    >
      <Grid item xs={12} container spacing={0}>
        <Grid item xs={6}>
          <MDBox p={0.5}>
            <MDTypography variant="h6" fontWeight="medium" color="white">
              {intensity} {type}
            </MDTypography>
            <MDTypography variant="h6" fontWeight="regular" color="white">
              {convertMM(volume)} {precipUnitLabel}
            </MDTypography>
          </MDBox>
        </Grid>
        <Grid item xs={6}>
          <MDBox>
            <MDBox
              bgColor="light"
              variant="gradient"
              borderRadius="lg"
              m={1}
              p={0.5}
              display="flex"
            >
              <MDTypography variant="caption" fontWeight="medium">
                {time}
              </MDTypography>
            </MDBox>
            <MDBox
              bgColor={popColor}
              variant="gradient"
              shadow="md"
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={0.5}
              m={1}
            >
              <MDTypography variant="caption" fontWeight="medium" color="white">
                {pop}% Chance
              </MDTypography>
            </MDBox>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

// Default Props
PrecipitationCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
};

// Props typechecking
PrecipitationCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  type: PropTypes.string.isRequired,
  pop: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  time: PropTypes.string.isRequired,
};

export default PrecipitationCard;
