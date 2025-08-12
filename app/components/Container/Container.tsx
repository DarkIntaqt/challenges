import clsx from "clsx";
import css from "./container.module.scss";

export default function Container({
   className = "",
   children,
   large = false,
   small = false,
   center = false,
   flex = false,
   justify = false,
   fullHeight = false,
   fullWidth = false,
   column = false,
   headerPadding = false,
}: {
   className?: string;
   children?: React.ReactNode;
   large?: boolean;
   small?: boolean;
   center?: boolean;
   flex?: boolean;
   justify?: boolean;
   fullHeight?: boolean;
   fullWidth?: boolean;
   column?: boolean;
   headerPadding?: boolean;
}) {
   if (large && small) {
      throw new Error("Container cannot be both large and small at the same time.");
   }

   return (
      <section
         className={clsx(
            className,
            css.container,
            center && css.center,
            large && css.large,
            small && css.small,
            flex && css.flex,
            justify && css.justify,
            fullHeight && css.fullHeight,
            fullWidth && css.fullWidth,
            column && css.column,
            headerPadding && css.headerPadding,
         )}
      >
         {children}
      </section>
   );
}
