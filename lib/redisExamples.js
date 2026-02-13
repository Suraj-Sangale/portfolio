// /**
//  * Redis Usage Examples
//  * 
//  * This file contains examples of how to use Redis in your Next.js application.
//  * Copy and adapt these examples to your needs.
//  */

// import {
//   setRedis,
//   getRedis,
//   deleteRedis,
//   existsRedis,
//   incrementRedis,
//   getCachedPortfolioData,
//   clearCacheRedis,
// } from "./redisUtils";
// import { getPortfolioData } from "@/utilities/getPortfolioData";

// /**
//  * Example 1: Basic Set and Get
//  */
// export async function exampleBasicOperations() {
//   // Set a simple string value
//   await setRedis("user:name", "Suraj Sangale");
  
//   // Set an object (automatically stringified)
//   await setRedis("user:profile", {
//     name: "Suraj",
//     email: "suraj@example.com",
//     role: "Developer",
//   }, 3600); // Expires in 1 hour
  
//   // Get the value
//   const name = await getRedis("user:name");
//   const profile = await getRedis("user:profile"); // Automatically parsed as object
  
//   return { name, profile };
// }

// /**
//  * Example 2: Caching Portfolio Data
//  */
// export async function exampleCachePortfolio() {
//   // Get portfolio data with automatic caching
//   const portfolioData = await getCachedPortfolioData(
//     "portfolio:all",
//     () => getPortfolioData(), // Fallback function if not in cache
//     3600 // Cache for 1 hour
//   );
  
//   return portfolioData;
// }

// /**
//  * Example 3: Counter/Increment Operations
//  */
// export async function exampleCounter() {
//   // Increment a counter
//   const views = await incrementRedis("page:views", 1);
  
//   // Decrement
//   const { decrementRedis } = await import("./redisUtils");
//   const stock = await decrementRedis("product:stock", 1);
  
//   return { views, stock };
// }

// /**
//  * Example 4: Check and Set Pattern
//  */
// export async function exampleCheckAndSet() {
//   const key = "api:rate-limit:user123";
  
//   // Check if key exists
//   const exists = await existsRedis(key);
  
//   if (!exists) {
//     // Set with expiration (e.g., rate limiting)
//     await setRedis(key, "1", 60); // Expires in 60 seconds
//   } else {
//     // Increment if exists
//     await incrementRedis(key, 1);
//   }
  
//   return exists;
// }

// /**
//  * Example 5: Cache Invalidation
//  */
// export async function exampleCacheInvalidation() {
//   // Clear specific cache
//   await deleteRedis("portfolio:projects");
  
//   // Clear all portfolio-related cache
//   await clearCacheRedis("portfolio:*");
  
//   return true;
// }

// /**
//  * Example 6: Using in API Route
//  */
// export async function exampleApiRoute() {
//   // This would be used in pages/api/example.js
//   const cacheKey = "api:data";
  
//   // Try to get from cache first
//   let data = await getRedis(cacheKey);
  
//   if (!data) {
//     // If not in cache, fetch from source
//     // data = await fetchFromDatabase();
//     // data = await fetchFromExternalAPI();
    
//     // Then cache it
//     await setRedis(cacheKey, data, 1800); // Cache for 30 minutes
//   }
  
//   return data;
// }

// /**
//  * Example 7: Session Storage
//  */
// export async function exampleSessionStorage(sessionId, userData) {
//   const sessionKey = `session:${sessionId}`;
  
//   // Store session data
//   await setRedis(sessionKey, userData, 3600); // 1 hour session
  
//   // Retrieve session
//   const session = await getRedis(sessionKey);
  
//   // Delete session on logout
//   // await deleteRedis(sessionKey);
  
//   return session;
// }

// /**
//  * Example 8: Cache with Fallback
//  */
// export async function exampleCacheWithFallback() {
//   const cacheKey = "expensive:operation:result";
  
//   try {
//     // Try cache first
//     let result = await getRedis(cacheKey);
    
//     if (result) {
//       return { data: result, fromCache: true };
//     }
    
//     // If not in cache, perform expensive operation
//     // result = await performExpensiveOperation();
    
//     // Cache the result
//     await setRedis(cacheKey, result, 3600);
    
//     return { data: result, fromCache: false };
//   } catch (error) {
//     // If Redis fails, fallback to direct operation
//     console.error("Redis error, using fallback:", error);
//     // return await performExpensiveOperation();
//     return null;
//   }
// }

