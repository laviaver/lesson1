const { redisClient } = require("../config/redis");
const logger = require("../utils/logger");

// Delete all employee list cache entries
async function invalidateEmployeeCache() {
  try {
    // Find all keys matching the employee cache pattern
    const keys = await redisClient.keys("employees:*");

    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info("Employee cache invalidated", { keysDeleted: keys.length });
    }
  } catch (err) {
    logger.error("Cache invalidation error", { error: err.message });
  }
}

module.exports = { invalidateEmployeeCache };