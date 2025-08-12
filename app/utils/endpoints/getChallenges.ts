import { fetchApiPath } from "../api";
import type { IApiChallengeResponse } from "./types";

export async function getChallenges(gameName: string, tagLine: string) {
   const response = await fetchApiPath<IApiChallengeResponse>(
      `/challenges/by-riot-id/${gameName}/${tagLine}`,
   );

   return response;
}
