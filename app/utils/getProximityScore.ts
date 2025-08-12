const maxScore = 100;
const baseScore = 10;

/*
 * Compares how close b is to a
 */
export function getProximityScore(a: string, b: string): number {
   if (!a.includes(b)) return 0;

   let score = baseScore;

   if (a === b) {
      score = maxScore;
   } else if (a.startsWith(b)) {
      score = 50;
   }

   // todo, this algo could probably be optimized but it is good enough haha
   return score;
}
