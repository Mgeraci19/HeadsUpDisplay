// Heads Up Display - Main Application

// Configuration will be injected by the server
let config = window.HUD_CONFIG || {
  location: { latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', name: 'New York' },
  googleCalendar: { enabled: false, calendarId: '' },
  obsidian: { enabled: false }
};

// Collection of grounding quotes
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It is not the mountain we conquer, but ourselves.", author: "Edmund Hillary" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh" },
  { text: "Between stimulus and response there is a space. In that space is our power to choose.", author: "Viktor Frankl" },
  { text: "How we spend our days is, of course, how we spend our lives.", author: "Annie Dillard" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Be where you are, not where you think you should be.", author: "Unknown" },
  { text: "One day at a time.", author: "Unknown" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Breathe. You're going to be okay.", author: "Unknown" },
  { text: "You are enough just as you are.", author: "Meghan Markle" },
  { text: "This too shall pass.", author: "Persian Proverb" },
  { text: "Be patient with yourself. Nothing in nature blooms all year.", author: "Unknown" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Wherever you go, there you are.", author: "Jon Kabat-Zinn" }
];

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
  displayQuote();
  fetchWeather();
  setupCalendar();
  fetchTasks();

  // Refresh weather every 15 minutes
  setInterval(fetchWeather, 15 * 60 * 1000);

  // Refresh tasks every 5 minutes
  setInterval(fetchTasks, 5 * 60 * 1000);

  // Update greeting every minute
  setInterval(updateGreeting, 60 * 1000);
});

// Display quote of the day (changes daily based on date)
function displayQuote() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const quoteIndex = dayOfYear % quotes.length;
  const quote = quotes[quoteIndex];

  document.getElementById('quote-text').textContent = `"${quote.text}"`;
  document.getElementById('quote-author').textContent = `— ${quote.author}`;
}

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
  url.searchParams.set('daily', 'sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max');
  url.searchParams.set('temperature_unit', 'fahrenheit');
  url.searchParams.set('forecast_days', '2');

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

  // Hourly forecast with tomorrow
  displayHourlyForecast(hourly, daily);

  // Rain alert
  checkForRain(hourly);
}

// Display hourly forecast for today and tomorrow
function displayHourlyForecast(hourly, daily) {
  const container = document.getElementById('hourly-forecast');
  const currentHour = new Date().getHours();

  let html = '';

  // Today's remaining hours
  html += '<div class="forecast-day"><span class="day-label">Today</span>';
  for (let i = currentHour; i < 24; i++) {
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
  html += '</div>';

  // Tomorrow summary
  if (daily && daily.weather_code && daily.weather_code[1] !== undefined) {
    const tomorrowWeather = weatherCodes[daily.weather_code[1]] || { icon: '❓', description: 'Unknown' };
    const tomorrowHigh = Math.round(daily.temperature_2m_max[1]);
    const tomorrowLow = Math.round(daily.temperature_2m_min[1]);
    const tomorrowRain = daily.precipitation_probability_max[1];

    html += `
      <div class="forecast-day tomorrow-summary">
        <span class="day-label">Tomorrow</span>
        <div class="hourly-item tomorrow-item ${tomorrowRain > 30 ? 'has-rain' : ''}">
          <div class="hourly-icon">${tomorrowWeather.icon}</div>
          <div class="hourly-temp">${tomorrowHigh}°<span class="temp-low">/${tomorrowLow}°</span></div>
          ${tomorrowRain > 0 ? `<div class="hourly-rain">${tomorrowRain}%</div>` : ''}
        </div>
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
    // Using AGENDA mode for a list view of upcoming events
    const calendarId = encodeURIComponent(config.googleCalendar.calendarId);
    const iframe = document.createElement('iframe');
    iframe.className = 'calendar-iframe';
    iframe.src = `https://calendar.google.com/calendar/embed?src=${calendarId}&mode=AGENDA&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0&showDate=1`;
    iframe.frameBorder = '0';
    iframe.scrolling = 'auto';

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

// Fetch tasks from Obsidian vault
async function fetchTasks() {
  const container = document.getElementById('tasks-container');
  const widget = document.getElementById('tasks-widget');

  if (!config.obsidian?.enabled) {
    container.innerHTML = `
      <div class="tasks-placeholder">
        <p>Obsidian tasks not configured</p>
        <p>Edit <code>config.js</code> to add your vault path</p>
      </div>
    `;
    return;
  }

  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Failed to fetch tasks');

    const data = await response.json();

    if (!data.enabled) {
      container.innerHTML = `
        <div class="tasks-placeholder">
          <p>Obsidian tasks not configured</p>
          <p>Edit <code>config.js</code> to add your vault path</p>
        </div>
      `;
      return;
    }

    displayTasks(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    container.innerHTML = `
      <div class="error">Unable to load tasks</div>
    `;
  }
}

// Display tasks in the widget
function displayTasks(data) {
  const container = document.getElementById('tasks-container');
  const { overdue, dueToday, upcoming } = data;

  if (overdue.length === 0 && dueToday.length === 0 && upcoming.length === 0) {
    container.innerHTML = `
      <div class="tasks-empty">No tasks due this week</div>
    `;
    return;
  }

  let html = '';

  // Overdue tasks
  if (overdue.length > 0) {
    html += renderTaskSection('Overdue', overdue, 'overdue');
  }

  // Today's tasks
  if (dueToday.length > 0) {
    html += renderTaskSection('Due Today', dueToday, 'today');
  }

  // Upcoming tasks
  if (upcoming.length > 0) {
    html += renderTaskSection('Coming Up', upcoming, 'upcoming');
  }

  container.innerHTML = html;
}

// Render a task section
function renderTaskSection(title, tasks, className) {
  const taskItems = tasks.map(task => `
    <li class="task-item">
      <div class="task-text">${escapeHtml(task.text)}</div>
      <div class="task-meta">
        <span class="task-date">${formatTaskDate(task.dueDate)}</span>
        <span class="task-file">${escapeHtml(task.file)}</span>
      </div>
    </li>
  `).join('');

  return `
    <div class="task-section ${className}">
      <div class="task-section-header">
        <span>${title}</span>
        <span class="count">${tasks.length}</span>
      </div>
      <ul class="task-list">
        ${taskItems}
      </ul>
    </div>
  `;
}

// Format task date for display
function formatTaskDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;

  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
