const express = require('express');
const cors = require('cors');
const compression = require('compression');
const env = require('./config/env');
const authRoutes = require('./modules/auth/authRoutes');
const sectionRoutes = require('./modules/cms/sectionRoutes');
const { getContent } = require('./modules/cms/sectionController');
const contactRoutes = require('./modules/contact/contactRoutes');
const analyticsRoutes = require('./modules/analytics/analyticsRoutes');
const { PAYLOAD_LIMIT_BYTES } = require('./modules/analytics/analyticsController');

const app = express();
const configuredOrigins = (env.frontendOrigin || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...configuredOrigins,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://kushalsaialeti.vercel.app',
]);

const isDev = process.env.NODE_ENV !== 'production';

app.use(compression());
// Keep the development origin visible even when a request fails before the
// cors package can complete its normal response handling.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.has(origin) || (isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  return next();
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    if (isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({
  limit: '2mb',
  verify(req, _res, buffer) {
    // Keep the analytics contract bounded without reducing the CMS JSON limit.
    if (req.path === '/api/analytics/events' && buffer.length > PAYLOAD_LIMIT_BYTES) {
      const error = new Error('Analytics payload exceeds 16kb');
      error.status = 413;
      throw error;
    }
  },
}));

app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    if (duration > 1000) console.warn(`[SLOW] ${req.method} ${req.path} took ${duration}ms`);
  });
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => res.send('Portfolio CMS API is online.'));
app.use('/api/auth', authRoutes);
app.get('/api/content', getContent);
app.use('/api/sections', sectionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes());

app.use((error, _req, res, _next) => {
  if (error.message === 'Origin is not allowed by CORS') {
    return res.status(403).json({ error: error.message });
  }
  if (error.status === 413 || error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request payload is too large' });
  }
  console.error('Unhandled API error:', error);
  return res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
