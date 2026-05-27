// Cache middleware for response caching
const cacheMiddleware = (ttl = 3600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const getRedis = require('../utils/redisClient').getRedis;
    const redis = getRedis();
    const cacheKey = `cache:${req.originalUrl}`;

    if (!redis) {
      return next();
    }

    // Try to get from cache
    redis.get(cacheKey, (err, data) => {
      if (data) {
        res.set('X-Cache', 'HIT');
        return res.json(JSON.parse(data));
      }

      // Store original send
      const originalSend = res.json.bind(res);

      // Override send to cache response
      res.json = function (data) {
        res.set('X-Cache', 'MISS');
        try {
          redis.setex(cacheKey, ttl, JSON.stringify(data), (err) => {
            if (err) console.error('Cache set error:', err);
          });
        } catch (e) {
          console.error('Cache middleware error:', e);
        }
        return originalSend(data);
      };

      next();
    });
  };
};

// Browser cache control headers
const browserCacheMiddleware = (maxAge = 3600) => {
  return (req, res, next) => {
    res.set('Cache-Control', `public, max-age=${maxAge}`);
    next();
  };
};

module.exports = { cacheMiddleware, browserCacheMiddleware };
