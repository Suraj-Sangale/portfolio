import portfolioData from "../data/portfolio.json";

/**
 * Get portfolio data with optional Redis caching
 * @param {boolean} useCache - Whether to use Redis cache (default: false)
 * @param {number} cacheExpiration - Cache expiration in seconds (default: 3600)
 * @returns {Promise<object>} - Portfolio data
 */
export async function getPortfolioDataWithCache(
  useCache = false,
  cacheExpiration = 3600
) {
  if (!useCache) {
    return portfolioData;
  }

  try {
    const { getCachedPortfolioData } = await import("@/lib/redisUtils");
    return await getCachedPortfolioData(
      "portfolio:all",
      () => portfolioData,
      cacheExpiration
    );
  } catch (error) {
    console.error("Error getting cached portfolio data:", error);
    // Fallback to direct data if cache fails
    return portfolioData;
  }
}

/**
 * Get personal info with optional caching
 */
export async function getPersonalInfoWithCache(useCache = false) {
  if (!useCache) {
    return portfolioData.personal;
  }

  try {
    const { getCachedPortfolioData } = await import("@/lib/redisUtils");
    return await getCachedPortfolioData(
      "portfolio:personal",
      () => portfolioData.personal,
      3600
    );
  } catch (error) {
    return portfolioData.personal;
  }
}

/**
 * Get projects with optional caching
 */
export async function getProjectsWithCache(useCache = false) {
  if (!useCache) {
    return portfolioData.projects;
  }

  try {
    const { getCachedPortfolioData } = await import("@/lib/redisUtils");
    return await getCachedPortfolioData(
      "portfolio:projects",
      () => portfolioData.projects,
      3600
    );
  } catch (error) {
    return portfolioData.projects;
  }
}

/**
 * Invalidate portfolio cache
 */
export async function invalidatePortfolioCache() {
  try {
    const { clearCacheRedis } = await import("@/lib/redisUtils");
    await clearCacheRedis("portfolio:*");
    return true;
  } catch (error) {
    console.error("Error invalidating cache:", error);
    return false;
  }
}

// Export all the original functions for backward compatibility
export const getPortfolioData = () => portfolioData;
export const getPersonalInfo = () => portfolioData.personal;
export const getSocialLinks = () => portfolioData.socialLinks;
export const getNavigation = () => portfolioData.navigation;
export const getAboutData = () => portfolioData.about;
export const getExperience = () => portfolioData.experience;
export const getProjects = () => portfolioData.projects;
export const getContactData = () => portfolioData.contact;
export const getSectionTitles = () => portfolioData.sections;
export const getSeoData = () => portfolioData.seo;
export const getSectionTitle = (sectionName) => {
  return portfolioData.sections[sectionName] || {};
};
export const getSocialLink = (platform) => {
  return portfolioData.socialLinks.find(
    (link) => link.platform.toLowerCase() === platform.toLowerCase()
  );
};

