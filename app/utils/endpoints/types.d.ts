import type { Tier } from "../tier";

export interface IApiAccountResponse {
   id: string;
   gameName: string;
   tagLine: string;
   region: string;
}

interface IApiProfileSummoner {
   profileIcon: number;
   level: number;
}

export interface IApiProfileResponse extends IApiAccountResponse {
   summoner: IApiProfileSummoner;
}

interface IApiChallengeSummoner extends IApiProfileSummoner {
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

export interface IApiVerifiedResponse {}

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
