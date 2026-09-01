/**
 * fetch-track-metadata.js
 *
 * Takes a list of { youtubeId } entries and builds the full track objects
 * your NostalgiaExperience player uses:
 *
 * {
 *   id, title, artist, album, cover, src, language, spotifyId, youtubeId
 * }
 *
 * WHAT CAN BE AUTO-FETCHED, AND WHAT CAN'T
 * -----------------------------------------------------------------
 * - title, cover  -> YouTube oEmbed (no API key needed, always works)
 * - artist (guess) -> YouTube oEmbed "author_name" (often the channel
 *                     name, e.g. "T-Series" — NOT reliably the real
 *                     singer, so it's marked as a guess you should check)
 * - album, spotifyId, artist (accurate) ->
 *                     Spotify Web API search, IF you provide
 *                     SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET.
 *                     Skipped automatically if those env vars are absent.
 * - language      -> can't be reliably auto-detected from metadata,
 *                     defaults to DEFAULT_LANGUAGE below — override
 *                     per-entry in the output if needed.
 * - src, id       -> left as "" and auto-incremented respectively,
 *                     same as your example object.
 *
 * SETUP
 * -----------------------------------------------------------------
 * 1. Requires Node.js 18+ (built-in fetch).
 * 2. Optional, for accurate artist/album/spotifyId:
 *    - Create an app at https://developer.spotify.com/dashboard
 *    - export SPOTIFY_CLIENT_ID=xxx
 *    - export SPOTIFY_CLIENT_SECRET=xxx
 * 3. Edit the `tracks` array and START_ID below.
 * 4. Run:  node fetch-track-metadata.js
 *    -> writes output.json and also prints JS you can paste straight
 *       into your tracks file.
 */

const fs = require("fs");

// -------------------- CONFIG --------------------

const tracks = [
  { youtubeId: "Y4TICMyl9Eg" },
  { youtubeId: "VQWk3VfdIxw" },
  { youtubeId: "Ofopo3YlN8w" },
  { youtubeId: "vSWQdjhLxsU" },
  { youtubeId: "i0Cj7FwEDnY" },
];

const START_ID = 2; // matches your example, which starts at "2"
const DEFAULT_LANGUAGE = "hindi";

// --------------------------------------------------

async function getSpotifyToken() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    console.warn("Spotify auth failed, skipping Spotify lookups.");
    return null;
  }
  const data = await res.json();
  return data.access_token;
}

async function getYoutubeOembed(youtubeId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ! oEmbed failed for ${youtubeId} (video may be private/removed)`);
    return null;
  }
  const data = await res.json();
  return {
    title: data.title,
    channel: data.author_name,
    // hqdefault matches the format in your example object
    cover: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  };
}

// Strips common YouTube title clutter like "(Official Video)", "| Movie Name"
function cleanTitle(rawTitle) {
  return rawTitle
    .replace(/[\(\[].*?(official|lyrical|audio|video|full song|hd).*?[\)\]]/gi, "")
    .replace(/\|.*/g, "")
    .trim();
}

async function searchSpotify(token, query) {
  if (!token) return null;
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return null;
  const data = await res.json();
  const track = data?.tracks?.items?.[0];
  if (!track) return null;
  return {
    spotifyId: track.id,
    artist: track.artists.map((a) => a.name).join(" & "),
    album: track.album.name,
  };
}

async function main() {
  const spotifyToken = await getSpotifyToken();
  if (!spotifyToken) {
    console.log(
      "No SPOTIFY_CLIENT_ID/SECRET found — artist/album/spotifyId will be left blank for you to fill in.\n"
    );
  }

  const results = [];

  for (let i = 0; i < tracks.length; i++) {
    const { youtubeId } = tracks[i];
    console.log(`Fetching ${youtubeId}...`);

    const yt = await getYoutubeOembed(youtubeId);
    if (!yt) {
      results.push({
        id: String(START_ID + i),
        title: "UNKNOWN - oEmbed failed",
        artist: "",
        album: "",
        cover: "",
        src: "",
        language: DEFAULT_LANGUAGE,
        spotifyId: "",
        youtubeId,
      });
      continue;
    }

    const cleaned = cleanTitle(yt.title);
    const spotify = await searchSpotify(spotifyToken, cleaned);

    results.push({
      id: String(START_ID + i),
      title: spotify ? cleaned : cleaned, // Spotify doesn't return a "clean title" separately; using cleaned YT title
      artist: spotify ? spotify.artist : `${yt.channel}`,
      album: spotify ? spotify.album : "",
      cover: yt.cover,
      src: "",
      language: DEFAULT_LANGUAGE,
      spotifyId: spotify ? spotify.spotifyId : "",
      youtubeId,
    });

    // be polite to the oEmbed/Spotify endpoints
    await new Promise((r) => setTimeout(r, 200));
  }

  fs.writeFileSync("output.json", JSON.stringify(results, null, 2));

  console.log("\n// Paste-ready JS:\n");
  console.log(
    results
      .map(
        (t) => `  {
    id: "${t.id}",
    title: "${t.title.replace(/"/g, '\\"')}",
    artist: "${t.artist.replace(/"/g, '\\"')}",
    album: "${t.album.replace(/"/g, '\\"')}",
    cover: "${t.cover}",
    src: "",
    language: "${t.language}",
    spotifyId: "${t.spotifyId}",
    youtubeId: "${t.youtubeId}",
  },`
      )
      .join("\n")
  );

  console.log("\nAlso saved to output.json");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});