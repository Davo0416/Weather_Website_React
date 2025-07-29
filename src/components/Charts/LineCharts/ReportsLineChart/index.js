import { useMemo } from "react";

import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Chart configurations
import configs from "components/Charts/LineCharts/ReportsLineChart/configs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Functions for creating a chart based on data and background color
function TempChart({ color, date, chart }) {
  const { data, options } = configs(
    chart.labels || [],
    chart.datasets || {},
    `°${chart.datasets.label}`
  );

  return (
    <MDBox padding="1rem">
      {useMemo(
        () => (
          <MDBox
            variant="gradient"
            bgColor={color}
            borderRadius="lg"
            coloredShadow={color}
            py={2}
            pr={0.5}
            mt={-5}
            height="12.5rem"
          >
            <Line data={data} options={options} redraw />
          </MDBox>
        ),
        [chart, color]
      )}
      <MDBox pt={3} pb={1} px={1}>
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
            <Icon>schedule</Icon>
          </MDTypography>
          <MDTypography variant="button" color="text" fontWeight="light">
            updated {date} min ago
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Default Props
TempChart.defaultProps = {
  color: "info",
  description: "",
};

// Props typechecking
TempChart.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.number.isRequired,
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
};

export default TempChart;
