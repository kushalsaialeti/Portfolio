require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const https = require('https');
const cmsRoutes = require('./routes/cmsRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const KEEP_ALIVE_INTERVAL_MS = 5 * 60 * 1000;

function pingUrl(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      const req = client.get(
        parsedUrl,
        { timeout: 10000, headers: { 'User-Agent': 'portfolio-keep-alive' } },
        (res) => {
          res.resume();
          resolve(res.statusCode >= 200 && res.statusCode < 500);
        }
      );

      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.on('error', () => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

function startKeepAliveJob() {
  const isEnabled = String(process.env.KEEP_ALIVE_ENABLED || 'false').toLowerCase() === 'true';

  if (!isEnabled) {
    console.log('Keep-alive job is disabled.');
    return;
  }

  const frontendUrl = process.env.KEEP_ALIVE_FRONTEND_URL;
  const backendUrl = process.env.KEEP_ALIVE_BACKEND_URL || process.env.RENDER_EXTERNAL_URL;

  const targets = [
    { label: 'frontend', url: frontendUrl },
    { label: 'backend', url: backendUrl }
  ].filter((target) => Boolean(target.url));

  if (targets.length === 0) {
    console.log('Keep-alive job enabled but no URLs are configured.');
    return;
  }

  const runPings = async () => {
    await Promise.all(
      targets.map(async ({ label, url }) => {
        const ok = await pingUrl(url);
        const statusText = ok ? 'OK' : 'FAILED';
        console.log(`[keep-alive] ${label} ping ${statusText}: ${url}`);
      })
    );
  };

  runPings();
  setInterval(runPings, KEEP_ALIVE_INTERVAL_MS);
  console.log(`Keep-alive job started. Interval: ${KEEP_ALIVE_INTERVAL_MS / 60000} minutes.`);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', cmsRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/contact', contactRoutes);

// Health Check
app.get('/', (req, res) => res.send('Portfolio CMS API is online.'));

// Database & Server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-cms')
  .then(() => {
    console.log('MongoDB Connected successfully.');
    startKeepAliveJob();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));
