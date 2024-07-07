import { ReactNode } from "react";

import ChallengeBoard from "challenges/components/Challenge/ChallengeBoard";
import ChallengeService from "challenges/services/ChallengeService";
import { ChallengeRouteParams } from "challenges/types/challenges-navigation.types";
import { ThresholdType } from "challenges/types/general.types";
import {
   LeaderboardChallenge,
   LeaderboardWarning,
   SummonerMapped,
   SummonersMapped,
   ThresholdsMapped,
} from "challenges/types/leaderboard.types";
import { tierTypes } from "challenges/utils/challengeFilter";
import getPlatform, { ServerRaw, serversBeautified } from "challenges/utils/platform";

export default async function LeaderboardGlobal({ params }: { params: ChallengeRouteParams }): Promise<ReactNode> {
   const { leaderboard, warnings, thresholds, summoners } = await getData(params);

   return (
      <ChallengeBoard
         challengeName={leaderboard.challenge.name}
         warnings={warnings}
         thresholds={thresholds}
         summoners={summoners}
      ></ChallengeBoard>
   );
}

async function getData({ challengeId }: ChallengeRouteParams): Promise<LeaderboardData> {
   const challengeService = new ChallengeService();
   const leaderboard = await challengeService.getById(parseInt(challengeId));

   if (!leaderboard) {
      throw new Error("Error loading leaderboard");
   }

   if (leaderboard.id === 0) {
      leaderboard.challenge.name = "Challenge Points Leaderboard";
      leaderboard.challenge.description = "Total challenge points gained by leveling up challenges";
   }

   const warnings: LeaderboardWarning[] = [];
   if (leaderboard.challenge.reversed) {
      warnings.push("reversed");
   }
   if (!leaderboard.challenge.leaderboard) {
      warnings.push(leaderboard.challenge.state === "ENABLED" ? "noApiSupport" : "noLeaderboard");
   }

   const thresholds: ThresholdsMapped = {} as ThresholdsMapped;
   const summoners: SummonersMapped = {} as SummonersMapped;

   thresholds[""] = [];
   for (let ix = 1; ix < 10; ix++) {
      const tier = tierTypes[ix] as ThresholdType;
      thresholds[""].unshift({
         tier: tier,
         points: leaderboard.challenge.thresholds[tier] ?? "-",
         percentile: leaderboard.challenge.percentiles[tier],
      });
   }

   for (const region of serversBeautified) {
      thresholds[region] = [];

      const serverRaw = getPlatform(region) as ServerRaw;
      for (let ix = 1; ix < 10; ix++) {
         const tier = tierTypes[ix] as ThresholdType;
         thresholds[region].unshift({
            tier: tier,
            points: leaderboard.stats[serverRaw]?.[ix] ?? "-",
            percentile: leaderboard.stats[`percentiles-${serverRaw}`]?.[tier] ?? 0,
         });
      }

      summoners[region] = (leaderboard.summoner[region] || []).map(
         (summoner): SummonerMapped => ({
            riotId: summoner[0],
            profileIcon: summoner[3],
            points: summoner[1],
            tier: tierTypes[tierTypes.indexOf(summoner[2]) - 1],
            achievedTimestamp: summoner[4],
            isVerified: summoner[5],
            region: region,
         }),
      );
   }

   return {
      leaderboard: leaderboard,
      warnings: warnings,
      thresholds: thresholds,
      summoners: summoners,
   };
}

interface LeaderboardData {
   leaderboard: LeaderboardChallenge;
   warnings: LeaderboardWarning[];
   thresholds: ThresholdsMapped;
   summoners: SummonersMapped;
}
