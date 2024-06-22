import { CheckResponse, UserInfo } from "challenges/types/user.types";
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


   async getUser(name: string, region: string): Promise<UserInfo | undefined> {
      const user = await this.getJSON(`/lookup/${region}/${name.replace(/[#-]/, "/")}`);
      // todo: temp, this endpoint doesn't have the required attributes
      return user
          ? {...user, challenges: [[2024207, 3, 34, 0, 1718984756917, [0.008]]], title: [20310203], selections: [[2024208, 6]]} as UserInfo
          : undefined;
   }

   async checkUser(name: string, region: string): Promise<CheckResponse | undefined> {
      const user = await this.getJSON(`/lookup/${region}/${name.replace(/[#-]/, "/")}`) as CheckResponse | undefined;
      return user;
   }


   async getVerificationState(puuid: string) {
      if (typeof puuid === "undefined") {
         return false;
      }

      return false; // todo: temp, this endpoint returns 404 on the "api2" subdomain
      // const verified = await this.getJSON("/v1/c-vip/?id=" + puuid);
      // return verified[0];
   }
}
