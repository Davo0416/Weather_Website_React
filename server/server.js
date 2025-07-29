// Defining the required dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const axios = require("axios");

const User = require("./models/User");

const app = express();
const Joi = require("joi");

// Use cors
app.use(cors({
  origin: "http://localhost:3000", // change to deployed frontend domain
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));

// Limit calls
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});

app.use(limiter);

// Schemas and validation
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required()
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Post signup and validate it
app.post("/api/signup", validate(signupSchema), async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Post signin and validate it
app.post("/api/signin", validate(signinSchema), async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    res.status(200).json({
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

const weatherQuerySchema = Joi.object({
  city: Joi.string(),
  id: Joi.string(),
}).or("city", "id");

// Get reverse geocode
app.get("/api/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: "Latitude and longitude are required." });
  }

  try {
    const response = await axios.get("https://api.openweathermap.org/geo/1.0/reverse", {
      params: {
        lat,
        lon,
        limit: 1,
        appid: process.env.OPENWEATHERMAP_API_KEY,
      },
    });

    if (response.data && response.data.length > 0) {
      res.json(response.data[0]); // includes name, country, state, etc.
    } else {
      res.status(404).json({ message: "No location found for these coordinates." });
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error.message);
    res.status(500).json({ message: "Failed to reverse geocode." });
  }
});

// Get weather
app.get("/api/weather", async (req, res) => {
  const { error } = weatherQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { city, id } = req.query;
  const queryParam = city
    ? `q=${encodeURIComponent(city)}`
    : `id=${encodeURIComponent(id)}`;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?${queryParam}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Weather fetch error:", error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Failed to fetch weather data",
    });
  }
});


const forecastQuerySchema = Joi.object({
  city: Joi.string(),
  id: Joi.string(),
  lat: Joi.number(),
  lon: Joi.number(),
}).custom((value, helpers) => {
  const hasCity = !!value.city;
  const hasId = !!value.id;
  const hasCoords = value.lat !== undefined && value.lon !== undefined;

  if (!hasCity && !hasId && !hasCoords) {
    return helpers.error("any.invalid");
  }

  return value;
}, "Custom forecast query validation").messages({
  "any.invalid": "City, ID, or coordinates (lat & lon) are required."
});

// Get forecast for user
app.get("/api/forecast", async (req, res) => {
  const { error } = forecastQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { city, id, lat, lon } = req.query;

  let queryParam = "";
  if (city) {
    queryParam = `q=${encodeURIComponent(city)}`;
  } else if (id) {
    queryParam = `id=${encodeURIComponent(id)}`;
  } else {
    queryParam = `lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?${queryParam}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Forecast fetch error:", error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Failed to fetch forecast data",
    });
  }
});

// Get weather for user
app.get("/api/user/weather/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("weather");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.weather || null);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Post weather for user
app.post("/api/user/weather/:userId", async (req, res) => {
  const { weather } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { weather },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Weather saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user settings
app.get("/api/user/settings/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("settings");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.settings || null);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Post user settings
app.post("/api/user/settings/:userId", async (req, res) => {
  const { settings } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { settings },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Settings saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Post user notifications
app.post("/api/user/notifications/:userId", async (req, res) => {
  const { alerts } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { notifications: alerts },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Notifications saved successfully" });
  } catch (err) {
    console.error("Error saving notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user notifications
app.get("/api/user/notifications/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("notifications");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.notifications || []);
  } catch (err) {
    console.error("Error loading notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user routes
app.get("/api/user/routes/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("routesState");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.routesState || { routes: [], currentRoute: null });
  } catch (err) {
    console.error("Error loading routesState:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Post user routes
app.post("/api/user/routes/:userId", async (req, res) => {
  const { routesState } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { routesState },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Routes state saved successfully" });
  } catch (err) {
    console.error("Error saving routesState:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get OWM Leaflet layer configs
app.get("/api/owm-layers", (req, res) => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  const layers = {
    tileLayers: {
      clouds: { type: "tile", url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, options: { opacity: 0.8, minZoom: 2, legendImagePath: 'files/NT2.png' } },
      precipitation: { type: "tile", url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, options: { opacity: 0.5, minZoom: 2 } },
      rain: { type: "tile", url: `https://tile.openweathermap.org/map/rain_new/{z}/{x}/{y}.png?appid=${apiKey}`, options: { opacity: 0.5, minZoom: 2 } },
      snow: { type: "tile", url: `https://tile.openweathermap.org/map/snow_new/{z}/{x}/{y}.png?appid=${apiKey}`, options: { opacity: 0.5, minZoom: 2 } },
      pressure: { type: "tile", url: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${apiKey}`, options: { opacity: 0.4, minZoom: 2 } },
      pressurecntr: { type: "tile", url: `https://tile.openweathermap.org/map/pressure_cntr/{z}/{x}/{y}.png?appid=${apiKey}`, options: { opacity: 0.5, minZoom: 2 } },
      temp: { type: "tile", url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, options: { opacity: 0.5, minZoom: 2 } },
      wind: { type: "tile", url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`, options: { opacity: 0.5, minZoom: 2 } },
    },
    currentLayers: {
      city: {
        intervall: 15,
        imageLoadingUrl: 'leaflet/owmloading.gif',
        minZoom: 5,
        appId: apiKey,
        temperatureUnit: "C",
        speedUnit: "ms",
        pressureUnit: "hPa"
      },
      imperialCity: {
        intervall: 15,
        imageLoadingUrl: 'leaflet/owmloading.gif',
        minZoom: 5,
        appId: apiKey,
        temperatureUnit: "F",
        speedUnit: "mph",
        pressureUnit: "psi"
      },
      windrose: {
        intervall: 15,
        imageLoadingUrl: 'leaflet/owmloading.gif',
        minZoom: 4,
        appId: apiKey,
        markerFunction: "windrose", // placeholder — you’ll handle this on frontend
        popup: false,
        clusterSize: 50,
        imageLoadingBgUrl: 'https://openweathermap.org/img/w0/iwind.png'
      }
    }
  };

  res.json(layers);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
