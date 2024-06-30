import { ChallengeDTO } from "./challenges.types";
import { TierType, UserChallengeDto } from "./user.types";

export type FilterCategory = "category" | "type" | "gamemode";
export type SortBy = "default" | "level" | "timestamp" | "percentile" | "levelup" | "az" | "za";
export type DisplayAs = "list" | "grid";

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
export interface FiltersApplied extends Record<FilterCategory, string[]> {
   sortBy: SortBy;
   hideCapstones: boolean;
   hideMaxedOut: boolean;
   masterThresholds: boolean;
}

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
   _canProgress: boolean;
}

export interface ChallengeHydrated extends ChallengeDTO {
   _parentId: string;
   _gameMode: string;
   _canProgress: boolean;
}
