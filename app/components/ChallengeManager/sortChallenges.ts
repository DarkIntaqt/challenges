import type { IChallengeDTO } from "@cgg/utils/challenges";

export type SortMode = "Name-ASC" | "Name-DESC";

export function sortChallenges(
   challenges: IChallengeDTO[],
   mode: SortMode,
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
         challenges = challenges.sort((a, b) => b.name.localeCompare(a.name));
         break;
      default:
         break;
   }

   return challenges;
}
