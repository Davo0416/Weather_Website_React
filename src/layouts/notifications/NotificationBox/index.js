import MDAlert from "components/MDAlert";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// Import alert context for loading and saving the alerts
import { useAlert } from "context/AlertContext";

// Functional component for rendering users current notifications and managing them
function NotificationBox({}) {
  const { alerts, closeAlert } = useAlert();
  console.log(alerts);

  return (
    <MDBox
      pt={2}
      px={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {alerts?.length === 0 && (
        <MDBox p={2}>
          <MDTypography variant="h6">No Notifications</MDTypography>
        </MDBox>
      )}
      {alerts?.map((alert, index) => (
        <MDAlert
          key={alert.id}
          index={alert.id}
          color={alert.color}
          dismissible
          removeAlert={closeAlert}
        >
          <MDTypography variant="body2" color="white">
            {alert.text}
          </MDTypography>
        </MDAlert>
      ))}
    </MDBox>
  );
}

NotificationBox.propTypes = {};

export default NotificationBox;
