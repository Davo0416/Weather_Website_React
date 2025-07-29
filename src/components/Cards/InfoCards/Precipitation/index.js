import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import React, { useState, useEffect } from "react";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import PrecipitationCard from "components/Cards/InfoCards/PrecipitationCard";
import { useUnits } from "context/UnitsContext";

// Functional component for rendering an animated card with Precipitation data
function Precipitation({ color, image, title, precipitationData }) {
  const [animatedHeight, setAnimatedHeight] = useState("0rem");
  const [animatedMargin, setAnimatedMargin] = useState(0);
  const { imperialUnits } = useUnits();

  // Beaker water animation
  useEffect(() => {
    let x = precipitationData.precipitationVol;
    if (x < 0.15 && x > 0) x = 0.15;
    if (x > 8) x = 8;
    const newHeight = x / 2 + "rem";
    const newMargin = x - 10.6;

    setAnimatedHeight(newHeight);
    setAnimatedMargin(newMargin);
  }, [precipitationData.precipitationVol]);

  // Helper conversion and unit functions
  const convertMM = (mm) => (imperialUnits ? Math.round((mm / 25.4) * 100) / 100 : mm);
  const precipUnitLabel = imperialUnits ? "in" : "mm";

  return (
    <Card>
      <Grid item xs={12} container spacing={0}>
        <Grid item xs={5}>
          <MDBox p={1} textAlign="center">
            <MDTypography
              variant="h4"
              fontWeight="medium"
              textTransform="capitalize"
              noWrap
              sx={{
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {title}
            </MDTypography>
          </MDBox>
          <MDBox display="grid" justifyContent="center">
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
              <MDBox
                ml={1}
                bgColor="rgb(88, 180, 255)"
                color="white"
                width="4.3rem"
                height={animatedHeight}
                mb={animatedMargin}
                borderRadius="md"
                shadow="md"
                position="relative"
                sx={{
                  transition: "height 0.3s ease, margin-bottom 0.3s ease",
                }}
              />
            </MDBox>
            <MDBox pb={1.5} px={2} textAlign="center" lineHeight={1.25}>
              <MDTypography variant="caption" color="text" fontWeight="regular">
                Overall Volume
              </MDTypography>
              <MDTypography variant="h5" fontWeight="medium" textAlign="center">
                {convertMM(precipitationData.precipitationVol)} {precipUnitLabel}
              </MDTypography>
            </MDBox>
          </MDBox>
        </Grid>

        {precipitationData && (
          <Grid item xs={7}>
            {precipitationData.length !== 0 && (
              <MDBox>
                {!precipitationData.precipitationArray[0] && (
                  <MDBox p={1} m={1} display="flex" alignItems="center" justifyContent="center">
                    <MDTypography variant="h5" fontWeight="medium" textTransform="capitalize">
                      No precipitation
                    </MDTypography>
                  </MDBox>
                )}
                {precipitationData.precipitationArray[0] && (
                  <PrecipitationCard
                    pop={precipitationData.precipitationArray[0].pop}
                    volume={precipitationData.precipitationArray[0].vol}
                    time={precipitationData.precipitationArray[0].time}
                    type={precipitationData.precipitationArray[0].type}
                    color={color}
                  />
                )}
                {precipitationData.precipitationArray[1] && (
                  <PrecipitationCard
                    pop={precipitationData.precipitationArray[1].pop}
                    volume={precipitationData.precipitationArray[1].vol}
                    time={precipitationData.precipitationArray[1].time}
                    type={precipitationData.precipitationArray[1].type}
                    color={color}
                  />
                )}
              </MDBox>
            )}
          </Grid>
        )}
      </Grid>
    </Card>
  );
}

// Default Props
Precipitation.defaultProps = {
  color: "info",
  precipitationData: { precipitationVol: 0, precipitationArray: [] },
};

// Props typechecking
Precipitation.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  precipitationData: PropTypes.object.isRequired,
};

export default Precipitation;
