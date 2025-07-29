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

// Default Material Dashboard 2 MDAlert component

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Fade from "@mui/material/Fade";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Custom styles for the MDAlert
import MDAlertRoot from "components/MDAlert/MDAlertRoot";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";

function MDAlert({ color, dismissible, children, removeAlert, index, ...rest }) {
  const [alertStatus, setAlertStatus] = useState("mount");

  // Trigger fade out when close icon is clicked
  const handleAlertStatus = () => {
    setAlertStatus("fadeOut");
  };

  // Remove alert from parent after fade out animation completes
  useEffect(() => {
    let timer;
    if (alertStatus === "fadeOut") {
      timer = setTimeout(() => {
        setAlertStatus("unmount");
        removeAlert(index);
      }, 400); // Must match Fade's timeout
    }
    return () => clearTimeout(timer);
  }, [alertStatus, index, removeAlert]);

  // Don't render anything once unmounted
  if (alertStatus === "unmount") return null;

  return (
    <Fade in={alertStatus === "mount"} timeout={300}>
      <MDAlertRoot ownerState={{ color }} {...rest}>
        <MDBox display="flex" alignItems="center" color="white">
          {children}
        </MDBox>
        {dismissible && <MDAlertCloseIcon onClick={handleAlertStatus}>&times;</MDAlertCloseIcon>}
      </MDAlertRoot>
    </Fade>
  );
}

// Default props
MDAlert.defaultProps = {
  color: "info",
  dismissible: false,
};

// Prop types
MDAlert.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  dismissible: PropTypes.bool,
  children: PropTypes.node.isRequired,
  removeAlert: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default MDAlert;
