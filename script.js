const map = L.map("map").setView([11.2, 123], 6);
L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{ attribution: "© OpenStreetMap contributors" }
).addTo(map);
const cities = [
{ name: "Manila", lat: 14.5995, lon: 120.9842 },
{ name: "Cebu City", lat: 10.3157, lon: 123.8854 },
{ name: "Davao City", lat: 7.1907, lon: 125.4553 }
];
cities.forEach(city => {
const marker = L.marker([city.lat, city.lon]).addTo(map);
marker.on("click", () => showWeather(city, marker));
});
const url = new URL(
"https://api.openweathermap.org/data/2.5/weather"
);
url.searchParams.set("lat", city.lat);
url.searchParams.set("lon", city.lon);
url.searchParams.set("units", "metric");
url.searchParams.set("appid", apiKey);
async function getCurrentWeather(city, apiKey) {
const url = new URL(
"https://api.openweathermap.org/data/2.5/weather"
);
url.searchParams.set("lat", city.lat);
url.searchParams.set("lon", city.lon);
url.searchParams.set("units", "metric");
url.searchParams.set("appid", apiKey);
const response = await fetch(url);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return await response.json();
}
const temperature = data.main.temp;
const humidity = data.main.humidity;
const description = data.weather[0].description;
const windSpeed = data.wind.speed;

// Example display
console.log(`${temperature} °C — ${description}`);
async function showWeather(city, marker) {
marker.bindPopup("Loading weather...").openPopup();
try {
const data = await getCurrentWeather(city, apiKey);
const summary = `${data.main.temp.toFixed(1)} °C`;
marker.bindPopup(`${city.name}: ${summary}`).openPopup();
} catch (error) {
marker.bindPopup("Weather unavailable.").openPopup();
console.error(error);
}
}