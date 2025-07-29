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

// Default Material Dashboard 2 DashboardLayout component

import { useState, useEffect } from "react";

// react-router components
import { useLocation } from "react-router-dom";

// prop-types
import PropTypes from "prop-types";

// @mui/material components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Custom components
import MDBox from "components/MDBox";
import Breadcrumbs from "components/Breadcrumbs";

// Custom styles
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
} from "components/Navbars/DashboardNavbar/styles";

// Context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (fixedNavbar) setNavbarType("sticky");
    else setNavbarType("static");

    const handleTransparentNavbar = () => {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    };

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    ></Menu>
  );

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar
        sx={(theme) => ({
          ...navbarContainer(theme),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          width: "100%",
        })}
      >
        {/* Left side: Breadcrumbs */}
        <MDBox color="inherit" sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>

        {/* Right side: Settings button */}
        {!isMini && (
          <MDBox display="flex" alignItems="center" justifyContent="flex-end" ml="auto">
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarIconButton}
              onClick={handleMiniSidenav}
            >
              <Icon sx={iconsStyle}>menu</Icon>
            </IconButton>
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarIconButton}
              onClick={handleConfiguratorOpen}
            >
              <Icon sx={iconsStyle}>settings</Icon>
            </IconButton>
          </MDBox>
        )}
      </Toolbar>
      {renderMenu()}
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
