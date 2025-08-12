import { getStaticData } from "@cgg/utils/endpoints/getStaticData";

export async function rootLoader() {
   const staticData = await getStaticData();

   if (staticData === null) {
      throw new Response("Static data unavailable", { status: 503 });
   }

   return { staticData: staticData };
}
