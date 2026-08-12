/**
 * @typedef {Object} Scene
 * @property {string} id
 * @property {string} title      - Devanagari / display title
 * @property {string} subtitle   - Cinematic uppercase subtitle
 * @property {string} image      - Path relative to /public
 * @property {string} trackId    - Default track to play for this scene
 * @property {string} accent     - CSS color for warm overlay tint
 */

/** @type {Scene[]} */
export const scenes = [
  {
    id: "bg_2",
    title: "बरसात",
    subtitle: "DELUXE SALOON • OPEN ALL HOURS",
    image: "/scenes/bg_2.png",
    imageResponsive: "/scenes/bg_2_mobile.png",
    trackId: "1",
    accent: "rgba(120, 60, 20, 0.22)",
  },
  {
    id: "railway",
    title: "यादों का पड़ाव",
    subtitle: "PLATFORM NO. 1 • DEPARTURES",
    image: "/scenes/bg_1.png",
    imageResponsive: "/scenes/bg_1_mobile.png",
    trackId: "8",
    accent: "rgba(60, 40, 80, 0.20)",
  },
  {
    id: "chai",
    title: "चाय और बातें",
    subtitle: "EVENING STORIES • SINCE 1975",
    image: "/scenes/chai.png",
    trackId: "7",
    accent: "rgba(110, 70, 10, 0.22)",
  },
  {
    id: "monsoon",
    title: "बरसात की रात",
    subtitle: "MUMBAI RAINS • MIDNIGHT",
    image: "/scenes/monsoon.png",
    trackId: "3",
    accent: "rgba(20, 40, 80, 0.25)",
  },
  {
    id: "cinema",
    title: "सिनेमा का जादू",
    subtitle: "SINGLE SCREEN • LAST SHOW",
    image: "/scenes/cinema.png",
    trackId: "4",
    accent: "rgba(80, 20, 20, 0.22)",
  },
];

export default scenes;
