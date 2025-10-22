import { getStaticData } from "@cgg/utils/endpoints/getStaticData";

// FIXME: this is stupid
export async function challengeLayoutLoader({
   params,
}: {
   params: { challengeId: string };
}) {
   const staticData = await getStaticData();
   if (staticData === null) {
      throw new Response("Static data unavailable", { status: 503 });
   }

   if (staticData.challenges[params.challengeId] === undefined) {
      throw new Response("Not Found", {
         status: 404,
         statusText: "Challenge not found",
      });
   }

   return;
}
