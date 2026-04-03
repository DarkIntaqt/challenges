import { get } from "http";
import type { IChallengeDTO } from "@cgg/utils/challenges";
import type { IApiChallenge } from "@cgg/utils/endpoints/types";
import type { Tier } from "@cgg/utils/tier";

const tierList: Tier[] = [
   "IRON",
   "BRONZE",
   "SILVER",
   "GOLD",
   "PLATINUM",
   "DIAMOND",
   "MASTER",
   "GRANDMASTER",
   "CHALLENGER",
];

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
   target?: Tier | "CROWN",
): Tier | "CROWN" {
   if (target) {
      return getClosestTier(target, challenge);
   }

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

function getClosestTier(
   idealTier: Tier | "CROWN",
   challenge: IChallengeDTO,
): Tier | "CROWN" {
   if (challenge.thresholds.hasOwnProperty(idealTier)) {
      return idealTier;
   }

   const index = getTierIndex(idealTier);
   for (let i = index - 1; i >= 0; i--) {
      if (challenge.thresholds.hasOwnProperty(tierList[i])) {
         return tierList[i];
      }
   }

   return "NONE";
}

export function getPosition(user: IApiChallenge, challenge: IChallengeDTO): number {
   if (!challenge.leaderboard) return 0;
   if (!user.position) return 0;

   let position = user.position;

   let currentTier: Tier | "CROWN" = user.tier;

   while (currentTier !== "CROWN") {
      const nextTier = getNextTier(currentTier, challenge, true);
      if (currentTier === nextTier) break;

      if (challenge.thresholds[currentTier].playersInLevel) {
         position += challenge.thresholds[currentTier].playersInLevel!;
      }

      currentTier = nextTier;
   }

   return position;
}

/**
 * Gets the index of a given tier. If the tier is "CROWN", it returns the length of the tier list.
 * If the tier is undefined, it returns -2.
 * If the tier is not found in the list, it returns -1.
 * @param tier Challenge tier
 * @returns Ordinal identifier of the tier
 */
export function getTierIndex(tier: Tier | "CROWN" | undefined): number {
   if (!tier) return -2;
   if (tier === "CROWN") return tierList.length;
   return tierList.indexOf(tier) || -1;
}

export { tierList };
