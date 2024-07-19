import { ThresholdType } from "./general.types";

export interface ChallengesFullDTO {
   challenges: Record<string, ChallengeDTO>;
   titles: Record<string, TitleDTO>;
}

export interface ChallengeDTO {
   id: string;
   name: string;
   description: string;
   descriptionShort: string;
   source: "CAP_INVENTORY" | "CHALLENGES" | "CLASH" | "EOGD" | "ETERNALS" | "RANKED" | "SUMMONER";
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
   capstoneId: string;
   gameMode: "aram" | "arena" | "bot" | "none" | "rift";
   canProgress: boolean;
}

declare interface RewardDTO {
   level: ThresholdType;
   rewardGroupId: string;
   rewardId: string;
   category: string | "TITLE";
   title?: string;
   quantity?: number;
}

export interface TitleDTO {
   name: string;
   type: "DEFAULT" | "EVENT" | "CHALLENGE" | "CHAMPION_MASTERY";
   id: string;
   challengeId?: string;
}

export interface LeaderboardDTO {
   id: number;
   timestamp: number;
   title: LeaderboardTitleDTO | null;
   text: string;
   challenge: ChallengeOldDTO;
   parents: ParentDTO[];
   stats: Record<string, string | Record<string, string>>;
   summoner: Record<string, (string | number)[]>;
}

interface ChallengeOldDTO {
   id: number;
   state: string;
   leaderboard: boolean;
   name: string;
   description: string;
   descriptionShort: string;
   source: string;
   queueIds: number[];
   capstone: boolean;
   reversed: boolean;
   thresholds: Record<ThresholdType, number>;
}

interface LeaderboardTitleDTO {
   title: string;
   id: number;
   tier: ThresholdType;
}

export interface ParentDTO {
   id: number;
   name: string;
}
