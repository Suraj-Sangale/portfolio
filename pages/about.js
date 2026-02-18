import { getPortfolioDataController } from "@/backend/controller/commonController";
import Layout from "@/components/layout";
import About from "@/components/about";

export default function AboutPage({ pageData }) {
  return (
    <Layout>
      <About />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const cacheKey = "portfolio:about";
  const pageData = {};

  try {
    const aboutData = await getPortfolioDataController(cacheKey, "about");
    if (aboutData?.status) {
      pageData.aboutData = aboutData.data;
    }
  } catch (error) {
    console.error("Error fetching about data:", error);
  }

  return {
    props: {
      pageData,
    },
  };
};

