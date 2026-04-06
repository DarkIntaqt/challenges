import cloneDeep from "clone-deep";
import type { M } from "vitest/dist/chunks/environment.d.cL3nLXbE.js";
import type { Category, GameMode, IChallengeDTO, Source } from "@cgg/utils/challenges";
import type { IApiChallenge } from "@cgg/utils/endpoints/types";
import { getNextTier, getTierIndex } from "@cgg/utils/getTier";

export type Modifications =
   | "points-only"
   | "master-thresholds"
   | "no-capstones"
   | "show-retired";

export interface IChallengeFilter {
   search: string;
   category: Category[];
   source: Source[];
   gameMode: GameMode[];
   modifications: Modifications[];
}

const MASTER_TIER_INDEX = getTierIndex("MASTER");

/**
 * Filters a list of challenges based on the given filter criteria and user challenges.
 * The array gets cloned before filtering to prevent mutating the original array.
 * @param challenges List of challenges to filter
 * @param filter List of filters to apply to these challenges
 * @param userChallenges Map of user challenges for further filtering
 * @returns List of all filtered challenges
 */
export function filterChallenges(
   challenges: IChallengeDTO[],
   filter: IChallengeFilter,
   userChallenges: Map<number, IApiChallenge>,
): IChallengeDTO[] {
   const { search, category, source, gameMode, modifications } = filter;
   const showRetired: boolean = modifications.includes("show-retired");
   const pointsOnly: boolean = modifications.includes("points-only");
   const noCapstones: boolean = modifications.includes("no-capstones");
   const searchTerms: string[] = search
      .split(",")
      .map((term) => term.trim().toLowerCase())
      .filter((term) => term.length > 0);

   return cloneDeep(
      challenges.filter((challenge) => {
         // remove retired first, either if requested or when points-only is enabled
         if ((!showRetired || pointsOnly) && challenge.retired) {
            return false;
         }

         if (noCapstones && challenge.tags.isCapstone === "Y") {
            return false;
         }

         if (pointsOnly) {
            // Remove legaccy
            if (challenge.categoryId === -1) return false;

            if (userChallenges.size > 0) {
               const userChallenge = userChallenges.get(challenge.id);
               if (userChallenge !== undefined) {
                  const tierId = getTierIndex(userChallenge.tier);
                  if (tierId >= MASTER_TIER_INDEX) {
                     return false;
                  }

                  if (getNextTier(userChallenge.tier, challenge) === userChallenge.tier) {
                     return false;
                  }
               }
            }
         }

         if (searchTerms.length > 0) {
            let found = false;
            // checks whether all results are excluded by default
            let purelyExclude = true;
            // checks whether a result was excluded, it can not be included again
            let breakAll = false;

            for (let term of searchTerms) {
               // whether to include or exclude search results
               let mode: "include" | "exclude" = "include";

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
            if (!category.includes(challenge.categoryId)) return;
         }

         if (gameMode.length > 0) {
            if (!gameMode.includes(challenge.gameMode)) return false;
         }

         if (source.length > 0) {
            if (!source.includes(challenge.source)) return false;
         }

         return true;
      }),
   );
}
