import "@/styles/globals.css";
import { newSeoData } from "@/utilities/Data";
import { DefaultSeo } from "next-seo";
import { Nunito } from "next/font/google";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"], // Only include weights you use
  display: "swap",
});
export default function App({ Component, pageProps }) {
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
