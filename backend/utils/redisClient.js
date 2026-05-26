const redis = require('redis');

let redisClient = null;
let isConnected = false;

/**
 * Initialize Redis client with fallback to in-memory cache if Redis is unavailable
 * This prevents crashes and allows graceful degradation
 */
const initRedis = async () => {
  try {
    const client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        connectTimeout: 5000,
      },
      // OPTIMIZATION: Enable offline queue to prevent blocking on Redis unavailability
      enableOfflineQueue: true,
    });

    client.on('connect', () => {
      console.log('✅ Redis connected');
      isConnected = true;
    });

    client.on('error', (err) => {
      console.warn('⚠️ Redis connection error:', err.message);
      isConnected = false;
    });

    client.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    await client.connect();
    redisClient = client;
    return client;
  } catch (err) {
    console.warn('⚠️ Redis not available, using in-memory cache:', err.message);
    // Return a mock Redis client for in-memory caching
    return createMemoryCache();
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
 * Invalidate cache by pattern
 * OPTIMIZATION: Batch invalidation for related content
 */
const invalidateCachePattern = async (pattern) => {
  try {
    const client = getRedis();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => client.del(key)));
      console.log(`✅ Invalidated ${keys.length} cache entries matching ${pattern}`);
    }
  } catch (err) {
    console.error(`Cache INVALIDATE error for pattern ${pattern}:`, err.message);
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
  invalidateCachePattern,
  healthCheck,
};
