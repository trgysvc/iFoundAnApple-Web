/**
 * Express Server for API Endpoints
 * Handles payment processing and other backend functionality
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'İyzico API Server çalışıyor',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Import and use API handlers
app.post('/api/iyzico-payment', async (req, res) => {
  try {
    const { handleIyzicoPayment } = await import('./api/iyzico-payment.js');
    const response = await handleIyzicoPayment(req);
    
    // Convert Response to Express response
    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.send(await response.text());
  } catch (error) {
    console.error('Iyzico payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/process-payment', async (req, res) => {
  try {
    const { processPaymentAPI } = await import('./api/process-payment.js');
    const result = await processPaymentAPI(req.body);
    res.json(result);
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/release-escrow', async (req, res) => {
  try {
    const { handleReleaseEscrow } = await import('./api/release-escrow.js');
    const response = await handleReleaseEscrow(req);
    
    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.send(await response.text());
  } catch (error) {
    console.error('Release escrow error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Webhook endpoints
app.post('/api/webhooks/iyzico-callback', async (req, res) => {
  try {
    const { handleIyzicoCallback } = await import('./api/webhooks/iyzico-callback.js');
    const response = await handleIyzicoCallback(req);
    
    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.send(await response.text());
  } catch (error) {
    console.error('Iyzico callback error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/webhooks/iyzico-3d-callback', async (req, res) => {
  try {
    const { handleIyzico3DCallback } = await import('./api/webhooks/iyzico-3d-callback.js');
    const response = await handleIyzico3DCallback(req);
    
    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.send(await response.text());
  } catch (error) {
    console.error('Iyzico 3D callback error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Fee calculation endpoint
app.post('/api/calculate-fees', async (req, res) => {
  try {
    const { handleCalculateFees } = await import('./api/calculate-fees.js');
    const response = await handleCalculateFees(req);
    
    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.send(await response.text());
  } catch (error) {
    console.error('Calculate fees error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api/*`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
