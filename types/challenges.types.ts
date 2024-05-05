export type ThresholdType = "IRON" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "MASTER" | "GRANDMASTER" | "CHALLENGER";

export interface ChallengesFullDTO {
   challenges: Record<string, ChallengeDTO>;
   titles: Record<string, TitleDTO>;
}

export interface ChallengeDTO {
   id: string;
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
   thresholds: Record<ThresholdType, number>;
   percentiles?: Record<ThresholdType, number>;
   leaderboard: boolean;
   reverseDirection?: boolean;
   rewards?: (RewardDTO | undefined)[];
}

declare interface RewardDTO {
   level: ThresholdType;
   rewardGroupId: string;
   rewardId: string;
   category: string;
   title?: string;
   quantity?: number;
}

export interface TitleDTO {
   name: string;
   type: "DEFAULT" | "EVENT" | "CHALLENGE";
}