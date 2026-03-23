import Header from "@/components/header";
import "@/styles/globals.css";
import { initGA, trackPageView } from "@/utilities/analytics";
import { newSeoData } from "@/utilities/Data";
import { DefaultSeo } from "next-seo";
import { Nunito } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"], // Only include weights you use
  display: "swap",
});
export default function App({ Component, pageProps }) {
  const router = useRouter();

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
    <>
      <DefaultSeo {...newSeoData} />
      <Header />
      <Component
        className={nunito.className}
        {...pageProps}
      />
    </>
  );
}
