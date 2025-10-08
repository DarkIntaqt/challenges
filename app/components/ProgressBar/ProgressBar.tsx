import clsx, { type ClassValue } from "clsx";
import variables from "@cgg/styles/variables.module.scss";
import type { Tier } from "@cgg/utils/tier";
import css from "./progressBar.module.scss";

export default function ProgressBar({
   current,
   next,
   tier,
   className,
   progress,
   pinned = false,
}: {
   current: number | undefined;
   next: number | undefined;
   tier?: Tier;
   className?: ClassValue;
   progress?: number;
   pinned?: boolean;
}) {
   const progressPct = Math.min(
      1,
      Math.max(0, progress ? progress : (current ?? 0) / (next ?? 1)),
   );

   return (
      <div
         className={clsx(
            css.progress,
            tier && variables[tier],
            className,
            pinned && css.pinned,
         )}
      >
         <div
            className={css.indicator}
            style={{
               width: `${progressPct * 100}%`,
            }}
         ></div>
      </div>
   );
}
