import { setDataToRedisController } from "@/backend/controller/redisController";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  const request = req.body;

  setDataToRedisController(request)
    .then((result) => {
      if (!result.status) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      return res.status(200).json({
        success: true,
        data: request,
      });
    })
    .catch((error) => {
      console.error("Redis Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    });
}
