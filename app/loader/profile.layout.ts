import { getChallenges } from "@cgg/utils/endpoints/getChallenges";

export async function profileLayoutLoader({ params }: { params: { profile: string } }) {
   const { profile } = params;
   const nameSections = profile.split("-", 2);

   if (nameSections.length !== 2) {
      throw new Response("Bad Request", {
         status: 400,
         statusText: "Invalid profile format",
      });
   }

   const [gameName, tagLine] = nameSections;

   const challengeData = await getChallenges(gameName, tagLine);
   if (challengeData === null) {
      throw new Response("Not Found", {
         status: 404,
         statusText: "Profile not found",
      });
   }

   return await challengeData;
}
