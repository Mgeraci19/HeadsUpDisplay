const express = require('express');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

// Load configuration
const config = require('./config');

const app = express();
const PORT = config.port || 3000;

// Inject configuration into the HTML (must be before static middleware)
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
        googleCalendar: config.googleCalendar,
        obsidian: { enabled: config.obsidian?.enabled || false }
      })};
    </script>
    </head>`;

    const modifiedHtml = html.replace('</head>', configScript);
    res.send(modifiedHtml);
  });
});

// Recursively find all markdown files in a directory
async function findMarkdownFiles(dir, files = []) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip hidden files/folders and .obsidian folder
      if (entry.name.startsWith('.')) continue;

      if (entry.isDirectory()) {
        await findMarkdownFiles(fullPath, files);
      } else if (entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }

  return files;
}

// Parse tasks from markdown content
function parseTasksFromMarkdown(content, filePath) {
  const tasks = [];
  const lines = content.split('\n');

  // Regex for uncompleted tasks with due dates
  // Matches: - [ ] Task text 📅 YYYY-MM-DD
  const taskRegex = /^[\s]*-\s*\[\s*\]\s*(.+)/;
  const dueDateRegex = /📅\s*(\d{4}-\d{2}-\d{2})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const taskMatch = line.match(taskRegex);

    if (taskMatch) {
      const taskText = taskMatch[1];
      const dueDateMatch = taskText.match(dueDateRegex);

      if (dueDateMatch) {
        const dueDate = dueDateMatch[1];
        // Remove the due date emoji and date from display text
        const cleanText = taskText.replace(/📅\s*\d{4}-\d{2}-\d{2}/, '').trim();

        tasks.push({
          text: cleanText,
          dueDate: dueDate,
          file: path.basename(filePath, '.md'),
          filePath: filePath,
          line: i + 1
        });
      }
    }
  }

  return tasks;
}

// API endpoint for Obsidian tasks
app.get('/api/tasks', async (req, res) => {
  if (!config.obsidian?.enabled || !config.obsidian?.vaultPath) {
    return res.json({ enabled: false, tasks: [] });
  }

  try {
    const vaultPath = config.obsidian.vaultPath;

    // Check if vault exists
    try {
      await stat(vaultPath);
    } catch {
      return res.status(404).json({ error: 'Obsidian vault not found', path: vaultPath });
    }

    // Find all markdown files
    const mdFiles = await findMarkdownFiles(vaultPath);

    // Parse tasks from all files
    let allTasks = [];
    for (const file of mdFiles) {
      try {
        const content = await readFile(file, 'utf8');
        const tasks = parseTasksFromMarkdown(content, file);
        allTasks = allTasks.concat(tasks);
      } catch (err) {
        console.error(`Error reading file ${file}:`, err.message);
      }
    }

    // Get date boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    // Categorize tasks
    const overdue = [];
    const dueToday = [];
    const upcoming = [];

    for (const task of allTasks) {
      const taskDate = new Date(task.dueDate + 'T00:00:00');

      if (taskDate < today) {
        overdue.push(task);
      } else if (taskDate.getTime() === today.getTime()) {
        dueToday.push(task);
      } else if (taskDate <= endOfWeek) {
        upcoming.push(task);
      }
    }

    // Sort each category by date
    const sortByDate = (a, b) => new Date(a.dueDate) - new Date(b.dueDate);
    overdue.sort(sortByDate);
    dueToday.sort(sortByDate);
    upcoming.sort(sortByDate);

    res.json({
      enabled: true,
      overdue,
      dueToday,
      upcoming,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Serve static files from public directory (after root route)
app.use(express.static(path.join(__dirname, 'public')));

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
