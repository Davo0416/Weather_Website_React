import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

var currentTime;
var currentTimezone = 0;
var weekday, day, month, year, time;

// Functional component for displaying day and time based on the timezone
function Time({ timezone, dayVal }) {
  const [time, setTime] = useState(new Date());
  if (timezone != null) currentTimezone = timezone;
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (dayVal == "Today")
    return (
      <MDTypography variant="h6" fontWeight="medium" align="right">
        {weekday} {currentTime}
      </MDTypography>
    );
  else
    return (
      <MDTypography variant="h6" fontWeight="medium" align="right">
        {dayVal}
      </MDTypography>
    );
}

// Function to update time based on local time and the timezone
function updateTime() {
  var d = new Date();
  var localTime = d.getTime();
  var localOffset = d.getTimezoneOffset() * 60000;
  var utc = localTime + localOffset;

  var timeArray = (new Date(utc + 1000 * currentTimezone) + "").split(" ");

  weekday = timeArray[0];
  month = timeArray[1];
  day = timeArray[2];
  year = timeArray[3];
  time = timeArray[4];

  currentTime = time.slice(0, -3);
}

// Update time every second for accurate time
setInterval(updateTime, 1000);

// Props typechecking
Time.propTypes = {
  timezone: PropTypes.number.isRequired,
  dayVal: PropTypes.string,
};

export default Time;
