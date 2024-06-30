import { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import { ReactNode } from "react";

import Sidebar from "challenges/components/Navigation/Sidebar";
import Footer from "challenges/layouts/Footer";
import css from "challenges/layouts/layout.module.scss";

import "challenges/styles/global.css";
import { cookies } from "next/headers";
import { SidebarConfig } from "challenges/types/general.types";
import ErrorBoundary from "challenges/components/ErrorBoundary";

export const metadata: Metadata = {
   icons: {
      icon: [
         { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
         { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      other: [{ url: "/safari-pinned-tab.svg", color: "#0dbdff", rel: "mask-icon" }],
   },
   manifest: "/site.webmanifest",
   other: { "msapplication-TileColor": "#0dbdff" },
};

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
   variable: "--roboto",
});

export default function RootLayout({ children }: { children: ReactNode }) {

   const cookieStore = cookies();
   const sidebarCookie = (cookieStore.get("sidebar")?.value || "VISIBLE") as SidebarConfig;

   return (
      <html lang="en">
         <body>
            <ErrorBoundary>
               <section className={[css.content, roboto.variable].join(" ")}>
                  <Sidebar sidebarConfigCookie={sidebarCookie} />
                  <div className={css.wrapper}>
                     <main className={css.main}>{children}</main>
                     <Footer />
                  </div>
               </section>
            </ErrorBoundary>
         </body>
         <Script src="https://cdn.darkintaqt.com/script/cc/bundle.js" />
      </html >
   );
}
