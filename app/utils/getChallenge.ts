import type { IChallengeDTO, IChallengesFullDTO } from "./challenges";
import type { IApiChallengeResponse } from "./endpoints/types";
import type { Tier } from "./tier";

export function getChallenge(
   challengeId: string | number | null,
   data: IChallengesFullDTO,
): IChallengeDTO | null {
   if (!challengeId) {
      return null;
   }

   const challenges = data.challenges;

   const challenge = challenges[challengeId];
   if (!challenge) {
      return null;
   }

   return challenge;
}

interface IChallengeUserResponse extends IChallengeDTO {
   percentile?: number;
   tier: Tier;
   points: number;
   achievedTime?: number;
   position?: number;
   playersInLevel?: number;
}

export function getUserChallenge(
   challengeId: string | number | null,
   profile: IApiChallengeResponse,
   data: IChallengesFullDTO,
): IChallengeUserResponse | null {
   const challenge = getChallenge(challengeId, data);
   if (!challenge) {
      return null;
   }

   const userChallenge = profile.challenges.find((ch) => ch.challengeId === challengeId);
   if (!userChallenge) {
      return null;
   }

   return {
      ...challenge,
      ...userChallenge,
   };
}
