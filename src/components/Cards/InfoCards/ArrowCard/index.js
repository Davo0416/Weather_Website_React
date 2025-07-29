import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import React, { useState, useEffect, useRef } from "react";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Functional component for rendering an animated arrow gauge card
function ArrowCard({ color, image, arrow, dir, title, description, value }) {
  const [currentDir, setCurrentDir] = useState(dir);
  const animationRef = useRef();

  // Animate the arrow rotation
  useEffect(() => {
    function animateRotation() {
      setCurrentDir((prev) => {
        const delta = (dir - prev) * 0.1;
        const next = prev + delta;

        if (Math.abs(dir - next) < 0.1) {
          cancelAnimationFrame(animationRef.current);
          return dir;
        }

        animationRef.current = requestAnimationFrame(animateRotation);
        return next;
      });
    }
    // cancel any ongoing animation
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animateRotation);

    // cancel on unmount
    return () => cancelAnimationFrame(animationRef.current);
  }, [dir]);

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
          <img
            src={`${process.env.PUBLIC_URL}/Weather_Icons/${arrow}.png`}
            width="110rem"
            alt="arrow"
            style={{
              transform: `rotate(${currentDir}deg)`,
              transition: "transform 0.1s linear",
            }}
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

// Default Props
ArrowCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
};

// Props typechecking
ArrowCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  image: PropTypes.string.isRequired,
  arrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  dir: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ArrowCard;
