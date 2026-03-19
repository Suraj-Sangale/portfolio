import { getPortfolioDataController } from "@/backend/controller/commonController";
import Layout from "@/components/layout";
import HomeWrapper from "@/components/homeWrapper";
import DevFolio from "@/components/home/devFolio";

export default function Home({ pageData }) {
  return (
    <>
      {/* <HomeWrapper pageData={pageData} /> */}
      <DevFolio pageData={pageData} />
    </>
  );
}

export const getServerSideProps = async () => {
  // const pageData = await fetch("http://localhost:3000/api/portfolio").then((res) => res.json());
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
};
