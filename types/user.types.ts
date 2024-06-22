export interface CheckResponse {
   playerId: string;
   name: string;
   tag: string;
   level: number;
   icon: number;
}

export interface UserInfo extends CheckResponse {
   challenges: Array<[number, number, number, number, number, [number]]>;
   title: [number];
   selections: Array<[number, number]>;
}
