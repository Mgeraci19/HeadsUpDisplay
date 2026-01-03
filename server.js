const express = require('express');
const path = require('path');
const fs = require('fs');

// Load configuration
const config = require('./config');

const app = express();
const PORT = config.port || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Inject configuration into the HTML
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'public', 'index.html');

  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Server error');
    }

    // Inject the configuration as a script before the app.js loads
    const configScript = `
    <script>
      window.HUD_CONFIG = ${JSON.stringify({
        location: config.location,
        googleCalendar: config.googleCalendar
      })};
    </script>
    </head>`;

    const modifiedHtml = html.replace('</head>', configScript);
    res.send(modifiedHtml);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                   Heads Up Display                         ║
╠═══════════════════════════════════════════════════════════╣
║  Dashboard running at: http://localhost:${PORT}              ║
║                                                           ║
║  Configuration:                                           ║
║  - Location: ${config.location.name.padEnd(41)}║
║  - Calendar: ${config.googleCalendar.enabled ? 'Enabled' : 'Not configured'.padEnd(41)}║
║                                                           ║
║  Edit config.js to customize your dashboard               ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
