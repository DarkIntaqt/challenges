import { fetchApi } from "../api";
import { cdnBase } from "../cdn";
import type { IChallengesFullDTO } from "../challenges";

export async function getStaticData(lang: string = "en-US") {
   const response = await fetchApi<IChallengesFullDTO>(
      cdnBase(`challenges/${lang}.json`, false),
   );

   return response;
}
