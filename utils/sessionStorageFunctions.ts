/**
 * Keys used for localStorage.
 */
export const storageKeys = {
   titleSearch: "title-search",
   challengeFilters: "challenge-filters",
   challengeDataFilters: "challenge-data-filters",
   challengeSearch: "challenge-search",
   headerPosition: "header-position",
   defaultRegion: "default-region",
   recentlySearched: "recently-searched",
   pinnedChallenges: "pinned-challenges"
};

/**
 * Get the JSON parsed value by key from sessionStorage. If no value is found,
 * a default value can optionally be used as the return.
 * @param {string} key sessionStorage key
 * @param {any} defaultValue default value to return if no value was found
 * @returns {any}
 */
export function getStorage(key: string, defaultValue: any): any {
   let value = sessionStorage.getItem(key);
   if (typeof value === "string") value = JSON.parse(value as string);
   if (value == null) value = defaultValue ?? undefined;
   return value;
}

/**
 * Sets the JSON stringified value of key into sessionStorage.
 * @param {string} key
 * @param {any} value
 */
export function setStorage(key: string, value: any) {
   sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * Removes the JSON value associated with key from sessionStorage.
 * @param {string} key
 */
export function removeStorage(key: string) {
   sessionStorage.removeItem(key);
}

/**
 * Clears all values from sessionStorage. Be careful using this. ❤️
 */
export function clearStorage() {
   sessionStorage.clear();
}