import { getPortfolioDataController } from "@/backend/controller/commonController";
import Layout from "@/components/layout";
import ContactSection from "@/components/contactSection";
import { useTrackPageActivity } from "@/hooks/useTrackPageActivity";

export default function ContactPage({ pageData }) {
  useTrackPageActivity("contact");

  return (
    <Layout>
      <ContactSection pageData={pageData} />
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const cacheKey = "portfolio:contact";
  const pageData = {};

  try {
    const contactData = await getPortfolioDataController(cacheKey, "contact");
    if (contactData?.status) {
      pageData.contactData = contactData.data;
    }
  } catch (error) {
    console.error("Error fetching contact data:", error);
  }

  return {
    props: {
      pageData,
    },
  };
};
