// Heads Up Display - Main Application

// Configuration will be injected by the server
let config = window.HUD_CONFIG || {
  location: { latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', name: 'New York' },
  googleCalendar: { enabled: false, calendarId: '' }
};

// Weather code to description and icon mapping
const weatherCodes = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌧️' },
  53: { description: 'Moderate drizzle', icon: '🌧️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: '🌨️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: '🌨️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌦️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
  updateGreeting();
  updateDate();
  fetchWeather();
  setupCalendar();

  // Refresh weather every 15 minutes
  setInterval(fetchWeather, 15 * 60 * 1000);

  // Update greeting every minute
  setInterval(updateGreeting, 60 * 1000);
});

// Update greeting based on time of day
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = 'Morning';
  } else if (hour < 17) {
    greeting = 'Afternoon';
  } else {
    greeting = 'Evening';
  }

  document.getElementById('greeting-time').textContent = greeting;
}

// Update current date display
function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
}

// Fetch weather data from Open-Meteo API
async function fetchWeather() {
  const { latitude, longitude, timezone, name } = config.location;

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('timezone', timezone);
  url.searchParams.set('current', 'temperature_2m,apparent_temperature,weather_code');
  url.searchParams.set('hourly', 'temperature_2m,precipitation_probability,weather_code');
  url.searchParams.set('daily', 'sunrise,sunset');
  url.searchParams.set('temperature_unit', 'fahrenheit');
  url.searchParams.set('forecast_days', '1');

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather data fetch failed');

    const data = await response.json();
    displayWeather(data);
    updateLastUpdated();

    // Update location name
    document.getElementById('location-name').textContent = `- ${name}`;
  } catch (error) {
    console.error('Error fetching weather:', error);
    document.getElementById('weather-current').innerHTML = `
      <div class="error">Unable to load weather data. Please check your connection.</div>
    `;
  }
}

// Display weather data
function displayWeather(data) {
  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  // Current weather
  const weatherInfo = weatherCodes[current.weather_code] || { description: 'Unknown', icon: '❓' };

  document.getElementById('weather-current').innerHTML = `
    <div class="current-temp">
      ${Math.round(current.temperature_2m)}<span class="unit">°F</span>
    </div>
    <div class="current-conditions">
      <div class="description">${weatherInfo.icon} ${weatherInfo.description}</div>
      <div class="feels-like">Feels like ${Math.round(current.apparent_temperature)}°F</div>
    </div>
  `;

  // Sunrise and sunset
  const sunrise = new Date(daily.sunrise[0]);
  const sunset = new Date(daily.sunset[0]);

  document.getElementById('sunrise').textContent = sunrise.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  document.getElementById('sunset').textContent = sunset.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Hourly forecast
  displayHourlyForecast(hourly);

  // Rain alert
  checkForRain(hourly);
}

// Display hourly forecast
function displayHourlyForecast(hourly) {
  const container = document.getElementById('hourly-forecast');
  const currentHour = new Date().getHours();

  let html = '';

  // Show next 12 hours
  for (let i = currentHour; i < Math.min(currentHour + 12, 24); i++) {
    const time = new Date(hourly.time[i]);
    const temp = Math.round(hourly.temperature_2m[i]);
    const rainChance = hourly.precipitation_probability[i];
    const weatherInfo = weatherCodes[hourly.weather_code[i]] || { icon: '❓' };
    const hasRain = rainChance > 30;

    html += `
      <div class="hourly-item ${hasRain ? 'has-rain' : ''}">
        <div class="hourly-time">${time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</div>
        <div class="hourly-icon">${weatherInfo.icon}</div>
        <div class="hourly-temp">${temp}°</div>
        ${rainChance > 0 ? `<div class="hourly-rain">${rainChance}%</div>` : ''}
      </div>
    `;
  }

  container.innerHTML = html;
}

// Check if rain is expected and show alert
function checkForRain(hourly) {
  const currentHour = new Date().getHours();
  const alertElement = document.getElementById('rain-alert');
  const messageElement = document.getElementById('rain-message');

  let rainTimes = [];

  for (let i = currentHour; i < 24; i++) {
    if (hourly.precipitation_probability[i] > 50) {
      const time = new Date(hourly.time[i]);
      rainTimes.push(time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }));
    }
  }

  if (rainTimes.length > 0) {
    alertElement.style.display = 'flex';
    if (rainTimes.length === 1) {
      messageElement.textContent = `Rain likely around ${rainTimes[0]}`;
    } else if (rainTimes.length <= 3) {
      messageElement.textContent = `Rain likely at ${rainTimes.join(', ')}`;
    } else {
      messageElement.textContent = `Rain expected throughout the day (${rainTimes.length} hours)`;
    }
  } else {
    alertElement.style.display = 'none';
  }
}

// Setup Google Calendar embed
function setupCalendar() {
  const container = document.getElementById('calendar-container');
  const placeholder = document.getElementById('calendar-placeholder');

  if (config.googleCalendar.enabled && config.googleCalendar.calendarId) {
    placeholder.style.display = 'none';

    // Create the Google Calendar embed iframe
    // Using agenda mode for weekly view
    const calendarId = encodeURIComponent(config.googleCalendar.calendarId);
    const iframe = document.createElement('iframe');
    iframe.className = 'calendar-iframe';
    iframe.src = `https://calendar.google.com/calendar/embed?src=${calendarId}&mode=WEEK&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=1`;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';

    container.appendChild(iframe);
  }
}

// Update last updated timestamp
function updateLastUpdated() {
  const now = new Date();
  document.getElementById('last-updated').textContent = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
