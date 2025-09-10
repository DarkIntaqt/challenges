import { storageNames } from "@cgg/config/config";

export interface RecentSummoner {
   type: "summoner";
   id: string;
   name: string;
   tagLine: string;
   icon: number;
}

export interface RecentChallenge {
   type: "challenge";
   id: number;
   iconId: number;
   name: string;
   description: string;
}

export type Recent = RecentSummoner | RecentChallenge;

const serverSide = typeof localStorage === "undefined";

export function getRecentSearches(noEmptyResults = true): Recent[] {
   if (serverSide) return [];

   const recents = localStorage.getItem(storageNames.recents);
   if (!recents) {
      if (!noEmptyResults) return [];

      return [
         {
            type: "summoner",
            id: "recent-summoner",
            name: "Hide on bush",
            tagLine: "KR1",
            icon: 6,
         },
         {
            type: "challenge",
            id: 0,
            iconId: 0,
            name: "Challenge Leaderboard",
            description: "",
         },
      ] as Recent[];
   }

   try {
      // wrong validation will throw an error, I assume
      return JSON.parse(recents) as Recent[];
   } catch (e) {
      console.error("Failed to parse recents from localStorage", e);
      return [];
   }
}

export function addRecentSearch(recent: Recent) {
   if (serverSide) return;
   const recents = getRecentSearches(false);

   // remove existing recent with same id
   const filteredRecents = recents.filter((r) => r.id !== recent.id);

   // add new recent to the front
   filteredRecents.unshift(recent);

   if (filteredRecents.length > 5) {
      filteredRecents.length = 5;
   }
   localStorage.setItem(storageNames.recents, JSON.stringify(filteredRecents));
}
