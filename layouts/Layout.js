import Header from "./Header";
import css from "challenges/styles/layout.module.scss";
import Footer from "./Footer";

export default function Layout(props) {

   let attributes = {};
   let classNames = [css.wrapper];

   for (const attribute in props) {
      if (Object.hasOwnProperty.call(props, attribute)) {

         if (attribute === "className") {
            classNames.push(props[attribute]);
            continue;
         }

         if (attribute !== "children") {
            attributes[attribute] = props[attribute];
         }


      }
   }

   return <section {...props} className={classNames.join(" ")}>

      <Header />

      <section className={css.contentWrapper}>

         <section>
            {props.children}
         </section>

         <Footer />

      </section>

   </section>;
}