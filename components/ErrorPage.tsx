import { ReactNode } from "react";

import css from "challenges/styles/social.module.scss";
import { ErrorProps } from "challenges/types/general.types";

export default function ErrorPage({ err }: ErrorProps): ReactNode {
   return (
      <>
         <section className={css.wrapper}>
            <h1 className={css.notFixed}>An error occurred</h1>
         </section>
      </>
   );
}
