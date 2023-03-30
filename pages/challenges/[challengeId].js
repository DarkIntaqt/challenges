import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";

import Link from "next/link";
import Head from "next/head";
import css from "challenges/styles/challenge.module.scss";
import Image from "next/image";
import VipBadge from "challenges/components/VipBadge";
import { intToTier } from "challenges/utils/intToTier";
import { beautifyNum } from "challenges/utils/beautify";
import { capitalize, strtolower, strtoupper } from "challenges/utils/stringManipulation";
import getPlatform from "challenges/utils/platform";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { getStorage, storageKeys } from "challenges/utils/localStorageFunctions";
import { addPinned, checkPinned, removePinned } from "challenges/utils/pinChallenge";
import CapstoneIcon from "challenges/assets/capstone.svg";

/**
 * Merges non-name users into an parsable user
 * @param {string} name 
 * @returns string
 */
function nameToURL(name) {
   if (typeof name !== "string") {
      return "error";
   }
   return name;
}


function checkThresholds(thresholds) {
   let noThresholds = true;
   for (let index = 0; index < thresholds.length; index++) {
      if (thresholds[index] !== "-") {
         noThresholds = false;
      }
   }
   return noThresholds;
}


/**
 * Creates a table-entry for a player
 * @returns LeaderboardPlayer component
 */
function LeaderboardPlayer({ name, icon, tier, server, position, points, vip }) {

   let userlink = "/profile/" + server + "/" + nameToURL(name);

   if (name === "%") {
      userlink = "/faq#h3";
   }

   return <tr key={name + server + position} className={intToTier(tier - 1)}>
      <td className={css.pos}>{position}.</td>
      <td className={css.name}>
         <Link href={userlink} >
            {vip === 1 ? <VipBadge size={"22px"} position={"absolute"} margin={"28px 0 0 30px"} /> : null}
            <Image height={30} width={30} src={"https://lolcdn.darkintaqt.com/cdn/profileicon/" + icon} alt={name + "'s profile image"} unoptimized />
            <p>{name} <span className={css.region}>#{server}</span></p>
         </Link>
      </td>
      <td className={css.tier}>{capitalize(strtolower(intToTier(tier - 1)))}</td>
      <td className={css.pts}>{beautifyNum(points, false)}</td>
   </tr>;
}



export default function Challenge({ challenge }) {

   /**
    * Return if the challenge is not set, so the challengeId is invalid
    */
   const router = useRouter();
   let region_ = "world";
   if (router.query.region) {
      region_ = router.query.region.split(",");
   }

   const [region, setRegion] = useState(region_);
   const [isPinned, setPinned] = useState("notPinned");

   useEffect(() => {
      setPinned(checkPinned(challenge.challenge.id));
   }, [challenge]);


   if (!challenge) {
      return <p>Error</p>;
   }

   const contentService = new ContentService();
   const iconLink = contentService.getChallengeTokenIcon(challenge.challenge.id, "master");

   const tiers = [
      "NONE",
      "IRON",
      "BRONZE",
      "SILVER",
      "GOLD",
      "PLATINUM",
      "DIAMOND",
      "MASTER",
      "GRANDMASTER",
      "CHALLENGER"
   ];

   const regions = [
      "br",
      "euw",
      "eune",
      "jp",
      "kr",
      "lan",
      "las",
      "na",
      "oc",
      "ru",
      "tr",
      "ph",
      "sg",
      "th",
      "tw",
      "vn"
   ];

   function changeRegion(e) {
      const newRegion = e.currentTarget.innerText;

      if (e.shiftKey) {

         if (!region.includes(newRegion)) {
            e.currentTarget.classList.add(css.active);
            if (region === "world") {
               window.history.replaceState({}, "", `?region=${newRegion}`);
               setRegion([newRegion]);
            } else {
               window.history.replaceState({}, "", `?region=${region.join(",")},${newRegion}`);
               setRegion([...region, newRegion]);
            }

         } else {
            let tempRegion_ = JSON.parse(JSON.stringify(region));
            const index = tempRegion_.indexOf(newRegion);

            if (index > -1) {
               tempRegion_.splice(index, 1);
            }

            e.currentTarget.classList.remove(css.active);

            if (tempRegion_.length === 0) {
               window.history.replaceState({}, "", "?");
               setRegion("world");
               return;
            }

            window.history.replaceState({}, "", `?region=${tempRegion_.join(",")}`);
            setRegion(tempRegion_);
         }
         return;
      }

      if (region.length === 1 && region[0] === newRegion) {
         e.currentTarget.classList.remove(css.active);
         window.history.replaceState({}, "", "?");
         setRegion("world");
         return;
      }

      let all = document.querySelectorAll("." + css.active);
      for (let i = 0; i < all.length; i++) {
         all[i].classList.remove(css.active);

      }


      e.currentTarget.classList.add(css.active);
      window.history.replaceState({}, "", "?region=" + newRegion);
      setRegion([newRegion]);
   }

   const selectors = regions.map((region) => {
      return <button type="button" className={css.region} key={region} onClick={changeRegion}>{region}</button>;
   });



   let tempRegion;
   if (region === "world") {
      tempRegion = "euw";
   } else {
      tempRegion = region[0];
   };

   /**
    * Handle and get thresholds and percentiles
    */
   let thresholds = ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"];
   let thresholdTable = [];
   let percentiles = {};
   for (let i = 0; i < tiers.length; i++) {
      percentiles[getPlatform(tiers[i])] = 1 - ((i + 1) / 10);
   }


   thresholds = challenge.stats[getPlatform(tempRegion)];
   percentiles = challenge.stats["percentiles-" + getPlatform(tempRegion)];

   let maxtier = 0;

   if (checkThresholds(thresholds)) {
      /**
       * Challenge is not enabled in this region
       */
   } else {

      for (let i = 1; i < thresholds.length; i++) {


         let lineThrough = { color: "#828282", textDecoration: "none", fontStyle: "normal", textAlign: "center" };
         if (thresholds[i] === "-" && percentiles[intToTier(i - 1)] === 0) {
            lineThrough.textDecoration = "line-through";
         } else {

            lineThrough.color = "var(--type,#fff)";

            if (maxtier < i) {

               maxtier = i;

            }
         }

         thresholdTable.unshift(<div key={"threshold" + i} className={css.rowParentTableRow}>
            <p className={intToTier(i - 1)} style={{ color: lineThrough["color"], textAlign: "center", textDecoration: lineThrough["textDecoration"], fontStyle: lineThrough["fontStyle"] }}>{strtolower(intToTier(i - 1))}</p>
            <p style={lineThrough}>{beautifyNum(thresholds[i])}</p>
            <p style={lineThrough}>{Math.round(percentiles[intToTier(i - 1)] * 1000) / 10}%</p>
         </div>);
      }
   }


   /**
    * Loop through all the players to generate the leaderboard
    */
   let i = 0;
   let playerlist = [];
   if (region === "world") {
      for (const region in challenge.summoner) {
         if (Object.hasOwnProperty.call(challenge.summoner, region)) {
            const r = challenge.summoner[region];

            for (let ii = 0; ii < r.length; ii++) {
               const player = r[ii];
               playerlist.push([
                  ...player,
                  region
               ]);
            }
         }
      }
   } else {
      for (let i = 0; i < region.length; i++) {
         const r = challenge.summoner[region[i]];

         for (let ii = 0; ii < r.length; ii++) {
            const player = r[ii];
            playerlist.push([
               ...player,
               region[i]
            ]);
         }
      }
   }


   /**
    * Sort the challenges if more than 1 region is involved
    */
   if (region === "world" || region.length > 1) {
      playerlist.sort((a, b) => {
         // Order by timestamp if same value and position
         if (a[1] === b[1]) {
            if (b[6] === a[6]) {
               return a[4] - b[4];
            }
            return a[6] - b[6];
         }
         return b[1] - a[1];
      });
   }


   /**
    * Generate the table for the summoners
    */
   const players = playerlist.map((player) => {
      i++;
      if (i > 250) {
         return null;
      }
      return <LeaderboardPlayer key={i}
         name={player[0]}
         points={player[1]}
         tier={player[2]}
         icon={player[3]}
         vip={player[5]}
         server={player[6]}
         position={i}
      />;
   });


   let title = ["SILVER", "No Title"];
   if (challenge.title.length > 0) {
      title = challenge.title[0];
   }

   maxtier = intToTier(maxtier - 1).toLowerCase();
   function pinChallenge() {
      if (isPinned === "isPinned") {
         setPinned("notPinned");

         removePinned(challenge.challenge.id);

      } else {
         setPinned("isPinned");

         addPinned(challenge.challenge.id);
      }
   }

   let capstones = [];
   for (let i = 0; i < challenge.parents.length; i++) {
      const parent = challenge.parents[i];

      capstones.push(<span key={parent[0]}>{i > 0 ? <FontAwesomeIcon icon={faChevronRight} style={{ margin: "0 3px", fontSize: ".6rem" }} /> : <></>}<Link href={"/challenges/" + parent[0]}><div className={css.svg}><CapstoneIcon /></div> {parent[1]}</Link></span>);

   }

   if (capstones.length > 0) {
      capstones = <div className={css.tag}>{capstones}</div>;
   }


   return <>
      <Head>
         <title>{challenge.challenge.name} Challenge Overview</title>
      </Head>

      <div className={css.bgImage} style={{
         backgroundImage: "url(https://cdn.darkintaqt.com/lol/static/challenges/_" + maxtier + "-full.webp)"
      }}>

      </div>

      <section className={css.challenge}>

         <div className={css.head}>

            <Image src={iconLink} height={100} width={100} alt="" unoptimized />

            <div>

               <h1>{challenge.challenge.name} <div className={`${css.pin} ${css[isPinned]}`} onClick={pinChallenge}><FontAwesomeIcon icon={faThumbTack} /></div></h1>


               <p className={"SILVER"}>{challenge.challenge.description}</p>

               <div className={css.tags}>

                  <div className={`${css.tag} ${title[0]} ${css.title}`}>{title[1]}</div>

                  {capstones}

               </div>

            </div>

         </div >

         <div className={css.objects}>

            <section>

               <div className={css.thresholds}>
                  <h3>Thresholds <span>How many players have reached a tier</span></h3>
                  <div className={css.table}>
                     <div className={css.tableHead}>
                        <p>Tier</p>
                        <p>Points</p>
                        <p>%</p>
                     </div>
                     {thresholdTable}
                  </div>
               </div>

               {challenge.info !== false ?
                  <div className={css.info}>
                     <h3>Info <span>All you need to know about this challenge</span></h3>
                     <div className={css.disclaimer}>

                        <p dangerouslySetInnerHTML={{ __html: challenge.info.replace(/\n/g, "<br />") }}></p>
                        {challenge.icon === "0" ?
                           <div className={css.bugDisclaimer}>
                              <h4>Known Bugs</h4>
                              <p>Status: <span className={css.semi}>Semi-Bugged</span></p>
                              <p>There were challenges removed, but not the points they gave. Now, you can&apos;t &quot;receive&quot; new points until you beat your old point-highscore. </p>
                           </div>
                           : <></>}
                     </div>
                  </div>
                  : <></>}
            </section>

            <div className={css.leaderboard}>
               <h3>Leaderboard <span>{
                  typeof region === "object" ?
                     <>Regional ranking</> :
                     <>Global ranking</>}</span></h3>

               <div className={css.regionSelector}>

                  {selectors}

               </div>

               <table className={css.table}>
                  <thead>
                     <tr className={css.heading}>
                        <th className={css.pos}>Position</th>
                        <th className={css.name}>Summoner</th>
                        <th className={css.tier}>Tier</th>
                        <th className={css.pts}>Points</th>
                     </tr>
                  </thead>
                  <tbody>
                     {players}
                  </tbody>
               </table>

            </div>

         </div>

      </section>

   </>;

}


Challenge.getInitialProps = async (ctx) => {

   const empty = {
      props: {}
   };

   if (!ctx || !ctx?.query || !ctx.query?.challengeId) {
      return empty;
   }

   const challengeId = parseInt(ctx.query.challengeId);

   const challengeService = new ChallengeService();
   const challenge = await challengeService.getById(challengeId);

   if (challenge === undefined) return empty;


   return {
      challenge
   };
};