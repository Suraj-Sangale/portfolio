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
  try {
    const response = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@surajsangle00"
    );

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("RSS fetch failed");
    }

    const posts = data.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      thumbnail: item.thumbnail,
      description: item.description,
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Medium posts" });
  }
}
