import { getPortfolioDataController } from "@/backend/controller/commonController";
import Layout from "@/components/layout";
import Timeline from "@/components/timeline";

export default function WorkPage({ pageData }) {
  return (
    <Layout>
      <Timeline pageData={pageData} />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const cacheKey = "portfolio:work";
  const pageData = {};

  try {
    const workData = await getPortfolioDataController(cacheKey, "work");
    if (workData?.status) {
      pageData.workData = workData.data;
    }
  } catch (error) {
    console.error("Error fetching work data:", error);
  }

  return {
    props: {
      pageData,
    },
  };
};
