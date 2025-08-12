import type { Tier } from "./tier";

const list: Tier[] = [
   "IRON",
   "BRONZE",
   "SILVER",
   "GOLD",
   "PLATINUM",
   "DIAMOND",
   "MASTER",
   "GRANDMASTER",
   "CHALLENGER",
];

export function suffixToTier(suffix: string | number): Tier {
   if (typeof suffix === "string") {
      suffix = parseInt(suffix);
   }

   if (isNaN(suffix)) {
      return "NONCHALLENGE";
   }

   const index = list[suffix];
   if (index) {
      return index;
   }
   return "NONCHALLENGE";
}
