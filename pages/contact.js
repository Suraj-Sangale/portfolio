import { getPortfolioDataController } from "@/backend/controller/commonController";
import Layout from "@/components/layout";
import ContactSection from "@/components/contactSection";

export default function ContactPage({ pageDataa }) {
  const pageData = {
    heading: "Contact",
    subheading: "Contact",
    mainText: "Reach out",
    highlightedText: "to me!",
    message:
      "Want to discuss a project or just say hi? My inbox is always open. 👋",
  };
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
