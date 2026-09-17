import Footer from "@/components/common/Footer";
import Header from "@/components/header";
import "@/styles/globals.css";

import { initGA, trackPageView } from "@/utilities/analytics";
import { newSeoData } from "@/utilities/Data";
import useVisitTracker from "@/hooks/useVisitTracker";

import { DefaultSeo } from "next-seo";
import { Outfit } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useVisitTracker();

  const layout = Component.layout;

  const isOpenLayout = layout === "open";

  useEffect(() => {
    initGA();

    const handleRouteChange = (url) => {
      trackPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <div className={outfit.className}>
      <DefaultSeo {...newSeoData} />

      {/* Header */}
      {!isOpenLayout && <Header />}

      {/* Page */}
      <Component {...pageProps} />

      {/* Footer */}
      {!isOpenLayout && <Footer />}
    </div>
  );
}