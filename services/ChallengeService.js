import "typedef";
import requests from "challenges/utils/requestFunctions";

/**
 * Represents a service for providing challenge related data.
 */
export default class ChallengeService {
  static baseUrl = "https://challenges.darkintaqt.com/api";

  constructor() { 
    this.list = this.list.bind(this);
    this.listTitles = this.listTitles.bind(this);
    this.getById = this.getById.bind(this);

    const { getJson } = requests(ChallengeService.baseUrl);
    this.getJson = getJson;
  }

  /**
   * Get the current list of challenges by region and language.
   * @param {string} region e.g. "na1", "euw1"...
   * @param {string} lang e.g. "en", "de"...
   * @returns {Promise<Array.<ChallengeDto>>} Challenges
   */
  async list(region, lang) {
    const challenges = await this.getJson(`/dynamic-data/serve?region=${region}&lang=${lang}`);
    return challenges;
  }

  /**
   * Get the current list of challenge titles.
   * @returns {Promise<Array.<TitleDto>>} Titles
   */
  async listTitles() {
    const titles = await this.getJson("/v2/t/");
    return titles;
  }

  /**
   * Get the challenge associated with numerical id.
   * @param {number} id 
   * @returns {Promise<GlobalChallengeDto>} Challenge
   */
  async getById(id) {
    const challenge = await this.getJson(`/v5/c/?id=${id}`);
    return challenge;
  }
}