import { fetchCdnPath } from "../api";
import type { IApiLeaderboardEntry } from "./types";

export async function getLeaderboard(challengeId: string, region: string = "global") {
   let path = `cgg-data/leaderboards/${region}/${challengeId}.json`;

   const response = await fetchCdnPath<IApiLeaderboardEntry[]>(path);

   return response;
}
