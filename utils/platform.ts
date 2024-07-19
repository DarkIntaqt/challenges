export const serversRaw = [
   "br1",
   "euw", // "euw1", // "euw1" returns a 400 response
   "eun1",
   "jp1",
   "kr",
   "la1", // LatAm-North
   "la2", // LatAm-South
   "me1",
   "na1",
   "oc1",
   "ph2",
   "ru",
   "sg2",
   "th2",
   "tr1",
   "tw2",
   "vn2",
] as const;
export type ServerRaw = (typeof serversRaw)[number];

export const serversBeautified = [
   "br",
   "euw",
   "eune",
   "jp",
   "kr",
   "lan",
   "las",
   "me",
   "na",
   "oc",
   "ph",
   "ru",
   "sg",
   "th",
   "tr",
   "tw",
   "vn",
] as const;
export type ServerBeautified = (typeof serversBeautified)[number];

export default function getPlatform(server: ServerBeautified): string {
   const ix = serversBeautified.indexOf(server);
   return ix === -1 ? server : serversRaw[ix];
}

export function beautifyServer(server: ServerRaw): string {
   const ix = serversRaw.indexOf(server);
   return ix === -1 ? server : serversBeautified[ix];
}
