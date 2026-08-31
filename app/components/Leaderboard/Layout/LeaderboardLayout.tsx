import clsx from "clsx";
import { Link, useSearchParams } from "react-router";
import Container from "@cgg/components/Container/Container";
import { SiteHeader } from "@cgg/components/SiteHeader/SiteHeader";
import regions from "@cgg/config/json/regions.json";
import type { RegionsJSON } from "@cgg/config/json/regions.types";
import { getChallengeIcon } from "@cgg/utils/cdn";
import type { IChallengeDTO } from "@cgg/utils/challenges";
import css from "./leaderboard.layout.module.scss";

export default function LeaderboardLayout({
   children,
   challenge,
}: {
   children: React.ReactNode;
   challenge: IChallengeDTO;
}) {
   // check if query param is current one
   const [queryParams] = useSearchParams();
   const queriedRegions = queryParams.getAll("region");

   return (
      <Container center className={css.container}>
         <SiteHeader
            props={{
               iconUrl: getChallengeIcon(challenge.iconId),
               iconAlt: `${challenge.name} icon`,
               heading: challenge.name,
            }}
         >
            <p className={css.description}>{challenge.description}</p>
         </SiteHeader>

         <div className={css.grid}>
            <div className={css.challengeInfo}>Placeholder</div>
            <div className={css.leaderboard}>
               <div className={css.regionLinks}>
                  <Link
                     to={`?`}
                     className={clsx(
                        css.regionLink,
                        queriedRegions.length === 0 && css.active,
                     )}
                  >
                     global
                  </Link>
                  {(regions as RegionsJSON).map((region) => (
                     <Link
                        key={region.key}
                        to={`?region=${region.key}`}
                        className={clsx(
                           css.regionLink,
                           queriedRegions.includes(region.key) && css.active,
                        )}
                     >
                        {region.abbreviation.toLowerCase()}
                     </Link>
                  ))}
               </div>
               {children}
            </div>
         </div>
      </Container>
   );
}
