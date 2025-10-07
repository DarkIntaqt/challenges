import type { IChallengeDTO } from "./challenges";
import type { IApiChallenge } from "./endpoints/types";
import { tierList } from "./suffixToTier";
import type { Tier } from "./tier";

export function getTier(challenge: IChallengeDTO, userData?: IApiChallenge): Tier {
   let tier: Tier = "MASTER";

   tierList.forEach((t) => {
      if (challenge.thresholds.hasOwnProperty(t)) {
         tier = t;
      }
   });

   if (userData) {
      if (challenge.thresholds.hasOwnProperty(userData.tier)) {
         tier = userData.tier;
      } else {
         return userData.tier;
      }
   }

   return tier;
}

export function getNextTier(
   tier: Tier,
   challenge: IChallengeDTO,
   includeCrown = false,
): Tier | "CROWN" {
   const index = tierList.indexOf(tier);
   if (index === tierList.length - 1) {
      if (includeCrown && challenge.thresholds.hasOwnProperty("CROWN")) {
         return "CROWN";
      }
      return tier;
   }
   for (let i = index + 1; i < tierList.length; i++) {
      if (challenge.thresholds.hasOwnProperty(tierList[i])) {
         return tierList[i];
      }
   }

   return tier;
}

export function getPosition(user: IApiChallenge, challenge: IChallengeDTO): number {
   if (!challenge.leaderboard) return 0;
   if (!user.position) return 0;

   if (user.challengeId === 302404) {
      console.log(user.position);
   }

   let position = user.position;

   let currentTier: Tier | "CROWN" = user.tier;

   while (currentTier !== "CROWN") {
      const nextTier = getNextTier(currentTier, challenge, true);
      if (currentTier === nextTier) break;

      if (challenge.thresholds[currentTier].playersInLevel) {
         position += challenge.thresholds[currentTier].playersInLevel!;
      }

      if (user.challengeId === 302404) {
         console.log(user.position);
      }

      currentTier = nextTier;
   }

   return position;
}
