"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { faCircleExclamation, faGlobe, faPlugCircleXmark, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import HoverObject from "challenges/components/HoverObject";
import {
   LeaderboardWarning,
   SummonerMapped,
   SummonersMapped,
   ThresholdsMapped,
} from "challenges/types/leaderboard.types";
import { profileIcon } from "challenges/utils/cdnHelpers";
import { fixRegionPretty } from "challenges/utils/leaderboardRegions";
import { capitalize } from "challenges/utils/stringManipulation";

import css from "challenges/styles/boards.module.scss";

export default function ChallengeBoard({
   challengeName,
   warnings,
   thresholds,
   summoners,
}: ChallengeBoardProps): ReactNode {
   const searchParams = useSearchParams();
   const region = fixRegionPretty(searchParams.get("region") ?? "");

   const getSummoners = (): SummonerMapped[] => {
      if (region) {
         return summoners[region];
      }

      return Object.values(summoners)
         .flat()
         .sort((a, b) =>
            a.points === b.points ? 0 : b.points > a.points ? 1 : -1 || a.achievedTimestamp - b.achievedTimestamp,
         )
         .slice(0, 250);
   };

   return (
      <section>
         <div className={css.thresholds}>
            <div className={css.layer + " clearfix"}>
               <table className={css.table}>
                  <caption className={css.tCaption}>
                     <h2>Thresholds</h2>
                     <span>How many players have reached a tier</span>
                  </caption>
                  <thead>
                     <tr>
                        <th>Tier</th>
                        <th>Points</th>
                        <th>%</th>
                     </tr>
                  </thead>
                  <tbody>
                     {thresholds[region].map((threshold) => (
                        <tr key={threshold.tier} className={threshold.points === "-" ? css.unavailable : ""}>
                           <td className={threshold.points === "-" ? "" : threshold.tier}>{threshold.tier}</td>
                           <td>{threshold.points}</td>
                           <td>{threshold.percentile}%</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <div className={(warnings.length ? css.warnings : "") + " clearfix"}>
               {warnings.map((warning) => {
                  switch (warning) {
                     case "noLeaderboard":
                        return (
                           <HoverObject
                              key={warning}
                              hover={
                                 <div className={css.hover}>Leaderboards aren&apos;t enabled for this challenge.</div>
                              }
                           >
                              <FontAwesomeIcon icon={faCircleExclamation} color="var(--loss)" />
                           </HoverObject>
                        );
                     case "noApiSupport":
                        return (
                           <HoverObject
                              key={warning}
                              hover={
                                 <div className={css.hover}>
                                    This leaderboard is not API-supported. This means that the leaderboard will update
                                    slower than api supported ones and only consist of already known summoners. If you
                                    know another summoner who should be on this list, just look them up.
                                 </div>
                              }
                           >
                              <FontAwesomeIcon icon={faPlugCircleXmark} color="var(--perfect)" />
                           </HoverObject>
                        );
                     case "reversed":
                        return (
                           <HoverObject
                              key={warning}
                              hover={
                                 <div className={css.hover}>
                                    This challenge is reversed. The less your points you have the better your placement
                                    is.
                                 </div>
                              }
                           >
                              <FontAwesomeIcon icon={faSort} color="var(--win)" />
                           </HoverObject>
                        );
                  }
               })}
               {region && thresholds[region].every((th) => th.points === "-") ? (
                  <HoverObject
                     hover={<div className={css.hover}>This challenge isn&apos;t enabled in this region.</div>}
                  >
                     <FontAwesomeIcon icon={faGlobe} color="var(--light0)" />
                  </HoverObject>
               ) : null}
            </div>
         </div>

         <div className={css.parent}>
            <div className={css.layer + " clearfix"}>
               <table className={css.table}>
                  <caption className={css.tCaption}>
                     <h2>{`"${challengeName}" Leaderboard`}</h2>
                     <span>{region ? "Regional" : "Global"} Ranking</span>
                  </caption>
                  <thead>
                     <tr>
                        <th>Position</th>
                        <th>Summoner</th>
                        <th>Tier</th>
                        <th>Points</th>
                     </tr>
                  </thead>
                  <tbody>
                     {getSummoners().map((summoner, ix) => (
                        <tr key={summoner.riotId + summoner.achievedTimestamp}>
                           <td>{ix + 1}.</td>
                           <td>
                              <Link href={`/profile/${summoner.region}/${summoner.riotId.replace("#", "-")}`}>
                                 <Image
                                    src={profileIcon(summoner.profileIcon)}
                                    alt={`${summoner.riotId}'s profile image`}
                                    height={30}
                                    width={30}
                                    loading="lazy"
                                 />
                                 {summoner.riotId}
                                 {region ? null : <span>{summoner.region}</span>}
                              </Link>
                           </td>
                           <td className={summoner.tier}>{capitalize(summoner.tier)}</td>
                           <td>{summoner.points}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </section>
   );
}

interface ChallengeBoardProps {
   challengeName: string;
   warnings: LeaderboardWarning[];
   thresholds: ThresholdsMapped;
   summoners: SummonersMapped;
}
