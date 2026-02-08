import { getRedisClient, connectRedis } from "./redis";

/**
 * Set a value in Redis with optional expiration
 * @param {string} key - Redis key
 * @param {string|object} value - Value to store (objects will be JSON stringified)
 * @param {number} expirationInSeconds - Optional expiration time in seconds
 * @returns {Promise<boolean>} - Success status
 */
export async function setRedis(key, value, expirationInSeconds = null) {
  try {
    const client = await connectRedis();

    // If value is an object, stringify it
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : value;

    if (expirationInSeconds) {
      await client.setex(key, expirationInSeconds, stringValue);
    } else {
      await client.set(key, stringValue);
    }

    return true;
  } catch (error) {
    console.error(`Error setting Redis key ${key}:`, error);
    return false;
  }
}

/**
 * Get a value from Redis
 * @param {string} key - Redis key
 * @param {boolean} parseJson - Whether to parse JSON response (default: true)
 * @returns {Promise<string|object|null>} - Retrieved value or null if not found
 */
export async function getRedis(key, parseJson = true) {
  try {
    const client = await connectRedis();
    const value = await client.get(key);

    if (value === null) {
      return null;
    }

    // Try to parse as JSON if parseJson is true
    if (parseJson) {
      try {
        return JSON.parse(value);
      } catch {
        // If parsing fails, return as string
        return value;
      }
    }

    return value;
  } catch (error) {
    console.error(`Error getting Redis key ${key}:`, error);
    return null;
  }
}

/**
 * Delete a key from Redis
 * @param {string} key - Redis key to delete
 * @returns {Promise<boolean>} - Success status
 */
export async function deleteRedis(key) {
  try {
    const client = await connectRedis();
    const result = await client.del(key);
    return result > 0;
  } catch (error) {
    console.error(`Error deleting Redis key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple keys from Redis
 * @param {string[]} keys - Array of Redis keys to delete
 * @returns {Promise<number>} - Number of keys deleted
 */
export async function deleteMultipleRedis(keys) {
  try {
    if (!keys || keys.length === 0) {
      return 0;
    }

    const client = await connectRedis();
    const result = await client.del(...keys);
    return result;
  } catch (error) {
    console.error(`Error deleting multiple Redis keys:`, error);
    return 0;
  }
}

/**
 * Check if a key exists in Redis
 * @param {string} key - Redis key to check
 * @returns {Promise<boolean>} - True if key exists
 */
export async function existsRedis(key) {
  try {
    const client = await connectRedis();
    const result = await client.exists(key);
    return result === 1;
  } catch (error) {
    console.error(`Error checking Redis key ${key}:`, error);
    return false;
  }
}

/**
 * Set expiration time for a key
 * @param {string} key - Redis key
 * @param {number} seconds - Expiration time in seconds
 * @returns {Promise<boolean>} - Success status
 */
export async function expireRedis(key, seconds) {
  try {
    const client = await connectRedis();
    const result = await client.expire(key, seconds);
    return result === 1;
  } catch (error) {
    console.error(`Error setting expiration for Redis key ${key}:`, error);
    return false;
  }
}

/**
 * Get time to live (TTL) for a key
 * @param {string} key - Redis key
 * @returns {Promise<number>} - TTL in seconds (-1 if no expiration, -2 if key doesn't exist)
 */
export async function getTtlRedis(key) {
  try {
    const client = await connectRedis();
    return await client.ttl(key);
  } catch (error) {
    console.error(`Error getting TTL for Redis key ${key}:`, error);
    return -2;
  }
}

/**
 * Increment a numeric value in Redis
 * @param {string} key - Redis key
 * @param {number} increment - Amount to increment (default: 1)
 * @returns {Promise<number>} - New value after increment
 */
export async function incrementRedis(key, increment = 1) {
  try {
    const client = await connectRedis();
    return await client.incrby(key, increment);
  } catch (error) {
    console.error(`Error incrementing Redis key ${key}:`, error);
    return null;
  }
}

/**
 * Decrement a numeric value in Redis
 * @param {string} key - Redis key
 * @param {number} decrement - Amount to decrement (default: 1)
 * @returns {Promise<number>} - New value after decrement
 */
export async function decrementRedis(key, decrement = 1) {
  try {
    const client = await connectRedis();
    return await client.decrby(key, decrement);
  } catch (error) {
    console.error(`Error decrementing Redis key ${key}:`, error);
    return null;
  }
}

/**
 * Get all keys matching a pattern
 * @param {string} pattern - Pattern to match (e.g., "user:*")
 * @returns {Promise<string[]>} - Array of matching keys
 */
export async function getKeysRedis(pattern) {
  try {
    const client = await connectRedis();
    return await client.keys(pattern);
  } catch (error) {
    console.error(`Error getting keys with pattern ${pattern}:`, error);
    return [];
  }
}

/**
 * Get multiple values from Redis
 * @param {string[]} keys - Array of Redis keys
 * @returns {Promise<object>} - Object with key-value pairs
 */
export async function getMultipleRedis(keys) {
  try {
    if (!keys || keys.length === 0) {
      return {};
    }

    const client = await connectRedis();
    const values = await client.mget(keys);

    const result = {};
    keys.forEach((key, index) => {
      try {
        result[key] = values[index] ? JSON.parse(values[index]) : null;
      } catch {
        result[key] = values[index];
      }
    });

    return result;
  } catch (error) {
    console.error(`Error getting multiple Redis keys:`, error);
    return {};
  }
}

/**
 * Set multiple key-value pairs in Redis
 * @param {object} keyValuePairs - Object with key-value pairs
 * @returns {Promise<boolean>} - Success status
 */
export async function setMultipleRedis(keyValuePairs) {
  try {
    if (!keyValuePairs || Object.keys(keyValuePairs).length === 0) {
      return false;
    }

    const client = await connectRedis();
    const pipeline = client.pipeline();

    Object.entries(keyValuePairs).forEach(([key, value]) => {
      const stringValue =
        typeof value === "object" ? JSON.stringify(value) : value;
      pipeline.set(key, stringValue);
    });

    await pipeline.exec();
    return true;
  } catch (error) {
    console.error(`Error setting multiple Redis keys:`, error);
    return false;
  }
}

/**
 * Get portfolio data from Redis cache or fallback to JSON file
 * @param {string} cacheKey - Cache key (e.g., "portfolio:data")
 * @param {function} fallbackFn - Function to get data if not in cache
 * @param {number} expirationInSeconds - Cache expiration time (default: 3600 = 1 hour)
 * @returns {Promise<object>} - Portfolio data
 */
export async function getCachedPortfolioData(
  cacheKey = "portfolio:data",
  fallbackFn,
  expirationInSeconds = 0,
) {
  try {
    // Try to get from cache
    const cachedData = await getRedis(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    console.log('fallbackFn', fallbackFn)
    // If not in cache, get from fallback function
    if (fallbackFn) {
      const data = await fallbackFn();

      // Store in cache for future requests
      if (data) {
        await setRedis(cacheKey, data);
      }

      return data;
    }

    return false;
  } catch (error) {
    console.error(`Error getting cached portfolio data:`, error);
    // Fallback to function if cache fails
    if (fallbackFn) {
      return await fallbackFn();
    }
    return false;
  }
}

/**
 * Clear cache for a specific key or pattern
 * @param {string} keyOrPattern - Key or pattern to clear
 * @returns {Promise<number>} - Number of keys deleted
 */
export async function clearCacheRedis(keyOrPattern) {
  try {
    const client = await connectRedis();

    // If it's a pattern (contains * or ?), get all matching keys first
    if (keyOrPattern.includes("*") || keyOrPattern.includes("?")) {
      const keys = await client.keys(keyOrPattern);
      if (keys.length === 0) {
        return 0;
      }
      return await client.del(...keys);
    }

    // Otherwise, delete the single key
    return await client.del(keyOrPattern);
  } catch (error) {
    console.error(`Error clearing cache for ${keyOrPattern}:`, error);
    return 0;
  }
}
