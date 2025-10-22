import { fetchApiPath } from "../api";
import type { IApiLeaderboardEntry } from "./types";

export async function getLeaderboard(challengeId: string, region?: string) {
   let path = `/leaderboard/${challengeId}`;
   if (region) {
      path += `?region=${region}`;
   }

   const response = await fetchApiPath<IApiLeaderboardEntry[]>(path);

   return response;
}
