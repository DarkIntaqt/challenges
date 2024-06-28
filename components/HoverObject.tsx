import { CSSProperties, ReactNode } from "react";

import css from "challenges/styles/hoverObject.module.scss";

export default function HoverObject({ children, hover = [], style = {} }: HoverObjectProps): ReactNode {
   return (
      <div className={css.hoverObject} style={style}>
         <div className={css.onHover}>{hover}</div>
         {children}
      </div>
   );
}

interface HoverObjectProps {
   children: ReactNode;
   hover?: ReactNode;
   style?: CSSProperties;
}
