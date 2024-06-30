import css from "challenges/styles/challenges.module.scss";
import ChallengeService from "challenges/services/ChallengeService";

import Head from "next/head";

import ChallengeHandler from "challenges/components/Challenges";
import { ChallengeDTO } from "challenges/types/challenges.types";
import ContentService from "challenges/services/ContentService";

/**
 * @typedef ChallengesProps
 * @type {Object}
 * @property {Array.<ChallengeDto>} challengesRaw
 * @property {Object} filters
 */


/**
 * @param {ChallengesProps} props
 */
export default async function Challenges() {

   const { challenges } = await getData();

   const contentService = new ContentService();
   const filters = {
      imagination: {
         src: contentService.getChallengeTokenIcon(1),
         name: challenges[1].name
      },
      expertise: {
         src: contentService.getChallengeTokenIcon(2),
         name: challenges[2].name
      },
      veterancy: {
         src: contentService.getChallengeTokenIcon(3),
         name: challenges[3].name
      },
      teamwork: {
         src: contentService.getChallengeTokenIcon(4),
         name: challenges[4].name
      },
      collection: {
         src: contentService.getChallengeTokenIcon(5),
         name: challenges[5].name
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

   return <div className={"object1000"}>
      <Head>
         <title>All League of Legends Challenges Overview</title>
      </Head>
      <div className={css.heading}>
         <h1>List of all challenges</h1>
         <h2>Overview and how to obtain them</h2>
      </div>

      <section className={css.parent}>
         {/* TODO - Add the '2022 Seasonal Challenges are retired' event card */}
         <h1>TODO - Event card goes here. {"(⸝⸝⸝╸w╺⸝⸝⸝)"}</h1>
      </section>

      <ChallengeHandler challengesRaw={challenges} filters={filters} apply={[]} region={""} />

   </div>;
}


async function getData(): Promise<ChallengeListResponse> {
   const challengeService = new ChallengeService();

   let challenges = await challengeService.list("na1", "en_US");
   if (!challenges) throw new Error("Unable to load challenegs");



   return {
      challenges: (Object.values(challenges) as ChallengeDTO[])
   };
}

interface ChallengeListResponse {
   challenges: ChallengeDTO[];
}