import { ChallengeDTO, TitleDTO } from "challenges/types/challenges.types";
import { TitleEntry, TitlesFiltersApplied, UserChallengesMap } from "challenges/types/draft.types";

export function titleFilter(
   challenges: ChallengeDTO[],
   titles: TitleDTO[],
   userChallenges: UserChallengesMap,
   filtersApplied: TitlesFiltersApplied,
   searchQuery: string,
): TitleEntry[] {
   const query = searchQuery.toLowerCase();

   return titles
      .filter(
         (title): title is TitleDTO & Required<Pick<TitleDTO, "challengeId">> =>
            !!title.challengeId && (!query || title.name.toLowerCase().includes(query)),
      )
      .map((title: TitleDTO & Required<Pick<TitleDTO, "challengeId">>) => {
         const challenge = challenges.find(
            (c) => c.id === title.challengeId && c.rewards?.find((r) => r?.category === "TITLE"),
         );
         const reward = challenge?.rewards?.find((r) => r?.category === "TITLE");
         return { title, challenge, reward };
      })
      .filter(({ challenge, reward }) => !!challenge && !!reward)
      .map(({ title, challenge, reward }) => {
         const userChallenge = userChallenges[title.challengeId];
         const progress = userChallenge?.value ?? 0;

         const threshold = challenge!.thresholds[reward!.level];
         const gap = progress >= threshold ? 0 : threshold - progress;

         return {
            id: title.id,
            challengeId: title.challengeId,
            name: title.name,
            description: challenge!.description,
            progress: progress,
            milestone: {
               threshold: threshold,
               gap: gap,
               tier: reward!.level,
            },
            _isUnlocked: gap === 0,
         } satisfies TitleEntry;
      })
      .sort((a: TitleEntry, b: TitleEntry) => {
         switch (filtersApplied.sortBy) {
            case "levelup":
               return (
                  // @ts-ignore // ts doesn't honor the boolean to number type coercion
                  a._isUnlocked - b._isUnlocked || // unlocked last
                  (a.milestone.gap === b.milestone.gap ? 0 : a.milestone.gap > b.milestone.gap ? 1 : -1) ||
                  a.name.localeCompare(b.name)
               );
            case "az":
               return a.name.localeCompare(b.name);
            case "za":
               return b.name.localeCompare(a.name);
            default:
               return (
                  // @ts-ignore // ts doesn't honor the boolean to number type coercion
                  b._isUnlocked - a._isUnlocked || // unlocked first
                  (a.milestone.gap === b.milestone.gap ? 0 : a.milestone.gap > b.milestone.gap ? 1 : -1) ||
                  a.name.localeCompare(b.name)
               );
         }
      });
}
