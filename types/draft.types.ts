import { ChallengeDTO } from "./challenges.types";
import { TierType, UserChallengeDto } from "./user.types";

export type FilterCategory = "category" | "gamemode";
export type SortBy = "level" | "timestamp" | "percentile" | "levelup" | "az" | "za";

export interface FilterItem {
   category: FilterCategory;
   name: string;
   id: string;
   image: string;
}

export interface CurrentSeason {
   id: string;
   name: string;
   image: string;
}

export type FiltersMap = Record<FilterCategory, FilterItem[]>;
export type FiltersApplied = Record<FilterCategory, string[]>;

export type UserChallengesMap = Record<string, UserChallengeDto>;

export interface ChallengeEntry {
   id: string;
   name: string;
   description: string;
   tier: TierType;
   percentile: number;
   progress: number;
   achievedAt: number;
   tierNext: { threshold: number; tier: TierType };
   tierMaster: { threshold: number };
}

export interface ChallengeHydrated extends ChallengeDTO {
   _parentId: string;
   _type?: string;
   _gameMode: string;
   _canProgress: boolean;
}
