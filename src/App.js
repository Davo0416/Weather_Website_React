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

// Material Dashboard 2 App code with a few changes

import { useState, useEffect } from "react";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";

import Sidenav from "components/Sidenav";
import Configurator from "components/Configurator";
import { AlertProvider } from "context/AlertContext";
import { RoutesProvider } from "context/RoutesContext";
import { UserProvider } from "context/UserContext";
import { UnitsProvider } from "context/UnitsContext";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React routes
import routes from "routes";
import { useUser } from "context/UserContext";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React contexts
import {
  useMaterialUIController,
  setMiniSidenav,
  setOpenConfigurator,
  setImperialUnits,
} from "context";

// Images
import brand from "assets/images/skyroute.png";
import { WeatherProvider } from "context/WeatherContext";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    darkMode,
    imperialUnits,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <UnitsProvider
        imperialUnits={imperialUnits}
        setImperialUnits={(value) => setImperialUnits(dispatch, value)}
      >
        <UserProvider>
          <AlertProvider>
            <WeatherProvider>
              <RoutesProvider>
                <CssBaseline />
                {layout === "dashboard" && (
                  <>
                    <Sidenav
                      color={sidenavColor}
                      brand={(transparentSidenav && !darkMode) || brand}
                      brandName="SkyRoute"
                      routes={routes}
                      onMouseEnter={handleOnMouseEnter}
                      onMouseLeave={handleOnMouseLeave}
                    />
                    <Configurator />
                  </>
                )}
                {layout === "vr" && <Configurator />}
                <Routes>
                  {getRoutes(routes)}
                  <Route path="/" element={<Navigate to={useUser() ? "/" : "/weather"} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </RoutesProvider>
            </WeatherProvider>
          </AlertProvider>
        </UserProvider>
      </UnitsProvider>
    </ThemeProvider>
  );
}
