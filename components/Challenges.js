import css from "challenges/styles/challenges.module.scss";
import filterCss from "challenges/styles/filter.module.scss";
import { capitalize } from "challenges/utils/stringManipulation";
import { storageKeys, getStorage, setStorage } from "challenges/utils/sessionStorageFunctions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { faAnglesUp, faBoxOpen, faList, faPlay, faRankingStar, faTableCells, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { intToTier, tierToInt } from "challenges/utils/intToTier";

import ChallengeObject from "challenges/components/ChallengeObject";
import { toArray } from "challenges/utils/toArray";
import ContentService from "challenges/services/ContentService";
import getParent from "challenges/utils/getParentChallenge";


/**
 * @typedef ChallengesProps
 * @type {Object}
 * @property {Array.<ChallengeDto>} challengesRaw
 * @property {Object} filters
 * @property {Array} apply
 * @property {String} region
 */


/**
 * @param {ChallengesProps} props
 */
export default function Challenges({ challengesRaw, filters, apply = [], region = "" }) {

   let applyChallenges = {};
   let isApplying = (apply.length > 0);
   for (let i = 0; i < apply.length; i++) {
      const challenge = apply[i];

      applyChallenges[challenge[0]] = challenge;
   }

   const challenges = Array
      .from(toArray(challengesRaw))
      .sort((a, b) => a.name < b.name
         ? -1 : +(a.name > b.name));


   /**
    * Category enum types.
    */

   const category = {
      category: "category",
      type: "type",
      gamemode: "gamemode"
   };
   /**
    * Data filters used as state for searching and CSS highlighting.
    */
   const [dataFilters, setDataFilters] = useState({
      // Challenge categories
      teamwork: { id: 4, key: "teamwork", css: "", category: category.category },
      imagination: { id: 1, key: "imagination", css: "", category: category.category },
      veterancy: { id: 3, key: "veterancy", css: "", category: category.category },
      collection: { id: 5, key: "collection", css: "", category: category.category },
      expertise: { id: 2, key: "expertise", css: "", category: category.category },
      legacy: { id: 600006, key: "legacy", css: "", category: category.category },
      seasonal2023: { id: 2023000, key: "seasonal2023", css: "", category: category.category },
      seasonalRetired: { id: "seasonal-retired", key: "seasonalRetired", css: "", category: category.category },
      // Challenge types
      progress: { id: "progress", key: "progress", css: "", category: category.type },
      ingame: { id: "ingame", key: "ingame", css: "", category: category.type },
      eternals: { id: "eternals", key: "eternals", css: "", category: category.type },
      clash: { id: "clash", key: "clash", css: "", category: category.type },
      inventory: { id: "inventory", key: "inventory", css: "", category: category.type },
      ranked: { id: "ranked", key: "ranked", css: "", category: category.type },
      profile: { id: "profile", key: "profile", css: "", category: category.type },
      // Challenge gamemodes
      summonersrift: { id: "summonerrift", key: "summonersrift", css: "", category: category.gamemode },
      aram: { id: "aram", key: "aram", css: "", category: category.gamemode },
      bot: { id: "bot", key: "bot", css: "", category: category.gamemode }
   });
   /**
    * Filters used for searching challenges.
    */
   const [searchFilters, setSearchFilters] = useState({
      category: [],
      type: [],
      gamemode: []
   });
   /**
    * Used for changing the display type of challenges.
    */
   const [isCompact, setCompact] = useState(true);
   const [search, setSearch] = useState("");


   /**
    * Passes all the available data in a ChallengeObject
    */
   const contentService = new ContentService();
   const challengeCards = [];
   for (const challenge of challenges) {

      if (challenge.state === "DISABLED") { continue; }

      let parent = getParent(challenge.parent, challengesRaw);

      let maxTier = 0;
      Object.keys(challenge.thresholds).forEach((key) => {
         const tier = tierToInt(key);
         if (tier > maxTier) {
            maxTier = tier;
         }
      });

      let type = maxTier;
      const apply = applyChallenges[challenge.id] || (!isApplying ? [challenge.id, maxTier] : [challenge.id, 1]);

      const tier = intToTier(apply[1] - 1);

      const card = <ChallengeObject
         key={challenge.id}
         id={challenge.id}
         region={region}
         image={contentService.getChallengeTokenIcon(challenge.id, (tier === "UNRANKED" ? "IRON" : tier))}
         title={challenge.name}
         subtitle={parent.name}
         description={challenge.description}
         type={type}
         apply={apply}
      />;
      challengeCards.push(card);
   }

   /**
    * Change the display mode of challenges.
    * @param {string} displayId `full` or `compact`
    */
   function handleChangeDisplay(displayId) {
      switch (displayId) {
         case "full":
            setCompact(false);
            break;
         case "compact":
            setCompact(true);
            break;
         default:
            throw new Error("Invalid displayId operation");
      }
   }

   /**
    * Change the challenge category filters from data filter key. See also `dataFilters` and `setDataFilters`.
    * @param {string} dataFilterKey The key of a data filter object from `dataFilters`
    */
   function handleChangeFilter(dataFilterKey) {
      const dataFilter = dataFilters[dataFilterKey];
      if (dataFilter == null) throw new Error("Unknown data filter key: " + dataFilterKey);

      let { category, css, id, key } = dataFilter;
      let filters = searchFilters[category];
      // Toggle CSS filter for selection
      if (css !== "") {
         css = "";
         filters = filters.filter(x => x !== id);
      } else {
         css = filterCss.selected;
         filters.push(id);
      }

      // Set search filters
      const updatedSearchFilters = { ...searchFilters };
      updatedSearchFilters[category] = filters;
      setSearchFilters(updatedSearchFilters);
      setStorage(storageKeys.challengeFilters, updatedSearchFilters);
      // Set data filters
      const updatedDataFilters = { ...dataFilters };
      updatedDataFilters[key] = { id, key, css, category };
      setDataFilters(updatedDataFilters);
      setStorage(storageKeys.challengeDataFilters, updatedDataFilters);
   }

   /**
    * Search for challenges by name.
    * @param {string} value 
    */
   function handleSearch(value) {
      setStorage(storageKeys.challengeSearch, value);
   }

   const isInitialized = useRef(false);
   useEffect(() => {
      if (!isInitialized.current) {
         setDataFilters(getStorage(storageKeys.challengeDataFilters, dataFilters));
         setSearchFilters(getStorage(storageKeys.challengeFilters, searchFilters));
         setSearch(getStorage(storageKeys.challengeSearch, search));
         isInitialized.current = true;
      }

   }, [dataFilters, isInitialized, search, searchFilters]);


   return <><input
      className={filterCss.input}
      type="search"
      placeholder="Search for a challenge"
      defaultValue={search}
      onKeyUp={(e) => handleSearch(e.target.value)}
      onInput={(e) => handleSearch(e.target.value)}
      onChange={(e) => handleSearch(e.target.value)} />
      <div className={filterCss.filter}>
         <div className={filterCss.selectors + " clearfix"}>
            <div className={filterCss.displayMode}>
               <button onClick={() => handleChangeDisplay("compact")} className={filterCss["cmode" + isCompact] + " " + filterCss.modetrue}>
                  <FontAwesomeIcon icon={faList} />
               </button>
               <button onClick={() => handleChangeDisplay("full")} className={filterCss["cmode" + isCompact] + " " + filterCss.modefalse}>
                  <FontAwesomeIcon icon={faTableCells} />
               </button>
            </div>

            <p className={filterCss.info}>Filter (multiple choices)</p>
            <FilterButtonList categoryType={category.category}>
               <button onClick={() => handleChangeFilter(dataFilters.teamwork.key)} className={dataFilters.teamwork.css}>
                  <Image width={16} height={16} src={filters.teamwork.src} alt="teamwork" unoptimized />
                  {capitalize(filters.teamwork.name)}
               </button>
               <button onClick={() => handleChangeFilter(dataFilters.imagination.key)} className={dataFilters.imagination.css}>
                  <Image width={16} height={16} src={filters.imagination.src} alt="imagination" unoptimized />
                  {capitalize(filters.imagination.name)}
               </button>
               <button onClick={() => handleChangeFilter(dataFilters.veterancy.key)} className={dataFilters.veterancy.css}>
                  <Image width={16} height={16} src={filters.veterancy.src} alt="veterancy" unoptimized />
                  {capitalize(filters.veterancy.name)}
               </button>
               <button onClick={() => handleChangeFilter(dataFilters.collection.key)} className={dataFilters.collection.css}>
                  <Image width={16} height={16} src={filters.collection.src} alt="collection" unoptimized />
                  {capitalize(filters.collection.name)}
               </button>
               <button onClick={() => handleChangeFilter(dataFilters.expertise.key)} className={dataFilters.expertise.css}>
                  <Image width={16} height={16} src={filters.expertise.src} alt="expertise" unoptimized />
                  {capitalize(filters.expertise.name)}
               </button>
               <button onClick={() => handleChangeFilter(dataFilters.legacy.key)} className={dataFilters.legacy.css}>
                  <Image width={16} height={16} src={filters.legacy.src} alt="legacy" unoptimized />
                  Legacy
               </button>
               <button onClick={() => handleChangeFilter(dataFilters.seasonal2023.key)} className={dataFilters.seasonal2023.css}>
                  <Image width={16} height={16} src={filters.seasonal2023.src} alt="2023 seasonal" unoptimized />
                  2023 Seasonal <span>NEW</span>
               </button>
               <button onClick={() => handleChangeFilter(dataFilters.seasonalRetired.key)} className={dataFilters.seasonalRetired.css}>
                  <Image width={16} height={16} src={filters.seasonalRetired.src} alt="seasonal retired" unoptimized />
                  Retired Seasonal
               </button>
            </FilterButtonList>

            {!isApplying ?
               <FilterButtonList categoryType={category.type}>
                  <button onClick={() => handleChangeFilter(dataFilters.progress.key)} className={dataFilters.progress.css}>
                     <FontAwesomeIcon icon={faAnglesUp} />
                     Progress
                  </button>
                  <button onClick={() => handleChangeFilter(dataFilters.ingame.key)} className={dataFilters.ingame.css}>
                     <FontAwesomeIcon icon={faPlay} />
                     Ingame
                  </button>
                  <button onClick={() => handleChangeFilter(dataFilters.eternals.key)} className={dataFilters.eternals.css}>
                     <Image width={16} height={16} src={filters.eternals.src} alt="eternals" unoptimized />
                     Eternals
                  </button>
                  <button onClick={() => handleChangeFilter(dataFilters.clash.key)} className={dataFilters.clash.css}>
                     <Image width={16} height={16} src={filters.clash.src} alt="clash" unoptimized />
                     Clash
                  </button>
                  <button onClick={() => handleChangeFilter(dataFilters.inventory.key)} className={dataFilters.inventory.css}>
                     <FontAwesomeIcon icon={faBoxOpen} />
                     Inventory
                  </button>
                  <button onClick={() => handleChangeFilter(dataFilters.ranked.key)} className={dataFilters.ranked.css}>
                     <FontAwesomeIcon icon={faRankingStar} />
                     Ranked
                  </button>
                  <button onClick={() => handleChangeFilter(dataFilters.profile.key)} className={dataFilters.profile.css}>
                     <FontAwesomeIcon icon={faUser} />
                     Profile
                  </button>
               </FilterButtonList>
               : null}

            <FilterButtonList categoryType={category.gamemode}>
               <button onClick={() => handleChangeFilter(dataFilters.summonersrift.key)} className={dataFilters.summonersrift.css}>
                  <Image width={16} height={16} src={filters.summonersrift.src} alt="Summoners Rift" unoptimized />
                  Summoners Rift
               </button>
               <button onClick={() => handleChangeFilter(dataFilters.aram.key)} className={dataFilters.aram.css}>
                  <Image width={16} height={16} src={filters.aram.src} alt="ARAM" unoptimized />
                  ARAM
               </button>
               <button onClick={() => handleChangeFilter(dataFilters.bot.key)} className={dataFilters.bot.css}>
                  <Image width={16} height={16} src={filters.bot.src} alt="Bot Games" unoptimized />
                  Bot
               </button>
            </FilterButtonList>
         </div>
      </div>

      <div className={css.parent + " " + css.flexWidth}>
         {challengeCards.length > 0 ? challengeCards : <NoChallengesFound />}
      </div>
   </>;
}


/**
 * @typedef FilterButtonListProps
 * @type {Object}
 * @property {Object} children React component children
 * @property {string} categoryType
 */

/**
 * @param {FilterButtonListProps} props
 */
function FilterButtonList({ children, categoryType }) {
   return <div className={filterCss.category}>
      <p className={filterCss.cheading}>{capitalize(categoryType)}</p>
      {children}
   </div>;
}


function NoChallengesFound() {
   return <p style={{
      color: "white",
      fontSize: "1rem",
      margin: "120px 0",
      textAlign: "center",
      width: "100%",
      float: "left"
   }}>
      <i>Is it a bug? Is it a feature?</i>
      <br /><br />No! There are just no challenges within the current filters.
      <br />Maybe the challenges aren&apos;t released yet?
   </p>;
}