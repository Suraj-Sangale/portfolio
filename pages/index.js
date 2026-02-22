import { getPortfolioDataController } from "@/backend/controller/commonController";
import Layout from "@/components/layout";
import HomeWrapper from "@/components/homeWrapper";

export default function Home({ pageData }) {
  return (
    <Layout>
      {/* <HomeLanding pageData={pageData} /> */}
      {/* <ScrollReveal /> */}
      <HomeWrapper pageData={pageData} />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  // const pageData = await fetch("http://localhost:3000/api/portfolio").then((res) => res.json());
  const cacheKey = "portfolio:all";
  let pageData = {};

  const [homePageData] = await Promise.all([
    getPortfolioDataController(cacheKey),
  ]);

  // console.log("homePageData", homePageData);
  if (homePageData.status) {
    pageData = { ...homePageData.data };
  }

  return {
    props: {
      pageData,
    },
  };
};
