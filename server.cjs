/**
 * Simple Express Server for Static File Serving
 * Production'da static dosyaları serve eder
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Production'da static files serve et
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server çalışıyor' });
});

// Production'da tüm route'ları index.html'e yönlendir (SPA için)
if (isProduction) {
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Server çalışıyor: http://localhost:${PORT}`);
  console.log(`📊 Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});
