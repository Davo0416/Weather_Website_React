import PropTypes from "prop-types";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Functional component for rendering an animated card
function AnimCard({ color, image, title, description, value }) {
  return (
    <Card>
      <MDBox p={1} pb={0} px={0} textAlign="center">
        <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox pt={1} display="flex" justifyContent="center">
        <MDBox
          p={1}
          display="grid"
          justifyContent="center"
          alignItems="center"
          bgColor={color}
          color="white"
          width="8rem"
          height="8rem"
          shadow="md"
          borderRadius="lg"
          variant="gradient"
          position="relative"
        >
          <MDBox
            ml={1}
            component="img"
            src={`${process.env.PUBLIC_URL}/Weather_Icons/${image}.png`}
            alt={title}
            borderRadius="md"
            bgColor="transparent"
            width="7rem"
            position="absolute"
            zIndex={1}
          />
        </MDBox>
      </MDBox>
      <MDBox pb={1.5} px={2} textAlign="center" lineHeight={1.25}>
        {description && (
          <MDTypography variant="caption" color="text" fontWeight="regular">
            {description}
          </MDTypography>
        )}
        {value && (
          <MDTypography variant="h5" fontWeight="medium">
            {value}
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

// Default props
AnimCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
};

// Props typechecking
AnimCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AnimCard;
