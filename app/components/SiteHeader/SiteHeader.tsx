import clsx from "clsx";
import Heading from "@cgg/components/Heading/Heading";
import cssVariables from "@cgg/styles/variables.module.scss";
import type { Tier } from "@cgg/utils/tier";
import css from "./siteHeader.module.scss";

interface SiteHeaderProps {
   iconUrl: string;
   iconAlt: string;
   tier?: Tier;
   level?: number;
   heading: React.ReactNode;
}

export function SiteHeader({
   props,
   children,
}: Readonly<{ props: SiteHeaderProps; children?: React.ReactNode }>) {
   return (
      <div className={css.head}>
         <div
            className={clsx(
               css.icon,
               props.tier != undefined && cssVariables[props.tier],
               props.tier === undefined && css.noTier,
            )}
         >
            <img className={css.icon} src={props.iconUrl} alt={props.iconAlt} />
            {props.level && <span className={css.level}>{props.level}</span>}
         </div>

         <div className={css.right}>
            <Heading>{props.heading}</Heading>

            {children}
         </div>
      </div>
   );
}
