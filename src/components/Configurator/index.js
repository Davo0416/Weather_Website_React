/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Default Material Dashboard 2 Configurator component (Slightly modified)

import { useState, useEffect } from "react";

// @mui material components
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// @mui icons
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Custom styles for the Configurator
import ConfiguratorRoot from "components/Configurator/ConfiguratorRoot";
import { useUser } from "context/UserContext";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setOpenConfigurator,
  setTransparentSidenav,
  setWhiteSidenav,
  setFixedNavbar,
  setSidenavColor,
  setDarkMode,
  setImperialUnits,
} from "context";

function Configurator() {
  const { user } = useUser();
  const [controller, dispatch] = useMaterialUIController();
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const {
    openConfigurator,
    fixedNavbar,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    imperialUnits,
  } = controller;
  const [disabled, setDisabled] = useState(false);
  const sidenavColors = ["primary", "dark", "info", "success", "warning", "error"];

  // Use the useEffect hook to change the button state for the sidenav type based on window size.
  useEffect(() => {
    // A function that sets the disabled state of the buttons for the sidenav type.
    function handleDisabled() {
      return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
    }

    // The event listener that's calling the handleDisabled function when resizing the window.
    window.addEventListener("resize", handleDisabled);

    // Call the handleDisabled function to set the state with the initial value.
    handleDisabled();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleDisabled);
  }, []);

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);
  const handleTransparentSidenav = () => {
    setTransparentSidenav(dispatch, true);
    setWhiteSidenav(dispatch, false);
  };
  const handleWhiteSidenav = () => {
    setWhiteSidenav(dispatch, true);
    setTransparentSidenav(dispatch, false);
  };
  const handleDarkSidenav = () => {
    setWhiteSidenav(dispatch, false);
    setTransparentSidenav(dispatch, false);
  };
  const handleFixedNavbar = () => setFixedNavbar(dispatch, !fixedNavbar);
  const handleDarkMode = () => setDarkMode(dispatch, !darkMode);
  const handleImperial = () => {
    setImperialUnits(dispatch, !imperialUnits);
  };

  // sidenav type buttons styles
  const sidenavTypeButtonsStyles = ({
    functions: { pxToRem },
    palette: { white, dark, background },
    borders: { borderWidth },
  }) => ({
    height: pxToRem(39),
    background: darkMode ? background.sidenav : white.main,
    color: darkMode ? white.main : dark.main,
    border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,

    "&:hover, &:focus, &:focus:not(:hover)": {
      background: darkMode ? background.sidenav : white.main,
      color: darkMode ? white.main : dark.main,
      border: `${borderWidth[1]} solid ${darkMode ? white.main : dark.main}`,
    },
  });

  // sidenav type active button styles
  const sidenavTypeActiveButtonStyles = ({
    functions: { pxToRem, linearGradient },
    palette: { white, gradients, background },
  }) => ({
    height: pxToRem(39),
    background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
    color: darkMode ? background.sidenav : white.main,

    "&:hover, &:focus, &:focus:not(:hover)": {
      background: darkMode ? white.main : linearGradient(gradients.dark.main, gradients.dark.state),
      color: darkMode ? background.sidenav : white.main,
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (user?._id) {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/settings/${user._id}`);
          if (res.ok) {
            const data = await res.json();
            console.log("✅ Settings Loaded:", data);

            if (data) {
              const {
                sidenavColor,
                darkMode,
                imperialUnits,
                fixedNavbar,
                transparentSidenav,
                whiteSidenav,
              } = data;

              // Dispatch values into Material UI controller context
              if (sidenavColor) setSidenavColor(dispatch, sidenavColor);
              if (typeof darkMode === "boolean") setDarkMode(dispatch, darkMode);
              if (typeof imperialUnits === "boolean") setImperialUnits(dispatch, imperialUnits);
              if (typeof fixedNavbar === "boolean") setFixedNavbar(dispatch, fixedNavbar);
              if (typeof transparentSidenav === "boolean")
                setTransparentSidenav(dispatch, transparentSidenav);
              if (typeof whiteSidenav === "boolean") setWhiteSidenav(dispatch, whiteSidenav);
              setSettingsLoaded(true);
            }
          }
        } catch (err) {
          console.error("❌ Error loading settings:", err);
        }
      }
    };

    loadSettings();
  }, [user]);

  useEffect(() => {
    //if (!settingsLoaded) return;
    const settings = {
      sidenavColor,
      darkMode,
      imperialUnits,
      fixedNavbar,
      transparentSidenav,
      whiteSidenav,
    };

    saveSettings(settings);
  }, [sidenavColor, darkMode, imperialUnits, fixedNavbar, transparentSidenav, whiteSidenav]);

  const saveSettings = async (settings) => {
    if (user?._id) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/settings/${user._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Error saving settings:", data.message || "Something went wrong.");
        } else {
          console.log("Settings saved successfully");
        }
      } catch (err) {
        console.error("Server error. Please try again later.");
      }
    }
  };

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        pt={4}
        pb={0.5}
        px={3}
      >
        <MDBox>
          <MDTypography variant="h5">Settings</MDTypography>
          <MDTypography variant="body2" color="text">
            See our customization options.
          </MDTypography>
        </MDBox>

        <Icon
          sx={({ typography: { size }, palette: { dark, white } }) => ({
            fontSize: `${size.lg} !important`,
            color: darkMode ? white.main : dark.main,
            stroke: "currentColor",
            strokeWidth: "2px",
            cursor: "pointer",
            transform: "translateY(5px)",
          })}
          onClick={handleCloseConfigurator}
        >
          close
        </Icon>
      </MDBox>

      <Divider />

      <MDBox pt={0.5} pb={3} px={3}>
        <MDBox>
          <MDTypography variant="h6">Secondary Colors</MDTypography>
          <MDTypography variant="button" color="text">
            Choose between different secondary colors.
          </MDTypography>
          <MDBox mb={0.5}>
            {sidenavColors.map((color) => (
              <IconButton
                key={color}
                sx={({
                  borders: { borderWidth },
                  palette: { white, dark, background },
                  transitions,
                }) => ({
                  width: "24px",
                  height: "24px",
                  padding: 0,
                  border: `${borderWidth[1]} solid ${darkMode ? background.sidenav : white.main}`,
                  borderColor: () => {
                    let borderColorValue = sidenavColor === color && dark.main;

                    if (darkMode && sidenavColor === color) {
                      borderColorValue = white.main;
                    }

                    return borderColorValue;
                  },
                  transition: transitions.create("border-color", {
                    easing: transitions.easing.sharp,
                    duration: transitions.duration.shorter,
                  }),
                  backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) =>
                    linearGradient(gradients[color].main, gradients[color].state),

                  "&:not(:last-child)": {
                    mr: 1,
                  },

                  "&:hover, &:focus, &:active": {
                    borderColor: darkMode ? white.main : dark.main,
                  },
                })}
                onClick={() => setSidenavColor(dispatch, color)}
              />
            ))}
          </MDBox>
        </MDBox>

        <MDBox mt={3} lineHeight={1}>
          <MDTypography variant="h6">Sidenav Type</MDTypography>
          <MDTypography variant="button" color="text">
            Choose between different sidenav types.
          </MDTypography>

          <MDBox
            sx={{
              display: "flex",
              mt: 2,
              mr: 1,
            }}
          >
            <MDButton
              color="dark"
              variant="gradient"
              onClick={handleDarkSidenav}
              disabled={disabled}
              fullWidth
              sx={
                !transparentSidenav && !whiteSidenav
                  ? sidenavTypeActiveButtonStyles
                  : sidenavTypeButtonsStyles
              }
            >
              Dark
            </MDButton>
            <MDBox sx={{ mx: 1, width: "8rem", minWidth: "8rem" }}>
              <MDButton
                color="dark"
                variant="gradient"
                onClick={handleTransparentSidenav}
                disabled={disabled}
                fullWidth
                sx={
                  transparentSidenav && !whiteSidenav
                    ? sidenavTypeActiveButtonStyles
                    : sidenavTypeButtonsStyles
                }
              >
                Transparent
              </MDButton>
            </MDBox>
            <MDButton
              color="dark"
              variant="gradient"
              onClick={handleWhiteSidenav}
              disabled={disabled}
              fullWidth
              sx={
                whiteSidenav && !transparentSidenav
                  ? sidenavTypeActiveButtonStyles
                  : sidenavTypeButtonsStyles
              }
            >
              White
            </MDButton>
          </MDBox>
        </MDBox>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          lineHeight={1}
        >
          <MDTypography variant="h6">Navbar Fixed</MDTypography>

          <Switch checked={fixedNavbar} onChange={handleFixedNavbar} color="black" />
        </MDBox>
        <Divider />
        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDTypography variant="h6">Dark Mode</MDTypography>

          <Switch checked={darkMode} onChange={handleDarkMode} color="black" />
        </MDBox>
        <Divider />
        <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
          <MDTypography variant="h6">Imperial Units</MDTypography>

          <Switch checked={imperialUnits} onChange={handleImperial} color="black" />
        </MDBox>
        <Divider />
      </MDBox>
    </ConfiguratorRoot>
  );
}

export default Configurator;
