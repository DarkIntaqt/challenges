import { ChallengeDTO } from "./challenges.types";
import { TierType, UserChallengeDto } from "./user.types";

export type FilterCategory = "category" | "type" | "gamemode";
export type DisplayAs = "list" | "grid";

export type ChallengesSortBy = "default" | "level" | "timestamp" | "percentile" | "levelup" | "az" | "za";
export type TitlesSortBy = "default" | "levelup" | "az" | "za";

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

export type ChallengesFiltersMap = Record<FilterCategory, FilterItem[]>;
export interface ChallengesFiltersApplied extends Record<FilterCategory, string[]> {
   sortBy: ChallengesSortBy;
   hideCapstones: boolean;
   hideMaxedOut: boolean;
   masterThresholds: boolean;
}

export interface TitlesFiltersApplied {
   sortBy: TitlesSortBy;
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
   tierNext: { threshold: number; gap: number; tier: TierType };
   tierMaster: { threshold: number };
   _tierInt: number;
   _canProgress: boolean;
}

export interface ChallengeHydrated extends ChallengeDTO {
   _parentId: string;
   _gameMode: string;
   _canProgress: boolean;
}

export interface TitleEntry {
   id: string;
   challengeId: string;
   name: string;
   description: string;
   progress: number;
   milestone: { threshold: number; gap: number; tier: TierType };
   _isUnlocked: boolean;
}
