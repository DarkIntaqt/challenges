import { ReactNode } from "react";

import ChallengeHeading from "challenges/components/Challenge/ChallengeHeading";
import ChallengeRegions from "challenges/components/Challenge/ChallengeRegions";
import ChallengeService from "challenges/services/ChallengeService";
import { ChallengeRouteParams } from "challenges/types/challenges-navigation.types";
import { LeaderboardChallenge } from "challenges/types/leaderboard.types";
import { profileBackgroundImage } from "challenges/utils/cdnHelpers";

import css from "challenges/styles/leaderboard.module.scss";

export default async function LeaderboardLayout({
   children,
   params,
}: {
   children: ReactNode;
   params: ChallengeRouteParams;
}): Promise<ReactNode> {
   const { leaderboard } = await getData(params);

   return (
      <>
         <div className={css.bgImage} style={{ backgroundImage: `url(${profileBackgroundImage("MASTER")})` }}></div>

         <div className={css.leaderboard}>
            <ChallengeHeading leaderboard={leaderboard} />

            <ChallengeRegions params={params} />

            {children}
         </div>
      </>
   );
}

async function getData({ challengeId }: ChallengeRouteParams): Promise<ChallengeLayoutData> {
   const challengeService = new ChallengeService();
   const leaderboard = await challengeService.getById(parseInt(challengeId));

   if (!leaderboard) {
      throw new Error("Error loading leaderboard");
   }

   if (leaderboard.id === 0) {
      leaderboard.challenge.name = "Challenge Points Leaderboard";
      leaderboard.challenge.description = "Total challenge points gained by leveling up challenges";
   }

   return { leaderboard: leaderboard };
}

interface ChallengeLayoutData {
   leaderboard: LeaderboardChallenge;
}
