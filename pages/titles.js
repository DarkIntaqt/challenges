import Head from "next/head";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";
import css from "styles/titles.module.scss";
import filterCss from "styles/filter.module.scss";
import { storageKeys, getStorage, setStorage } from "utils/sessionStorageFunctions";
import Link from "next/link";
import { intToTier } from "challenges/utils/intToTier";
import { capitalize } from "challenges/utils/stringManipulation";

/**
 * @typedef TitlesProps
 * @type {Object}
 * @property {Array.<TitleDto>} titles
 */

/**
 * @param {TitlesProps} props 
 */
export default function Titles({ titles, challenges }) {
   const [searchList, setSearchList] = useState(titles);
   const [search, setSearch] = useState("");

   // Local storage can only be called within useEffect which happens client-side.
   useEffect(() => {
      const savedSearch = getStorage(storageKeys.titleSearch, "");
      // Load previous search query from local storage.
      if (savedSearch !== "") {
         handleChallengeSearch(savedSearch, titles, setSearchList);
         setSearch(savedSearch);
      }
   }, [titles, search]);

   return <div className={"object1000"}>
      <Head>
         <title>All Challenges Titles - Overview</title>
      </Head>

      <h1 className={css.heading}>All titles</h1>
      <p className={css.subheading}>A list of all League of Legends Title Challenges and how to achieve them</p>
      <input
         className={filterCss.input}
         type="search"
         list="items"
         placeholder="Search for challenge titles"
         defaultValue={search}
         spellCheck={false}
         // We need these three event handlers to deal with oddities across Chrome and Firefox. ૮(˶╥︿╥)ა
         onChange={(e) => handleChallengeSearch(e.target.value, titles, setSearchList)}
         onKeyUp={(e) => handleChallengeSearch(e.target.value, titles, setSearchList)}
         onInput={(e) => handleChallengeSearch(e.target.value, titles, setSearchList)} />

      <datalist id="items">
         {/* Add challenge titles to datalist for native HTML searching options! (*´▽`*)❀ */}
         {titles.map((title) => <option key={title.titleId} value={title.title} />)}
      </datalist>

      <div className={css.titles}>
         <TitleList titles={searchList} challenges={challenges} />
      </div>
   </div>;
}

/**
 * @typedef TitleListProps
 * @type {Object}
 * @property {Array.<TitleDto>} titles
 */

/**
 * @param {TitleListProps} props 
 */
function TitleList({ titles, challenges }) {

   const contentService = new ContentService();

   const challengeTitles = titles.map((title) => {

      if (typeof challenges[title.challengeId] === "undefined" || title.challengeTier === 0) {
         return <Fragment key={title.titleId} />;
      }

      const challenge = challenges[title.challengeId];

      const iconLink = contentService.getChallengeTokenIcon(title.challengeId, intToTier(title.challengeTier));

      return <Link
         key={title.titleId}
         href={"/challenges/" + title.challengeId}
         className={`${css.title} ${title.type} clearfix`}
         challengeid={title.cid}>

         <Image
            height={45}
            width={45}
            src={iconLink}
            alt={`${title.title}'s icon`}
            loading="lazy"
            unoptimized
         />

         <h2>{title.title}<br /><span data-nosnippet>{Math.round(challenge.percentiles[intToTier(title.challengeTier)] * 1000) / 10}%</span></h2>
         <p>Reach <span className={intToTier(title.challengeTier)}>{capitalize(intToTier(title.challengeTier))}</span> tier in {challenge.name}. <br />{challenge.descriptionShort}<br /><br /><i>Need {challenge.thresholds[intToTier(title.challengeTier)]} points. </i></p>

      </Link >;
   });

   return challengeTitles;
}

/**
 * Search challenge titles and filter if title includes query. Case in-sensitive.
 * @param {string} value 
 * @param {Array.<TitleDto>} titles 
 * @param {Function} setSearchList 
 */
function handleChallengeSearch(value, titles, setSearchList) {
   // Filter challenge titles that include the search value (case-insensitive)
   const query = titles.filter((title) => title.title.toLowerCase().includes(value.toLowerCase()));
   setStorage(storageKeys.titleSearch, value);
   setSearchList([...query]);
}

Titles.getInitialProps = async (ctx) => {
   const challengeService = new ChallengeService();
   const all = await challengeService.listAll("na1", "en_US");

   const titles = all.titles;
   const challenges = all.challenges;

   return {
      titles,
      challenges
   };
};