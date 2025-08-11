import "@/styles/globals.css";
import { newSeoData } from "@/utilities/Data";
import { DefaultSeo } from "next-seo";
import { Nunito } from "next/font/google";
import useLenis from "@/hooks/useLenis";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"], // Only include weights you use
  display: "swap",
});
export default function App({ Component, pageProps }) {
  // useLenis();

  return (
    <>
      <DefaultSeo {...newSeoData} />
      <Component
        className={nunito.className + " min-h-screen"}
        {...pageProps}
      />
    </>
  );
}
