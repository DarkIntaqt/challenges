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
   */
  getChallengeTokenIcon(id: number, type?: string) {
    let link = `${ContentService.cdnUrl}/np-token/${id}`;
    if (type != null) link = `${link}/${type.toLowerCase()}`;
    return encodeURI(link);
  }

  /**
   * Get the link of a summoner icon by id
   */
  getProfileIcon(id: number) {
    return encodeURI(`${ContentService.cdnUrl}/profileicon/${id.toString()}`);
  }
}