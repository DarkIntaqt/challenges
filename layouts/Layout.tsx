import React, { useState } from "react";
import css from "./layout.module.scss";
import Footer from "./Footer";
import Sidebar from "challenges/components/Navigation/Sidebar";
import { SidebarConfig } from "challenges/types/general.types";
import { setCookie } from "nookies";

export default function Layout({ classes, children, sidebarConfig }: Readonly<{ classes: string, children: React.ReactNode, sidebarConfig: SidebarConfig }>) {

   const [sidebarState, setSidebar] = useState<SidebarConfig>(sidebarConfig);
   let classNames = [css.content, classes];

   function toggleSidebar() {
      let setTo: SidebarConfig = "HIDDEN";
      if (sidebarState === "HIDDEN") {
         setTo = "VISIBLE";
      }
      setSidebar(setTo);
      setCookie(null, "sidebar", setTo);
   }

   return <section className={classNames.join(" ")} >
      <Sidebar view={sidebarState} toggleSidebar={toggleSidebar} />
      <div className={css.wrapper}>
         <main className={css.main}>
            {children}
         </main>
         <Footer />
      </div>
   </section>;
}
