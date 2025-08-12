import Footer from "./Footer";
import Header from "./Header";
import css from "./navigation.module.scss";

export default function Navigation({ children }: { children: React.ReactNode }) {
   return (
      <section className={css.layout}>
         <Header />
         <section className={css.content}>
            <main>{children}</main>
            <Footer />
         </section>
      </section>
   );
}
