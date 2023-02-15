import { Noto_Sans, Noto_Sans_JP, Noto_Sans_KR, Source_Sans_Pro } from "@next/font/google";
import Layout from "challenges/layouts/Layout";
import "challenges/styles/global.css";

const noto = Noto_Sans({
  weight: ["300", "400", "700"],
  subsets: ["latin", "greek"],
  variable: "--Noto"
});

const notoJP = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--NotoJP"
});

const notoKR = Noto_Sans_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--NotoKR"
});

const source = Source_Sans_Pro({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--Source"
});

export default function App({ Component, pageProps }) {
  return <Layout className={`${noto.variable} ${notoJP.variable} ${notoKR.variable} ${source.variable}`}>
    <Component {...pageProps} />
  </Layout>;
}
