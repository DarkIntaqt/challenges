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
    this.listAll = this.listAll.bind(this);
    this.getById = this.getById.bind(this);

    const { getJson } = requests(ChallengeService.baseUrl);
    this.getJson = getJson;
  }

  /**
   * Get the current list of challenges by region and language.
   * @param {string} region e.g. "na1", "euw1"...
   * @param {string} lang e.g. "en_US", "de_DE"...
   * @returns {Promise<Array.<ChallengeDto>>} Challenges
   */
  async list(region, lang = "en_US") {
    const challenges = await this.getJson(`/challenges/${region}/${lang}.json`);
    return challenges.challenges;
  }

  /**
   * Get the current list of challenge titles.
   * @param {string} region e.g. "na1", "euw1"...
   * @param {string} lang e.g. "en_US", "de_DE"...
   * @returns {Promise<Array.<TitleDto>>} Titles
   */
  async listTitles(region, lang = "en_US") {
    const titles = await this.getJson(`/challenges/${region}/${lang}.json`);
    return titles.titles;
  }

  /**
 * Get the current list of challenges and titles by region and language.
 * This is more effective as titles OR challenges doesn't need to be called individually
 * @param {string} region e.g. "na1", "euw1"...
 * @param {string} lang e.g. "en_US", "de_DE"...
 * @returns {Promise<ChallengesRawDto>} Challenges and Titles
 */
  async listAll(region, lang = "en_US") {
    const all = await this.getJson(`/challenges/${region}/${lang}.json`);
    return all;
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