import Challenges from "challenges/components/Challenges";
import ErrorPage from "challenges/components/ErrorPage";
import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";
import UserService from "challenges/services/UserService";
import getPlatform, { serversBeautified } from "challenges/utils/platform";

export default function Profile({ user = {}, challengesRaw = {}, filters = {}, err }) {

   if (err) {
      console.log(err);
      return <ErrorPage></ErrorPage>;
   }

   return <>

      <div className={"object1000"}>

         <Challenges challengesRaw={challengesRaw} filters={filters} apply={user.challenges}></Challenges>

      </div>

   </>;
}


Profile.getInitialProps = async (ctx) => {

   const region = ctx.query.region;

   if (!serversBeautified.includes(region)) {
      ctx.res.statusCode = 404;
      return {
         err: {
            statusCode: 404,
            message: "Invalid region"
         }
      };
   }

   if (ctx.query.summoner.length > 2) {
      ctx.res.statusCode = 404;
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
      const challengeService = new ChallengeService();
      const contentService = new ContentService();

      let challengesRaw = await challengeService.list(getPlatform(ctx.query.region), "en_US");

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
         filters
      };

   } catch (e) {

      ctx.res.statusCode = 404;
      return {
         err: {
            statusCode: 404,
            message: e
         }
      };

   }

};