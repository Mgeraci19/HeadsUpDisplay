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

2. Configure your settings:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your personal settings:
   - Set your location (latitude/longitude)
   - Add your Google Calendar ID
   - Set your Obsidian vault path

3. Start the server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

## Running Long-Term (PM2)

For running the server persistently in the background, use PM2:

### Installation

```bash
npm install -g pm2
```

### Start the Server

```bash
pm2 start server.js --name "HeadsUpDisplay"
```

### Auto-Start on Windows Boot

```bash
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

### PM2 Commands Reference

| Command | Description |
|---------|-------------|
| `pm2 status` | Check running processes |
| `pm2 logs HeadsUpDisplay` | View server logs |
| `pm2 stop HeadsUpDisplay` | Stop the server |
| `pm2 restart HeadsUpDisplay` | Restart the server |
| `pm2 delete HeadsUpDisplay` | Remove from PM2 |
| `pm2 kill` | Shutdown PM2 daemon entirely |

**Note:** Closing the terminal window does NOT stop PM2 - the server continues running in the background. Use `pm2 stop` or `pm2 kill` to stop it.

## Configuration

Copy `.env.example` to `.env` and customize your settings:

```bash
# Server Configuration
PORT=3000

# Location Settings (find your coordinates at https://www.latlong.net/)
LOCATION_LATITUDE=40.7128
LOCATION_LONGITUDE=-74.0060
LOCATION_TIMEZONE=America/New_York
LOCATION_NAME=New York

# Google Calendar
GOOGLE_CALENDAR_ENABLED=true
GOOGLE_CALENDAR_ID=your-email@gmail.com

# Obsidian Integration
OBSIDIAN_ENABLED=true
OBSIDIAN_VAULT_PATH=/path/to/your/Obsidian Vault
```

**Note:** The `.env` file contains your personal settings and is not committed to git.

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
├── .env.example        # Template for environment variables
├── .env                # Your personal settings (not committed)
├── config.js           # Loads settings from .env
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
