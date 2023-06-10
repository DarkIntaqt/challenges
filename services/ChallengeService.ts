import requests from "challenges/utils/requestFunctions";
import { ChallengeDTO, ChallengesFull, TitleDTO } from "challenges/types";

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
  async list(region: string, lang = "en_US"): Promise<Array<ChallengeDTO>> {
    const challenges = await this.getJson(`/challenges/${region}/${lang}.json`);
    return challenges.challenges;
  }

  /**
   * Get the current list of challenge titles.
   */
  async listTitles(region: string, lang = "en_US"): Promise<Array<TitleDTO>> {
    const titles = await this.getJson(`/challenges/${region}/${lang}.json`);
    return titles.titles;
  }

  /**
 * Get the current list of challenges and titles by region and language.
 * This is more effective as titles OR challenges doesn't need to be called individually
 * @returns {Promise<ChallengesRawDto>} Challenges and Titles
 */
  async listAll(region: string, lang = "en_US"): Promise<ChallengesFull> {
    const all = await this.getJson(`/challenges/${region}/${lang}.json`);
    return all;
  }

  /**
   * Get the challenge associated with numerical id.
   * @returns {Promise<GlobalChallengeDto>} Challenge
   */
  async getById(id: number) {
    const challenge = await this.getJson(`/v5/showChallenge.php?id=${id}`);
    return challenge;
  }
}