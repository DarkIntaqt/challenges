import type { Tier } from "./tier";

interface IChallengesFullDTO {
   challenges: Record<string, IChallengeDTO>;
   titles: Record<string, ITitleDTO>;
}

interface IChallengeDTO {
   id: number;
   iconId: number;
   name: string;
   description: string;
   descriptionShort: string;
   source: string;
   tags: {
      isCapstone?: string;
      isCategory?: string;
      parent?: number;
   };
   queueIds: number[];
   seasons: number[];
   endTimestamp?: number;
   thresholds: Record<Tier, number>;
   percentiles?: Record<Tier, number>;
   leaderboard: boolean;
   reverseDirection?: boolean;
   titles?: ITitleRewardDTO[];
   capstoneId: number;
   gameMode: string;
   retired: boolean;
}

interface ITitleRewardDTO {
   level: Tier;
   titleId: number;
   category: string;
   quantity?: number;
}

interface ITitleDTO {
   name: string;
   id: number;
   challengeId?: number;
   type: string;
   requirement?: {
      name: string;
      description: string;
   };
   icon?: string;
}

export type { IChallengesFullDTO, IChallengeDTO, ITitleRewardDTO, ITitleDTO };
