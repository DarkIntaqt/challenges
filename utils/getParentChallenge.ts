import { ChallengeDTO } from "challenges/types/challenges.types";

/**
 * 
 * @param {Number} parentId - id of the parent challenge
 * @param {Object<number,ChallengeDto>} challenges 
 * @param {Boolean} recursive - whether get the parents parent (recursive) or only the next parent; default is recursive
 * @returns 
 */
export default function getParent(parentId: number, challenges: {[key: number]: ChallengeDTO}, recursive: boolean = true): any {

   if (!recursive) {
      // TODO
   }

   try {
      let parent = challenges[parentId];
      let parentParent = challenges[parent.tags.parent ?? -1];
      if (parentParent.id !== parent.id && parseInt(parent.id) > 10) {
         let result = getParent(parseInt(parentParent.id), challenges, recursive);
         if (result.id === 0) {
            return {
               name: "LEGACY"
            };
         }
         return {
            name: result.name
         };
      }
      if (parseInt(parent.id) === 0) {
         return {
            name: "LEGACY"
         };
      }
      return {
         name: parent.name
      };
   } catch (e) {
      return {
         name: challenges[parentId]
      };
   }

}
