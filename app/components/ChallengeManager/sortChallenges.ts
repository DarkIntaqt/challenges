import type { IChallengeDTO } from "@cgg/utils/challenges";
import type { IApiChallenge } from "@cgg/utils/endpoints/types";
import { getNextTier, getTierIndex } from "@cgg/utils/getTier";

export type SortMode =
   | "Name-ASC"
   | "Name-DESC"
   | "Rank"
   | "Last Updated"
   | "Position"
   | "Levelup";

// TODO: Maps would probably be more efficient here
export function sortChallenges(
   challenges: IChallengeDTO[],
   mode: SortMode,
   userChallenges?: IApiChallenge[],
): IChallengeDTO[] {
   switch (mode) {
      case "Name-ASC":
         challenges = challenges.sort((a, b) => {
            if (a.retired && !b.retired) return 1;
            if (!a.retired && b.retired) return -1;

            return a.name.localeCompare(b.name);
         });
         break;
      case "Name-DESC":
         challenges = challenges.sort((a, b) => {
            if (a.retired && !b.retired) return 1;
            if (!a.retired && b.retired) return -1;

            return b.name.localeCompare(a.name);
         });
         break;

      case "Rank":
         // When this filter - for whatever reason - gets selected on a non-user page
         if (!userChallenges) {
            return sortChallenges(challenges, "Name-ASC");
         }
         challenges = challenges.sort((a, b) => {
            if (a.retired && !b.retired) return 1;
            if (!a.retired && b.retired) return -1;

            const userChallengeA = userChallenges.find((uc) => uc.challengeId === a.id);
            const userChallengeB = userChallenges.find((uc) => uc.challengeId === b.id);
            const tierA = getTierIndex(userChallengeA?.tier);
            const tierB = getTierIndex(userChallengeB?.tier);

            // sort by tier first, then by percentile
            if (tierA !== tierB) return tierB - tierA;

            return (userChallengeA?.percentile || 0) - (userChallengeB?.percentile || 0);
         });
         break;

      case "Last Updated":
         // When this filter - for whatever reason - gets selected on a non-user page
         if (!userChallenges) {
            return sortChallenges(challenges, "Name-ASC");
         }
         challenges = challenges.sort((a, b) => {
            if (a.retired && !b.retired) return 1;
            if (!a.retired && b.retired) return -1;

            const userChallengeA = userChallenges.find((uc) => uc.challengeId === a.id);
            const userChallengeB = userChallenges.find((uc) => uc.challengeId === b.id);

            if (userChallengeA && userChallengeB) {
               return (
                  new Date(userChallengeB.achievedTime || 0).getTime() -
                  new Date(userChallengeA.achievedTime || 0).getTime()
               );
            }

            if (userChallengeA && !userChallengeB) return -1;
            if (!userChallengeA && userChallengeB) return 1;
            return 0;
         });
         break;

      case "Position":
         // When this filter - for whatever reason - gets selected on a non-user page
         if (!userChallenges) {
            return sortChallenges(challenges, "Name-ASC");
         }
         challenges = challenges.sort((a, b) => {
            if (a.retired && !b.retired) return 1;
            if (!a.retired && b.retired) return -1;

            const userChallengeA = userChallenges.find((uc) => uc.challengeId === a.id);
            const userChallengeB = userChallenges.find((uc) => uc.challengeId === b.id);

            if (userChallengeA && userChallengeB) {
               const positionA = userChallengeA.position || 0;
               const positionB = userChallengeB.position || 0;

               // A validation check with <= 0 is necessary, as it is not uncommon for the API to return negative positions
               if (positionA > 0 && positionB <= 0) return -1;
               if (positionA <= 0 && positionB > 0) return 1;
               if (positionA <= 0 && positionB <= 0) return 0;
               return (positionA as number) - (positionB as number);
            }

            if (userChallengeA && !userChallengeB) return -1;
            if (!userChallengeA && userChallengeB) return 1;
            return 0;
         });

         break;

      case "Levelup":
         // When this filter - for whatever reason - gets selected on a non-user page
         if (!userChallenges) {
            return sortChallenges(challenges, "Name-ASC");
         }
         challenges = challenges.sort((a, b) => {
            if (a.retired && !b.retired) return 1;
            if (!a.retired && b.retired) return -1;

            const userChallengeA = userChallenges.find((uc) => uc.challengeId === a.id);
            const userChallengeB = userChallenges.find((uc) => uc.challengeId === b.id);
            if (userChallengeA && !userChallengeB) return -1;
            if (!userChallengeA && userChallengeB) return 1;
            if (!userChallengeA && !userChallengeB) return 0;

            const currentValueA = userChallengeA!.value;
            const nextValueA =
               a.thresholds[getNextTier(userChallengeA!.tier, a, false)].points;
            const currentValueB = userChallengeB!.value;
            const nextValueB =
               b.thresholds[getNextTier(userChallengeB!.tier, b, false)].points;

            if (nextValueA === 0 && nextValueB === 0) return 0;
            if (nextValueA === 0) return -1;
            if (nextValueB === 0) return 1;

            const progressA = Math.min(currentValueA / nextValueA, 1);
            const progressB = Math.min(currentValueB / nextValueB, 1);

            // Already "maxed challenges" (progress >= 1) can be put at the back of the list
            if (progressA >= 1 && progressA === progressB) return 0;
            if (progressA >= 1 && progressB < 1) return 1;
            if (progressA < 1 && progressB >= 1) return -1;

            return progressB - progressA;
         });

         break;
      default:
         break;
   }

   return challenges;
}
