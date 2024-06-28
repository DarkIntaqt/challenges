import { CSSProperties, HTMLAttributes, ReactNode } from "react";

import css from "challenges/styles/loader.module.scss";

export default function Loader({ style, ...props }: LoaderProps): ReactNode {
   return (
      <div
         {...props}
         style={
            style || {
               position: "absolute",
               top: "50%",
               left: "50%",
               transform: "translate(-50%,-50%)",
            }
         }
         className={css.loader}
      ></div>
   );
}

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
   style?: CSSProperties;
}
