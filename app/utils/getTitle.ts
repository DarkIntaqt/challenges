import type {
   IChallengeDTO,
   IChallengesFullDTO,
   ITitleDTO,
} from "./challenges";
import { suffixToTier } from "./suffixToTier";
import type { Tier } from "./tier";

interface ITitleResponse extends ITitleDTO {
   tier: Tier;
   challenge?: IChallengeDTO;
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
   let challenge: IChallengeDTO | undefined = undefined;
   if (title.challengeId) {
      challenge = data.challenges[title.challengeId];
      if (challenge) {
         const rewards = challenge.titles ?? [];

         const foundTitle = rewards.find((t) => t.titleId === title.id);
         if (foundTitle) {
            tier = foundTitle.level;
         }
      }
   }

   return {
      ...title,
      tier,
      challenge,
   };
}
