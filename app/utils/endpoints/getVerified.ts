import { fetchApiPath } from "../api";
import type { IApiVerified, IApiVerifiedResponse } from "./types";

export async function getVerifiedProfile(puuid: string) {
   const response = await fetchApiPath<IApiVerifiedResponse>(`/v1/verified/${puuid}`);

   const result = {
      verified: response?.verified ?? false,
      beta: response?.beta ?? false,
   } as IApiVerified;

   return result;
}
