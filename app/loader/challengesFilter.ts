import { parse } from "cookie";
import type { IChallengeFilter } from "@cgg/components/ChallengeManager/filterChallenges";
import { cookieNames } from "@cgg/config/config";

export type ChallengesLoaderLocation = "overview" | "profile";

export async function challengesLoader(
   request: Request,
   location: ChallengesLoaderLocation,
   client: boolean = false,
) {
   let filter: IChallengeFilter = {
      search: "",
      category: [],
      source: [],
      gameMode: [],
   };
   let cookie = null;
   if (!client) {
      cookie = request.headers.get("Cookie");
   } else {
      cookie = document.cookie;
   }
   if (cookie) {
      const cookiename =
         location === "overview"
            ? cookieNames.overviewChallengeFilter
            : cookieNames.profileChallengeFilter;
      const values = parse(cookie);
      if (values[cookiename]) {
         try {
            const parsed = JSON.parse(atob(values[cookiename] ?? "{}"));
            filter = {
               search: parsed.search ?? "",
               category: parsed.category ?? [],
               source: parsed.source ?? [],
               gameMode: parsed.gameMode ?? [],
            };
         } catch (e) {
            // ignore invalid cookie
         }
      }
   }

   return { filter };
}
