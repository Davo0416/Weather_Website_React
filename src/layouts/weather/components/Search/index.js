import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";

// Functional searchbar component
function Search({ callFunction, error, success, color }) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  // Handle searchbox change
  const handleChange = (e) => {
    setInputVal(e.target.value);
  };

  // Handle search
  const handleSearch = () => {
    callFunction(inputVal);
    setInputVal("");
    inputRef.current.focus();
  };

  // Trigger search on enter press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <MDBox mb={2}>
      <Card>
        <MDBox p={2}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h4" fontWeight="medium">
              Search
            </MDTypography>
            <MDBox display="flex">
              <MDInput
                inputRef={inputRef}
                label="Enter the Location"
                success={success}
                error={error}
                size="medium"
                value={inputVal}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <MDBox ml={-1} mt={-0.1}>
                <MDButton
                  borderRadius="0px 10px 10px 0px"
                  iconOnly
                  size="searchBar"
                  variant="gradient"
                  color={color}
                  onClick={handleSearch}
                >
                  <Icon sx={{ fontWeight: "bold" }}>search</Icon>
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </MDBox>
  );
}

// Props typechecking
Search.propTypes = {
  callFunction: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
};

export default Search;
