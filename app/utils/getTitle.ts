import type { IChallengesFullDTO, ITitleDTO } from "./challenges";
import { suffixToTier } from "./suffixToTier";
import type { Tier } from "./tier";

interface ITitleResponse extends ITitleDTO {
   tier: Tier;
}

export default function getTitle(
   titleId: string | number | null,
   data: IChallengesFullDTO,
): ITitleResponse | null {
   if (!titleId) {
      return null;
   }

   const titles = data.titles;

   const title = titles[titleId];
   if (!title) {
      return null;
   }

   let tier: Tier = "NONCHALLENGE";
   if (title.challengeId) {
      tier = suffixToTier(title.id.toString().replace(title.challengeId.toString(), ""));
   }

   return {
      ...title,
      tier,
   };
}
