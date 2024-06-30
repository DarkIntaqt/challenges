import React, { useState } from "react";
import css from "./layout.module.scss";
import Footer from "./Footer";
import Sidebar from "challenges/components/Navigation/Sidebar";
import { SidebarConfig } from "challenges/types/general.types";

export default function Layout({ classes, children, sidebarConfig }: Readonly<{ classes: string, children: React.ReactNode, sidebarConfig: SidebarConfig }>) {

   const [sidebarState, setSidebar] = useState<SidebarConfig>(sidebarConfig);
   let classNames = [css.content, classes];

   return <section className={classNames.join(" ")} >
      <Sidebar sidebarConfigCookie={sidebarState} />
      <div className={css.wrapper}>
         <main className={css.main}>
            {children}
         </main>
         <Footer />
      </div>
   </section>;
}
