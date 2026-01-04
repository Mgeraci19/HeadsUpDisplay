// Configuration for your Heads Up Display
// Modify these settings to customize your dashboard

module.exports = {
  // Server settings
  port: 3000,

  // Location for weather (latitude, longitude)
  // Default: New York City - change to your location
  // You can find your coordinates at: https://www.latlong.net/
  location: {
    latitude: 38.9101,
    longitude: -77.0669,
    timezone: 'America/New_York',
    name: 'Washington DC'
  },

  // Google Calendar settings
  // To get your calendar embed URL:
  // 1. Go to Google Calendar settings
  // 2. Click on your calendar under "Settings for my calendars"
  // 3. Scroll to "Integrate calendar"
  // 4. Copy the "Public URL to this calendar" or use the embed code
  // Note: Your calendar must be set to public or you need to use an embed URL
  googleCalendar: {
    // Replace with your Google Calendar ID (usually your email for primary calendar)
    calendarId: 'michaelgeraci19@gmail.com',
    // Set to true once you've configured your calendar ID
    enabled: true
  },

  // Obsidian Tasks settings
  obsidian: {
    // Path to your Obsidian vault
    vaultPath: 'C:/Users/Michael Geraci/Documents/ObsidianNotes/Obsidian',
    // Set to true to enable tasks widget
    enabled: true
  }
};
