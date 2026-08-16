import Head from "next/head";
import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with Audio API
const NostalgiaExperience = dynamic(
  () => import("@/components/nostalgia/NostalgiaExperience"),
  {
    ssr: false,
  }
);

export default function NostalgiaHome({ tracks }) {
  return (
    <>
      <Head>
        <title>
          Rainy Love Songs | Hindi & Marathi Monsoon Playlist
        </title>

        <meta
          name="description"
          content="Listen to soulful Hindi and Marathi romantic rain songs for rainy evenings, monsoon memories, quiet nights, and moments of love."
        />

        <meta
          name="keywords"
          content="rainy love songs, rain songs, romantic rain songs, Hindi rain songs, Marathi rain songs, Hindi romantic songs, Marathi romantic songs, monsoon songs, monsoon love songs, rainy day playlist, romantic monsoon playlist, Hindi monsoon songs, Marathi monsoon songs, rainy evening songs, love songs for rainy days"
        />

        <meta name="author" content="यादों का सफ़र" />

        <meta name="robots" content="index, follow" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        {/* Theme */}
        <meta name="theme-color" content="#171411" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />

        <meta
          property="og:title"
          content="यादों का सफ़र | Rainy Love Songs 🌧️❤️"
        />

        <meta
          property="og:description"
          content="A soulful collection of Hindi and Marathi romantic rain songs for rainy evenings, monsoon memories, and quiet moments."
        />

        <meta
          property="og:site_name"
          content="यादों का सफ़र"
        />

        <meta property="og:locale" content="en_IN" />

        <meta
          property="og:image"
          content="/og-image.jpg"
        />

        <meta
          property="og:image:alt"
          content="Rainy Love Songs — Hindi & Marathi Monsoon Playlist"
        />

        {/* Twitter / X */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="यादों का सफ़र | Rainy Love Songs 🌧️❤️"
        />

        <meta
          name="twitter:description"
          content="Hindi and Marathi romantic songs for rainy evenings, monsoon memories, and quiet moments."
        />

        <meta
          name="twitter:image"
          content="/og-image.jpg"
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://your-domain.com/"
        />

        {/* Google Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Yatra+One&family=Noto+Serif+Devanagari:wght@400;700;900&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <NostalgiaExperience tracks={tracks} />
    </>
  );
}

NostalgiaHome.layout = "open";