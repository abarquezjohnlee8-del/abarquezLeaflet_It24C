
const map = L.map("map").setView([11.2, 123], 6);

// Add base tile layer
L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { attribution: "© OpenStreetMap contributors" }
).addTo(map);


const cities = [
  { name: "Manila",         lat: 14.5995, lon: 120.9842 },
  { name: "Cebu City",      lat: 10.3157, lon: 123.8854 },
  { name: "Davao City",     lat: 7.1907,  lon: 125.4553 },
  { name: "Manolo Fortich", lat: 8.35809,lon: 124.87885 } // ✅ Added your location
 
];


// Your OpenWeatherMap API key — replace with your own
const apiKey = "YOUR_API_KEY_HERE";

// --------------------------
// Weather Fetch Function
// --------------------------
async function getCurrentWeather(city, apiKey) {
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  
  // ✅ PASS LATITUDE & LONGITUDE to the API
  url.searchParams.set("lat", city.lat);
  url.searchParams.set("lon", city.lon);
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", apiKey);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

// --------------------------
// Show Weather on Marker Click
// --------------------------
async function showWeather(city, marker) {
  marker.bindPopup("Loading weather...").openPopup();
  try {
    const data = await getCurrentWeather(city, apiKey);
    
    // Extract weather data
    const temp = data.main.temp.toFixed(1);
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const windSpeed = data.wind.speed;

    // ✅ Display including coordinates
    const popupContent = `
      <strong>${city.name}</strong><br>
      📍 Lat: ${city.lat}, Lon: ${city.lon}<br>
      🌡️ Temperature: ${temp} °C<br>
      💧 Humidity: ${humidity}%<br>
      🌤️ ${description}<br>
      💨 Wind: ${windSpeed} m/s
    `;
    
    marker.bindPopup(popupContent).openPopup();
    console.log(`${city.name} (${city.lat}, ${city.lon}): ${temp} °C — ${description}`);
  } catch (error) {
    marker.bindPopup("⚠️ Weather unavailable").openPopup();
    console.error("Error fetching weather:", error);
  }
}

// --------------------------
// Create Markers for ALL cities
// --------------------------
cities.forEach(city => {
  // ✅ Place marker using latitude & longitude
  const marker = L.marker([city.lat, city.lon]).addTo(map);
  marker.on("click", () => showWeather(city, marker));
});

map.on("click", function(event) {
const lat = event.latlng.lat;
const lng = event.latlng.lng;

L.popup()
.setLatLng(event.latlng)
.setContent(
"Latitude: " + lat.toFixed(5) +
"<br>Longitude: " + lng.toFixed(5)
)
.openOn(map);
});
