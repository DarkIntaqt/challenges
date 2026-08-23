import type { Tier } from "../tier";
import { IApiVerifiedResponse } from "./types.d";

export interface IApiProfileResponse {
   id: string;
   gameName: string;
   tagLine: string;
   region: string;
   summonerIconId: number;
   summonerLevel: number;
}

interface IApiChallengeSummoner {
   tier: Tier;
   totalPoints: number;
   percentile: number;
   title: string | null;
   displayedChallenges?: number[];
}

interface IApiChallenge {
   challengeId: number;
   percentile: number;
   tier: Tier;
   value: number;
   achievedTime?: number;
   position?: number;
   playersInLevel?: number;
}

export interface IApiChallengeResponse extends IApiProfileResponse {
   summoner: IApiChallengeSummoner;
   challenges: IApiChallenge[];
}

export interface IApiVerifiedResponse {
   id: string;
   verified: boolean;
   beta?: boolean;
}

export interface IApiVerified {
   verified: boolean;
   beta: boolean;
}

export interface IApiLeaderboardEntry {
   puuid: string;
   gameName: string;
   tagLine: string;
   region: string;
   iconId: number;
   tier: Tier;
   verified?: boolean;
   points: number;
}
