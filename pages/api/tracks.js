import { tracks } from "@/data/tracks";

/**
 * GET /api/tracks
 * Returns the full track list as JSON. Served server-side only.
 */
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
  return res.status(200).json(tracks);
}
