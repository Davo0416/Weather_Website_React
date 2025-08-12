# [View Webpage](https://skyroutereact.netlify.app/)

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
   cd Weather_Website_React-main

2. **Install Dependencies**
   ```bash
   npm install

3. **Set Server Variables**
   Create a .env file in the server folder and populate it with this
   ```bash
   OPENWEATHER_API_KEY=your_api_key
   DATABASE_URL=your_database_url

4. **Set Project Variables**
   Create another .env file in the main project folder and populate it with this
   ```bash
   REACT_APP_API_URL=http://localhost:5000 // or yout deployed backend domain
   CI=false 

5. **Modify the cors origin in server.js to http://localhost:5000 or your frontend domain**
   ```bash
   origin: "http://localhost:3000", // or yout deployed frontend domain

6. **Run the Application**
   ```bash
   npm start

7. **Run the Server**
   ```bash
   cd server
   node server.js

8. **Access the Application**  
Open your browser and navigate to http://localhost:3000 (or the frontend URL if applicable) to use the app.

## Images

Below are screenshots of the main pages of the application.

### Home / Dashboard
<img width="1920" height="945" alt="image" src="https://github.com/user-attachments/assets/6fece980-7566-4d64-8128-9139b5544d91" />

### Weather Page and Map
<img width="1920" height="1749" alt="Sky-Route" src="https://github.com/user-attachments/assets/63e7da0f-9aee-4abf-a41d-3a6fb7ac5a81" />

### Interactive Weather Map
<img width="1075" height="700" alt="image" src="https://github.com/user-attachments/assets/d6f70fbd-a015-4f09-8db8-ac7483aedaf7" />

### Route Planning Page
<img width="1920" height="945" alt="image" src="https://github.com/user-attachments/assets/e723c456-aab7-462f-a0eb-8e051a621705" />

### Notifications Page
<img width="1920" height="945" alt="image" src="https://github.com/user-attachments/assets/0f15b089-d26d-4017-949a-b103b3dde4a2" />

### User Sign-up
<img width="1920" height="945" alt="image" src="https://github.com/user-attachments/assets/51235bb7-8810-4ded-b619-a2299da19599" />

### User Sign-in
<img width="1920" height="945" alt="image" src="https://github.com/user-attachments/assets/9e811b46-20bb-40fd-b2f8-71019e31a90c" />

### Settings SideBar
<img width="358" height="946" alt="image" src="https://github.com/user-attachments/assets/3eb9a73a-ea2f-4c86-8540-4956b0c1f9a3" />

---

## Future Enhancements
- Using paid API tiers or making own API solutions for faster data retrieval
- Severe weather alerts for planned routes and reschedule suggestions
- Offline route saving and map access
- Multi-day trip weather forecasting

---

## License
This project is released under the [MIT License](./LICENSE).
