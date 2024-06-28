import { ThresholdType } from "challenges/types/challenges.types";
import {
   ChallengeEntry,
   ChallengeHydrated,
   FiltersApplied,
   SortBy,
   UserChallengesMap,
} from "challenges/types/draft.types";
import { TierType } from "challenges/types/user.types";

export function challengeFilter(
   challenges: ChallengeHydrated[],
   seasonPrevious: string,
   seasonsRetired: string[],
   userChallenges: UserChallengesMap,
   filtersApplied: FiltersApplied,
   sortingApplied: SortBy,
   searchQuery: string,
): ChallengeEntry[] {
   const retiredHidden = seasonsRetired.filter((sid) => sid !== seasonPrevious);
   const query = searchQuery.toLowerCase();

   function passCategory(challenge: ChallengeHydrated): boolean {
      if (challenge.tags.isCategory === "true") return false;
      if (filtersApplied.category.length === 0) return !retiredHidden.includes(challenge.name);
      return filtersApplied.category.includes(challenge._parentId);
   }

   function passGameMode(challenge: ChallengeHydrated): boolean {
      if (filtersApplied.gamemode.length === 0) return true;
      return filtersApplied.gamemode.includes(challenge._gameMode);
   }

   return challenges
      .filter(
         (challenge) =>
            passCategory(challenge) &&
            passGameMode(challenge) &&
            (!query || challenge.name.toLowerCase().includes(query)),
      )
      .map((challenge) => {
         const userChallenge = userChallenges[challenge.id];
         const currentTier = userChallenge?.tier ?? "NONE";
         const nextTier = getNextTier(currentTier);
         return {
            id: challenge.id,
            name: challenge.name,
            description: challenge.description,
            tier: currentTier,
            percentile: userChallenge?.percentile ?? 100,
            progress: userChallenge?.value ?? 0,
            achievedAt: userChallenge?.achievedTimestamp ?? 0,
            tierNext: {
               threshold:
                  challenge.thresholds[nextTier] ??
                  (currentTier === "NONE" ? 1 : challenge.thresholds[currentTier] ?? 1),
               tier: nextTier,
            },
            tierMaster: {
               threshold:
                  challenge.thresholds.MASTER ?? (currentTier === "NONE" ? 1 : challenge.thresholds[currentTier] ?? 1),
            },
         } satisfies ChallengeEntry;
      })
      .sort((a: ChallengeEntry, b: ChallengeEntry) => {
         switch (sortingApplied) {
            case "level":
               return 0;
            case "timestamp":
               return b.achievedAt - a.achievedAt;
            case "percentile":
               return a.percentile - b.percentile;
            case "levelup":
               return a.tierNext.threshold - a.progress - (b.tierNext.threshold - b.progress);
            case "az":
               return a.name.localeCompare(b.name);
            case "za":
               return b.name.localeCompare(a.name);
            default:
               return 0;
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
