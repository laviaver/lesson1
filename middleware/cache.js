const { redisClient } = require("../config/redis");
const logger = require("../utils/logger");

function cache(ttl) {
  return async (req, res, next) => {
    // Build a unique cache key from the URL and query params
    const key = `employees:${req.originalUrl}`;

    try {
      const cached = await redisClient.get(key);

      if (cached) {
        logger.info("Cache hit", { key });
        return res.json(JSON.parse(cached));
      }

      logger.info("Cache miss", { key });

      // Intercept res.json so we can cache the response before sending it
      const originalJson = res.json.bind(res);
      res.json = (data) => {
        // Only cache successful responses
        if (res.statusCode === 200) {
          redisClient.setEx(key, ttl, JSON.stringify(data)).catch((err) => {
            logger.error("Cache write error", { error: err.message });
          });
        }
        return originalJson(data);
      };

      next();
    } catch (err) {
      // If Redis is down, don't crash the request — just skip caching
      logger.error("Cache middleware error", { error: err.message });
      next();
    }
  };
}

module.exports = cache;