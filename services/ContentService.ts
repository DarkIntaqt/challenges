import { ThresholdType } from "challenges/types/challenges.types";

/**
 * Represents a service for providing data from CDN.
 */
export default class ContentService {
  static cdnUrl = "https://lolcdn.darkintaqt.com/cdn";

  constructor() {
    this.getChallengeTokenIcon = this.getChallengeTokenIcon.bind(this);
    this.getProfileIcon = this.getProfileIcon.bind(this);
  }

  /**
   * Get the link of a challenge token icon by id. Tier type can optionally be 
   * passed for tier token icon (Diamond, Master, etc).
   * @param {number} id 
   * @param {string} type e.g. "diamond", "master"... case in-sensitive
   * @returns {string}
   */
  getChallengeTokenIcon(id: number, type?: ThresholdType): string {
    let link = `${ContentService.cdnUrl}/np-token/${id}`;
    if (type != null) link = `${link}/${type.toLowerCase()}`;
    return encodeURI(link);
  }

  /**
   * Get the link of a summoner icon by id
   * @param {number} id 
   * @returns {string}
   */
  getProfileIcon(id: number): string {
    return encodeURI(`${ContentService.cdnUrl}/profileicon/${id.toString()}`);
  }
}