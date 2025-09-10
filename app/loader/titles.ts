import { getChampions } from "@cgg/utils/endpoints/getStaticData";

export async function titleLoader() {
   const championData = await getChampions();

   if (championData === null) {
      throw new Response("Champion data unavailable", { status: 503 });
   }

   return { championData };
}
