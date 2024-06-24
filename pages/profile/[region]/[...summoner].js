import Challenges from "challenges/components/Challenges";
import ErrorPage from "challenges/components/ErrorPage";
import UserHeading from "challenges/components/UserHeading";
import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";
import UserService from "challenges/services/UserService";
import getTitle from "challenges/utils/getTitle";
import getPlatform, { serversBeautified } from "challenges/utils/platform";

import css from "challenges/styles/user.module.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import HoverObject from "challenges/components/HoverObject";
import { capitalize } from "challenges/utils/stringManipulation";

export default function Profile({ user, verified, challengesRaw, filters, err, region, titles, current }) {

   const [currentSite, setCurrent] = useState(current);

   useEffect(() => {

      document.getElementById(currentSite)?.classList.add(css.active);

   }, [currentSite]);

   if (err) {
      return <ErrorPage></ErrorPage>;
   }

   function navigate(e) {

      document.getElementById(currentSite).classList.remove(css.active);
      setCurrent(e.currentTarget.id);

      history.pushState(null, "", "/profile/" + region + "/" + user.name + "-" + user.tag + ((e.currentTarget.id === "overview") ? "" : ("/" + e.currentTarget.id)));

   }

   const title = getTitle(user.preferences.title, titles);
   const contentService = new ContentService();

   const showCaseChallenges = user.preferences.displayed.map((challengeId) => {

      const challengeInfo = challengesRaw[challengeId];
      const challengeUser = user.challenges.find(c => c.id === challengeId);

      if (!challengeInfo || !challengeUser) {
         return <></>;
      }

      return (
          <HoverObject key={challengeInfo.id} hover={(
              <div className={`${css.hover} ${challengeUser.tier}`}>
                 <p>{challengeInfo.name}</p>
                 <span><b>{capitalize(challengeUser.tier)}</b> rank token</span>
                 <br />
                 <span><i>{challengeInfo.description}</i></span>
              </div>
          )}>
             <Image src={contentService.getChallengeTokenIcon(challengeInfo.id, challengeUser.tier)} unoptimized height={35} width={35} alt={challengeInfo.name} />
          </HoverObject>
      );

   });

   return <>


      <div className={css.bgImage} style={{
         backgroundImage: "url(https://cdn.darkintaqt.com/lol/static/challenges/_" + user.points.tier.toLowerCase() + "-full.webp)"
      }}></div>

      <div className={css.user}>

         <UserHeading user={user} title={title} verified={verified} selections={showCaseChallenges} />

         <div className={css.navigation}>

            <div id="overview" onClick={navigate}>Overview</div>

            <div id="titles" onClick={navigate}>Titles</div>

            <div id="statistics" onClick={navigate}>Statistics</div>

            <div id="history" onClick={navigate}>History</div>

         </div>

         <Challenges challengesRaw={challengesRaw} filters={filters} apply={user.challenges} region={region}></Challenges>

      </div>

   </>;
}


Profile.getInitialProps = async (ctx) => {

   const {region, summoner} = ctx.query;

   if (!serversBeautified.includes(region)) {
      return makeErr("Invalid region");
   }

   if (!Array.isArray(summoner) || summoner.length === 0 || summoner.length > 2) {
      return makeErr("Invalid path");
   }

   const [name, current = "overview"] = summoner;

   try {

      const userService = new UserService();

      const user = await userService.getUser(name, getPlatform(region));
      if (typeof user === "undefined" || user === null) {
         return makeErr("Invalid content");
      }

      const verified = await userService.getVerificationState(user.playerId);

      const challengeService = new ChallengeService();

      const all = await challengeService.listAll(getPlatform(region), "en_US");
      if (typeof all === "undefined" || all === null) {
         return makeErr("Invalid content");
      }

      const challengesRaw = all.challenges;
      const titles = all.titles;

      const contentService = new ContentService();

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
         verified,
         challengesRaw,
         filters,
         region,
         titles,
         current
      };

   } catch (e) {
      return makeErr(e);
   }

   function makeErr(e, code = 404) {

      if (ctx.res) {
         ctx.res.statusCode = code;
      }

      return {
         err: {
            statusCode: code,
            message: e
         }
      };
   }

};
