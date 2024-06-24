import { ThresholdType } from "challenges/types/challenges.types";

export type TierType = ThresholdType | "NONE";

export interface CheckResponse {
    playerId: string;
    name: string;
    tag: string;
    level: number;
    icon: number;
}

export interface UserInfo extends CheckResponse {
    playerId: string;
    name: string;
    tag: string;
    level: number;
    icon: number;
    region: string;
    points: UserPointsDto;
    preferences: UserPreferencesDto;
    challenges: UserChallengeDto[];
    categories: UserCategoryDto[];
}

interface UserPointsDto {
    tier: TierType;
    current: number;
    max: number;
    percentile: number;
}

interface UserPreferencesDto {
    displayed: number[];
    title: string;
}

interface UserChallengeDto {
    id: number;
    percentile: number;
    tier: TierType;
    value: number;
    achievedTimestamp?: number;
}

interface UserCategoryDto {
    name: string;
    tier: TierType;
    current: number;
    max: number;
    percentile: number;
}
