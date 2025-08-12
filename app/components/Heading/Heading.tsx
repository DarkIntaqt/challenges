import clsx from "clsx";
import { createElement } from "react";
import css from "./heading.module.scss";

export default function Heading({
   level = 1,
   children,
   className = "",
}: {
   level?: 1 | 2 | 3 | 4 | 5 | 6;
   children: React.ReactNode;
   className?: string;
}) {
   return createElement(
      "h" + level,
      { className: clsx(css.heading, className) },
      children,
   );
}
