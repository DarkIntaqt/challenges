import { Header } from "./Header";
import css from "challenges/styles/layout.module.scss";

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

      <Header>
      </Header>

      <section className={css.contentWrapper}>
         {props.children}
      </section>

   </section>;
}