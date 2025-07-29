import React, { useState } from "react";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// Import contexts for page management
import { useMaterialUIController } from "context";
import { useUnits } from "context/UnitsContext";

function Route({
  routeInfo,
  noGutter,
  deleteRoute,
  onEdit,
  index,
  selectedId,
  selectRoute,
  noEdit,
}) {
  const { imperialUnits } = useUnits();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openDialog, setOpenDialog] = useState(false);

  // Handle delete route dialogue open/close/confirm
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleConfirmDelete = () => {
    deleteRoute(routeInfo);
    setOpenDialog(false);
  };

  // Helper distance conversion and unit functions
  const convertDist = (km) => (imperialUnits ? Math.round(km * 0.621371 * 10) / 10 : km);
  const distUnitLabel = imperialUnits ? "Miles" : "Kilometers";

  const route = routeInfo.route
    .split("-")
    .map((part) => part.split(",")[0].trim())
    .join("-");

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      flexDirection="column"
      bgColor={darkMode ? "light" : "grey-100"}
      variant={darkMode ? "gradient" : ""}
      borderRadius="lg"
      p={3}
      mb={noGutter ? 0 : 1}
      mt={2}
      sx={{
        cursor: "pointer",
        border: selectedId === index ? "2px solid #2196f3" : "2px solid transparent",
        transition: "border 0.3s ease",
        width: "100%",
      }}
      onClick={() => selectRoute?.(index)}
    >
      <MDBox width="100%" display="flex" flexDirection="column">
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
          gap={1}
        >
          <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
            {route}
          </MDTypography>
          <MDBox display="flex" alignItems="center" flexWrap="wrap">
            <MDBox color="text" mr={0.5} lineHeight={0}>
              <Icon color="inherit" fontSize="small">
                date_range
              </Icon>
            </MDBox>
            <MDTypography variant="button" color="text" fontWeight="regular">
              {routeInfo.date}
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          flexWrap="wrap"
        >
          <MDBox>
            <MDTypography variant="caption" color="text">
              Distance:&nbsp;
              <strong>
                {convertDist(routeInfo.distance)} {distUnitLabel}
              </strong>
            </MDTypography>
            <br />
            <MDTypography variant="caption" color="text">
              Journey Time: <strong>{routeInfo.time}</strong>
            </MDTypography>
            <br />
            <MDTypography variant="caption" color="text">
              Weather: <strong>{routeInfo.weather}</strong>
            </MDTypography>
          </MDBox>

          {(!noEdit ?? true) && (
            <MDBox display="flex" flexDirection="row" alignItems="center" gap={1} flexWrap="wrap">
              <MDButton variant="text" color="error" onClick={handleOpenDialog}>
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
              <MDButton
                variant="text"
                color={darkMode ? "white" : "dark"}
                onClick={() => onEdit(index)}
              >
                <Icon>edit</Icon>&nbsp;edit
              </MDButton>
            </MDBox>
          )}
        </MDBox>
      </MDBox>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: darkMode ? "#1a2035" : "#f0f2f5",
          },
        }}
      >
        <DialogTitle>Confirm Deletion of &apos;{route}&apos;</DialogTitle>
        <DialogContent>Are you sure you want to delete this route?</DialogContent>
        <DialogActions>
          <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={handleCloseDialog}>
            Cancel
          </MDButton>
          <MDButton variant="text" color="error" onClick={handleConfirmDelete}>
            <Icon>delete</Icon>&nbsp;delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

// Default Props
Route.defaultProps = {
  noGutter: false,
};

// Props typechecking
Route.propTypes = {
  routeInfo: PropTypes.object.isRequired,
  noGutter: PropTypes.bool,
  deleteRoute: PropTypes.func,
  onEdit: PropTypes.func,
  index: PropTypes.number.isRequired,
  selectedId: PropTypes.number,
  selectRoute: PropTypes.func.isRequired,
  noEdit: PropTypes.bool,
};

export default Route;
