import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-RD6GBTESJ6"); // replace with your ID
};

export const trackPageView = (url) => {
  ReactGA.send({
    hitType: "pageview",
    page: url,
  });
};

export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};