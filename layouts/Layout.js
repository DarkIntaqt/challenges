import Header from "./Header";
import css from "challenges/styles/layout.module.scss";
import Footer from "./Footer";

export default function Layout(props) {

   let attributes = {};

   for (const attribute in props) {
      if (Object.hasOwnProperty.call(props, attribute)) {

         if (attribute !== "children") {
            attributes[attribute] = props[attribute];
         }

      }
   }

   return <section {...props} className={css.wrapper}>

      <Header />

      <section className={css.contentWrapper}>

         <section>
            {props.children}
         </section>

         <Footer />

      </section>

   </section>;
}