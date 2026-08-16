import HomeWrapper from "@/components/homeWrapper";
import { useTrackPageActivity } from "@/hooks/useTrackPageActivity";

export default function PortfolioHome({ pageData }) {
  useTrackPageActivity("home");

  return <HomeWrapper pageData={pageData} />;
}