import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";

import Link from "next/link";
import Head from "next/head";
import css from "challenges/styles/challenge.module.scss";
import Image from "next/image";
import VipBadge from "challenges/components/VipBadge";
import { intToTier } from "challenges/utils/intToTier";
import { beautifyNum } from "challenges/utils/beautify";
import { capitalize, strtolower } from "challenges/utils/stringManipulation";


function nameToURL(name) {
   if (typeof name !== "string") {
      return "error";
   }
   return name;
}

function LeaderboardPlayer({ name, icon, tier, server, position, points, vip }) {

   let userlink = "/profile/" + server + "/" + nameToURL(name);

   if (name === "%") {
      userlink = "/faq#h3";
   }

   return <tr key={name + server + position} className={intToTier(tier)}>
      <td className={css.pos}>{position}.</td>
      <td className={css.name}>
         <Link href={userlink} >
            {vip === 1 ? <VipBadge size={"22px"} position={"absolute"} margin={"28px 0 0 30px"} /> : null}
            <Image height={30} width={30} src={"https://lolcdn.darkintaqt.com/cdn/profileicon/" + icon} placeholderSrc={"https://lolcdn.darkintaqt.com/s/p-cb"} alt={name + "'s profile image"} />
            <p>{name} <span className={css.region}>#{server}</span></p>
         </Link>
      </td>
      <td className={css.tier}>{capitalize(strtolower(intToTier(tier)))}</td>
      <td className={css.pts}>{beautifyNum(points, false)}</td>
   </tr>;
}



export default function Challenge({ challenge }) {

   if (!challenge) {
      return <p>Error</p>;
   }
   const contentService = new ContentService();

   const iconLink = contentService.getChallengeTokenIcon(challenge.challenge.id, "master");

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

   const selectors = regions.map((region) => {
      return <button type="button" className={css.region} key={region}>{region}</button>;
   });

   let i = 0;
   const players = challenge.summoner.euw.map((player) => {
      i++;
      return <LeaderboardPlayer key={i}
         name={player[0]}
         points={player[1]}
         tier={player[2]}
         icon={player[3]}
         vip={player[5]}
         server={"euw"}
         position={i}
      />;
   });

   return <>
      <Head>
         <title> - Overview</title>
      </Head>

      <div className={css.bgImage}>
         <Image src="https://cdn.darkintaqt.com/lol/static/challenges/_master-full.webp" fill={true} alt="" />
      </div>

      <section className={css.challenge}>

         <div className={css.head}>

            <Image src={iconLink} height={100} width={100} alt="" />

            <div>

               <h1>{challenge.challenge.translation.name}</h1>

               <p className={"SILVER"}>{challenge.challenge.translation.description}</p>

               <div className={css.regionSelector}>

                  {selectors}

               </div>

            </div>

         </div >

         <div className={css.objects}>

            <section>

               <div className={css.thresholds}>
                  <p>Thresholds <span>How many players have reached a tier</span></p>
               </div>

               <div className={css.thresholds}>
                  <p>Info <span>All you need to know about this challenge</span></p>
               </div>

            </section>

            <div className={css.leaderboard}>
               <p>Leaderboard <span>Global ranking</span></p>

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



export async function getServerSideProps(ctx) {

   const empty = {
      props: {}
   };

   if (!ctx || !ctx?.params || !ctx.params?.challengeId) {
      return empty;
   }

   const challengeId = parseInt(ctx.params.challengeId);

   const challengeService = new ChallengeService();
   const challenge = await challengeService.getById(challengeId);

   if (challenge === undefined) return empty;


   return {
      props: {
         challenge
      }
   };
}