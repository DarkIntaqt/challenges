import "typedef";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";
import css from "styles/titles.module.scss";
import filterCss from "styles/filter.module.scss";
import { storageKeys, getStorage, setStorage } from "utils/localStorageFunctions";
import Link from "next/link";

/**
 * @typedef TitlesProps
 * @type {Object}
 * @property {Array.<TitleDto>} titles
 */

/**
 * @param {TitlesProps} props 
 */
export default function Titles({ titles }) {
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
         {titles.map((title) => <option key={title.cid} value={title.title} />)}
      </datalist>

      <div className={css.titles}>
         <TitleList titles={searchList} />
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
function TitleList({ titles }) {
   const contentService = new ContentService();

   const challengeTitles = titles.map((title) => {
      const iconLink = contentService.getChallengeTokenIcon(title.icon, title.type);

      return <Link
         key={title.cid}
         href={"/challenges/" + title.cid}
         className={`${css.title} ${title.type} clearfix`}
         challengeid={title.cid}>
         <span>
            <Image
               height={45}
               width={45}
               src={iconLink}
               placeholdersrc={"https://cdn.darkintaqt.com/lol/static/missing/item.png"}
               alt={`${title.title}'s icon`}
               loading="lazy"
               unoptimized
            />
         </span>

         <h2>{title.title}<br /><span data-nosnippet>{title.percentile}%</span></h2>
         <p>Reach {title.type} tier in {title.challenge}<br></br>{title.description}<br /><br /><i>Need {title.threshold}</i></p>

      </Link>;
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

export async function getServerSideProps() {
   const challengeService = new ChallengeService();
   const titles = await challengeService.listTitles("na1", "en_US");

   return {
      props: {
         titles
      }
   };
}