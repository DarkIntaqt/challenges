/**
 * Keys used for localStorage.
 */
export const storageKeys = {
  challengeFilters: "challenge-filters",
  challengeSearch: "challenge-search"
}

/**
 * Get the JSON parsed value by key from localStorage. If no value is found,
 * a default value can optionally be used as the return.
 * @param {string} key localStorage key
 * @param {any} defaultValue default value to return if no value was found
 * @returns {any}
 */
export function getStorage(key, defaultValue) {
  let value = JSON.parse(localStorage.getItem(key));
  if (value == null) value = defaultValue ?? undefined;
  return value;
}

/**
 * Sets the JSON stringified value of key into localStorage.
 * @param {string} key
 * @param {any} value
 */
export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Removes the JSON value associated with key from localStorage.
 * @param {string} key
 */
export function removeStorage(key) {
  localStorage.removeItem(key);
}

/**
 * Clears all values from localStorage. Be careful using this. ❤️
 */
export function clearStorage() {
  localStorage.clear();
}