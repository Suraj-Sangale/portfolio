import { getPortfolioDataController } from "@/backend/controller/commonController";
import { getCachedPortfolioData } from "@/lib/redisUtils";
import { getPortfolioData } from "@/utilities/getPortfolioData";

/**
 * API route to get portfolio data with Redis caching
 * GET /api/portfolio
 * GET /api/portfolio?section=about
 * GET /api/portfolio?section=projects
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    response.message = "Method not allowed";
    return res.status(405).json(response);
  }

  try {
    const response = { status: false, message: "" };
    const { section } = req.query;
    const cacheKey = section ? `portfolio:${section}` : "portfolio:all";
    const data = await getPortfolioDataController(cacheKey, section);
    if (!data) {
      response.message = "No data found";
      return res.status(200).json(response);
    }

    response.status = true;
    response.data = data;
    response.cached = true;
    response.message = "Portfolio data fetched successfully";
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
}
