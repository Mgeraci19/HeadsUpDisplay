// Configuration for your Heads Up Display
// Copy .env.example to .env and customize your settings there

require('dotenv').config();

module.exports = {
  // Server settings
  port: parseInt(process.env.PORT) || 3000,

  // Location for weather (latitude, longitude)
  // Find your coordinates at: https://www.latlong.net/
  location: {
    latitude: parseFloat(process.env.LOCATION_LATITUDE) || 40.7128,
    longitude: parseFloat(process.env.LOCATION_LONGITUDE) || -74.0060,
    timezone: process.env.LOCATION_TIMEZONE || 'America/New_York',
    name: process.env.LOCATION_NAME || 'New York'
  },

  // Google Calendar settings
  googleCalendar: {
    calendarId: process.env.GOOGLE_CALENDAR_ID || '',
    enabled: process.env.GOOGLE_CALENDAR_ENABLED === 'true'
  },

  // Obsidian Tasks settings
  obsidian: {
    vaultPath: process.env.OBSIDIAN_VAULT_PATH || '',
    enabled: process.env.OBSIDIAN_ENABLED === 'true'
  }
};
