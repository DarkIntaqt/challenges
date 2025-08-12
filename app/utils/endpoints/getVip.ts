import { fetchApiPath } from "../api";
import type { IApiVerifiedResponse } from "./types";

export async function getProfile(puuid: string) {
   const response = await fetchApiPath<IApiVerifiedResponse>(`/verified/${puuid}`);

   return response;
}
