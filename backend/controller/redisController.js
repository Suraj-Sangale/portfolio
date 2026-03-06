import { setRedis } from "@/lib/redisUtils";

export const setDataToRedisController = async (reqBody) => {
  try {
    const { key, data } = reqBody;
    const result = await setRedis(key, data);

    if (!result) {
      return { status: false, message: "No data found", data: null };
    }

    return { status: true, message: "Data set successfully", data: result };
  } catch (error) {
    console.error("Error in setDataToRedis:", error);
    return {
      status: false,
      message: error.message || "Error fetching data",
      data: null,
    };
  }
};
