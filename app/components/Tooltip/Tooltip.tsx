import clsx from "clsx";
import css from "./tooltip.module.scss";

export default function Tooltip({
   children,
   tooltip,
   className,
}: {
   children: React.ReactNode;
   tooltip: string | React.ReactNode;
   className?: string;
}) {
   return (
      <span className={clsx(css.wrapper, className)}>
         {children}
         <span className={css.tooltip}>
            <span className={css.tooltipInner}>
               {tooltip}
               <span className={css.arrow} />
            </span>
         </span>
      </span>
   );
}
