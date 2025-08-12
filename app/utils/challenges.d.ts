import type { Tier } from "./tier";

type IChallengesFullDTO = {
   challenges: Record<string, IChallengeDTO>;
   titles: Record<string, ITitleDTO>;
};

type IChallengeDTO = {
   id: number;
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
};

type ITitleRewardDTO = {
   level: Tier;
   titleId: number;
   category: string;
   quantity?: number;
};

type ITitleDTO = {
   name: string;
   id: number;
   challengeId?: number;
   titleAcquisitionType: string;
   requirements?: {
      name: string;
      description: string;
   };
};

export type { IChallengesFullDTO, IChallengeDTO, ITitleRewardDTO, ITitleDTO };
