/*
 * Weather & Route Visualization Map
 * ---------------------------------
 * This JavaScript script integrates OpenStreetMap and OpenWeatherMap to display
 * a map with weather overlays, custom markers (including wind rose icons),
 * and a dynamic routing system that includes weather forecasting at waypoints
 * and sampled intermediate cities. 
 *
 * Key Features:
 * - Supports both metric and imperial units
 * - Multiple weather overlays (clouds, rain, snow, pressure, etc.)
 * - Real-time wind rose visualization using canvas
 * - Route planning with arrival time and forecast integration
 * 
 * Made using leaflet
 */


var map;
var imperialUnits = false;

// Convert temperature from Celsius to Fahrenheit if imperialUnits is true
convertTemp = (celsius) =>
  imperialUnits ? Math.round((celsius * 9) / 5 + 32) : celsius;
// Convert speed from km/h to mph if imperialUnits is true
convertSpeed = (km) =>
  imperialUnits ? Math.round(km * 0.621371 * 10) / 10 : km;

// Get appropriate temperature unit label ("F" or "C")
getTempUnitLabel = () => (imperialUnits ? "F" : "C");
// Get appropriate speed unit label ("mp/h" or "km/h")
getSpeedUnitLabel = () => (imperialUnits ? "mp/h" : "km/h");

// Extract query parameters from URL and return as key-value pairs
function getUrlParameters() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

// Center map on given position
function foundLocation(position) {
	console.log(position);
	if (typeof map != "undefined") {
		var lat = position.latitude;
		var lon = position.longitude;

		if (lat == null)
			lat = position.lat;
		if (lon == null)
			lon = position.lon;
		map.setView(new L.LatLng(lat, lon), 11);
	}
}

// Create a wind rose marker for a weather station
function myWindroseMarker(data) {
	var content = '<canvas id="id_' + data.id + '" width="50" height="50"></canvas>';
	var icon = L.divIcon({ html: content, iconSize: [50, 50], className: 'owm-div-windrose' });
	return L.marker([data.coord.Lat, data.coord.Lon], { icon: icon, clickable: false });
}

// Draw a wind rose canvas icon to represent wind direction and strength
function myWindroseDrawCanvas(data, owm) {
	var canvas = document.getElementById('id_' + data.id);
	canvas.title = data.name;
	var angle = 0;
	var speed = 0;
	var gust = 0;
	if (typeof data.wind != 'undefined') {
		if (typeof data.wind.speed != 'undefined') {
			canvas.title += ', ' + data.wind.speed + ' m/s';
			canvas.title += ', ' + owm._windMsToBft(data.wind.speed) + ' BFT';
			speed = data.wind.speed;
		}
		if (typeof data.wind.deg != 'undefined') {
			canvas.title += ', ' + owm._directions[(data.wind.deg / 22.5).toFixed(0)];
			angle = data.wind.deg;
		}
		if (typeof data.wind.gust != 'undefined') {
			gust = data.wind.gust;
		}
	}
	if (canvas.getContext && speed > 0) {
		var red = 0;
		var green = 0;
		if (speed <= 10) {
			green = 10 * speed + 155;
			red = 255 * speed / 10.0;
		} else {
			red = 255;
			green = 255 - (255 * (Math.min(speed, 21) - 10) / 11.0);
		}
		var ctx = canvas.getContext('2d');
		ctx.translate(25, 25);
		ctx.rotate(angle * Math.PI / 180);
		ctx.fillStyle = 'rgb(' + Math.floor(red) + ',' + Math.floor(green) + ',' + 0 + ')';
		ctx.beginPath();
		ctx.moveTo(-15, -25);
		ctx.lineTo(0, -10);
		ctx.lineTo(15, -25);
		ctx.lineTo(0, 25);
		ctx.fill();

		// Draw inner arrow for gust
		if (gust > 0 && gust != speed) {
			if (gust <= 10) {
				green = 10 * gust + 155;
				red = 255 * gust / 10.0;
			} else {
				red = 255;
				green = 255 - (255 * (Math.min(gust, 21) - 10) / 11.0);
			}
			canvas.title += ', gust ' + data.wind.gust + ' m/s';
			canvas.title += ', ' + owm._windMsToBft(data.wind.gust) + ' BFT';
			ctx.fillStyle = 'rgb(' + Math.floor(red) + ',' + Math.floor(green) + ',' + 0 + ')';
			ctx.beginPath();
			ctx.moveTo(-15, -25);
			ctx.lineTo(0, -10);
			ctx.lineTo(0, 25);
			ctx.fill();
		}
	} else {
		canvas.innerHTML = '<div>'
			+ (typeof data.wind != 'undefined' && typeof data.wind.deg != 'undefined' ? data.wind.deg + '°' : '')
			+ '</div>';
	}
}

//Helper function for replacing leaflet-openweathermap's builtin marker by a wind rose symbol.
function windroseAdded(e) {
	for (var i in this._markers) {
		var m = this._markers[i];
		var cv = document.getElementById('id_' + m.options.owmId);
		for (var j in this._cache._cachedData.list) {
			var station = this._cache._cachedData.list[j];
			if (station.id == m.options.owmId) {
				myWindroseDrawCanvas(station, this);
			}
		}
	}
}

// Map marker function
function myOwmMarker(data) {
	console.log(data);
	return L.marker([data.coord.Lat, data.coord.Lon]);
}

// Map popup function
function myOwmPopup(data) {
	return L.popup().setContent(typeof data.name != 'undefined' ? data.name : data.id);
}

//Declaring the layers
var clouds, precipitation, rain, snow, temp, wind, pressure, pressurecntr, city, imperialCity, windrose;
var routingControl = null;

//Initialize the map.
function initMap(apiUrl) {
	//Resetting the previous map instance
	if (L.DomUtil.get("map") != null) {
		const existingMap = L.DomUtil.get("map");
		if (existingMap._leaflet_id) {
			existingMap._leaflet_id = null;
		}
	}

	if(map){
		map.eachLayer(function (layer) {
			map.removeLayer(layer);
		});
	}

	if (routingControl) {
		routingControl.remove();
		routingControl = null;
	}

	if(map){
		map.eachLayer(layer => {
			if (layer instanceof L.Polyline || layer instanceof L.Marker) {
				map.removeLayer(layer);
			}
		});
	}

	//Defining map layers
	var standard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		minZoom: 2,
		className: 'map-tiles',
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a>'
	});

	var humanitarian = L.tileLayer('https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		maxZoom: 17,
		minZoom: 2,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors</a> <a href="https://www.hotosm.org/" target="_blank">Tiles courtesy of Humanitarian OpenStreetMap Team</a>'
	});

	fetch(`${apiUrl}/api/owm-layers`)
    .then(res => res.json())
    .then(data => {
      const tileLayers = data.tileLayers;
      const currentLayers = data.currentLayers;

      // Create and add tile layers
      clouds = L.tileLayer(tileLayers.clouds.url, tileLayers.clouds.options);
      precipitation = L.tileLayer(tileLayers.precipitation.url, tileLayers.precipitation.options);
      rain = L.tileLayer(tileLayers.rain.url, tileLayers.rain.options);
      snow = L.tileLayer(tileLayers.snow.url, tileLayers.snow.options);
      pressure = L.tileLayer(tileLayers.pressure.url, tileLayers.pressure.options);
      pressurecntr = L.tileLayer(tileLayers.pressurecntr.url, tileLayers.pressurecntr.options);
      temp = L.tileLayer(tileLayers.temp.url, tileLayers.temp.options);
      wind = L.tileLayer(tileLayers.wind.url, tileLayers.wind.options);

      // Create current weather layers (from Leaflet.OWM plugin)
      city = new L.OWM.Current(currentLayers.city);
      imperialCity = new L.OWM.Current(currentLayers.imperialCity);

      // Handle windrose markerFunction manually
      currentLayers.windrose.markerFunction = myWindroseMarker;
      windrose = new L.OWM.Current(currentLayers.windrose);
      windrose.on('owmlayeradd', windroseAdded, windrose);
    })
    .catch((err) => console.error("Failed to load layers", err));

	//Defining map parameters
	var zoom = 6;
	var lat = 51.58;
	var lon = 10.1;
	var urlParams = getUrlParameters();
	if (typeof urlParams.zoom != "undefined" && typeof urlParams.lat != "undefined" && typeof urlParams.lon != "undefined") {
		zoom = urlParams.zoom;
		lat = urlParams.lat;
		lon = urlParams.lon;
		useGeolocation = false;
	}

	const southWest = L.latLng(-85, -Infinity);
	const northEast = L.latLng(85, Infinity);
	const bounds = L.latLngBounds(southWest, northEast);

	//Defining the map and the overlays
	map = L.map('map', {
		center: new L.LatLng(lat, lon), zoom: zoom,
		maxBounds: bounds,
		maxBoundsViscosity: 1.0,
		layers: [standard]
	});

	map.attributionControl.setPrefix("");

	window.baseMaps = {
		"OSM Standard": standard
		, "OSM Humanitarian": humanitarian
	};

	var overlayMaps = {};
	overlayMaps['Clouds'] = clouds;
	overlayMaps['Precipitation'] = precipitation;
	overlayMaps['Rain'] = rain;
	overlayMaps['Snow'] = snow;
	overlayMaps['Temperature'] = temp;
	overlayMaps['Wind Speed'] = wind;
	overlayMaps['Pressure'] = pressure;
	overlayMaps['Pressure Contour'] = pressurecntr;
	overlayMaps['Cities (min Zoom 5)'] = city;
	overlayMaps['Wind Rose'] = windrose;
}

//Overlay toggle functions
var cloudsOn = false;
function Clouds(on) {
	cloudsOn = on;
	if (on) map.addLayer(clouds)
	else if (clouds != null) map.removeLayer(clouds);
}

var precipitationOn = false;
function Precipitation(on) {
	precipitationOn = on;
	if (on) map.addLayer(precipitation);
	else if (precipitation != null) map.removeLayer(precipitation);
}

var rainOn = false;
function Rain(on) {
	rainOn = on;
	if (on) map.addLayer(rain);
	else if (rain != null) map.removeLayer(rain);
}

var snowOn = false;
function Snow(on) {
	snowOn = on;
	if (on) map.addLayer(snow);
	else if (snow != null) map.removeLayer(snow);
}

var temperatureOn = false;
function Temperature(on) {
	temperatureOn = on;
	if (on) map.addLayer(temp);
	else if (temp != null) map.removeLayer(temp);
}

var windSpeedOn = false;
function WindSpeed(on) {
	windSpeedOn = on;
	if (on) map.addLayer(wind);
	else if (wind != null) map.removeLayer(wind);
}

var pressureOn = false;
function Pressure(on) {
	pressureOn = on;
	if (on) map.addLayer(pressure);
	else if (pressure != null) map.removeLayer(pressure);
}

var contourOn = false;
function Contour(on) {
	contourOn = on;
	if (on) map.addLayer(pressurecntr);
	else if (pressurecntr != null) map.removeLayer(pressurecntr);
}

var citiesOn = false;
function Cities(on) {
	citiesOn = on;
	if(imperialUnits){
		if (city != null) map.removeLayer(city);
		if (on) map.addLayer(imperialCity);
		else if (imperialCity != null) map.removeLayer(imperialCity);
	}
	else{
		if (imperialCity != null) map.removeLayer(imperialCity);
		if (on) map.addLayer(city);
		else if (city != null) map.removeLayer(city);
	}
}

var windRoseOn = false;
function WindRose(on) {
	windRoseOn = on;
	if (on) map.addLayer(windrose);
	else if (windrose != null) map.removeLayer(windrose);
}

// Defining marker data
var cityMarkers = [];
var customIcon = L.icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var passByIcon = L.icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
	iconSize: [19, 31],
	iconAnchor: [9, 31],
	popupAnchor: [1, -26],
	shadowSize: [31, 31]
});

// Function to generate the given route
var currentRouteGeneration = 0;
function Route(route, setLength, apiUrl) {
	currentRouteGeneration++;
	const generation = currentRouteGeneration;

	// Remove previous route instance
	if (routingControl) {
		routingControl.remove();
		routingControl = null;
	}

	// Remove previous city markers
	cityMarkers.forEach(marker => marker.remove());
	cityMarkers = [];

	if (!route || !route.points) return;
	// Initialize routing
	routingControl = L.Routing.control({
		waypoints: route.points.map(point => L.latLng(point.lat, point.lon)),
		routeWhileDragging: true,
		draggableWaypoints: false,
		addWaypoints: false,
		createMarker: () => null,
		router: L.Routing.osrmv1({}),
		show: false,
		lineOptions: {
			styles: [
				{ color: '#94a9ff', opacity: 0.15, weight: 9 },
				{ color: '#94a9ff', opacity: 0.8, weight: 6 },
				{ color: '#03f', opacity: 1, weight: 2 }
			]
		}
	}).addTo(map);

	const origClearLines = routingControl._clearLines;
	routingControl._clearLines = function () {
		if (!this._map) {
			return;
		}
		origClearLines.call(this);
	};

	//Route generation
	routingControl.on('routesfound', async function (e) {
		if (generation !== currentRouteGeneration) return;
		const routeData = e.routes[0];
		const summary = routeData.summary;
		const distanceInKm = Math.round(summary.totalDistance / 1000);
		const hours = Math.floor(summary.totalTime / 3600);
		const minutes = Math.round((summary.totalTime % 3600) / 60);
		const estimatedTime = `${hours}h ${minutes}min`;

		const waypointIndices = routeData.waypointIndices;
		const instructions = routeData.instructions;

		let segmentDurations = [];

		for (let i = 0; i < waypointIndices.length - 1; i++) {
			let startIdx = waypointIndices[i];
			let endIdx = waypointIndices[i + 1];
			let segmentTime = 0;

			for (let instr of instructions) {
				if (instr.index >= startIdx && instr.index < endIdx) {
					segmentTime += instr.time;
				}
			}

			segmentDurations.push(segmentTime);
		}

		const allDescriptions = [];

		//Calculate arrival times
		const departureDateTimeStr = `${route.points[0].date} ${route.points[0].departureTime}`;
		let currentTime = new Date(departureDateTimeStr);
		let arrivalTimes = [new Date(currentTime)];

		for (let duration of segmentDurations) {
			currentTime = new Date(currentTime.getTime() + duration * 1000);
			arrivalTimes.push(new Date(currentTime));
		}

		//Create markers for main waypoints
		route.points.forEach((point, index) => {
			const name = point.city || 'City';
			const date = point.date;
			const departureTime = point.departureTime;

			//Get arrival time
			let arrivalDate = '';
			let arriveTime = '';
			let weatherInfo = '<em>No Weather Data</em>';

			if (arrivalTimes[index]) {
				const arrival = arrivalTimes[index];
				arrivalDate = arrival.toLocaleDateString();
				arriveTime = arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

				//Match closest forecast to display
				const forecastTimes = point.dates || [];
				const forecastDateTimes = forecastTimes.map(f => new Date(f));
				let closestIndex = null;
				let smallestDiff = 1000 * 60 * 60 * 2; // 2 hours
				console.log(point);
				forecastDateTimes.forEach((time, i) => {
					const diff = Math.abs(time.getTime() - arrival.getTime());
					if (diff <= smallestDiff) {
						smallestDiff = diff;
						closestIndex = i;
					}
				});

				//Creating main popups
				if (closestIndex !== null && point.temperature && point.temperature[closestIndex] != null) {
					const deg = point.windDirection[closestIndex];
					const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
						'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
					const compass = directions[Math.round(deg / 22.5) % 16];
					const forecastWeather = point.weatherDescription[closestIndex];
					allDescriptions.push(forecastWeather);

					weatherInfo = `
						<div style="background-color: #cce6ff; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 4px 10px; margin-top: 6px; font-weight: bold; width: fit-content;">
							Weather
						</div>
						<div style="background-color: #e0f0ff; border-radius: 8px; border-top-left-radius: 0px; padding: 6px 10px; display: flex; gap: 12px; align-items: center;">
							<div style="display: flex; flex-direction: column; align-items: center; min-width: 60px;">
								<img 
									src="/Weather_Icons/${forecastWeather}.png" 
									alt='${forecastWeather}' 
									style="width: 40px; height: 40px;" 
								/>
								<span style="margin-top: 4px; font-size: 14px; font-weight: 500; text-align: center; word-wrap: break-word; white-space: normal; max-width: 80px;">
									${forecastWeather}
								</span>
							</div>
 							<div style="display: flex; flex-direction: column; font-size: 14px; font-weight: 500; line-height: 1.5;">
								<span style="font-size: 14px;"><b>Temp:</b> ${convertTemp(point.temperature[closestIndex])}°${getTempUnitLabel()}</span>
								<span style="font-size: 14px;"><b>Humidity:</b> ${point.humidity[closestIndex]}%</span>
								<span style="font-size: 14px;"><b>Wind:</b> ${convertSpeed(point.windSpeed[closestIndex])} ${getSpeedUnitLabel()} ${compass}</span>
							</div>
						</div>
					`;
				}


			}

			const popupContent = `
				<div style="font-size: 14px; line-height: 1.4;">
					<strong>${name}</strong><br/>
					${index === 0 ? `
						<div style="background-color: #cce6ff; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 4px 10px; margin-top: 6px; font-weight: bold; width: fit-content;">
							Departure
						</div>
						<div style="background-color: #e0f0ff; border-radius: 8px; border-top-left-radius: 0px; padding: 6px 10px;">
							Date: ${formatDateToDDMMYYYY(date)}<br/>
							Time: ${departureTime}
						</div>
					` : `
						<div style="background-color: #cce6ff; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 4px 10px; margin-top: 6px; font-weight: bold; width: fit-content;">
							${index === route.points.length - 1 ? 'Arrival' : 'Stop'}
						</div>
						<div style="background-color: #e0f0ff; border-radius: 8px; border-top-left-radius: 0px; padding: 6px 10px;">
							Date: ${arrivalDate}<br/>
							Time: ${arriveTime}
						</div>
					`}
					<div style="margin-top: 8px;">
						${weatherInfo}
					</div>
				</div>
			`;
			if (generation !== currentRouteGeneration) return;
			const marker = L.marker([point.lat, point.lon], { icon: customIcon })
				.bindPopup(popupContent)
				.addTo(map);

			cityMarkers.push(marker);
		});

		//Calculate harversine distance
		function haversineDistance(coord1, coord2) {
			const toRad = deg => deg * Math.PI / 180;
			const R = 6371;
			const dLat = toRad(coord2.lat - coord1.lat);
			const dLon = toRad(coord2.lng - coord1.lng);
			const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) * Math.sin(dLon / 2) ** 2;
			return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		}

		//Get total route distance
		function getTotalRouteDistance(coords) {
			return coords.reduce((acc, curr, idx) => {
				if (idx === 0) return 0;
				return acc + haversineDistance(coords[idx - 1], curr);
			}, 0);
		}

		//Find point distance along the route
		function findDistanceAlongRoute(samplePoint, coords) {
			let distanceSoFar = 0;
			for (let i = 1; i < coords.length; i++) {
				const segmentDistance = haversineDistance(coords[i - 1], coords[i]);
				const toCurrent = haversineDistance(coords[i - 1], samplePoint);
				const toNext = haversineDistance(coords[i], samplePoint);
				const segmentTotal = segmentDistance;

				// If the point lies near this segment
				if (Math.abs(toCurrent + toNext - segmentTotal) < 1) {
					// Found approximate segment where this samplePoint lies
					distanceSoFar += toCurrent;
					return distanceSoFar;
				}

				distanceSoFar += segmentDistance;
			}
			return null;
		}

		const routeCoords = routeData.coordinates.map(c => ({ lat: c.lat, lng: c.lng }));
		const totalRouteDistance = getTotalRouteDistance(routeCoords);
		//Get points every X km
		function getPointsEveryXkm(coords, intervalKm = 150) {
			const points = [];
			let last = coords[0];
			let dist = 0;
			for (let i = 1; i < coords.length; i++) {
				const curr = coords[i];
				dist += haversineDistance(last, curr);
				if (dist >= intervalKm) {
					points.push(curr);
					last = curr;
					dist = 0;
				}
			}
			return points;
		}

		const manuallyProvidedCities = new Set(
			route.points.map(p => (p.city || '').toLowerCase().trim()).filter(name => name.length > 0)
		);

		//Storing already visited cities to prevent doubles
		const visitedCities = new Set();
		const sampled = getPointsEveryXkm(routeData.coordinates.map(c => ({ lat: c.lat, lng: c.lng })));
		const inbetweenPoints = [];
		if (route.inbetweenPoints == null) {
			for (const point of sampled) {
				if (generation !== currentRouteGeneration) return;
				//Check coordinates for a nearby city
				try {
					const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${point.lat}&lon=${point.lng}&accept-language=en`, {
						headers: { 'User-Agent': 'YourApp/1.0' }
					});
					if (!res.ok) continue;

					const data = await res.json();
					const address = data.address;

					//Filter small cities towns villages out
					const cityName = address.city || null;
					if (!cityName) continue; 
					
					//Filter districts, municipalities, counties, regions
					const excludedKeywords = ['district', 'municipal', 'municipality', 'county', 'region'];
					const nameLower = cityName.toLowerCase();
					if (excludedKeywords.some(keyword => nameLower.includes(keyword))) continue;

					const cityKey = cityName.toLowerCase();
					if (visitedCities.has(cityKey) || manuallyProvidedCities.has(cityKey)) continue;
					
					visitedCities.add(cityKey);
					const distanceToSample = findDistanceAlongRoute(point, routeCoords);
					if (distanceToSample === null) continue;

					const fraction = distanceToSample / totalRouteDistance;
					const secondsSinceStart = summary.totalTime * fraction;

					const passByTime = new Date(new Date(departureDateTimeStr).getTime() + secondsSinceStart * 1000);
					const date = passByTime.toLocaleDateString();
					const time = passByTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
					const centerLat = parseFloat(data.lat);
					const centerLon = parseFloat(data.lon);

					//Fetch weather forecast for this location
					const weatherRes = await fetch(`${apiUrl}/api/forecast?lat=${centerLat}&lon=${centerLon}`);
					if (!weatherRes.ok) {
						console.warn('Failed to fetch weather for', cityName);
						continue;
					}
					const weatherData = await weatherRes.json();

					//Find the closest forecast item to passByTime within 2 hours
					let closestForecast = null;
					let smallestDiff = 2 * 60 * 60 * 1000 + 1; // 2 hours
					for (const forecastItem of weatherData.list) {
						const forecastDate = new Date(forecastItem.dt * 1000);
						const diff = Math.abs(forecastDate.getTime() - passByTime.getTime());
						if (diff <= smallestDiff) {
							smallestDiff = diff;
							closestForecast = forecastItem;
						}
					}

					// Build weather info or "No Weather Data"
					let weatherInfo = '<em>No Weather Data</em>';
					if (closestForecast) {
						const forecastWeather = closestForecast.weather[0].description; // e.g. "Clear"
						const description = closestForecast.weather[0].description;
						const temperature = closestForecast.main.temp;
						const humidity = closestForecast.main.humidity;
						const windSpeed = closestForecast.wind.speed;
						const windDirDegrees = closestForecast.wind.deg;

						allDescriptions.push(forecastWeather);

						// Convert degrees to compass
						const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
							"S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
						const compassIndex = Math.round(windDirDegrees / 22.5) % 16;
						const compass = directions[compassIndex];

						//Create popup for intermediate points
						weatherInfo = `
					<div style="background-color: #cce6ff; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 4px 10px; margin-top: 6px; font-weight: bold; width: fit-content;">
						Weather
					</div>
					<div style="background-color: #e0f0ff; border-radius: 8px; border-top-left-radius: 0px; padding: 6px 10px; display: flex; gap: 12px; align-items: center;">
						<div style="display: flex; flex-direction: column; align-items: center; min-width: 60px; max-width: 80px;">
							<img 
								src="/Weather_Icons/${forecastWeather}.png" 
								alt='${forecastWeather}' 
								style="width: 40px; height: 40px;" 
							/>
							<span style="margin-top: 4px; font-size: 14px; font-weight: 500; text-align: center; word-wrap: break-word; white-space: normal; max-width: 80px;">
								${description}
							</span>
						</div>
						<div style="display: flex; flex-direction: column; font-size: 14px; font-weight: 500; line-height: 1.5;">
							<span style="font-size: 14px;"><b>Temp:</b> ${convertTemp(temperature)}°${getTempUnitLabel()}</span>
							<span style="font-size: 14px;"><b>Humidity:</b> ${humidity}%</span>
							<span style="font-size: 14px;"><b>Wind:</b> ${convertSpeed(windSpeed)} ${getSpeedUnitLabel()} ${compass}</span>
						</div>
					</div>
				`;
					}

					const popupContent = `
				<div style="font-size: 14px; line-height: 1.4;">
					<strong>${cityName}</strong><br/>
					<div style="background-color: #cce6ff; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 4px 10px; margin-top: 6px; font-weight: bold; width: fit-content;">
						Pass By
					</div>
					<div style="background-color: #e0f0ff; border-radius: 8px; border-top-left-radius: 0px; padding: 6px 10px;">
						Date: ${date}<br/>
						Time: ${time}
					</div style="margin-top: 8px;">
					${weatherInfo}
				</div>`;

					const inbetweenPoint = {
						city: cityName,
						date: date,
						passByTime: time,
						lat: centerLat,
						lon: centerLon,
						forecast: weatherData,
					}

					inbetweenPoints.push(inbetweenPoint);

					const marker = L.marker([centerLat, centerLon], { icon: passByIcon })
						.bindPopup(popupContent)
						.addTo(map);

					cityMarkers.push(marker);

					//Add a delay to avoid hitting API rate limits
					await new Promise(res => setTimeout(res, 1100));
				} catch (e) {
					console.error('Reverse geocoding or weather fetch failed:', e);
				}
			}

			const mostFrequentDescription = Array.from(new Set(allDescriptions)).reduce((prev, curr) =>
				allDescriptions.filter(el => el === curr).length > allDescriptions.filter(el => el === prev).length ? curr : prev
			);

			// Send estimated length and time and points data back.
			if (setLength) {
				setLength(distanceInKm, estimatedTime, inbetweenPoints, mostFrequentDescription.replace(/\b\w/g, char => char.toUpperCase()));
			}
		}
		else {
			// Use the saved route data
			for (const point of route.inbetweenPoints) {
				const forecastList = point.forecast?.list || [];

				// Find the closest forecast item to passByTime within 2 hours
				const [day, month, year] = point.date.split("/").map(Number);
				const [hours, minutes] = point.passByTime.split(":").map(Number);
				const passByTime = new Date(year, month - 1, day, hours, minutes);

				let closestForecast = null;
				let smallestDiff = 2 * 60 * 60 * 1000 + 1;

				for (const item of forecastList) {
					const forecastTime = new Date(item.dt * 1000);
					const diff = Math.abs(forecastTime - passByTime);
					console.log(forecastTime, passByTime);
					if (diff < smallestDiff) {
						smallestDiff = diff;
						closestForecast = item;
					}
				}

				//Creating popups
				let weatherInfo = '<em>No Weather Data</em>';
				if (closestForecast) {
					const forecastWeather = closestForecast.weather[0].description;
					const temperature = closestForecast.main.temp;
					const humidity = closestForecast.main.humidity;
					const windSpeed = closestForecast.wind.speed;
					const windDirDegrees = closestForecast.wind.deg;
					// Compass directions
					const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
						"S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
					const compass = directions[Math.round(windDirDegrees / 22.5) % 16];
 
					weatherInfo = `
			<div style="background-color: #cce6ff; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 4px 10px; margin-top: 6px; font-weight: bold; width: fit-content;">
				Weather
			</div>
			<div style="background-color: #e0f0ff; border-radius: 8px; border-top-left-radius: 0px; padding: 6px 10px; display: flex; gap: 12px; align-items: center;">
				<div style="display: flex; flex-direction: column; align-items: center; min-width: 60px; max-width: 80px;">
					<img 
						src="/Weather_Icons/${forecastWeather}.png" 
						alt='${forecastWeather}' 
						style="width: 40px; height: 40px;" 
					/>
					<span style="margin-top: 4px; font-size: 14px; font-weight: 500; text-align: center; word-wrap: break-word; white-space: normal; max-width: 80px;">
						${forecastWeather}
					</span>
				</div>
				<div style="display: flex; flex-direction: column; font-size: 14px; font-weight: 500; line-height: 1.5;">
					<span style="font-size: 14px;"><b>Temp:</b> ${convertTemp(temperature)}°${getTempUnitLabel()}</span>
					<span style="font-size: 14px;"><b>Humidity:</b> ${humidity}%</span>
					<span style="font-size: 14px;"><b>Wind:</b> ${convertSpeed(windSpeed)} ${getSpeedUnitLabel()} ${compass}</span>
				</div>
			</div>`;
				}

				const popupContent = `
			<div style="font-size: 14px; line-height: 1.4;">
				<strong>${point.city}</strong><br/>
				<div style="background-color: #cce6ff; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 4px 10px; margin-top: 6px; font-weight: bold; width: fit-content;">
					Pass By
				</div>
				<div style="background-color: #e0f0ff; border-radius: 8px; border-top-left-radius: 0px; padding: 6px 10px;">
					Date: ${point.date}<br/>
					Time: ${point.passByTime}
				</div>
				<div style="margin-top: 8px;">
					${weatherInfo}
				</div>
			</div>
		`;

				const marker = L.marker([point.lat, point.lon], { icon: passByIcon })
					.bindPopup(popupContent)
					.addTo(map);
				cityMarkers.push(marker);
			}
		}
	});
}

// Convert "YYYY-MM-DD" string to "DD/MM/YYYY" format
function formatDateToDDMMYYYY(dateStr) {
	const [year, month, day] = dateStr.split('-');
	return `${day}/${month}/${year}`;
}

//Get route end based on start and length
function getEndDateTime(startStr, lengthStr) {
	if (startStr == null || lengthStr == null)
		return null;
	console.log(lengthStr);
	// Parse start date string into a Date object
	const [datePart, timePart] = startStr.split(' ');
	const [year, month, day] = datePart.split('-').map(Number);
	const [hour, minute] = timePart.split(':').map(Number);
	const startDate = new Date(year, month - 1, day, hour, minute); // month is 0-indexed

	// Extract hours and minutes from length string
	const hourMatch = lengthStr.match(/(\d+)\s*h/);
	const minMatch = lengthStr.match(/(\d+)\s*min/);

	const addHours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
	const addMinutes = minMatch ? parseInt(minMatch[1], 10) : 0;

	// Add duration
	startDate.setHours(startDate.getHours() + addHours);
	startDate.setMinutes(startDate.getMinutes() + addMinutes);

	// Format result
	const endDateStr = startDate.toISOString().replace('T', ' ').substring(0, 16); // "YYYY-MM-DD HH:MM"

	return endDateStr;
}

// Select map type
function SelectMap(mapType) {
	if (!window.map) {
		console.warn("window.map is not defined.");
		return;
	}

	if (!window.baseMaps || typeof window.baseMaps !== "object") {
		console.warn("window.baseMaps is not defined or not an object.");
		return;
	}

	const baseLayers = Object.values(window.baseMaps);
	let activeBaseLayer = null;

	// Find the currently active base layer
	window.map.eachLayer(function (layer) {
		if (baseLayers.includes(layer)) {
			activeBaseLayer = layer;
		}
	});

	// Determine the requested base layer
	const selectedLayer =
		mapType === "humanitarian"
			? window.baseMaps["OSM Humanitarian"]
			: window.baseMaps["OSM Standard"];

	// If the requested base layer is already active, do nothing
	if (activeBaseLayer === selectedLayer) {
		return;
	}

	// Otherwise, switch to the new base layer
	if (activeBaseLayer) {
		window.map.removeLayer(activeBaseLayer);
	}

	if (selectedLayer) {
		window.map.addLayer(selectedLayer);
	}

	//reinstantiate all the map layers
	if (cloudsOn) { map.removeLayer(clouds); map.addLayer(clouds); }
	if (precipitationOn) { map.removeLayer(precipitation); map.addLayer(precipitation); }
	if (rainOn) { map.removeLayer(rain); map.addLayer(rain); }
	if (snowOn) { map.removeLayer(snow); map.addLayer(snow); }
	if (temperatureOn) { map.removeLayer(temp); map.addLayer(temp); }
	if (windSpeedOn) { map.removeLayer(wind); map.addLayer(wind); }
	if (pressureOn) { map.removeLayer(pressure); map.addLayer(pressure); }
	if (contourOn) { map.removeLayer(pressurecntr); map.addLayer(pressurecntr); }
	if (citiesOn) { map.removeLayer(city); map.addLayer(city); }
	if (windRoseOn) { map.removeLayer(windrose); map.addLayer(windrose); }
}

// Map Dark mode (Didn't look good so its disabled)
function DarkMode(on) {
	/*if (on) {
		for (let sheet of document.styleSheets) {
			try {
				for (let i = 0; i < sheet.cssRules.length; i++) {
					const rule = sheet.cssRules[i];
					if (rule.selectorText === '.leaflet-tile') {
						rule.style.filter = 'brightness(0.3) contrast(1.2)';
					}
				}
			} catch (e) {
				// Some stylesheets (cross-origin) can throw errors on access, so we catch and ignore
			}
		}
	}
	else {
		for (let sheet of document.styleSheets) {
			try {
				for (let i = 0; i < sheet.cssRules.length; i++) {
					const rule = sheet.cssRules[i];
					if (rule.selectorText === '.leaflet-tile') {
						rule.style.filter = 'none';
					}
				}
			} catch (e) {
				// Some stylesheets (cross-origin) can throw errors on access, so we catch and ignore
			}
		}
	}*/
}

// Toggle units between metric and imperial
function Imperial(on) {
	imperialUnits = on;
	if(citiesOn)
	{
		Cities(false);
		Cities(true);
	}
}
