import css from "challenges/styles/challenges.module.scss";
import filterCss from "challenges/styles/filter.module.scss";
import ChallengeService from "challenges/services/ChallengeService";
import { capitalize } from "challenges/utils/stringManipulation";
import { storageKeys, getStorage, setStorage } from "challenges/utils/sessionStorageFunctions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import Image from "next/image";
import { faAnglesUp, faBoxOpen, faList, faPlay, faRankingStar, faTableCells, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { intToTier, tierToInt } from "challenges/utils/intToTier";

import ChallengeObject from "challenges/components/ChallengeObject";
import { toArray } from "challenges/utils/toArray";
import ContentService from "challenges/services/ContentService";
import getParent from "challenges/utils/getParentChallenge";

import ChallengeHandler from "challenges/components/Challenges";

/**
 * @typedef ChallengesProps
 * @type {Object}
 * @property {Array.<ChallengeDto>} challengesRaw
 * @property {Object} filters
 */


/**
 * @param {ChallengesProps} props
 */
export default function Challenges({ challengesRaw = {}, filters = {} }) {


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

      <ChallengeHandler challengesRaw={challengesRaw} filters={filters} />

   </div>;
}


/**
 * SSR
 * @param {Object} ctx 
 * @returns Props
 */
Challenges.getInitialProps = async (ctx) => {

   return await getProps();

};

/**
 * 
 * @returns Props
 */
async function getProps() {
   const challengeService = new ChallengeService();
   const contentService = new ContentService();

   let challengesRaw = await challengeService.list("na1", "en_US");

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
      challengesRaw,
      filters
   };
}