import type { Tier } from "./tier";

export const gameModes = ["rift", "aram", "arena", "bot", "swarm", "none"] as const;
export type GameMode = (typeof gameModes)[number];

export function gameModeToString(gamemode: GameMode): string {
   switch (gamemode) {
      case "rift":
         return "Summoner's Rift";
      case "aram":
         return "ARAM";
      case "arena":
         return "Arena";
      case "bot":
         return "Co-op vs. AI";
      case "swarm":
         return "Swarm";
      case "none":
         return "None";
      default:
         return gamemode;
   }
}

export const sources = [
   "CHALLENGES",
   "EOGD",
   "CLASH",
   "ETERNALS",
   "CAP_INVENTORY",
   "SUMMONER",
   "RANKED",
] as const;
export type Source = (typeof sources)[number];

export const categories = [1, 2, 3, 4, 5, -1] as const;
export type Category = (typeof categories)[number];

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
   source: Source;
   tags: {
      isCapstone?: string;
      isCategory?: string;
      parent?: number | string;
   };
   queueIds: number[];
   seasons: number[];
   endTimestamp?: number;
   thresholds: Record<Tier | "CROWN", IThresholdDTO>;
   percentiles?: Record<Tier, number>;
   leaderboard: boolean;
   reverseDirection?: boolean;
   titles?: ITitleRewardDTO[];
   categoryId: number;
   gameMode: GameMode;
   retired: boolean;
}

interface IThresholdDTO {
   points: number;
   playersInLevel?: number;
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
