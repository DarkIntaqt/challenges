import { ThresholdType } from "challenges/types/challenges.types";
import {
   ChallengeEntry,
   ChallengeHydrated,
   ChallengesFiltersApplied,
   UserChallengesMap,
} from "challenges/types/draft.types";
import { TierType } from "challenges/types/user.types";

export function challengeFilter(
   challenges: ChallengeHydrated[],
   seasonPrevious: string,
   seasonsRetired: string[],
   userChallenges: UserChallengesMap,
   filtersApplied: ChallengesFiltersApplied,
   searchQuery: string,
): ChallengeEntry[] {
   const retiredHidden = seasonsRetired.filter((sid) => sid !== seasonPrevious);
   const query = searchQuery.toLowerCase();

   function passCategory(challenge: ChallengeHydrated): boolean {
      if (challenge.tags.isCategory === "true") return false;
      if (filtersApplied.category.length === 0) return !retiredHidden.includes(challenge._parentId);
      if (filtersApplied.category.includes("retired") && seasonsRetired.includes(challenge._parentId)) return true;
      return filtersApplied.category.includes(challenge._parentId);
   }

   function passType(challenge: ChallengeHydrated): boolean {
      if (filtersApplied.type.length === 0) return true;
      return filtersApplied.type.includes(challenge.source);
   }

   function passGameMode(challenge: ChallengeHydrated): boolean {
      if (filtersApplied.gamemode.length === 0) return true;
      return filtersApplied.gamemode.includes(challenge._gameMode);
   }

   return challenges
      .filter(
         (challenge) =>
            passCategory(challenge) &&
            passType(challenge) &&
            passGameMode(challenge) &&
            (!filtersApplied.hideCapstones || challenge.tags.isCapstone !== "Y") &&
            (!query || challenge.name.toLowerCase().includes(query)),
      )
      .map((challenge) => {
         const userChallenge = userChallenges[challenge.id];
         const progress = userChallenge?.value ?? 0;
         const currentTier = userChallenge?.tier ?? "NONE";

         const nextTier = getNextTier(currentTier);
         const nextThreshold =
            challenge.thresholds[nextTier] ?? (currentTier === "NONE" ? 1 : challenge.thresholds[currentTier] ?? 1);
         const nextGap = progress >= nextThreshold ? 0 : nextThreshold - progress;

         const masterThreshold =
            challenge.thresholds.MASTER ?? (currentTier === "NONE" ? 1 : challenge.thresholds[currentTier] ?? 1);
         // const masterGap = progress >= masterThreshold ? 0 : masterThreshold - progress;

         return {
            id: challenge.id,
            name: challenge.name,
            description: challenge.description,
            tier: currentTier,
            percentile: userChallenge?.percentile ?? 100,
            progress: progress,
            achievedAt: userChallenge?.achievedTimestamp ?? 0,
            tierNext: { threshold: nextThreshold, gap: nextGap, tier: nextTier },
            tierMaster: { threshold: masterThreshold },
            _tierInt: tierTypes.indexOf(currentTier),
            _canProgress: challenge._canProgress && currentTier !== nextTier,
         } satisfies ChallengeEntry;
      })
      .filter((challenge: ChallengeEntry) => !filtersApplied.hideMaxedOut || challenge._canProgress)
      .sort((a: ChallengeEntry, b: ChallengeEntry) => {
         switch (filtersApplied.sortBy) {
            case "level":
               return 0;
            case "timestamp":
               return b.achievedAt - a.achievedAt;
            case "percentile":
               return a.percentile - b.percentile;
            case "levelup":
               return (
                  (a.tierNext.gap === b.tierNext.gap ? 0 : a.tierNext.gap > b.tierNext.gap ? 1 : -1) ||
                  a.name.localeCompare(b.name)
               );
            case "az":
               return a.name.localeCompare(b.name);
            case "za":
               return b.name.localeCompare(a.name);
            default:
               return (
                  (b._tierInt === a._tierInt ? 0 : b._tierInt > a._tierInt ? 1 : -1) || // highest first
                  (a.percentile === b.percentile ? 0 : a.percentile > b.percentile ? 1 : -1) || // least first
                  a.name.localeCompare(b.name)
               );
         }
      });
}

const tierTypes: TierType[] = [
   "NONE",
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

function getNextTier(currentTier: TierType): ThresholdType {
   if (currentTier === "CHALLENGER") return "CHALLENGER";
   return tierTypes[tierTypes.indexOf(currentTier) + 1] as ThresholdType; // "NONE" wouldn't be returned
}
