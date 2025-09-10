import type { IChampionFullDTO } from "@cgg/utils/champions";
import { fetchApi } from "../api";
import { cdn, cdnData } from "../cdn";
import type { IChallengesFullDTO } from "../challenges";

export async function getStaticData(lang: string = "en-US", region: string = "euw1") {
   return await fetchApi<IChallengesFullDTO>(
      cdnData(`challenges/${lang}/${region}.json`),
   );
}

export async function getChampions(lang: string = "en-US") {
   return await fetchApi<IChampionFullDTO>(cdn(`data/${lang}/champion.json`, false));
}
