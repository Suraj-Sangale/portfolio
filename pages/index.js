import PortfolioHome from "@/components/PortfolioHome";
import NostalgiaHome from "@/components/NostalgiaHome";

export default function Home(props) {
  const site = process.env.NEXT_PUBLIC_SITE;

  if (site === "nostalgia") {
    return <NostalgiaHome {...props} />;
  }

  return <PortfolioHome {...props} />;
}

// _app.js reads Component.layout — must be on the page export, not on child components.
Home.layout = process.env.NEXT_PUBLIC_SITE === "nostalgia" ? "open" : undefined;

export async function getServerSideProps(context) {
  const site = process.env.NEXT_PUBLIC_SITE;

  if (site === "nostalgia") {
    const { tracks } = await import("@/data/tracks");

    return {
      props: {
        tracks,
      },
    };
  }

  const {
    getPortfolioDataController,
  } = await import("@/backend/controller/commonController");

  const cacheKey = "portfolio:all";

  let pageData = {};

  const [homePageData] = await Promise.all([
    getPortfolioDataController(cacheKey),
  ]);

  if (homePageData.status) {
    pageData = { ...homePageData.data };
  }

  return {
    props: {
      pageData,
    },
  };
}