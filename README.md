# Heads Up Display

A local homepage dashboard for daily awareness - weather, calendar, and more.

## Features

- **Weather Widget**: Shows current temperature, conditions, hourly forecast, rain alerts, and sunrise/sunset times
- **Google Calendar**: Embedded weekly calendar view
- **Auto-refresh**: Weather updates every 15 minutes

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your settings in `config.js`:
   - Set your location (latitude/longitude)
   - Add your Google Calendar ID

3. Start the server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

## Configuration

Edit `config.js` to customize:

```javascript
module.exports = {
  port: 3000,

  location: {
    latitude: 40.7128,      // Your latitude
    longitude: -74.0060,    // Your longitude
    timezone: 'America/New_York',
    name: 'New York'
  },

  googleCalendar: {
    calendarId: 'your-email@gmail.com',
    enabled: true
  }
};
```

### Finding Your Coordinates

Visit https://www.latlong.net/ to find your location's coordinates.

### Setting Up Google Calendar

1. Go to [Google Calendar](https://calendar.google.com)
2. Click the gear icon → Settings
3. Under "Settings for my calendars", click your calendar
4. Scroll to "Integrate calendar"
5. Copy your Calendar ID (usually your email for primary calendar)
6. Make sure your calendar sharing settings allow embedding

## Weather Data

Weather data is provided by [Open-Meteo](https://open-meteo.com/) - a free, open-source weather API that requires no API key.

## Future Enhancements

- [ ] Obsidian tasks integration
- [ ] Multiple calendar support
- [ ] Custom widgets
- [ ] Dark/light theme toggle
