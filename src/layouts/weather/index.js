import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";

import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import Search from "layouts/weather/components/Search";
import WeatherStats from "layouts/weather/components/WeatherStats";
import Weather from "layouts/weather/components/Weather";
import Map from "components/Map";
import MapSettings from "components/MapSettings";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Forecast from "layouts/weather/components/Forecast";

// Importing contexts for data and UI management
import { useWeather } from "context/WeatherContext";
import { useAlert } from "context/AlertContext";
import { useUnits } from "context/UnitsContext";
import { useTheme, useMediaQuery } from "@mui/material";
import { useMaterialUIController } from "context";

var selectedForecast = -1;

function WeatherPage() {
  const { imperialUnits } = useUnits();
  const { weatherState, setWeatherState } = useWeather();
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;

  const [location, setLocation] = useState("");
  const [dayVal, setDayVal] = useState("Today");
  const [temperature, setTemperature] = useState(0);
  const [precipitationData, setPrecipitationData] = useState({
    precipitationVol: 0,
    precipitationArray: [],
  });
  const [visibility, setVisibility] = useState(0);
  const [weather, setWeather] = useState("");
  const [timezone, setTimezone] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [forecastUpdated, setForecastUpdated] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [graphData, setGraphData] = useState({ labels: [], datasets: { label: "", data: [] } });
  const [windSpeed, setWindSpeed] = useState(0);
  const [windDir, setWindDir] = useState(0);
  const [pressure, setPressure] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [forecastData, setForecastData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [settings, setSettings] = useState({});

  const { addAlert } = useAlert();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  // Defining variables
  var todaysWeather = "";
  var todaysTemp = 0;
  var todaysPressure = 0;
  var todaysCoverage = 0;
  var todaysHumidity = 0;
  var todaysWindSpeed = 0;
  var todaysWindDir = 0;
  var todaysVisibility = 0;

  var currentDt = 0;
  var currentForecastDt = 0;

  const weatherInterval = useRef(null);
  const forecastInterval = useRef(null);

  // Get users locations weather or load from DB
  useEffect(() => {
    setSettings({ ...settings, route: null });
    if (!weatherState) {
      getLocation();
    } else {
      // Restore from context
      setLocation(weatherState.location);
      setTemperature(weatherState.temperature);
      setWeather(weatherState.weather);
      setTimezone(weatherState.timezone);
      setWindSpeed(weatherState.windSpeed);
      setWindDir(weatherState.windDir);
      setHumidity(weatherState.humidity);
      setPressure(weatherState.pressure);
      setCoverage(weatherState.coverage);
      setVisibility(weatherState.visibility);
      setCountryCode(weatherState.countryCode);
      const newSettings = {
        ...settings,
        route: null,
        imperialUnits: imperialUnits,
        location: { latitude: weatherState.coords.lat, longitude: weatherState.coords.lon },
      };
      setSettings(newSettings);
      if (weatherState.forecastData && weatherState.forecastData.length > 0) {
        setForecastData(weatherState.forecastData);
        const firstForecast = weatherState.forecastData[0];
        setPrecipitationData(
          firstForecast.precipitation || { precipitationVol: 0, precipitationArray: [] }
        );
        setGraphData({
          labels: firstForecast.dayTimes || [],
          datasets: { label: "", data: firstForecast.dayTemps || [] },
        });
      }
    }
  }, []);

  // Update settings on darkMode and imperialUnits change
  useEffect(() => {
    onSettingsChange(settings);
  }, [darkMode, imperialUnits]);

  // Select 1st forecast on forecast load
  useEffect(() => {
    if (forecastData.length != 0) selectForecast(0);
  }, [forecastData]);

  // Reset map settings on load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (weatherState) {
        const newSettings = {
          ...settings,
          route: null,
          imperialUnits: imperialUnits,
          location: {
            latitude: weatherState.coords.lat,
            longitude: weatherState.coords.lon,
          },
        };
        setSettings(newSettings);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Function used for updating weather from the map script
  const callFunction = (loc) => {
    updateWeather(loc, false);
  };

  // Select forecast by ID
  const selectForecast = (num) => {
    if (selectedForecast != num) {
      setGraphData({
        labels: forecastData[num].dayTimes,
        datasets: { label: "", data: forecastData[num].dayTemps },
      });
      setWeather(forecastData[num].weather);
      setWindDir(forecastData[num].windDir);
      setWindSpeed(forecastData[num].windSpeed);
      setHumidity(forecastData[num].humidity);
      setPressure(forecastData[num].pressure);
      setCoverage(forecastData[num].cloudCoverage);
      setVisibility(forecastData[num].visibility);
      setDayVal(forecastData[num].day);
      setPrecipitationData(forecastData[num].precipitation);

      selectedForecast = num;

      if (selectedForecast != 0) setTemperature(forecastData[num].maxTemp);
      else setTemperature(forecastData[0].currentTemp);
    }
  };

  // Radian/Degree conversion functions
  function toRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  function toDegrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
  }

  // Helper conversion and label functions
  const convertTemp = useCallback(
    (celsius) => (imperialUnits ? (celsius * 9) / 5 + 32 : celsius),
    [imperialUnits]
  );
  const convertSpeed = (mps) => (imperialUnits ? Math.round(mps * 2.237 * 10) / 10 : mps);
  const convertPressure = (hPa) => (imperialUnits ? Math.round(hPa * 0.0145038 * 10) / 10 : hPa);
  const convertVisibility = (km) => (imperialUnits ? Math.round(km * 0.621371 * 10) / 10 : km);
  const tempUnitLabel = imperialUnits ? "F" : "C";
  const speedUnitLabel = imperialUnits ? "MPH" : "M/S";
  const pressureUnitLabel = imperialUnits ? "psi" : "hPa";
  const visibilityUnitLabel = imperialUnits ? "MI" : "KM";

  const tempData = useMemo(
    () => ({
      labels: graphData.labels,
      datasets: {
        label: tempUnitLabel,
        data: graphData.datasets.data.map((t) => convertTemp(t)),
      },
    }),
    [graphData, tempUnitLabel, convertTemp]
  );

  // Update the time that weather was last updated
  function weatherUpdateTime() {
    const d = new Date();
    const localOffset = d.getTimezoneOffset() * 60000;
    const updateDate = new Date((currentDt + timezone) * 1000 + localOffset);
    var localTime = d.getTime();
    var utc = localTime + localOffset;

    const date = new Date(utc + 1000 * timezone);

    var diff = date - updateDate;

    setUpdated(Math.floor(diff / 60000));
  }

  // Update the time that forecast was last updated
  function forecastUpdateTime() {
    const d = new Date();
    const localOffset = d.getTimezoneOffset() * 60000;
    const updateDate = new Date((currentForecastDt + timezone) * 1000 + localOffset);
    var localTime = d.getTime();
    var utc = localTime + localOffset;

    const date = new Date(utc + 1000 * timezone);

    var diff = date - updateDate;
    var hours = Math.floor(diff / 3600000);
    var minutes = Math.floor((diff - hours * 3600000) / 60000);
    hours += 3;
    var updateTime;

    if (hours == 0) updateTime = minutes + " minutes";
    else if (minutes == 0) updateTime = hours + " hours ";
    else updateTime = hours + " hours " + minutes + " minutes";

    setForecastUpdated(updateTime);
  }

  // Update weather by location or ID function
  const updateWeather = (loc, isByID) => {
    let url = `${process.env.REACT_APP_API_URL}/api/weather?city=${encodeURIComponent(loc)}`;
    if (isByID) url = `${process.env.REACT_APP_API_URL}/api/weather?id=${loc}`;

    // Call the backend for the data
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.cod !== 200) {
          addAlert({
            text: "Failed to find the location " + loc,
            color: "error",
            icon: "notification",
          });
          setSuccess(false);
          setError(true);
          return;
        }

        // Update all the data and the map based on the recieved data
        setLocation(loc);

        const newSettings = {
          ...settings,
          route: null,
          imperialUnits: imperialUnits,
          location: { latitude: data.coord.lat, longitude: data.coord.lon },
        };
        setSettings(newSettings);

        if (weatherInterval.current !== null) clearInterval(weatherInterval.current);
        weatherInterval.current = setInterval(weatherUpdateTime, 1000);

        setSuccess(true);
        setError(false);
        currentDt = data.dt;
        setLocation(data.name);
        setWeather(data.weather[0].description);
        setTemperature(Math.round(data.main.temp));
        setTimezone(data.timezone);
        setCountryCode(data.sys.country);
        setWindDir(data.wind.deg);
        setWindSpeed(Math.round(data.wind.speed * 10) / 10);
        setHumidity(data.main.humidity);
        setPressure(data.main.pressure);
        setCoverage(data.clouds.all);
        setVisibility(data.visibility);

        todaysWeather = data.weather[0].description;
        todaysTemp = Math.round(data.main.temp);
        todaysPressure = data.main.pressure;
        todaysCoverage = data.clouds.all;
        todaysHumidity = data.main.humidity;
        todaysWindSpeed = Math.round(data.wind.speed * 10) / 10;
        todaysWindDir = data.wind.deg;
        todaysVisibility = data.visibility;
        weatherUpdateTime();

        // Compile all the weather data
        const fullWeatherData = {
          timestamp: Date.now(),
          currentDt: data.dt,
          location: data.name,
          coords: data.coord,
          timezone: data.timezone,
          countryCode: data.sys.country,
          weather: data.weather[0].description,
          temperature: Math.round(data.main.temp),
          windDir: data.wind.deg,
          windSpeed: Math.round(data.wind.speed * 10) / 10,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          coverage: data.clouds.all,
          visibility: data.visibility,
          updated: updated,
          forecastData: [],
        };

        // Send the data over to the forecast function
        updateForecast(loc, data.timezone, isByID, fullWeatherData);
      })
      .catch((error) => {
        setSuccess(false);
        setError(true);
        console.error("Error fetching weather data:", error);
      });
  };

  // Update forecast based on the location or ID function
  const updateForecast = (loc, tz, isByID, weatherData) => {
    let url = `${process.env.REACT_APP_API_URL}/api/forecast?city=${encodeURIComponent(loc)}`;
    if (isByID) url = `${process.env.REACT_APP_API_URL}/api/forecast?id=${loc}`;

    // Call backend for the forecast data
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const APIData = data.list;
        currentForecastDt = APIData[0].dt;
        if (forecastInterval.current != null) clearInterval(forecastInterval.current);
        forecastInterval.current = setInterval(forecastUpdateTime, 1000);
        const forecastTimes = [];
        const forecastTemps = [];
        const newForecastData = [];

        var offset = 0;

        //Divide the data into 5 parts based on the 5 days
        //Package the data into arrays for more optimal usage
        for (let j = 0; j < 5; j++) {
          var precipitationArray = [];
          var temps = [];
          var times = [];
          var averageCloudiness = 0;
          var dayHumidity = 0;
          var dayPressure = 0;
          var dayVisibility = 0;
          var dayWindSpeed = 0;
          var windDirSumX = 0;
          var windDirSumY = 0;

          var precipitationVol = 0;
          var dayVol = 0;
          var pop = 0;
          var hours = 0;
          var start = "";
          var startDay = "";

          var day = "";
          for (let i = 0; i < 8; i++) {
            var id = j * 8 + i;
            if (j != 0) id -= offset;
            const element = APIData[id];
            const d = new Date();
            const localOffset = d.getTimezoneOffset() * 60000;
            const date = new Date((element.dt + tz) * 1000 + localOffset);
            day = date.toString().split(" ")[0];
            var time = date.toString().split(" ")[4].slice(0, -3);
            if (j == 0 && i != 0)
              if (time == "00:00" || time == "01:00" || time == "02:00") offset = 8 - i;
            times.push(time);
            temps.push(Math.round(element.main.temp * 10) / 10);
            averageCloudiness += element.clouds.all;
            dayHumidity += element.main.humidity;
            dayWindSpeed += element.wind.speed;
            dayPressure += element.main.pressure;
            dayVisibility += element.visibility;
            windDirSumX += Math.cos(toRadians(element.wind.deg));
            windDirSumY += Math.sin(toRadians(element.wind.deg));
            var vol = element.rain?.["3h"];
            if (vol != null) {
              if (start == "") start = time;
              if (startDay == "") startDay = day;
              dayVol += vol;
              precipitationVol += vol;
              hours += 3;
              pop = Math.max(pop, element.pop);
            } else if (hours != 0) {
              var precipitation = {
                pop: Math.round(pop * 100),
                type: "Rain",
                vol: Math.round((precipitationVol / hours) * 100) / 100,
                time: start + "-" + time,
              };
              precipitationArray.push(precipitation);
              precipitationVol = 0;
              hours = 0;
              pop = 0;
              start = "";
              startDay = "";
            }
            if (i == 7 && hours != 0) {
              var endDate = new Date((element.dt + tz + 10800) * 1000 + localOffset);
              var precipitation = {
                pop: Math.round(pop * 100),
                type: "Rain",
                vol: Math.round((precipitationVol / hours) * 100) / 100,
                time: start + "-" + endDate.toString().split(" ")[4].slice(0, -3),
              };
              precipitationArray.push(precipitation);
            }
          }

          var dayWindDir = toDegrees(Math.atan2(windDirSumY, windDirSumX));
          averageCloudiness /= 8;
          dayHumidity /= 8;
          dayWindSpeed /= 8;
          dayPressure /= 8;
          dayVisibility /= 8;
          var weatherForTheDay = "";
          dayVol = Math.round(dayVol * 10) / 10;

          if (averageCloudiness < 10) weatherForTheDay = "clear sky";
          else if (averageCloudiness < 50) weatherForTheDay = "scattered clouds";
          else if (averageCloudiness < 80) weatherForTheDay = "broken clouds";
          else weatherForTheDay = "overcast clouds";

          var forecast;
          if (j == 0)
            forecast = {
              day: "Today",
              weather: todaysWeather,
              minTemp: Math.round(Math.min(...temps)),
              currentTemp: todaysTemp,
              maxTemp: Math.round(Math.max(...temps)),
              dayTemps: temps,
              dayTimes: times,
              humidity: todaysHumidity,
              windSpeed: todaysWindSpeed,
              windDir: todaysWindDir,
              cloudCoverage: todaysCoverage,
              pressure: todaysPressure,
              visibility: todaysVisibility,
              precipitation: { precipitationVol: dayVol, precipitationArray },
            };
          else
            forecast = {
              day,
              weather: weatherForTheDay,
              minTemp: Math.round(Math.min(...temps)),
              maxTemp: Math.round(Math.max(...temps)),
              dayTemps: temps,
              dayTimes: times,
              humidity: Math.round(dayHumidity),
              windSpeed: Math.round(dayWindSpeed * 10) / 10,
              windDir: dayWindDir,
              cloudCoverage: Math.round(averageCloudiness),
              pressure: Math.round(dayPressure),
              visibility: Math.round(dayVisibility * 10) / 10,
              precipitation: { precipitationVol: dayVol, precipitationArray },
            };

          newForecastData.push(forecast);

          forecastTemps.push(temps);
          forecastTimes.push(times);
        }

        // Save weather to the backend
        setWeatherState({
          ...weatherData,
          forecastData: newForecastData,
        });
        setForecastData(newForecastData);
        setPrecipitationData(newForecastData[0].precipitation);

        setGraphData({
          labels: newForecastData[0].dayTimes,
          datasets: { label: "", data: newForecastData[0].dayTemps },
        });
      })
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
      });
  };

  // Functions to get user coords
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successPos, errorPos);
    }
  }

  function successPos(position) {
    // Call backend for geolocation
    fetch(
      `${process.env.REACT_APP_API_URL}/api/reverse-geocode?lat=${position.coords.latitude}&lon=${position.coords.longitude}`
    )
      .then((response) => response.json())
      .then((data) => {
        updateWeather(data.name + ", " + data.country, false);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }

  function errorPos() {
    alert("Sorry, no position available.");
  }

  // Update map settings on settings change
  function onSettingsChange(settings) {
    var newSettings = {
      ...settings,
      route: null,
      location: null,
      darkMode: darkMode,
      imperialUnits: imperialUnits,
    };
    setSettings(newSettings);
  }

  // Function used to call for a city from the map script
  function CallCity(callerID) {
    updateWeather(callerID, true);
    scrollToTop();
  }

  // Function used to scroll to the top of the page
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox>
        <MDBox>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Search
                    callFunction={callFunction}
                    success={success}
                    error={error}
                    color={sidenavColor}
                  />
                  <Weather
                    color={sidenavColor}
                    location={location}
                    countryCode={countryCode}
                    temperature={convertTemp(temperature)}
                    unit={tempUnitLabel}
                    timezone={timezone}
                    weatherCondition={weather}
                    tempData={tempData}
                    updated={updated}
                    day={dayVal}
                  />
                  {!isSmallScreen ? (
                    <>
                      <MDBox mt={2}>
                        <Forecast
                          color={sidenavColor}
                          forecastData={forecastData}
                          updated={forecastUpdated}
                          callFunction={selectForecast}
                          selectedNum={selectedForecast}
                        />
                      </MDBox>
                      <MDBox mt={2}>
                        <Map
                          settings={settings}
                          callCity={CallCity}
                          color={sidenavColor}
                          doRoute={false}
                        />
                      </MDBox>
                    </>
                  ) : (
                    <>
                      <MDBox mt={2}>
                        <WeatherStats
                          windSpeed={convertSpeed(windSpeed)}
                          tempUnitLabel={tempUnitLabel}
                          speedUnitLabel={speedUnitLabel}
                          pressureUnitLabel={pressureUnitLabel}
                          visibilityUnitLabel={visibilityUnitLabel}
                          windDir={windDir}
                          pressure={pressure}
                          humidity={humidity}
                          coverage={coverage}
                          temperature={temperature}
                          visibility={convertVisibility(visibility)}
                          precipitationData={precipitationData}
                        />
                      </MDBox>
                      <MDBox mt={2}>
                        <Forecast
                          color={sidenavColor}
                          forecastData={forecastData}
                          updated={forecastUpdated}
                          callFunction={selectForecast}
                          selectedNum={selectedForecast}
                        />
                      </MDBox>
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={4}>
              {!isSmallScreen ? (
                <>
                  <WeatherStats
                    windSpeed={convertSpeed(windSpeed)}
                    tempUnitLabel={tempUnitLabel}
                    speedUnitLabel={speedUnitLabel}
                    pressureUnitLabel={pressureUnitLabel}
                    visibilityUnitLabel={visibilityUnitLabel}
                    windDir={windDir}
                    pressure={pressure}
                    humidity={humidity}
                    coverage={coverage}
                    temperature={temperature}
                    visibility={convertVisibility(visibility)}
                    precipitationData={precipitationData}
                  />
                  <MDBox mt={2}>
                    <MapSettings callFunction={onSettingsChange} color={sidenavColor} />
                  </MDBox>
                </>
              ) : (
                <>
                  <MDBox mt={2}>
                    <Map
                      settings={settings}
                      callCity={CallCity}
                      color={sidenavColor}
                      doRoute={false}
                    />
                  </MDBox>
                  <MDBox mt={2}>
                    <MapSettings callFunction={onSettingsChange} color={sidenavColor} />
                  </MDBox>
                </>
              )}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default WeatherPage;
