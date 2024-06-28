import { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import { ReactNode } from "react";

import SidebarApp from "challenges/components/Navigation/SidebarApp";
import Footer from "challenges/layouts/Footer";
import css from "challenges/layouts/layout.module.scss";

import "challenges/styles/global.css";

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
   return (
      <html lang="en">
         <body>
            <section className={[css.content, roboto.variable].join(" ")}>
               <SidebarApp />
               <div className={css.wrapper}>
                  <main className={css.main}>{children}</main>
                  <Footer />
               </div>
            </section>
         </body>
         <Script src="https://cdn.darkintaqt.com/script/cc/bundle.js" />
      </html>
   );
}
