import { ServerBeautified, serversBeautified } from "./platform";

export function fixRegionPretty(region?: string): ServerBeautified | "" {
   const ix = serversBeautified.indexOf(region as ServerBeautified);
   return ix === -1 ? "" : (region as ServerBeautified);
}
