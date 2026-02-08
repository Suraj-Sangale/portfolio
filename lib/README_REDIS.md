# Redis Setup and Usage Guide

This project uses Redis for server-side caching and data storage. This guide explains how to set up and use Redis in your Next.js portfolio.

## Installation

Redis client (`ioredis`) is already installed. You need to set up a Redis server.

### Local Development

1. **Install Redis locally:**
   - **Windows:** Download from [Redis for Windows](https://github.com/microsoftarchive/redis/releases) or use WSL
   - **macOS:** `brew install redis`
   - **Linux:** `sudo apt-get install redis-server` or `sudo yum install redis`

2. **Start Redis server:**
   ```bash
   redis-server
   ```

3. **Test connection:**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

### Production/Cloud Options

- **Upstash Redis** (Free tier available): https://upstash.com/
- **Redis Cloud**: https://redis.com/cloud/
- **AWS ElastiCache**: https://aws.amazon.com/elasticache/
- **DigitalOcean Managed Redis**: https://www.digitalocean.com/products/managed-redis

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Local Redis (default)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# OR use REDIS_URL for cloud Redis
REDIS_URL=rediss://default:password@host:port
```

## Usage Examples

### Basic Operations

```javascript
import { setRedis, getRedis, deleteRedis } from "@/lib/redisUtils";

// Set a value
await setRedis("user:123", { name: "John", email: "john@example.com" }, 3600);

// Get a value
const user = await getRedis("user:123");

// Delete a value
await deleteRedis("user:123");
```

### Caching Portfolio Data

```javascript
import { getCachedPortfolioData } from "@/lib/redisUtils";
import { getPortfolioData } from "@/utilities/getPortfolioData";

// Get portfolio data with automatic caching
const data = await getCachedPortfolioData(
  "portfolio:all",
  () => getPortfolioData(),
  3600 // Cache for 1 hour
);
```

### In API Routes

```javascript
// pages/api/example.js
import { getRedis, setRedis } from "@/lib/redisUtils";

export default async function handler(req, res) {
  // Try to get from cache
  let data = await getRedis("my-data");
  
  if (!data) {
    // Fetch from source
    data = await fetchDataFromSource();
    // Cache for 1 hour
    await setRedis("my-data", data, 3600);
  }
  
  return res.json({ data });
}
```

### Available Functions

#### Basic Operations
- `setRedis(key, value, expirationInSeconds)` - Set a value
- `getRedis(key, parseJson)` - Get a value
- `deleteRedis(key)` - Delete a key
- `existsRedis(key)` - Check if key exists
- `expireRedis(key, seconds)` - Set expiration
- `getTtlRedis(key)` - Get time to live

#### Advanced Operations
- `incrementRedis(key, increment)` - Increment a number
- `decrementRedis(key, decrement)` - Decrement a number
- `getKeysRedis(pattern)` - Get keys matching pattern
- `getMultipleRedis(keys)` - Get multiple values
- `setMultipleRedis(keyValuePairs)` - Set multiple values
- `deleteMultipleRedis(keys)` - Delete multiple keys
- `clearCacheRedis(pattern)` - Clear cache by pattern

#### Special Functions
- `getCachedPortfolioData(key, fallbackFn, expiration)` - Get with automatic fallback
- `connectRedis()` - Manually connect to Redis
- `closeRedis()` - Close Redis connection

## API Endpoint

A sample API endpoint is available at `/api/portfolio`:

```bash
# Get all portfolio data
GET /api/portfolio

# Get specific section
GET /api/portfolio?section=projects
GET /api/portfolio?section=about
```

## Best Practices

1. **Always use try-catch** when working with Redis
2. **Set appropriate expiration times** to avoid stale data
3. **Use meaningful key patterns** (e.g., `portfolio:projects`, `user:123:profile`)
4. **Cache expensive operations** (API calls, database queries)
5. **Invalidate cache** when data is updated
6. **Handle Redis connection failures gracefully** with fallbacks

## Troubleshooting

### Connection Issues

If you see connection errors:

1. **Check if Redis is running:**
   ```bash
   redis-cli ping
   ```

2. **Check environment variables** in `.env.local`

3. **Verify Redis URL format** if using cloud Redis

4. **Check firewall/network** settings for cloud Redis

### Performance Tips

- Use connection pooling (already implemented)
- Batch operations when possible (`getMultipleRedis`, `setMultipleRedis`)
- Use appropriate expiration times
- Monitor Redis memory usage

## Example: Caching API Responses

```javascript
// pages/api/projects.js
import { getCachedPortfolioData } from "@/lib/redisUtils";
import { getProjects } from "@/utilities/getPortfolioData";

export default async function handler(req, res) {
  const projects = await getCachedPortfolioData(
    "portfolio:projects",
    () => getProjects(),
    1800 // 30 minutes
  );
  
  return res.json({ projects });
}
```

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for production Redis
- Use SSL/TLS (`rediss://`) for cloud Redis connections
- Restrict Redis access to your application server only

