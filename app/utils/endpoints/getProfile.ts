import { fetchApiPath } from "../api";
import type { IApiProfileResponse } from "./types";

export async function getProfile(gameName: string, tagLine: string) {
   const response = await fetchApiPath<IApiProfileResponse>(
      `/summoner/by-riot-id/${gameName}/${tagLine}`,
   );

   return response;
}
