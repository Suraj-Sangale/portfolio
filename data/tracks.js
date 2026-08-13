/**
 * @typedef {Object} Track
 * @property {string} id
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * @property {string} cover
 * @property {string} src              – local / SoundHelix fallback for HTML5 player
 * @property {'hindi'|'marathi'} language
 * @property {string|null} spotifyId   – Spotify track ID (embed + open link)
 * @property {string|null} youtubeId   – YouTube video ID (embed + open link)
 */



/** @type {Track[]} */
export const tracks = [
  {
    id: "1",
    title: "Ghan Aaj Barse",
    artist: "Swapnil Bandodkar",
    album: "Marathi Song",
    cover: "https://i.ytimg.com/vi/SMyds5pcrOk/hqdefault.jpg",
    src: "",
    language: "marathi",
    spotifyId: "26Nu5GRBUdEA0ms3CDWWzN",
    youtubeId: "SMyds5pcrOk",
  },

  {
    id: "2",
    title: "Baarish",
    artist: "Ash King & Shashaa Tirupati",
    album: "Half Girlfriend",
    cover: "https://i.ytimg.com/vi/BNfAf4To73c/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "4FeiicaPWhZZusS1rddYdc",
    youtubeId: "BNfAf4To73c",
  },

  {
    id: "3",
    title: "Kabhi Jo Baadal Barse",
    artist: "Arijit Singh",
    album: "Jackpot",
    cover: "https://i.ytimg.com/vi/qH1eRWlJpsY/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "5T1yqdTEpwwo8UsjriiAQK",
    youtubeId: "qH1eRWlJpsY",
  },

  {
    id: "4",
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    album: "Aashiqui 2",
    cover: "https://i.ytimg.com/vi/NUo8CKI34o4/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "56zZ48jdyY2oDXHVnwg5Di",
    youtubeId: "NUo8CKI34o4",
  },

  {
    id: "5",
    title: "Woh Baarishein",
    artist: "Arjun Kanungo",
    album: "Woh Baarishein",
    cover: "https://i.ytimg.com/vi/qxvL7fi75ks/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "3RFNUexrtXExkzTEiJ0eBh",
    youtubeId: "qxvL7fi75ks",
  },

  {
    id: "6",
    title: "Dekho Na",
    artist: "Sonu Nigam & Sunidhi Chauhan",
    album: "Fanaa",
    cover: "https://i.ytimg.com/vi/v4h5iPlxj0c/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "5q0pLxhyHvZXnYxaygt2Az",
    youtubeId: "v4h5iPlxj0c",
  },

  {
    id: "7",
    title: "Saanson Ko Saanson Mein",
    artist: "Babul Supriyo & Alka Yagnik",
    album: "Hum Tum",
    cover: "https://i.ytimg.com/vi/joqFbZy96Xk/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "6YRbDkyTzsizAWFz8kwiI7",
    youtubeId: "joqFbZy96Xk",
  },

  {
    id: "8",
    title: "Ishq Bulaava",
    artist: "Sanam Puri & Shipra Goyal",
    album: "Hasee Toh Phasee",
    cover: "https://i.ytimg.com/vi/c2gSzYLJ8sY/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "1fkjRQA8wXPPyxqYLbxuqy",
    youtubeId: "c2gSzYLJ8sY",
  },

  {
    id: "9",
    title: "Qaafirana",
    artist: "Arijit Singh & Nikhita Gandhi",
    album: "Kedarnath",
    cover: "https://i.ytimg.com/vi/ZmcBC9-wAXM/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "7BCp5hEiiDSmXsxsXkvYff",
    youtubeId: "ZmcBC9-wAXM",
  },

  {
    id: "10",
    title: "Apna Bana Le",
    artist: "Arijit Singh",
    album: "Bhediya",
    cover: "https://i.ytimg.com/vi/ElZfdU54Cp8/hqdefault.jpg",
    src: "",
    language: "hindi",
    spotifyId: "5bQ6oDLqvw8tywmnSmwEyL",
    youtubeId: "ElZfdU54Cp8",
  },
];
export default tracks;
