const { describe, it } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');

describe('Project structure', () => {
  it('should have required files', () => {
    const requiredFiles = [
      'server.js',
      'config.js',
      'package.json',
      'public/index.html',
      'public/styles.css',
      'public/app.js'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, '..', file);
      assert.ok(fs.existsSync(filePath), `Missing required file: ${file}`);
    }
  });

  it('should have valid package.json', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    assert.ok(pkg.name, 'package.json should have a name');
    assert.ok(pkg.version, 'package.json should have a version');
    assert.ok(pkg.scripts.start, 'package.json should have a start script');
    assert.ok(pkg.dependencies.express, 'package.json should have express dependency');
  });
});

describe('Config structure', () => {
  it('should export valid config object', () => {
    const config = require('../config');

    assert.ok(config.port, 'Config should have port');
    assert.ok(config.location, 'Config should have location');
    assert.ok(config.location.latitude !== undefined, 'Location should have latitude');
    assert.ok(config.location.longitude !== undefined, 'Location should have longitude');
    assert.ok(config.location.timezone, 'Location should have timezone');
    assert.ok(config.location.name, 'Location should have name');
  });

  it('should have valid coordinate ranges', () => {
    const config = require('../config');

    assert.ok(
      config.location.latitude >= -90 && config.location.latitude <= 90,
      'Latitude should be between -90 and 90'
    );
    assert.ok(
      config.location.longitude >= -180 && config.location.longitude <= 180,
      'Longitude should be between -180 and 180'
    );
  });
});

describe('Frontend files', () => {
  it('should have valid HTML structure', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(html.includes('<!DOCTYPE html>'), 'HTML should have doctype');
    assert.ok(html.includes('<html'), 'HTML should have html tag');
    assert.ok(html.includes('app.js'), 'HTML should reference app.js');
    assert.ok(html.includes('styles.css'), 'HTML should reference styles.css');
  });

  it('should have weather widget elements', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(html.includes('weather-widget'), 'Should have weather widget');
    assert.ok(html.includes('hourly-forecast'), 'Should have hourly forecast');
  });

  it('should have tasks widget elements', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(html.includes('tasks-widget'), 'Should have tasks widget');
    assert.ok(html.includes('tasks-container'), 'Should have tasks container');
  });

  it('should have calendar widget elements', () => {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    assert.ok(html.includes('calendar-widget'), 'Should have calendar widget');
    assert.ok(html.includes('calendar-container'), 'Should have calendar container');
  });
});

describe('JavaScript functionality', () => {
  it('should have required functions defined', () => {
    const jsPath = path.join(__dirname, '..', 'public', 'app.js');
    const js = fs.readFileSync(jsPath, 'utf8');

    const requiredFunctions = [
      'updateGreeting',
      'updateDate',
      'fetchWeather',
      'displayWeather',
      'setupCalendar',
      'fetchTasks',
      'displayQuote'
    ];

    for (const fn of requiredFunctions) {
      assert.ok(js.includes(`function ${fn}`), `Should have ${fn} function`);
    }
  });

  it('should have weather codes defined', () => {
    const jsPath = path.join(__dirname, '..', 'public', 'app.js');
    const js = fs.readFileSync(jsPath, 'utf8');

    assert.ok(js.includes('weatherCodes'), 'Should have weatherCodes object');
    assert.ok(js.includes('Clear sky'), 'Should have weather descriptions');
  });

  it('should have quotes array defined', () => {
    const jsPath = path.join(__dirname, '..', 'public', 'app.js');
    const js = fs.readFileSync(jsPath, 'utf8');

    assert.ok(js.includes('const quotes'), 'Should have quotes array');
  });
});
