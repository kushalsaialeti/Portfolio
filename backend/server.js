require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const https = require('https');
const compression = require('compression');
const cmsRoutes = require('./routes/cmsRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { initRedis } = require('./utils/redisClient');

const app = express();
const PORT = process.env.PORT || 5000;
// RENDER KEEP-ALIVE: Render spins down after 15 minutes of inactivity.
// Pinging every 10 minutes prevents the container from ever sleeping while active.
const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000;

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
        { timeout: 15000, headers: { 'User-Agent': 'portfolio-keep-alive/2.0' } },
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
  const isEnabled = String(process.env.KEEP_ALIVE_ENABLED || 'true').toLowerCase() === 'true';

  if (!isEnabled) {
    console.log('Keep-alive job is explicitly DISABLED via environment.');
    return;
  }

  const frontendUrl = process.env.KEEP_ALIVE_FRONTEND_URL || 'https://kushalsaialeti.vercel.app';
  
  // Auto-detect or default to the Render deployment /health endpoint
  const rawBackend = process.env.KEEP_ALIVE_BACKEND_URL || 
                     process.env.RENDER_EXTERNAL_URL ||
                     (process.env.RENDER_EXTERNAL_HOSTNAME ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}` : null) ||
                     'https://portfolio-4uyl.onrender.com';

  const backendUrl = rawBackend.endsWith('/health') 
    ? rawBackend 
    : `${rawBackend.replace(/\/api\/?$/, '').replace(/\/$/, '')}/health`;

  const targets = [
    { label: 'Frontend', url: frontendUrl },
    { label: 'Backend Health', url: backendUrl }
  ].filter((target) => Boolean(target.url));

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
// OPTIMIZATION: Add gzip compression to reduce payload size by ~85%
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// OPTIMIZATION: Request monitoring middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (duration > 1000) {
      console.log(`[SLOW] ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  next();
});

// Health check endpoint (no DB hit, prevents unnecessary spin-up)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', cmsRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/contact', contactRoutes);

// Health Check
app.get('/', (req, res) => res.send('Portfolio CMS API is online.'));

// Database & Server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-cms', {
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
  maxPoolSize: 5, // OPTIMIZATION: Limit connections on free tier
})
  .then(async () => {
    console.log('MongoDB Connected successfully.');
    await initRedis();
    startKeepAliveJob();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Keep-alive interval: 30 minutes`);
      console.log(`Response compression: enabled`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
