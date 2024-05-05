import { ChallengeDTO, ChallengesFullDTO } from "challenges/types/challenges.types";
import requests from "challenges/utils/requestFunctions";

/**
 * Error handling if a resources load failed, but the resource was required
 */
export function handleResourceError() {
  throw new Error("Required resource failed to load");
}

/**
 * Represents a service for providing challenge related data.
 */
export default class ChallengeService {
  static baseUrl = "https://challenges.darkintaqt.com/api";
  getJson: (url: string) => Promise<any>;

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
   */
  async list(region: string, lang = "en_US"): Promise<Record<string, ChallengeDTO> | undefined> {
    const challenges = await this.listAll(region, lang);
    return challenges?.challenges;
  }

  /**
   * Get the current list of challenge titles.
   * @param {string} region e.g. "na1", "euw1"...
   * @param {string} lang e.g. "en_US", "de_DE"...
   * @returns {Promise<Array.<TitleDto>>} Titles
   */
  async listTitles(region: string, lang = "en_US") {
    const titles = await this.listAll(region, lang);
    return titles?.titles;
  }

  /**
 * Get the current list of challenges and titles by region and language.
 * This is more effective as titles OR challenges doesn't need to be called individually
 * @param {string} region e.g. "na1", "euw1"...
 * @param {string} lang e.g. "en_US", "de_DE"...
 * @returns {Promise<ChallengesRawDto>} Challenges and Titles
 */
  async listAll(region: string, lang: string): Promise<ChallengesFullDTO | undefined> {
    const all = await this.getJson("/test.php") as ChallengesFullDTO | undefined;
    return all;
  }

  /**
   * Get the challenge associated with numerical id.
   * @param {number} id 
   * @returns {Promise<GlobalChallengeDto>} Challenge
   */
  async getById(id: string) {
    const challenge = await this.getJson(`/v5/showChallenge.php?id=${id}`);
    return challenge;
  }
}