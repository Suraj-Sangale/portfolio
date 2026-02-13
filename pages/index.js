import { getPortfolioDataController } from "@/backend/controller/commonController";
import Header from "@/components/header";
import HomeWrapper from "@/components/homeWrapper";

export default function Home({ pageData }) {
  return (
    <>
      <Header />
      <HomeWrapper pageData={pageData} />
    </>
  );
}

export const getServerSideProps = async () => {
  // const pageData = await fetch("http://localhost:3000/api/portfolio").then((res) => res.json());
  const cacheKey = "portfolio:all";
  const pageData = {};

  const [homePageData] = await Promise.all([
    getPortfolioDataController(cacheKey),
  ]);

  // console.log("homePageData", homePageData);
  if (homePageData.status) {
    pageData.homePageData = homePageData.data;
  }

  return {
    props: {
      pageData,
    },
  };
};
