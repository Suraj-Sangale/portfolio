import { getPortfolioData } from "@/utilities/getPortfolioData";

export const getPortfolioDataforCache = async (section) => {
  const allData = await getPortfolioData();
  return section ? allData[section] || null : allData;
};
