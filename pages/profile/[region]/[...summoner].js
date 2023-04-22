import Challenges from "challenges/components/Challenges";
import ErrorPage from "challenges/components/ErrorPage";
import UserHeading from "challenges/components/UserHeading";
import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";
import UserService from "challenges/services/UserService";
import getTitle from "challenges/utils/getTitle";
import { intToTier } from "challenges/utils/intToTier";
import getPlatform, { serversBeautified } from "challenges/utils/platform";

import css from "challenges/styles/user.module.scss";

export default function Profile({ user = {}, challengesRaw = {}, filters = {}, err, region, titles = {} }) {

   if (err) {
      return <ErrorPage></ErrorPage>;
   }

   const tier = intToTier(user.challenges[0][1] - 1);
   const title = getTitle(user.title[0], titles);

   return <>


      <div className={css.bgImage} style={{
         backgroundImage: "url(https://cdn.darkintaqt.com/lol/static/challenges/_" + tier.toLowerCase() + "-full.webp)"
      }}></div>

      <div className={css.user}>

         <UserHeading user={user} tier={tier} title={title} />

         <Challenges challengesRaw={challengesRaw} filters={filters} apply={user.challenges} region={region}></Challenges>

      </div>


   </>;
}


Profile.getInitialProps = async (ctx) => {

   const region = ctx.query.region;

   if (!serversBeautified.includes(region)) {

      if (ctx.res) {
         ctx.res.statusCode = 404;
      }

      return {
         err: {
            statusCode: 404,
            message: "Invalid region"
         }
      };
   }

   if (ctx.query.summoner.length > 2) {

      if (ctx.res) {
         ctx.res.statusCode = 404;
      }

      return {
         err: {
            statusCode: 404,
            message: "Invalid path"
         }
      };
   }

   try {

      const userService = new UserService();

      const user = await userService.getUser(ctx.query.summoner[0], getPlatform(ctx.query.region));
      if (typeof user === "undefined" || user === null) {
         throw new Error("Invalid content");
      }
      const challengeService = new ChallengeService();
      const contentService = new ContentService();

      let all = await challengeService.listAll(getPlatform(ctx.query.region), "en_US");

      let challengesRaw = all.challenges;
      let titles = all.titles;

      const filters = {
         imagination: {
            src: contentService.getChallengeTokenIcon(1),
            name: challengesRaw[1].name
         },
         expertise: {
            src: contentService.getChallengeTokenIcon(2),
            name: challengesRaw[2].name
         },
         veterancy: {
            src: contentService.getChallengeTokenIcon(3),
            name: challengesRaw[3].name
         },
         teamwork: {
            src: contentService.getChallengeTokenIcon(4),
            name: challengesRaw[4].name
         },
         collection: {
            src: contentService.getChallengeTokenIcon(5),
            name: challengesRaw[5].name
         },
         legacy: {
            src: "https://cdn.darkintaqt.com/lol/static/challenges/legacy.svg",
         },
         seasonal2023: {
            src: "https://cdn.darkintaqt.com/lol/static/challenges/2023seasonal.svg",
         },
         seasonalRetired: {
            src: "https://cdn.darkintaqt.com/lol/static/challenges/retired.svg",
         },
         summonersrift: {
            src: "https://lolcdn.darkintaqt.com/cdn/sr.svg",
         },
         aram: {
            src: "https://lolcdn.darkintaqt.com/cdn/ha.svg",
         },
         bot: {
            src: "https://lolcdn.darkintaqt.com/cdn/bot.png",
         },
         eternals: {
            src: "https://cdn.darkintaqt.com/lol/static/challenges/eternals.webp"
         },
         clash: {
            src: "https://cdn.darkintaqt.com/lol/static/challenges/clash.webp"
         }
      };

      return {
         user,
         challengesRaw,
         filters,
         region: region.toString(),
         titles
      };

   } catch (e) {

      if (ctx.res) {
         ctx.res.statusCode = 404;
      }

      return {
         err: {
            statusCode: 404,
            message: e
         }
      };

   }

};