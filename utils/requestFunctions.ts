import { handleResourceError } from "challenges/services/ChallengeService";

/**
 * Returns curried request functions that uses base url prepended.
 */
export default function requests(baseUrl: string) {
  /**
   * Get JSON representation of response data. Returns undefined if response code
   * was not in the 200-299 range.
   */
  const getJson = async (url: string) => {
    const res = await getResponse(url);

    if (res === undefined) {
      return undefined;
    }

    let data = await res.json();
    return data;
  };

  /**
   * Get the raw response using appended encoded url.
   * @param {string} url 
   * @returns {any}
   */
  const getResponse = async (url: string) => {
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