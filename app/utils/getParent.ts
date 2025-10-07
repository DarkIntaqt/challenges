import type { IChallengeDTO, IChallengesFullDTO } from "./challenges";

export function getParents(
   challenge: IChallengeDTO,
   challenges: IChallengesFullDTO["challenges"],
): number[] {
   const parents: number[] = [];
   let parent = challenge.tags.parent || challenge.categoryId || 0;
   if (typeof parent === "string") {
      parent = parseInt(parent);
   }

   if (parent > 0 && parent !== challenge.id) {
      parents.push(parent);
   }

   while (parent > 0) {
      let nextParent: string | number =
         challenges[parent].tags.parent || challenges[parent].categoryId || 0;

      if (typeof nextParent === "string") {
         nextParent = parseInt(nextParent);
      }

      if (nextParent === parent) {
         break;
      }

      if (nextParent > 0 || nextParent === -1) {
         parents.push(nextParent);
      }

      parent = nextParent;
   }

   return parents;
}
