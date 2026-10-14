require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');
const { initRedis } = require('./integrations/redis');

async function start() {
  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });

  try {
    await mongoose.connect(env.mongoUri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      maxPoolSize: 5,
    });
    console.log('MongoDB connected successfully.');
    await initRedis();
  } catch (error) {
    console.warn('MongoDB unavailable; serving versioned CMS defaults:', error.message);
  }

  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down gracefully...`);
    server.close();
    await mongoose.connection.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
