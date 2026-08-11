/**
 * @typedef {Object} Track
 * @property {string} id
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * @property {string} cover
 * @property {string} src
 * @property {'hindi'|'marathi'} language
 */

/**
 * HOW TO ADD YOUR OWN SONGS
 * ─────────────────────────
 * 1. Place your .mp3 files inside:  /public/music/
 * 2. Update the `src` field below to match your filename,
 *    e.g.  src: "/music/tum-se-hi.mp3"
 *
 * DEMO AUDIO NOTE
 * ───────────────
 * The `src` fields currently point to royalty-free demo tracks from
 * SoundHelix (soundhelix.com) so the player works immediately.
 * Replace them with your own files at any time.
 */

// Royalty-free demo tracks — cycle through 8 SoundHelix samples
const DEMO = [
  "/music/Ghan-Aaj-Barse.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
];

/** @type {Track[]} */
export const tracks = [
  // ── Hindi Songs ────────────────────────────────────────────────────────────
  {
    id: "1",
    title: "Ghan Aaj Barse",
    artist: "Swapnil Bandodkar",
    album: "Marathi Song",
    cover: "/songsCover/ghan_aaj.png",
    src: DEMO[0],
    language: "marathi",
  },
  {
    id: "2",
    title: "Baarish",
    artist: "Ash King & Shashaa Tirupati",
    album: "Half Girlfriend",
    cover: "/scenes/monsoon.png",
    src: DEMO[1],
    language: "hindi",
  },
  {
    id: "3",
    title: "Kabhi Jo Baadal Barse",
    artist: "Arijit Singh",
    album: "Jackpot",
    cover: "/scenes/monsoon.png",
    src: DEMO[2],
    language: "hindi",
  },
  {
    id: "4",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    album: "Aashiqui 2",
    cover: "/scenes/cinema.png",
    src: DEMO[3],
    language: "hindi",
  },
  {
    id: "5",
    title: "Woh Baarishein",
    artist: "Arjun Kanungo",
    album: "Woh Baarishein",
    cover: "/scenes/monsoon.png",
    src: DEMO[4],
    language: "hindi",
  },
  {
    id: "6",
    title: "Dekho Na",
    artist: "Shaan & Kavita Krishnamurthy",
    album: "Fanaa",
    cover: "/scenes/salon.png",
    src: DEMO[5],
    language: "hindi",
  },
  {
    id: "7",
    title: "Saanson Ko Saanson Mein",
    artist: "Udit Narayan",
    album: "Hum Tum",
    cover: "/scenes/chai.png",
    src: DEMO[6],
    language: "hindi",
  },
  {
    id: "8",
    title: "Ishq Bulava",
    artist: "Shafqat Amanat Ali",
    album: "Hasee Toh Phasee",
    cover: "/scenes/railway.png",
    src: DEMO[7],
    language: "hindi",
  },
  {
    id: "9",
    title: "Qaafirana",
    artist: "Arijit Singh & Nikhita Gandhi",
    album: "Kedarnath",
    cover: "/scenes/railway.png",
    src: DEMO[0],
    language: "hindi",
  },
  {
    id: "10",
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    album: "Bhediya",
    cover: "/scenes/chai.png",
    src: DEMO[1],
    language: "hindi",
  },

  // ── Marathi Songs ──────────────────────────────────────────────────────────
  {
    id: "11",
    title: "पाऊस पाऊस",
    artist: "Avadhoot Gupte",
    album: "Romantic Marathi",
    cover: "/scenes/monsoon.png",
    src: DEMO[2],
    language: "marathi",
  },
  {
    id: "12",
    title: "साजणी",
    artist: "Swapnil Bandodkar",
    album: "Romantic Marathi",
    cover: "/scenes/salon.png",
    src: DEMO[3],
    language: "marathi",
  },
  {
    id: "13",
    title: "गुलाबी रिमझिम",
    artist: "Hrishikesh Ranade",
    album: "Romantic Marathi",
    cover: "/scenes/monsoon.png",
    src: DEMO[4],
    language: "marathi",
  },
  {
    id: "14",
    title: "तू ये ना",
    artist: "Swapnil Bandodkar",
    album: "Romantic Marathi",
    cover: "/scenes/chai.png",
    src: DEMO[5],
    language: "marathi",
  },
  {
    id: "15",
    title: "तू आणि मी",
    artist: "Vaishali Made",
    album: "Romantic Marathi",
    cover: "/scenes/cinema.png",
    src: DEMO[6],
    language: "marathi",
  },
  {
    id: "16",
    title: "सांज",
    artist: "Anand Shinde",
    album: "Romantic Marathi",
    cover: "/scenes/chai.png",
    src: DEMO[7],
    language: "marathi",
  },
  {
    id: "17",
    title: "रात्रीस खेळ चाले",
    artist: "Various Artists",
    album: "Atmospheric Marathi",
    cover: "/scenes/cinema.png",
    src: DEMO[0],
    language: "marathi",
  },
  {
    id: "18",
    title: "येडं हे मन माझं",
    artist: "Swapnil Bandodkar",
    album: "Romantic Marathi",
    cover: "/scenes/salon.png",
    src: DEMO[1],
    language: "marathi",
  },
  {
    id: "19",
    title: "तुला पाहता",
    artist: "Hrishikesh Ranade",
    album: "Romantic Marathi",
    cover: "/scenes/railway.png",
    src: DEMO[2],
    language: "marathi",
  },
  {
    id: "20",
    title: "बेधुंद मी",
    artist: "Avadhoot Gupte",
    album: "Romantic Marathi",
    cover: "/scenes/monsoon.png",
    src: DEMO[3],
    language: "marathi",
  },
  {
    id: "21",
    title: "खुळाच झालो गं",
    artist: "Swapnil Bandodkar",
    album: "Romantic Marathi",
    cover: "/scenes/chai.png",
    src: DEMO[4],
    language: "marathi",
  },
  {
    id: "22",
    title: "तू श्वास सारे",
    artist: "Hrishikesh Ranade",
    album: "Romantic Marathi",
    cover: "/scenes/salon.png",
    src: DEMO[5],
    language: "marathi",
  },
  {
    id: "23",
    title: "चंद्र झुल्यावर",
    artist: "Various Artists",
    album: "Romantic Marathi",
    cover: "/scenes/cinema.png",
    src: DEMO[6],
    language: "marathi",
  },
  {
    id: "24",
    title: "नाते नव्याने",
    artist: "Avadhoot Gupte",
    album: "Romantic Marathi",
    cover: "/scenes/railway.png",
    src: DEMO[7],
    language: "marathi",
  },
  {
    id: "25",
    title: "लाजताना",
    artist: "Swapnil Bandodkar",
    album: "Romantic Marathi",
    cover: "/scenes/salon.png",
    src: DEMO[0],
    language: "marathi",
  },
];

export default tracks;
