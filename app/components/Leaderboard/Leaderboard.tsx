import clsx from "clsx";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { Link } from "react-router";
import { usePageTransition } from "@cgg/hooks/usePageTransition";
import variables from "@cgg/styles/variables.module.scss";
import { capitalize } from "@cgg/utils/capitalize";
import { getProfileIcon } from "@cgg/utils/cdn";
import type { IChallengeDTO } from "@cgg/utils/challenges";
import type { IApiLeaderboardEntry } from "@cgg/utils/endpoints/types";
import { formatNumber } from "@cgg/utils/formatNumber";
import Heading from "../Heading/Heading";
import Loader from "../Loader/Loader";
import css from "./leaderboard.module.scss";

export default function Leaderboard({
   entries,
   challenge,
}: {
   entries: IApiLeaderboardEntry[];
   challenge: IChallengeDTO;
}) {
   const { transition } = usePageTransition();

   return (
      <div className={css.leaderboard}>
         <Heading level={2}>"{challenge.name}" Leaderboard</Heading>
         <div className={css.line} />
         <table className={css.table}>
            <thead className={css.head}>
               <tr>
                  <th className={css.position} scope="col">
                     Position
                  </th>
                  <th className={css.player} scope="col">
                     Summoner
                  </th>
                  <th className={css.tier} scope="col">
                     Tier
                  </th>
                  <th className={css.points} scope="col">
                     Points
                  </th>
               </tr>
            </thead>
            <tbody className={css.body}>
               {!transition &&
                  entries.map((entry, index) => (
                     <tr key={index} className={clsx(index % 2 === 1 && css.zebra)}>
                        <td className={css.position}>{index + 1}.</td>
                        <th className={css.player} scope="row">
                           <Link
                              to={`/profile/${entry.gameName}-${entry.tagLine}`}
                              prefetch="none"
                           >
                              <img
                                 src={getProfileIcon(entry.iconId)}
                                 alt=""
                                 loading="lazy"
                                 className={css.icon}
                              />
                              {entry.verified && (
                                 <span
                                    className={css.verifiedBadge}
                                    title="Verified Summoner"
                                 >
                                    <TbRosetteDiscountCheckFilled />
                                 </span>
                              )}
                              <p>
                                 {entry.gameName}#{entry.tagLine}
                                 <br />
                                 <span>{entry.region}</span>
                              </p>
                           </Link>
                        </th>
                        <td className={clsx(css.tier, variables[entry.tier])}>
                           {capitalize(entry.tier)}
                        </td>
                        <td className={css.points}>
                           {formatNumber(entry.points, false)}
                        </td>
                     </tr>
                  ))}
               {transition && (
                  <tr>
                     <td colSpan={4}>
                        <div className={css.loader}>
                           <Loader />
                           <p>Loading...</p>
                        </div>
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
   );
}
