# Interactive Weather & Route Planning Website

## Overview
This project is a responsive, interactive web application that provides **real-time weather information** for any global city or the user’s current location. It also features **route planning with weather-aware navigation**, allowing users to plan trips while considering current weather conditions.

The platform combines **clear visual data**, **interactive maps**, and **personalization features** to create a user-friendly experience for travelers, outdoor planners, and casual users.

---

## Features
- **Real-Time Weather Data**
  - City-based search or automatic location detection
  - Displays temperature, wind speed, cloud cover, and atmospheric pressure
- **Interactive Mapping**
  - Weather patterns displayed via [Leaflet.js](https://leafletjs.com/)
  - Dynamic map markers and overlays
- **Dynamic Graphs**
  - Temperature trends visualized using [Chart.js](https://www.chartjs.org/)
- **Route Planning**
  - Create travel routes with weather information along the path
  - Interactive map-based route creation and adjustment
- **User Accounts & Data Storage**
  - Save routes and preferences in a secure backend database
  - Retrieve previously planned trips for reuse or editing
- **Responsive Design**
  - Works seamlessly on desktop, tablet, and mobile devices

---

## Technology Stack
**Frontend:**
- HTML, CSS, JavaScript (or React)
- Leaflet.js for interactive maps
- Chart.js or D3.js for dynamic graphs

**Backend:**
- Node.js & Express.js for API handling and server logic
- MongoDB for user data and route storage

**APIs:**
- [OpenWeatherMap API](https://openweathermap.org/api) for real-time weather data
- [Nomatim API](https://nominatim.org). for route creation and reverse geocoding

**Hosting:**
- **Frontend:** [Netlify](https://www.netlify.com/) for fast, globally distributed hosting  
- **Backend:** [Render](https://render.com/) for reliable cloud server and database hosting

---

## How It Works
1. **Weather Data Retrieval**
   - The application fetches live weather data from OpenWeatherMap based on the user’s location or chosen city.
2. **Visualization**
   - Data is displayed on an interactive map with custom markers and weather overlays.
   - Graphs provide a visual breakdown of temperature trends over time.
3. **Route Planning**
   - Users can create travel routes directly on the map.
   - The system provides weather data relevant to the route.
4. **User Data Management**
   - The backend stores routes, preferences, and user details in a database.
   - Returning users can log in to view or edit saved routes.
5. **Responsive & Accessible**
   - The layout adapts to different devices, ensuring usability across screens.

---

## Installation & Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/weather-route-planner.git
   cd weather-route-planner

2. **Install Dependencies**
   ```bash
   npm install

3. **Set Environment Variables**
   ```bash
   OPENWEATHER_API_KEY=your_api_key
   DATABASE_URL=your_database_url

4. Run the Application
   ```bash
   npm start

## Images

Below are screenshots of the main pages of the application. Add these image files to an `images/` folder in the repo (or update the paths below to match your structure).

### Home / Dashboard
![Dashboard](images/dashboard.png)

### Weather Page and Map
![Weather Page](<img width="1920" height="1749" alt="image" src="https://github.com/user-attachments/assets/07935372-f87e-4a84-bcb3-5384d442d406" />)

### Interactive Weather Map
![Interactive Weather Map](images/map.png)

### Route Planning Page
![Route Planning](images/route-planning.png)

### User Login
![Saved Routes](images/saved-routes.png)

---

## Future Enhancements
- Using paid API tiers or making own API solutions for faster data retrieval
- Severe weather alerts for planned routes and reschedule suggestions
- Offline route saving and map access
- Multi-day trip weather forecasting

---

## License
This project is released under the [MIT License](./LICENSE).
