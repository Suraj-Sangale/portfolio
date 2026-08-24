// index.mjs
import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';
import { YouTube } from 'youtube-sr';

// Usage: node index.mjs <mp3-folder> [output.json]
const FOLDER = process.argv[2] || './songs';
const OUTPUT = process.argv[3] || './youtube-ids.json';

// Try ID3 tags first (artist - title), fall back to the filename
async function getSearchQuery(filePath) {
  try {
    const metadata = await parseFile(filePath);
    const title = metadata.common.title;
    const artist = metadata.common.artist;
    if (title) {
      return artist ? `${artist} - ${title}` : title;
    }
  } catch {
    // no readable tags, fall through to filename
  }
  return path.basename(filePath, path.extname(filePath));
}

async function searchYouTube(query) {
  try {
    const results = await YouTube.search(query, { limit: 1, type: 'video' });
    if (results.length > 0) {
      return { id: results[0].id, url: results[0].url, title: results[0].title };
    }
  } catch (e) {
    console.error(`  ✗ search failed for "${query}": ${e.message}`);
  }
  return null;
}

async function main() {
  if (!fs.existsSync(FOLDER)) {
    console.error(`Folder not found: ${FOLDER}`);
    process.exit(1);
  }

  const files = fs.readdirSync(FOLDER).filter(f => f.toLowerCase().endsWith('.mp3'));
  console.log(`Found ${files.length} mp3 file(s) in ${FOLDER}\n`);

  const results = [];

  for (const file of files) {
    const fullPath = path.join(FOLDER, file);
    const query = await getSearchQuery(fullPath);
    process.stdout.write(`Searching: ${query} ... `);

    const yt = await searchYouTube(query);
    console.log(yt ? `✓ ${yt.id}` : '✗ no match');

    results.push({
      file,
      query,
      youtubeId: yt?.id || null,
      youtubeUrl: yt?.url || null,
      youtubeTitle: yt?.title || null,
    });

    // small delay so we don't hammer YouTube
    await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(results, null, 2));
  console.log(`\nSaved results to ${OUTPUT}`);

  const missing = results.filter(r => !r.youtubeId);
  if (missing.length) {
    console.log(`\n${missing.length} file(s) need manual lookup:`);
    missing.forEach(m => console.log(`  - ${m.file}`));
  }
}

main();