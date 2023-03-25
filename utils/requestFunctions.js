import { handleResourceError } from "challenges/services/ChallengeService";

/**
 * Returns curried request functions that uses base url prepended.
 * @param {string} baseUrl 
 * @returns 
 */
export default function requests(baseUrl) {
  /**
   * Get JSON representation of response data. Returns undefined if response code
   * was not in the 200-299 range.
   * @param {string} url 
   * @returns {any}
   */
  const getJson = async (url) => {
    const res = await getResponse(url);

    let data = undefined;
    try {
      if (res.ok) {
        data = await res.json();
      }
    } catch (e) {
      console.warn(e);
    } finally {
      return data;
    }
  };

  /**
   * Get the raw response using appended encoded url.
   * @param {string} url 
   * @returns {any}
   */
  const getResponse = async (url) => {
    try {
      const res = await fetch(encodeURI(baseUrl + url));
      return res;
    } catch (e) {
      handleResourceError();
      return undefined;
    }
  };

  return { getJson, getResponse };
}