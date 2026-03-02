const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Zoom requires these OWASP security headers on all text/html responses.
// Without them, the app is blocked from rendering in the Zoom client.
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
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

// Serve static files from public (index.html) and dist (bundle.js)
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use(express.static(path.join(__dirname, 'dist'), staticOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Zoom Timer App is running' });
});

// Serve the main index.html for SPA fallback
app.get('*path', (req, res) => {
  setSecurityHeaders(res);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
