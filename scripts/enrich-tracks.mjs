/**
 * enrich-tracks.mjs
 * ------------------
 * Reads every youtubeId in data/tracks.js (by text-parsing),
 * fetches real video title + channel name via YouTube oEmbed (no API key),
 * and patches the file in-place — only for entries missing title or artist.
 *
 * Run: node scripts/enrich-tracks.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRACKS_FILE = path.resolve(__dirname, "../data/tracks.js");

// ── 1. Parse all object blocks from the JS source ─────────────────────────
function parseBlocks(source) {
  const blocks = [];
  // Match every {...} object literal (non-greedy, single-level)
  const blockRe = /\{([^{}]*)\}/gs;
  let match;
  while ((match = blockRe.exec(source)) !== null) {
    const body = match[1];
    const ytMatch = body.match(/youtubeId\s*:\s*["']([^"']+)["']/);
    if (!ytMatch) continue;

    const youtubeId = ytMatch[1];
    const hasTitle = /\btitle\s*:/.test(body);
    const hasArtist = /\bartist\s*:/.test(body);

    blocks.push({
      youtubeId,
      hasTitle,
      hasArtist,
      index: match.index,
      length: match[0].length,
    });
  }
  return blocks;
}

// ── 2. Fetch title + channel from YouTube oEmbed ──────────────────────────
async function fetchYTMeta(youtubeId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ⚠  oEmbed HTTP ${res.status} for ${youtubeId}`);
      return null;
    }
    const json = await res.json();
    return {
      title: json.title ?? null,
      artist: json.author_name ?? null, // YouTube channel name
    };
  } catch (e) {
    console.warn(`  ✗  fetch failed for ${youtubeId}: ${e.message}`);
    return null;
  }
}

// ── 3. Patch a single block inside the source string ──────────────────────
function patchBlock(source, youtubeId, meta) {
  // Find the youtubeId line and inject missing fields right after it
  const lines = source.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/youtubeId\s*:/.test(line)) continue;
    if (!line.includes(`"${youtubeId}"`) && !line.includes(`'${youtubeId}'`))
      continue;

    // Scan the surrounding block for existing title / artist
    let blockStart = i;
    while (blockStart > 0 && !lines[blockStart].trim().startsWith("{"))
      blockStart--;
    let blockEnd = i;
    while (blockEnd < lines.length && !lines[blockEnd].trim().startsWith("}"))
      blockEnd++;

    const blockLines = lines.slice(blockStart, blockEnd + 1);
    const hasTitle = blockLines.some((l) => /\btitle\s*:/.test(l));
    const hasArtist = blockLines.some((l) => /\bartist\s*:/.test(l));

    const indent = (line.match(/^(\s*)/) || ["", "  "])[1];
    const insertions = [];

    if (!hasTitle && meta.title)
      insertions.push(`${indent}title: ${JSON.stringify(meta.title)},`);
    if (!hasArtist && meta.artist)
      insertions.push(`${indent}artist: ${JSON.stringify(meta.artist)},`);

    if (insertions.length) {
      lines.splice(i + 1, 0, ...insertions);
    }
    break;
  }

  return lines.join("\n");
}

// ── 4. Main ───────────────────────────────────────────────────────────────
async function main() {
  console.log(`📖  Reading ${TRACKS_FILE} …`);
  let source = fs.readFileSync(TRACKS_FILE, "utf-8");

  const blocks = parseBlocks(source);
  const toEnrich = blocks.filter((b) => !b.hasTitle || !b.hasArtist);

  if (!toEnrich.length) {
    console.log("✅  All tracks already have title + artist. Nothing to do.");
    return;
  }

  console.log(`\n🔍  Fetching metadata for ${toEnrich.length} track(s)…\n`);

  for (const block of toEnrich) {
    process.stdout.write(`  ⏳  ${block.youtubeId} … `);
    const meta = await fetchYTMeta(block.youtubeId);

    if (!meta) {
      console.log("skipped (fetch failed)");
      continue;
    }

    console.log(`"${meta.title}"  /  channel: "${meta.artist}"`);
    source = patchBlock(source, block.youtubeId, meta);

    // Brief pause so we don't hammer YouTube's servers
    await new Promise((r) => setTimeout(r, 350));
  }

  fs.writeFileSync(TRACKS_FILE, source, "utf-8");
  console.log("\n✅  tracks.js patched and saved!");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
