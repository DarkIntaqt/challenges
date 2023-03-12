import "typedef";
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
}