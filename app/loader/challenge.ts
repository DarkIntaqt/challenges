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

   const leaderboard = await getLeaderboard(challengeId, region);
   if (leaderboard === null) {
      throw new Response("Not Found", {
         status: 404,
         statusText: "Challenge not found",
      });
   }

   return { leaderboard };
}
