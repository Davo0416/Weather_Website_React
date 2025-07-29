import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import PropTypes from "prop-types";
import Route from "layouts/plan/components/Route";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDInput from "components/MDInput";

//Import contexts for page management
import { useMaterialUIController } from "context";
import { useUser } from "context/UserContext";

function Planned({
  plannedRoutes,
  noEdit,
  addRoute,
  deleteRoute,
  editIndex,
  startEditRoute,
  selectRouteMap,
  selectedId,
}) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  // Handle delete confirmation open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formData, setFormData] = useState({
    locations: ["", ""],
    startDate: "",
    startTime: "",
  });

  // Handle route loctaion chnage when edited
  const handleLocationChange = (index, value) => {
    const newLocations = [...formData.locations];
    newLocations[index] = value;
    setFormData({ ...formData, locations: newLocations });
  };

  // Add a stop to the route
  const addLocation = () => {
    setFormData({ ...formData, locations: [...formData.locations, ""] });
  };

  // Remove a stop from the route
  const removeLocation = (index) => {
    if (formData.locations.length <= 2) return;
    const newLocations = formData.locations.filter((_, i) => i !== index);
    setFormData({ ...formData, locations: newLocations });
  };

  // Select route by ID
  function selectRoute(id) {
    selectRouteMap?.(id);
  }

  // Handle route edit
  useEffect(() => {
    if (editIndex !== null && plannedRoutes[editIndex]) {
      const selected = plannedRoutes[editIndex];
      const locations = selected.route.split("-");
      const [startDate, startTime] = selected.date.split(" ");
      setFormData({
        locations: locations.length >= 2 ? locations : ["", ""],
        startDate: startDate || "",
        startTime: startTime || "",
      });
      setOpen(true);
    }
  }, [editIndex]);

  // Handle form data after change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle route form submit
  const handleSubmit = () => {
    // Check all locations are filled
    if (formData.locations.some((loc) => !loc.trim())) {
      alert("Please fill all location fields.");
      return;
    }
    if (!formData.startDate || !formData.startTime) {
      alert("Please fill date and time.");
      return;
    }

    const routeStr = formData.locations.join("-");

    const newRoute = {
      route: routeStr,
      date: `${formData.startDate} ${formData.startTime}`,
      distance: "5",
      time: "2 hours",
      weather: "Scattered clouds",
    };

    addRoute(newRoute);
    setFormData({ locations: ["", ""], startDate: "", startTime: "" });
    setOpen(false);
  };

  return (
    <Card id="delete-account" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <MDBox pt={3} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Planned routes
        </MDTypography>
        {(!noEdit ?? true) && (
          <MDBox>
            <MDButton variant="gradient" color="dark" onClick={handleOpen}>
              <Icon sx={{ fontWeight: "bold" }}>add</Icon>
              &nbsp;add new route
            </MDButton>
            <Dialog
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  backgroundColor: darkMode ? "#1a2035" : "#f0f2f5",
                },
              }}
            >
              <DialogTitle>{editIndex !== null ? "Edit route" : "Add a new route"}</DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  {formData.locations.map((loc, index) => (
                    <Grid item xs={12} key={index} container spacing={1} alignItems="center">
                      <Grid item xs={10}>
                        <MDInput
                          label={`Location ${index + 1}`}
                          value={loc}
                          onChange={(e) => handleLocationChange(index, e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={2}>
                        {formData.locations.length > 2 && (
                          <MDButton
                            variant="outlined"
                            color="error"
                            onClick={() => removeLocation(index)}
                            sx={{ minWidth: "40px", padding: "6px 8px'" }}
                          >
                            &times;
                          </MDButton>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                  <MDButton
                    variant="gradient"
                    color="dark"
                    onClick={addLocation}
                    sx={{ mt: 1, ml: 2 }}
                  >
                    Add Location
                  </MDButton>
                  <Grid item xs={12}>
                    <MDInput
                      label="Start Date"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                      autoComplete="off"
                      sx={{
                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                          filter: darkMode ? "invert(1)" : "invert(0)", // Invert makes it white on dark mode
                        },
                        "&.Mui-focused": {
                          backgroundColor: darkMode ? "#2c3457" : "#f0f2f5", // keep same bg on focus
                        },
                        "& input": {
                          backgroundColor: "transparent", // make sure input itself is transparent
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MDInput
                      label="Start Time"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                      sx={{
                        '& input[type="time"]::-webkit-calendar-picker-indicator': {
                          filter: darkMode ? "invert(1)" : "invert(0)",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <MDButton onClick={handleClose} color="error">
                  Cancel
                </MDButton>
                <MDButton onClick={handleSubmit} color="dark" variant="gradient">
                  {editIndex == null && <Icon sx={{ fontWeight: "bold" }}>add</Icon>}
                  &nbsp;{editIndex !== null ? "Save" : "Add"}
                </MDButton>
              </DialogActions>
            </Dialog>
          </MDBox>
        )}
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        {plannedRoutes.length == 0 && (
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            <MDTypography variant="h6" fontWeight="medium">
              No planned routes
            </MDTypography>
          </MDBox>
        )}
        {plannedRoutes.map((route, index) => (
          <Route
            selectedId={selectedId}
            selectRoute={selectRoute}
            key={index}
            routeInfo={route}
            noGutter={true}
            deleteRoute={deleteRoute}
            onEdit={startEditRoute}
            noEdit={noEdit}
            index={index}
          />
        ))}
        {!user && (
          <MDBox mt={2}>
            <MDTypography> Sign in to save your planned routes</MDTypography>
          </MDBox>
        )}
      </MDBox>
    </Card>
  );
}

// Props typechecking
Planned.propTypes = {
  plannedRoutes: PropTypes.array.isRequired,
  addRoute: PropTypes.func,
  deleteRoute: PropTypes.func,
  editIndex: PropTypes.func,
  startEditRoute: PropTypes.func,
  selectRouteMap: PropTypes.func,
  selectedId: PropTypes.number,
  noEdit: PropTypes.bool,
};

export default Planned;
