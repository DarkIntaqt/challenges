import type { IChallengeDTO } from "@cgg/utils/challenges";
import type { IApiChallenge } from "@cgg/utils/endpoints/types";
import { getNextTier, getTierIndex } from "@cgg/utils/getTier";
import type { Tier } from "@cgg/utils/tier";

export type SortMode =
   | "Name-ASC"
   | "Name-DESC"
   | "Rank"
   | "Last Updated"
   | "Position"
   | "Levelup";

let index: Map<number, IApiChallenge>;
let targetTier: Tier | undefined = undefined;

export function sortChallenges(
   challenges: IChallengeDTO[],
   mode: SortMode,
   masterThresholdsActive: boolean,
   userChallenges: Map<number, IApiChallenge>,
): IChallengeDTO[] {
   index = new Map(userChallenges);
   targetTier = masterThresholdsActive ? "MASTER" : undefined;

   switch (mode) {
      // Fallthrough is intentional to sort by name if userChallenges is not available
      case "Rank":
         if (userChallenges.size > 0) {
            challenges.sort(sortByRank);
            break;
         }

      case "Last Updated":
         if (userChallenges.size > 0) {
            challenges.sort(sortByLastUpdated);
            break;
         }

      case "Position":
         if (userChallenges.size > 0) {
            challenges.sort(sortByPosition);
            break;
         }

      case "Levelup":
         if (userChallenges.size > 0) {
            challenges = challenges.sort(sortByLevelup);
            break;
         }

      case "Name-ASC":
         challenges.sort(sortByNameAsc);
         break;
      case "Name-DESC":
         challenges.sort(sortByNameDesc);
         break;

      default:
         console.warn(`Unknown sort mode: ${mode}`);
         break;
   }

   index.clear();
   return challenges;
}

function sortRetiredHelper(a: IChallengeDTO, b: IChallengeDTO): number | null {
   if (a.retired && !b.retired) return 1;
   if (!a.retired && b.retired) return -1;
   return null;
}

function sortByExistenceHelper(a: IChallengeDTO, b: IChallengeDTO): number | null {
   const userChallengeA = index.get(a.id);
   const userChallengeB = index.get(b.id);

   if (userChallengeA && !userChallengeB) return -1;
   if (!userChallengeA && userChallengeB) return 1;
   if (!userChallengeA && !userChallengeB) return 0;
   return null;
}

function sortByPercentileHelper(a: IChallengeDTO, b: IChallengeDTO) {
   const userChallengeA = index.get(a.id);
   const userChallengeB = index.get(b.id);

   const exists = sortByExistenceHelper(a, b);
   if (exists !== null) return exists;

   const percentileA = userChallengeA!.percentile || -1;
   const percentileB = userChallengeB!.percentile || -1;

   if (percentileA >= 0 && percentileB < 0) return -1;
   if (percentileA < 0 && percentileB >= 0) return 1;
   if (percentileA >= 0 && percentileB >= 0) {
      if (percentileA !== percentileB) {
         return percentileB - percentileA;
      }
      const res = sortByRankHelper(a, b);
      if (res !== 0) return res;
      return sortByPositionHelper(a, b);
   }

   return 0;
}

function sortByPositionHelper(a: IChallengeDTO, b: IChallengeDTO) {
   const userChallengeA = index.get(a.id);
   const userChallengeB = index.get(b.id);

   const exists = sortByExistenceHelper(a, b);
   if (exists !== null) return exists;

   const positionA: number = userChallengeA!.position || 0;
   const positionB: number = userChallengeB!.position || 0;

   // A validation check with <= 0 is necessary, as it is not uncommon for the API to return negative positions
   if (positionA > 0 && positionB <= 0) return -1;
   if (positionA <= 0 && positionB > 0) return 1;
   if (positionA > 0 && positionB > 0) {
      if (positionA !== positionB) {
         return positionA - positionB;
      }
   }
   return 0;
}

function sortByRankHelper(a: IChallengeDTO, b: IChallengeDTO) {
   const userChallengeA = index.get(a.id);
   const userChallengeB = index.get(b.id);
   const tierA = getTierIndex(userChallengeA?.tier);
   const tierB = getTierIndex(userChallengeB?.tier);

   // sort by tier first
   if (tierA !== tierB) return tierB - tierA;

   return 0;
}

function sortByNameAsc(a: IChallengeDTO, b: IChallengeDTO) {
   const retiredSort = sortRetiredHelper(a, b);
   if (retiredSort !== null) return retiredSort;

   return a.name.localeCompare(b.name);
}

function sortByNameDesc(a: IChallengeDTO, b: IChallengeDTO) {
   const retiredSort = sortRetiredHelper(a, b);
   if (retiredSort !== null) return retiredSort;

   return b.name.localeCompare(a.name);
}

function sortByRank(a: IChallengeDTO, b: IChallengeDTO) {
   const retiredSort = sortRetiredHelper(a, b);
   if (retiredSort !== null) return retiredSort;

   const res = sortByRankHelper(a, b);
   if (res !== 0) return res;
   return sortByPercentileHelper(a, b);
}

function sortByLastUpdated(a: IChallengeDTO, b: IChallengeDTO) {
   const retiredSort = sortRetiredHelper(a, b);
   if (retiredSort !== null) return retiredSort;

   const userChallengeA = index.get(a.id);
   const userChallengeB = index.get(b.id);

   const exists = sortByExistenceHelper(a, b);
   if (exists !== null) return exists;

   return (
      new Date(userChallengeB!.achievedTime || 0).getTime() -
      new Date(userChallengeA!.achievedTime || 0).getTime()
   );
}

function sortByPosition(a: IChallengeDTO, b: IChallengeDTO) {
   const retiredSort = sortRetiredHelper(a, b);
   if (retiredSort !== null) return retiredSort;

   const res = sortByPositionHelper(a, b);
   if (res !== 0) return res;

   return sortByPercentileHelper(a, b);
}

function sortByLevelup(a: IChallengeDTO, b: IChallengeDTO) {
   const retiredSort = sortRetiredHelper(a, b);
   if (retiredSort !== null) return retiredSort;

   const userChallengeA = index.get(a.id);
   const userChallengeB = index.get(b.id);

   const exists = sortByExistenceHelper(a, b);
   if (exists !== null) return exists;

   const currentValueA = userChallengeA!.value;
   const nextValueA =
      a.thresholds[getNextTier(userChallengeA!.tier, a, false, targetTier)].points;
   const currentValueB = userChallengeB!.value;
   const nextValueB =
      b.thresholds[getNextTier(userChallengeB!.tier, b, false, targetTier)].points;

   if (nextValueA === 0 && nextValueB === 0) return 0;
   if (nextValueA === 0) return -1;
   if (nextValueB === 0) return 1;

   const progressA = Math.min(currentValueA / nextValueA, 1);
   const progressB = Math.min(currentValueB / nextValueB, 1);

   // Already "maxed challenges" (progress >= 1) can be put at the back of the list
   if (progressA >= 1 && progressB >= 1) return sortByNameAsc(a, b);
   if (progressA >= 1 && progressB < 1) return 1;
   if (progressA < 1 && progressB >= 1) return -1;

   return progressB - progressA;
}
