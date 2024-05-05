import React from "react";
import Header from "./Header";
import css from "challenges/styles/layout.module.scss";
import Footer from "./Footer";

export default function Layout({ classes, children }: Readonly<{ classes: string, children: React.ReactNode }>) {


   let classNames = [css.wrapper, classes];

   return <section className={classNames.join(" ")} >

      <Header />

      < section className={css.contentWrapper} >

         <section>
            {children}
         </section>

         < Footer />

      </section>

   </section>;
}