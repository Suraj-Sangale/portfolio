const fs = require("fs");
const path = require("path");

/**
 * ============================================================
 * CONFIG
 * ============================================================
 */

const SOURCE_DIR = path.join(process.cwd(), "mp3");
const OUTPUT_DIR = path.join(process.cwd(), "public", "songs");
const GENERATED_FILE = path.join(process.cwd(), "tracks.generated.js");

/**
 * ============================================================
 * TRACKS
 * Keep your complete tracks array here.
 * ============================================================
 */

const tracks = [
  {
    id: "1",
    title: "Ghan Aaj Barse",
    artist: "Swapnil Bandodkar",
    album: "Marathi Song",
    language: "marathi",
    spotifyId: "26Nu5GRBUdEA0ms3CDWWzN",
    youtubeId: "SMyds5pcrOk",
  },
  {
    id: "2",
    title: "Baarish",
    artist: "Ash King & Shashaa Tirupati",
    album: "Half Girlfriend",
    language: "hindi",
    spotifyId: "4FeiicaPWhZZusS1rddYdc",
    youtubeId: "BNfAf4To73c",
  },
  {
    id: "3",
    title: "Kabhi Jo Baadal Barse",
    artist: "Arijit Singh",
    album: "Jackpot",
    language: "hindi",
    spotifyId: "5T1yqdTEpwwo8UsjriiAQK",
    youtubeId: "qH1eRWlJpsY",
  },
  {
    id: "4",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    album: "Aashiqui 2",
    language: "hindi",
    spotifyId: "56zZ48jdyY2oDXHVnwg5Di",
    youtubeId: "NUo8CKI34o4",
  },
  {
    id: "5",
    title: "Woh Baarishein",
    artist: "Arjun Kanungo",
    album: "Woh Baarishein",
    language: "hindi",
    spotifyId: "3RFNUexrtXExkzTEiJ0eBh",
    youtubeId: "qxvL7fi75ks",
  },
  {
    id: "6",
    title: "Dekho Na",
    artist: "Sonu Nigam & Sunidhi Chauhan",
    album: "Fanaa",
    language: "hindi",
    spotifyId: "5q0pLxhyHvZXnYxaygt2Az",
    youtubeId: "v4h5iPlxj0c",
  },
  {
    id: "7",
    title: "Saanson Ko Saanson Mein",
    artist: "Babul Supriyo & Alka Yagnik",
    album: "Hum Tum",
    language: "hindi",
    spotifyId: "6YRbDkyTzsizAWFz8kwiI7",
    youtubeId: "joqFbZy96Xk",
  },
  {
    id: "8",
    title: "Ishq Bulaava",
    artist: "Sanam Puri & Shipra Goyal",
    album: "Hasee Toh Phasee",
    language: "hindi",
    spotifyId: "1fkjRQA8wXPPyxqYLbxuqy",
    youtubeId: "c2gSzYLJ8sY",
  },
  {
    id: "9",
    title: "Qaafirana",
    artist: "Arijit Singh & Nikhita Gandhi",
    album: "Kedarnath",
    language: "hindi",
    spotifyId: "7BCp5hEiiDSmXsxsXkvYff",
    youtubeId: "ZmcBC9-wAXM",
  },
  {
    id: "10",
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    album: "Bhediya",
    language: "hindi",
    spotifyId: "5bQ6oDLqvw8tywmnSmwEyL",
    youtubeId: "ElZfdU54Cp8",
  },

  // Add tracks 11-25 here
];

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function removeExtension(filename) {
  return filename.replace(/\.[^/.]+$/, "");
}

function getMp3Files() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`\n❌ Source folder not found: ${SOURCE_DIR}`);
    console.log("\nCreate it and put your MP3 files inside:");
    console.log("   ./mp3\n");
    process.exit(1);
  }

  return fs
    .readdirSync(SOURCE_DIR)
    .filter((file) => path.extname(file).toLowerCase() === ".mp3");
}

/**
 * ============================================================
 * MATCHING
 * ============================================================
 */

function findMatchingFile(track, files) {
  const title = normalize(track.title);

  // Exact normalized title match
  let match = files.find((file) => {
    const filename = normalize(removeExtension(file));
    return filename === title;
  });

  if (match) return match;

  // Filename starts with title
  match = files.find((file) => {
    const filename = normalize(removeExtension(file));
    return filename.startsWith(title);
  });

  if (match) return match;

  // Title words are contained in filename
  const titleWords = title.split(" ").filter(Boolean);

  match = files.find((file) => {
    const filename = normalize(removeExtension(file));

    return titleWords.every((word) => filename.includes(word));
  });

  return match || null;
}

/**
 * ============================================================
 * GENERATE TRACKS FILE
 * ============================================================
 */

function generateTracksFile(results) {
  const outputTracks = results.map(({ track, outputFile }) => ({
    ...track,
    src: outputFile ? `/songs/${outputFile}` : null,
    cover: track.youtubeId
      ? `https://i.ytimg.com/vi/${track.youtubeId}/hqdefault.jpg`
      : "/scenes/monsoon.png",
  }));

  const content = `/**
 * AUTO-GENERATED FILE
 * Do not edit manually.
 *
 * Generated by:
 * scripts/organize-songs.js
 */

export const tracks = ${JSON.stringify(outputTracks, null, 2)};
`;

  fs.writeFileSync(GENERATED_FILE, content, "utf8");
}

/**
 * ============================================================
 * MAIN
 * ============================================================
 */

function main() {
  console.log("\n========================================");
  console.log("        🎵 SONG ORGANIZER");
  console.log("========================================\n");

  const files = getMp3Files();

  console.log(`📂 Source: ${SOURCE_DIR}`);
  console.log(`🎵 MP3 files found: ${files.length}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const results = [];
  const usedFiles = new Set();

  let matchedCount = 0;
  let missingCount = 0;

  for (const track of tracks) {
    const sourceFile = findMatchingFile(track, files);

    if (!sourceFile || usedFiles.has(sourceFile)) {
      console.log(`❌ MISSING: ${track.title}`);

      results.push({
        track,
        outputFile: null,
      });

      missingCount++;
      continue;
    }

    usedFiles.add(sourceFile);

    const extension = path.extname(sourceFile).toLowerCase();
    const filename = `${slugify(track.title)}${extension}`;

    const sourcePath = path.join(SOURCE_DIR, sourceFile);
    const outputPath = path.join(OUTPUT_DIR, filename);

    fs.copyFileSync(sourcePath, outputPath);

    console.log(`✅ ${track.title}`);
    console.log(`   ${sourceFile}`);
    console.log(`   → public/songs/${filename}`);

    results.push({
      track,
      outputFile: filename,
    });

    matchedCount++;
  }

  /**
   * Generate tracks.generated.js
   */
  generateTracksFile(results);

  /**
   * Find unused MP3s
   */
  const unusedFiles = files.filter((file) => !usedFiles.has(file));

  console.log("\n========================================");
  console.log("              SUMMARY");
  console.log("========================================");

  console.log(`\n✅ Matched : ${matchedCount}`);
  console.log(`❌ Missing : ${missingCount}`);
  console.log(`⚠️ Unused  : ${unusedFiles.length}`);

  if (missingCount > 0) {
    console.log("\n❌ Missing songs:");

    results
      .filter((result) => !result.outputFile)
      .forEach(({ track }) => {
        console.log(`   - ${track.title}`);
      });
  }

  if (unusedFiles.length > 0) {
    console.log("\n⚠️ Unmatched MP3 files:");

    unusedFiles.forEach((file) => {
      console.log(`   - ${file}`);
    });
  }

  console.log(`\n📄 Generated: ${GENERATED_FILE}`);

  console.log("\n========================================");
  console.log("              DONE 🎵");
  console.log("========================================\n");
}

main();