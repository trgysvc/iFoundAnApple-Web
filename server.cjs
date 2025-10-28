/**
 * Simple Express Server for Payment Processing
 * Bu server ödeme işlemleri için gerekli endpoint'leri sağlar
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Form data için

// Production'da static files serve et
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Supabase Configuration (Environment'dan alınmalı)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zokkxkyhabihxjskdcfg.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2t4a3loYWJpaHhqc2tkY2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTQyMDMsImV4cCI6MjA3MTE5MDIwM30.Dvnl7lUwezVDGY9I6IIgfoJXWtaw1Un_idOxTlI0xwQ';

// Backend anon key kullanır (payer_id device'dan alınacak, RLS uyumlu)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('[SERVER] Payment Server başlatılıyor...');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Payment Server çalışıyor' });
});

// Production'da tüm route'ları index.html'e yönlendir (SPA için)
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Payment Server çalışıyor: http://localhost:${PORT}`);
  console.log(`📊 Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});