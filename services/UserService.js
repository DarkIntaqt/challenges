import requests from "challenges/utils/requestFunctions";

/**
 * Service to get dynamic user data
 */
export default class UserService {
   static baseUrl = "https://challenges.darkintaqt.com/api";

   constructor() {
      const { getJson } = requests(UserService.baseUrl);
      this.getJSON = getJson;
   }

   /**
    * Get a user from the edge api
    * @param {string} name
    * @param {string} region e.g. "euw1", "na1"
    * @returns {User}
    */
   async getUser(name, region) {
      const user = await this.getJSON(`/edge/user/${region}/${name}`);
      return user;
   }


   /**
    * returns true or false if a user (puuid) is verified
    * @param {string} puuid puuid of the player
    * @returns {boolean}
    */
   async getVerificationState(puuid) {
      const verified = await this.getJSON("/v1/c-vip/?id=" + puuid);

      return verified[0];
   }
}