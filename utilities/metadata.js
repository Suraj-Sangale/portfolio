import "./globals.css";

export const metadata = {
  title: "यादों का सफ़र | Rainy Love Songs & Monsoon Playlist",

  description:
    "Listen to soulful Hindi and Marathi romantic rain songs for rainy evenings, monsoon memories, quiet nights, and moments of love.",

  keywords: [
    "rainy love songs",
    "rain songs",
    "romantic rain songs",
    "Hindi rain songs",
    "Marathi rain songs",
    "Hindi romantic songs",
    "Marathi romantic songs",
    "monsoon songs",
    "monsoon love songs",
    "rainy day playlist",
    "romantic monsoon playlist",
    "Hindi monsoon songs",
    "Marathi monsoon songs",
    "rainy evening songs",
    "love songs for rainy days",
  ],

  authors: [
    {
      name: "यादों का सफ़र",
    },
  ],

  creator: "यादों का सफ़र",

  openGraph: {
    title: "यादों का सफ़र | Rainy Love Songs & Monsoon Playlist",

    description:
      "A soulful collection of Hindi and Marathi romantic rain songs for rainy evenings and monsoon memories.",

    type: "website",

    locale: "en_IN",

    siteName: "यादों का सफ़र",

    // Add this after creating your OG image
    // images: [
    //   {
    //     url: "/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Rainy Love Songs - Hindi & Marathi",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",

    title: "यादों का सफ़र | Rainy Love Songs 🌧️❤️",

    description:
      "Hindi and Marathi romantic songs for rainy evenings, monsoon memories, and quiet moments.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}