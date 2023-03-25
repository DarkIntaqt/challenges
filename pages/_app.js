import { Noto_Sans, Noto_Sans_JP, Noto_Sans_KR, Source_Sans_Pro } from "@next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import "challenges/styles/global.css";

import Loader from "challenges/components/Loader";
import Layout from "challenges/layouts/Layout";
import ErrorBoundary from "challenges/components/ErrorBoundary";


/**
 * Fonts used for this Site. 
 * 
 * Noto is the default font. Additionally, notoJP and 
 * notoKR should cover most of the ASIA regions to
 * not cause any font issues. 
 * 
 * Source Sans Pro is currently only used for the logo
 */
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


export default function ChallengeTracker({ Component, pageProps }) {

  /**
   * Handler to show a loading animation instead of a
   * stuck screen when changing routes
   */
  const router = useRouter();
  const [lastKnownUrl, setLastKnownUrl] = useState(router.asPath);
  const [loading, setLoading] = useState(false);


  /**
   * Handle the loading animation
   * 
   * Set the state "loading" to true if the page is
   * currently changing, and render the <Loading/>
   * componen instead. 
   */
  useEffect(() => {
    const handleStart = (url) => {
      if (url === lastKnownUrl) {
        return;
      }
      setLastKnownUrl(url);
      setLoading(true);
    };

    const handleStop = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      /**
       * Unmount, even tho probably unnecessary as in _app
       */
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router, setLoading, lastKnownUrl, setLastKnownUrl]);


  /**
   * Return the app body in the <Layout/>. 
   * Shows a loader if(loading === true)
   */
  return <ErrorBoundary>

    <Layout className={`${noto.variable} ${notoJP.variable} ${notoKR.variable} ${source.variable}`}>

      {
        loading
          ? <Loader style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)"
          }} />
          : <Component {...pageProps} />
      }

    </Layout>

  </ErrorBoundary>;
}
