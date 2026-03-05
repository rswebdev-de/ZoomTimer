const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// PUBLIC_URL: the path prefix where a reverse proxy exposes this app
// (e.g. "/apps/timer"). Leave empty when served from root.
const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');

// Pre-render index.html with <base> tag so the browser resolves
// relative asset URLs (bundle.js, etc.) against the proxy prefix.
const rawIndexHtml = fs.readFileSync(
  path.join(__dirname, 'public', 'index.html'),
  'utf8',
);
const indexHtml = PUBLIC_URL
  ? rawIndexHtml.replace('<head>', `<head>\n    <base href="${PUBLIC_URL}/" />`)
  : rawIndexHtml;

// Zoom requires these OWASP security headers on all text/html responses.
// Without them, the app is blocked from rendering in the Zoom client.
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
  ].join('; '),
};

function setSecurityHeaders(res) {
  for (const [key, value] of Object.entries(securityHeaders)) {
    res.setHeader(key, value);
  }
}

const staticOptions = { setHeaders: setSecurityHeaders };

// Serve static files from public and dist.
// index: false prevents express.static from serving index.html for "/",
// so all HTML responses go through the SPA fallback with <base> injection.
app.use(express.static(path.join(__dirname, 'public'), { ...staticOptions, index: false }));
app.use(express.static(path.join(__dirname, 'dist'), staticOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Zoom Timer App is running' });
});

// Serve the main index.html for SPA fallback
app.get('*path', (req, res) => {
  setSecurityHeaders(res);
  res.type('html').send(indexHtml);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Zoom Timer App server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
