import "@/styles/globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"], // Only include weights you use
  display: "swap",
});
export default function App({ Component, pageProps }) {
  return (
    <Component
      className={nunito.className}
      {...pageProps}
    />
  );
}
