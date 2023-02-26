import css from "../../styles/challenges.module.scss";
import userCss from "../../styles/user.module.scss";
import filterCss from "../../styles/filter.module.scss";
import ChallengeService from "challenges/services/ChallengeService";
import { capitalize } from "challenges/utils/stringManipulation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import Image from "next/image";
import { faAnglesUp, faBoxOpen, faList, faPlay, faRankingStar, faTableCells, faUser } from "@fortawesome/free-solid-svg-icons";

/**
 * @typedef CategoriesMap
 * @type {Object}
 * @property {GlobalChallengeDto} teamwork
 * @property {GlobalChallengeDto} imagination
 * @property {GlobalChallengeDto} veterancy 
 * @property {GlobalChallengeDto} expertise 
 * @property {GlobalChallengeDto} collection
 */

/**
 * @typedef ChallengesProps
 * @type {Object}
 * @property {Array.<ChallengeDto>} challenges
 * @property {Object} filters
 */

/**
 * @param {ChallengesProps} props
 */
export default function Challenges({ challenges, filters }) {
   // TODO
   // Complete migration of ChallengeObject
   const challengeCards = [];
   for (const challenge of challenges) {
      const card = <div key={challenge.id}>
         <p>{challenge.translation.name}</p>
      </div>;
      challengeCards.push(card);
   }


   function handleChangeFilter() {

   }

   return <div className={"object1000"}>
      <Head>
         <title>All League of Legends Challenges Overview</title>
      </Head>
      <div className={css.heading}>
         <h1>List of all challenges</h1>
         <h2>Overview and how to obtain them</h2>
      </div>

      <section className={userCss.parent}>

      </section>

      <input 
         className={filterCss.input}
         type="search"
         placeholder="Search for a challenge"/>
      <div className={filterCss.filter}>
         <div className={filterCss.selectors + " clearfix"}>
            <div className={filterCss.displayMode}>
               <button id="compact" className={filterCss["cmode" + "true"] + " " + filterCss.modetrue}>
                  <FontAwesomeIcon icon={faList}/>
               </button>
               <button id="full" className={filterCss["cmode" + "true"] + " " + filterCss.modefalse}>
                  <FontAwesomeIcon icon={faTableCells}/>
               </button>
            </div>

            <p className={filterCss.info}>Filter (multiple choices)</p>
            <FilterButtonList categoryType="category">
               <button onClick={handleChangeFilter} data-id="4">
                  <Image width={16} height={16} src={filters.teamwork.src} alt="teamwork" />
                  {capitalize(filters.teamwork.name)}
               </button>
               <button onClick={handleChangeFilter} data-id="1">
                  <Image width={16} height={16} src={filters.imagination.src} alt="imagination" />
                  {capitalize(filters.imagination.name)}
               </button>
               <button onClick={handleChangeFilter} data-id="3">
                  <Image width={16} height={16} src={filters.veterancy.src} alt="veterancy" />
                  {capitalize(filters.veterancy.name)}
               </button>
               <button onClick={handleChangeFilter} data-id="5">
                  <Image width={16} height={16} src={filters.collection.src} alt="collection" />
                  {capitalize(filters.collection.name)}
               </button>
               <button onClick={handleChangeFilter} data-id="2">
                  <Image width={16} height={16} src={filters.expertise.src} alt="expertise" />
                  {capitalize(filters.expertise.name)}
               </button>
               <button onClick={handleChangeFilter} data-id="600006">
                  <Image width={16} height={16} src={filters.legacy.src} alt="legacy" />
                  Legacy
               </button>
               <button onClick={handleChangeFilter} data-id="2023000">
                  <Image width={16} height={16} src={filters.seasonal2023.src} alt="2023 seasonal" />
                  2023 Seasonal <span>NEW</span>
               </button>
               <button onClick={handleChangeFilter} data-id="seasonal-retired">
                  <Image width={16} height={16} src={filters.seasonalRetired.src} alt="seasonal retired" />
                  Retired Seasonal
               </button>
            </FilterButtonList>

            <FilterButtonList categoryType="type">
               <button onClick={handleChangeFilter} data-id="progress">
                  <FontAwesomeIcon icon={faAnglesUp}/>
                  Progress
               </button>
               <button onClick={handleChangeFilter} data-id="ingame">
                  <FontAwesomeIcon icon={faPlay}/>
                  Ingame
               </button>
               <button onClick={handleChangeFilter} data-id="eternals">
                  <Image width={16} height={16} src={filters.eternals.src} alt="eternals" />
                  Eternals
               </button>
               <button onClick={handleChangeFilter} data-id="clash">
                  <Image width={16} height={16} src={filters.clash.src} alt="clash" />
                  Clash
               </button>
               <button onClick={handleChangeFilter} data-id="inventory">
                  <FontAwesomeIcon icon={faBoxOpen} />
                  Inventory
               </button>
               <button onClick={handleChangeFilter} data-id="ranked">
                  <FontAwesomeIcon icon={faRankingStar} />
                  Ranked
               </button>
               <button onClick={handleChangeFilter} data-id="profile">
                  <FontAwesomeIcon icon={faUser} />
                  Profile
               </button>
            </FilterButtonList>

            <FilterButtonList categoryType="gamemode">
               <button onClick={handleChangeFilter} data-id="summonersrift">
                  <Image width={16} height={16} src={filters.summonersrift.src} alt="Summoners Rift" />
                  Summoners RIft
               </button>
               <button onClick={handleChangeFilter} data-id="aram">
                  <Image width={16} height={16} src={filters.aram.src} alt="ARAM" />
                  ARAM
               </button>
               <button onClick={handleChangeFilter} data-id="bot">
                  <Image width={16} height={16} src={filters.bot.src} alt="Bot Games" />
                  Bot
               </button>
            </FilterButtonList>
         </div>
      </div>

      <div className={userCss.parent + " " + userCss.flexWidth}>
         { challengeCards.length > 0 ? challengeCards : <NoChallengesFound/>}
      </div>
   </div>;
}

/**
 * @typedef FilterButtonListProps
 * @type {Object}
 * @property {Object} children
 * @property {string} categoryType
 */

/**
 * @param {FilterButtonListProps} props
 */
function FilterButtonList({children, categoryType}) {
   return <div className={filterCss.category} category={categoryType}>
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
      float: "left"}}>
      <i>Is it a bug? Is it a feature?</i>
      <br/><br/>No! There are just no challenges within the current filters.
      <br/>Maybe the challenges aren&apos;t released yet? 
   </p>;
}

export async function getServerSideProps() {
   const challengeService = new ChallengeService();

   let challenges = await challengeService.list("na1", "en");
   challenges = Array
      .from(challenges)
      .sort((a, b) => a.translation.name < b.translation.name 
         ? -1 : +(a.translation.name > b.translation.name));

   const categories = {
      teamwork: await challengeService.getById(4),
      imagination: await challengeService.getById(1),
      veterancy: await challengeService.getById(3),
      collection: await challengeService.getById(5),
      expertise: await challengeService.getById(2)
   };

   const filters = {
      expertise: {
         src: "https://cdn.darkintaqt.com/lol/static/challenges/expertise.svg",
         name: categories.teamwork.challenge.translation.name
      },
      collection: {
         src: "https://cdn.darkintaqt.com/lol/static/challenges/collection.svg",
         name: categories.collection.challenge.translation.name
      },
      imagination: {
         src: "https://cdn.darkintaqt.com/lol/static/challenges/imagination.svg",
         name: categories.imagination.challenge.translation.name
      },
      veterancy: {
         src: "https://cdn.darkintaqt.com/lol/static/challenges/veterancy.svg",
         name: categories.veterancy.challenge.translation.name
      },
      teamwork: {
         src: "https://cdn.darkintaqt.com/lol/static/challenges/teamwork.svg",
         name: categories.teamwork.challenge.translation.name
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
      props: {
         challenges,
         filters
      }
   };
}