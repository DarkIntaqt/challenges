import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";

import Link from "next/link";
import Head from "next/head";
import css from "challenges/styles/challenge.module.scss";
import Image from "next/image";

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

            <div className={css.thresholds}>
               <p>Thresholds <span>How many players have reached a tier</span></p>
            </div>

            <div className={css.leaderboard}>
               <p>Leaderboard <span>Global ranking</span></p>
            </div>

         </div>

      </section >

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