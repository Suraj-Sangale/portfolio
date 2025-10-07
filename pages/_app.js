import "@/styles/globals.css";
import { newSeoData } from "@/utilities/Data";
import { DefaultSeo } from "next-seo";
import { Nunito } from "next/font/google";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect } from "react";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"], // Only include weights you use
  display: "swap",
});
export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedTheme = localStorage.getItem("theme");
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      const theme = storedTheme || (prefersLight ? "light" : "dark");
      document.documentElement.setAttribute("data-theme", theme);
    } catch (_) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);
  return (
    <>
      <DefaultSeo {...newSeoData} />
      <Component
        className={nunito.className}
        {...pageProps}
      />
    </>
  );
}
