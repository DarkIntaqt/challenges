/**
 * 
 * @param {Number} parentId - id of the parent challenge
 * @param {Object<number,ChallengeDto>} challenges 
 * @param {Boolean} recursive - whether get the parents parent (recursive) or only the next parent; default is recursive
 * @returns 
 */
export default function getParent(parentId, challenges, recursive = true) {

   try {
      let parent = challenges[parentId];
      if (parent.parent !== parent.id && parent.id > 10) {
         let result = getParent(parent.parent, challenges, recursive);
         if (result.id === 0) {
            return {
               name: "LEGACY"
            };
         }
         return {
            name: result.name
         };
      }
      if (parent.id === 0) {
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
