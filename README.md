# Heads Up Display

A local homepage dashboard for daily awareness - weather, calendar, tasks, and motivational quotes.

## Features

- **Weather Widget**
  - Current temperature and conditions
  - "Feels like" temperature
  - Hourly forecast for today
  - Tomorrow's forecast summary (high/low)
  - Rain probability alerts
  - Sunrise and sunset times
  - Auto-refreshes every 15 minutes

- **Google Calendar**
  - Embedded agenda view of upcoming events
  - Auto-updates with your calendar

- **Obsidian Tasks Integration**
  - Displays tasks from your Obsidian vault
  - Shows overdue, due today, and upcoming tasks (next 7 days)
  - Parses tasks with the Obsidian Tasks plugin format
  - Auto-refreshes every 5 minutes

- **Daily Quote**
  - Rotating motivational quotes
  - Changes daily based on date

## Screenshot

The dashboard is optimized for a 1080p display with:
- Tasks sidebar on the left
- Weather bar at the top right
- Calendar taking the main area

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your settings in `config.js`:
   - Set your location (latitude/longitude)
   - Add your Google Calendar ID
   - Set your Obsidian vault path

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
    latitude: 38.9101,
    longitude: -77.0669,
    timezone: 'America/New_York',
    name: 'Washington DC'
  },

  googleCalendar: {
    calendarId: 'your-email@gmail.com',
    enabled: true
  },

  obsidian: {
    vaultPath: '/path/to/your/Obsidian Vault',
    enabled: true
  }
};
```

### Finding Your Coordinates

Visit https://www.latlong.net/ to find your location's coordinates.

### Setting Up Google Calendar

1. Go to [Google Calendar](https://calendar.google.com)
2. Click the gear icon > Settings
3. Under "Settings for my calendars", click your calendar
4. Scroll to "Integrate calendar"
5. Copy your Calendar ID (usually your email for primary calendar)
6. Ensure your calendar sharing settings allow embedding

### Obsidian Tasks Format

The dashboard looks for uncompleted tasks with due dates in this format:
```markdown
- [ ] Task description 📅 2025-01-15
```

This is compatible with the [Obsidian Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) plugin.

## API Dependencies

- **Weather**: [Open-Meteo](https://open-meteo.com/) - Free, no API key required
- **Calendar**: Google Calendar embed (requires public calendar or embed URL)
- **Tasks**: Local file system access to Obsidian vault

## Project Structure

```
HeadsUpDisplay/
├── config.js           # User configuration
├── server.js           # Express server with API endpoints
├── package.json        # Dependencies
├── public/
│   ├── index.html      # Dashboard layout
│   ├── styles.css      # Styling (optimized for 1080p)
│   └── app.js          # Frontend logic
├── KNOWN_ISSUES.md     # Known bugs and limitations
└── README.md           # This file
```

## Known Issues

See [KNOWN_ISSUES.md](KNOWN_ISSUES.md) for current limitations.

## License

MIT
