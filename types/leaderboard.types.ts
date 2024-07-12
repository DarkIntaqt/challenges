import { TierType } from "challenges/types/user.types";
import { type ServerBeautified, ServerRaw } from "challenges/utils/platform";
import { ThresholdType } from "./general.types";

export type LeaderboardWarning = "noLeaderboard" | "noApiSupport" | "reversed";

export interface LeaderboardChallenge {
   id: number;
   updated: number;
   title: {
      title: string;
      id: number;
      tier: ThresholdType;
   } | null;
   info: boolean;
   challenge: Challenge;
   parents: Parent[];
   stats: Stats$Thresholds & Stats$Percentiles;
   summoner: Partial<Record<ServerBeautified, SummonerTemp[]>>;
}

interface Challenge {
   id: number;
   state: string;
   name: string;
   description: string;
   descriptionShort: string;
   source: string;
   queueIds: number[];
   parent: number;
   capstone: boolean;
   reversed: boolean;
   leaderboard: boolean;
   thresholds: Thresholds;
   percentiles: Percentiles;
}

type Percentiles = Record<ThresholdType, number>;

type Thresholds = Partial<Record<ThresholdType, number | string>>;

interface Parent {
   id: number;
   name: string;
}

type RegionalThresholds = [string, string, string, string, string, string, string, string, string, string];
type Stats$Thresholds = Record<ServerRaw, RegionalThresholds>;
type Stats$Percentiles = Record<`percentiles-${ServerRaw}`, Percentiles>;

type SummonerTemp<
   RiotId = string,
   Points = number,
   ProfileIcon = number,
   AchievedTimestamp = number,
   IsVerified = number,
> = [RiotId, Points, ThresholdType, ProfileIcon, AchievedTimestamp, IsVerified];

export interface SummonerMapped {
   riotId: string;
   profileIcon: number;
   points: number;
   tier: TierType;
   achievedTimestamp: number;
   isVerified: number;
   region: ServerBeautified;
}

export interface ThresholdMapped {
   tier: ThresholdType;
   points: number | string;
   percentile: number;
}

export type SummonersMapped = Record<ServerBeautified, SummonerMapped[]>;
export type ThresholdsMapped = Record<ServerBeautified | "", ThresholdMapped[]>;
