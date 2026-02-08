import { getCachedPortfolioData } from "@/lib/redisUtils";
import { getPortfolioDataforCache } from "../model/commonModel";

export const getPortfolioDataController = async (cacheKey, section) => {
  const data = await getCachedPortfolioData(cacheKey, () =>
    getPortfolioDataforCache(),
  );
  return data;
};
