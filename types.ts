export interface ChallengesFull {
   challenges: Array<ChallengeDTO>;
   titles: Array<TitleDTO>;
}

export interface TitleDTO {
   title: string;
   titleId: number;
   challeneId: number;
   challengeTier: number;
}

export interface ChallengeDTO {
   id: number;
   state: "ENABLED" | "RETIRED" | "DISABLED";
   name: string;
   description: string;
   descriptionShort: string;
   source: string;
   queueIds: Array<number>;
   parent: number;
   capstone: boolean;
   reversed: boolean;
   leaderboard: boolean;

   thresholds: StatsDTO;
   percentiles: StatsDTO;
}


export interface StatsDTO {
   IRON?: number;
   BRONZE?: number;
   SILVER?: number;
   GOLD?: number;
   PLATINUM?: number;
   DIAMOND?: number;
   MASTER?: number;
   GRANDMASTER?: number;
   CHALLENGER?: number;
   UNRANKED?: number;
   NONE?: number;
}
