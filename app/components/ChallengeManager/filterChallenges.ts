import type { Category, GameMode, IChallengeDTO, Source } from "@cgg/utils/challenges";

export interface IChallengeFilter {
   search: string;
   category: Category[];
   source: Source[];
   gameMode: GameMode[];
}

export function filterChallenges(
   challenges: IChallengeDTO[],
   filter: IChallengeFilter,
): IChallengeDTO[] {
   return challenges.filter((challenge) => {
      const { search, category, source, gameMode } = filter;

      if (search.length > 0) {
         let found = false;
         // checks whether all results are excluded by default
         let purelyExclude = true;
         // checks whether a result was excluded, it can not be included again
         let breakAll = false;

         const split = search.split(",");
         for (let i = 0; i < split.length; i++) {
            // whether to include or exclude search results
            let mode: "include" | "exclude" = "include";
            let term = split[i].trim().toLowerCase();

            if (term.startsWith("-")) {
               mode = "exclude";
               term = term.slice(1).trim();
            }

            if (mode === "include" && term.length > 0) {
               purelyExclude = false;
            }

            if (
               term !== "" &&
               (challenge.name.toLowerCase().search(term) >= 0 ||
                  challenge.id.toString() == term ||
                  challenge.description.toLowerCase().search(term) >= 0 ||
                  challenge.descriptionShort.toLowerCase().search(term) >= 0)
            ) {
               if (mode === "exclude") {
                  breakAll = true;
               }
               found = true;
            }
         }

         if ((!found && !purelyExclude) || breakAll) return false;
      }

      if (category.length > 0) {
         let found = false;
         for (let i = 0; i < category.length; i++) {
            if (challenge.categoryId === category[i]) {
               found = true;
               break;
            }
         }
         if (!found) return false;
      }

      if (gameMode.length > 0) {
         let found = false;
         for (let i = 0; i < gameMode.length; i++) {
            if (challenge.gameMode === gameMode[i]) {
               found = true;
               break;
            }
         }
         if (!found) return false;
      }

      if (source.length > 0) {
         let found = false;
         for (let i = 0; i < source.length; i++) {
            if (challenge.source === source[i]) {
               found = true;
               break;
            }
         }
         if (!found) return false;
      }

      return true;
   });
}
