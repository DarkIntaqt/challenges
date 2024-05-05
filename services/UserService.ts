import { CheckResponse } from "challenges/types/user.types";
import requests from "challenges/utils/requestFunctions";

/**
 * Service to get dynamic user data
 */
export default class UserService {
   static baseUrl = "https://api2.darkintaqt.com/api/v1";
   getJSON: (url: string) => Promise<any>;

   constructor() {
      const { getJson } = requests(UserService.baseUrl);
      this.getJSON = getJson;
   }


   async getUser(name: string, region: string) {
      const user = await this.getJSON(`/lookup//${region}/${name.replace("#", "-")}`);
      return user;
   }

   async checkUser(name: string, region: string): Promise<CheckResponse | undefined> {
      const user = await this.getJSON(`/lookup/${region}/${name.replace(/#/g, "/")}`) as CheckResponse | undefined;
      return user;
   }


   async getVerificationState(puuid: string) {
      const verified = await this.getJSON("/v1/c-vip/?id=" + puuid);

      return verified[0];
   }
}