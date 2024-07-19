"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

import { ChallengeRouteParams } from "challenges/types/challenges-navigation.types";
import { fixRegionPretty } from "challenges/utils/leaderboardRegions";
import { serversBeautified } from "challenges/utils/platform";

import css from "challenges/styles/leaderboard.module.scss";

export default function ChallengeRegions({ params }: { params: ChallengeRouteParams }): ReactNode {
   const searchParams = useSearchParams();
   const region = fixRegionPretty(searchParams.get("region") ?? "");

   return (
      <div className={css.regionsBar}>
         <Link href={`/challenges/${params.challengeId}`} className={"" === region ? css.active : ""}>
            {"Global"}
         </Link>
         {serversBeautified.map((server) => (
            <Link
               key={server}
               href={`/challenges/${params.challengeId}?region=${server}`}
               className={server === region ? css.active : ""}
            >
               {server.toUpperCase()}
            </Link>
         ))}
      </div>
   );
}
