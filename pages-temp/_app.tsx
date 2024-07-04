import React from "react";
import { Roboto } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import "challenges/styles/global.css";

import Loader from "challenges/components/Loader";
import Layout from "challenges/layouts/Layout";
import ErrorBoundary from "challenges/components/ErrorBoundary";
import { AppProps } from "next/app";
import { parseCookies } from "nookies";
import { SidebarConfig } from "challenges/types/general.types";
import { AppContextType } from "next/dist/shared/lib/utils";


/**
 * Fonts used for this Site. 
 * 
 * Noto is the default font. Additionally, notoJP and 
 * notoKR should cover most of the ASIA regions to
 * not cause any font issues. 
 * 
 * Source Sans Pro is currently only used for the logo
 */
const roboto = Roboto({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--roboto"
});

interface CustomProps extends AppProps {
  sidebar: SidebarConfig
}
export default function ChallengeTracker({ Component, pageProps, sidebar }: CustomProps) {

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
    const handleStart = (url: string) => {
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
  return (
      <ErrorBoundary>
        <Layout classes={`${roboto.variable}`} sidebarConfig={sidebar}>
          { loading ? <Loader/> : <Component { ...pageProps } /> }
        </Layout>
      </ErrorBoundary>
  );
}

ChallengeTracker.getInitialProps = async (ctx: AppContextType) => {
  const cookies = parseCookies(ctx.ctx);
  let pageProps = {};

  if (ctx.Component.getInitialProps) {
    pageProps = await ctx.Component.getInitialProps(ctx.ctx);
  }

  let sidebar: SidebarConfig = "VISIBLE";
  if (cookies["sidebar"]) {
    const sidebarCookie = cookies["sidebar"] as SidebarConfig;
    if (sidebarCookie === "VISIBLE" || sidebarCookie === "HIDDEN") {
      sidebar = sidebarCookie;
    }
  }

  return {
    pageProps,
    sidebar,
  };
};