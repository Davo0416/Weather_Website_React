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

// Default Material Dashboard 2 MDButton component (Slightly modified)

import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for MDButton
import MDButtonRoot from "components/MDButton/MDButtonRoot";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

const MDButton = forwardRef(
  ({ color, variant, size, circular, iconOnly, borderRadius, children, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    return (
      <MDButtonRoot
        {...rest}
        ref={ref}
        color="primary"
        variant={variant === "gradient" ? "contained" : variant}
        size={size}
        ownerState={{
          color,
          variant,
          size,
          circular,
          iconOnly,
          darkMode,
          borderRadius,
        }}
      >
        {children}
      </MDButtonRoot>
    );
  }
);

MDButton.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
  circular: false,
  iconOnly: false,
  borderRadius: undefined,
};

MDButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large", "searchBar"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  color: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  borderRadius: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default MDButton;
