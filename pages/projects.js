import { getPortfolioDataController } from "@/backend/controller/commonController";
import Layout from "@/components/layout";
import Projects from "@/components/projects";

export default function ProjectsPage({ pageData }) {
  return (
    <Layout>
      <Projects pageData={pageData} />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const cacheKey = "portfolio:projects";
  const pageData = {};

  try {
    const projectsData = await getPortfolioDataController(cacheKey, "projects");
    if (projectsData?.status) {
      pageData.projectsData = projectsData.data;
    }
  } catch (error) {
    console.error("Error fetching projects data:", error);
  }

  return {
    props: {
      pageData,
    },
  };
};

