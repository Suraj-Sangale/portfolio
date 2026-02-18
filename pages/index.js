import { getPortfolioDataController } from "@/backend/controller/commonController";
import Layout from "@/components/layout";
import HomeLanding from "@/components/homeLanding";

export default function Home({ pageData }) {
  return (
    <Layout>
      <HomeLanding />
    </Layout>
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
