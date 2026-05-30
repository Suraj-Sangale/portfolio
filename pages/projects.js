import { getPortfolioDataController } from "@/backend/controller/commonController";
import Layout from "@/components/layout";
import ProjectsWrapper from "@/components/projectsWrapper";
import { useTrackPageActivity } from "@/hooks/useTrackPageActivity";

export default function ProjectsPage({ pageData }) {
  useTrackPageActivity("projects");

  return (
    <Layout>
      <ProjectsWrapper pageData={pageData} />
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

