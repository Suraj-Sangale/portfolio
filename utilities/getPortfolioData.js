import portfolioData from "../data/portfolio.json";

// Get the entire portfolio data
export const getPortfolioData = () => {
  return portfolioData;
};

// Helper functions to get specific sections
export const getPersonalInfo = () => portfolioData.personal;
export const getSocialLinks = () => portfolioData.socialLinks;
export const getNavigation = () => portfolioData.headerOptions;
export const getAboutData = () => portfolioData.about;
export const getExperience = () => portfolioData.experience;
export const getProjects = () => portfolioData.projects;
export const getContactData = () => portfolioData.contact;
// export const getSectionTitles = () => {};
export const getSeoData = () => portfolioData.seo;

// Get specific section title
// export const getSectionTitle = (sectionName) => {
//   console.log('sectionName', sectionName)
//   return portfolioData.sections?.[sectionName] || {};
// };

// Get social link by platform
export const getSocialLink = (platform) => {
  return portfolioData.socialLinks.find(
    (link) => link.platform.toLowerCase() === platform.toLowerCase()
  );
};

