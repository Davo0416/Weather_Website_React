import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import NotificationBox from "./NotificationBox";

function Notifications() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Notifications</MDTypography>
              </MDBox>
              <NotificationBox />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
