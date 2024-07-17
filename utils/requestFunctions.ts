import { handleResourceError } from "challenges/services/ChallengeService";

/**
 * Returns curried request functions that uses base url prepended.
 * @param {string} baseUrl 
 * @returns 
 */
export default function requests(baseUrl: string) {
  /**
   * Get JSON representation of response data. Returns undefined if response code
   * was not in the 200-299 range.
   * @param {string} url 
   * @returns {any}
   */
  const getJson = async (url: string) => {
    const res = await getResponse(url);

    let data = undefined;
    try {
      if (res?.ok) {
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
  const getResponse = async (url: string) => {
    try {
      const res = await fetch(encodeURI(baseUrl + decodeURI(url)), { next: { revalidate: 120 } });
      return res;
    } catch (e) {
      handleResourceError();
      return undefined;
    }
  };

  return { getJson, getResponse };
}