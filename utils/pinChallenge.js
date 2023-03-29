import { getStorage, setStorage, storageKeys } from "./localStorageFunctions";


function getPinned() {
   return getStorage(storageKeys.pinnedChallenges, []);
}


/**
 * 
 * @param {number} id challenge id
 * @returns {string} whether the challenge is pinned or not
 */
export function checkPinned(id) {
   let pinned = getPinned();

   return pinned.includes(id) ? "isPinned" : "notPinned";
}


export function addPinned(id) {
   let pinned = getPinned();

   if (!pinned.includes(id)) {
      pinned.push(id);
   }

   setStorage(storageKeys.pinnedChallenges, pinned);
   return;

}

export function removePinned(id) {
   let pinned = getPinned();

   const index = pinned.indexOf(id);
   if (index > -1) {
      pinned.splice(index, 1);
   }
   setStorage(storageKeys.pinnedChallenges, pinned);
   return;
}