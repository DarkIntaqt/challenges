import requests from "challenges/utils/requestFunctions";

/**
 * Service to get dynamic user data
 */
export default class UserService {
   static baseUrl = "https://challenges.darkintaqt.com/api";
   // eslint-disable-next-line no-unused-vars
   getJson: (url: any) => Promise<any>;

   constructor() {
      const { getJson } = requests(UserService.baseUrl);
      this.getJson = getJson;
   }

   /**
    * Get a user from the edge api
    * @param {string} name
    * @param {string} region e.g. "euw1", "na1"
    * @returns {User}
    */
   async getUser(name: string, region: string) {
      const user = await this.getJson(`/edge/user/${region}/${name}`);
      return user;
   }


   /**
    * returns true or false if a user (puuid) is verified
    */
   async getVerificationState(puuid: string): Promise<boolean> {
      const verified = await this.getJson("/v1/c-vip/?id=" + puuid);

      return verified[0];
   }
}