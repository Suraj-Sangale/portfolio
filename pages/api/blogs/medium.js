import { m } from "framer-motion";
import Parser from "rss-parser";

// export default async function handler(req, res) {
//   const parser = new Parser();

//   try {
//     const feed = await parser.parseURL(
//       "https://medium.com/feed/@surajsangle00",
//     );

//     const posts = feed.items.map((item) => ({
//       title: item.title,
//       link: item.link,
//       pubDate: item.pubDate,
//       content: item.contentSnippet,
//       thumbnail: item.thumbnail || null,
//     }));

//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch Medium posts" });
//   }
// }

export default async function handler(req, res) {
  const respoonse = { status: false, data: [], message: "" };
  // Support both GET and POST methods
  if (req.method !== "GET" && req.method !== "POST") {
    respoonse.message = "Method not allowed";
    return res.status(405).json(respoonse);
  }

  try {
    const response = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@surajsangle00",
    );

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("RSS fetch failed");
    }
    const extractImage = (content) => {
      if (!content) return null;

      const match = content.match(/<img[^>]+src="([^">]+)"/);
      return match ? match[1] : null;
    };
    const styles = [
      {
        accent: "#06b6d4",
        emoji: "🌐",
        grad: "linear-gradient(135deg,#06b6d4,#3b82f6)",
      },
      {
        accent: "#f59e0b",
        emoji: "⚡",
        grad: "linear-gradient(135deg,#f59e0b,#ef4444)",
      },
      {
        accent: "#10b981",
        emoji: "🚀",
        grad: "linear-gradient(135deg,#10b981,#22c55e)",
      },
      {
        accent: "#8b5cf6",
        emoji: "💡",
        grad: "linear-gradient(135deg,#8b5cf6,#ec4899)",
      },
      {
        accent: "#ef4444",
        emoji: "🔥",
        grad: "linear-gradient(135deg,#ef4444,#f97316)",
      },
    ];
    const posts = data.items.map((item, index) => {
      const style = styles[index % styles.length];

      return {
        ...item,
        authorInitials: "S",
        thumbnail: extractImage(item.content),
        accent: style.accent,
        emoji: style.emoji,
        grad: style.grad,
      };
    });

    respoonse.status = true;
    respoonse.data = posts;
    respoonse.message = "Medium posts fetched successfully";
    res.status(200).json(respoonse);
  } catch (error) {
    console.error(error);
    respoonse.message = error.message || "Failed to fetch Medium posts";
    res.status(500).json(respoonse);
  }
}
