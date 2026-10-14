const redis = require('redis');

let redisClient = null;

/**
 * Initialize Redis client with fallback to in-memory cache if Redis is unavailable
 * This prevents crashes and allows graceful degradation
 */
const initRedis = async () => {
  try {
    let clientConfig;

    if (process.env.REDIS_URL) {
      let url = process.env.REDIS_URL.trim();
      if (url.includes('upstash.io') && url.startsWith('redis://')) {
        url = url.replace(/^redis:\/\//, 'rediss://');
      }
      clientConfig = { url };
    } else if (process.env.REDIS_HOST) {
      let rawHost = process.env.REDIS_HOST.trim();
      if (rawHost.startsWith('redis://') || rawHost.startsWith('rediss://')) {
        if (rawHost.includes('upstash.io') && rawHost.startsWith('redis://')) {
          rawHost = rawHost.replace(/^redis:\/\//, 'rediss://');
        }
        clientConfig = { url: rawHost };
      } else {
        let host = rawHost.replace(/^https?:\/\//, '');
        const port = Number(process.env.REDIS_PORT) || 6379;
        const password = process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD.trim() : '';
        const isTls = host.includes('upstash.io') || process.env.REDIS_TLS === 'true' || (port === 6379 && host.includes('upstash'));

        if (password) {
          clientConfig = {
            url: `${isTls ? 'rediss' : 'redis'}://default:${encodeURIComponent(password)}@${host}:${port}`,
          };
        } else {
          clientConfig = {
            url: `${isTls ? 'rediss' : 'redis'}://${host}:${port}`,
          };
        }
      }
    } else {
      clientConfig = {
        url: 'redis://localhost:6379',
      };
    }

    const client = redis.createClient({
      ...clientConfig,
      socket: {
        ...(clientConfig.socket || {}),
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.warn('⚠️ Redis max reconnect attempts reached. Using in-memory cache.');
            return false;
          }
          return Math.min(retries * 200, 1000);
        },
        connectTimeout: 5000,
      },
    });

    client.on('connect', () => {
      console.log('✅ Redis connected successfully');
      redisClient = client;
    });

    client.on('error', (err) => {
      console.warn('⚠️ Redis connection error:', err.message || err);
    });

    client.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    await client.connect();
    redisClient = client;
    return client;
  } catch (err) {
    console.warn('⚠️ Redis connection failed, using in-memory cache fallback:', err.message || err);
    redisClient = createMemoryCache();
    return redisClient;
  }
};

/**
 * In-memory cache fallback for when Redis is unavailable
 * OPTIMIZATION: Lightweight fallback prevents server crashes
 */
const createMemoryCache = () => {
  const cache = new Map();
  const timers = new Map();

  return {
    set: (key, value, options) => {
      cache.set(key, value);
      if (options?.EX) {
        if (timers.has(key)) clearTimeout(timers.get(key));
        timers.set(
          key,
          setTimeout(() => cache.delete(key), options.EX * 1000)
        );
      }
      return Promise.resolve('OK');
    },
    get: (key) => Promise.resolve(cache.get(key) || null),
    del: (key) => {
      cache.delete(key);
      if (timers.has(key)) clearTimeout(timers.get(key));
      return Promise.resolve(1);
    },
    exists: (key) => Promise.resolve(cache.has(key) ? 1 : 0),
    keys: (pattern) => {
      // Simple pattern matching for in-memory cache
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return Promise.resolve(Array.from(cache.keys()).filter((k) => regex.test(k)));
    },
    flushAll: () => {
      cache.clear();
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      return Promise.resolve('OK');
    },
    isMemoryCache: true,
  };
};

/**
 * Get Redis client instance
 */
const getRedis = () => {
  if (!redisClient) {
    console.warn('⚠️ Redis client not initialized, using memory cache');
    return createMemoryCache();
  }
  return redisClient;
};

/**
 * Cache wrapper with TTL
 * OPTIMIZATION: Automatic expiration prevents stale data
 */
const setCache = async (key, value, ttlSeconds = 3600) => {
  try {
    const client = getRedis();
    const serialized = JSON.stringify(value);
    await client.set(key, serialized, { EX: ttlSeconds });
  } catch (err) {
    console.error(`Cache SET error for ${key}:`, err.message);
  }
};

/**
 * Get cached value
 */
const getCache = async (key) => {
  try {
    const client = getRedis();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error(`Cache GET error for ${key}:`, err.message);
    return null;
  }
};

/**
 * Delete cache
 */
const deleteCache = async (key) => {
  try {
    const client = getRedis();
    await client.del(key);
  } catch (err) {
    console.error(`Cache DEL error for ${key}:`, err.message);
  }
};

/**
 * Health check for Redis
 */
const healthCheck = async () => {
  try {
    const client = getRedis();
    if (client.isMemoryCache) {
      return { status: 'healthy', type: 'memory_cache' };
    }
    await client.ping();
    return { status: 'healthy', type: 'redis' };
  } catch (err) {
    return { status: 'unhealthy', error: err.message };
  }
};

module.exports = {
  initRedis,
  getRedis,
  setCache,
  getCache,
  deleteCache,
  healthCheck,
};
