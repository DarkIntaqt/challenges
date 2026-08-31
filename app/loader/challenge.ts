import regions from "@cgg/config/json/regions.json";
import { getLeaderboard } from "@cgg/utils/endpoints/getLeaderboard";

export async function challengeLoader({
   params,
   url,
}: {
   params: { challengeId: string };
   url: string;
}) {
   const { challengeId } = params;
   const searchParams = new URL(url).searchParams;
   const region = searchParams.get("region") || undefined;

   if (region !== undefined && !regions.some((r) => r.key === region)) {
      throw new Response("Bad Request", {
         status: 400,
         statusText: "Invalid region",
      });
   }

   const leaderboard = await getLeaderboard(challengeId, region);
   if (leaderboard === null) {
      throw new Response("Not Found", {
         status: 404,
         statusText: "Challenge not found",
      });
   }

   return { leaderboard };
}
