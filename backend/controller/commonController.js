import { getCachedPortfolioData } from "@/lib/redisUtils";
import { getPortfolioDataforCache } from "../model/commonModel";

export const getPortfolioDataController = async (cacheKey, section) => {
  try {
    const data = await getCachedPortfolioData(cacheKey, () =>
      getPortfolioDataforCache(section),
    );
    
    if (!data) {
      return { status: false, message: "No data found", data: null };
    }
    
    return { status: true, message: "Data fetched successfully", data };
  } catch (error) {
    console.error("Error in getPortfolioDataController:", error);
    return { status: false, message: error.message || "Error fetching data", data: null };
  }
};
