import ChallengeService from "challenges/services/ChallengeService";

import Link from "next/link";
import css from "challenges/styles/leaderboard.module.scss";
import Image from "next/image";
import VipBadge from "challenges/components/VipBadge";
import { intToTier } from "challenges/utils/intToTier";
import { beautifyNum } from "challenges/utils/beautify";
import { capitalize, strtolower } from "challenges/utils/stringManipulation";
import type { NextPageContext } from "next";
import { LeaderboardDTO, ThresholdType } from "challenges/types/challenges.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import ContentService from "challenges/services/ContentService";
import CapstoneIcon from "challenges/assets/capstone.svg";

const contentService = new ContentService();

export default function Leaderboard({ leaderboard }: Readonly<{ leaderboard: LeaderboardDTO }>) {

   if (leaderboard === undefined) {
      return "no no no"; // TODO
   }

   const highestTier: ThresholdType = "MASTER";
   const challengeToken = contentService.getChallengeTokenIcon(leaderboard.id, highestTier);

   const titleAvailable = false;
   const title = {
      tier: "BRONZE",
      name: "Uwu"
   };

   let challengeName = leaderboard.challenge.name;
   if (leaderboard.id === 0) {
      challengeName = "Challenge Points Leaderboard";
   }
   let challendeDescription = leaderboard.challenge.description;
   if (leaderboard.id === 0) {
      challendeDescription = "Total challenge points gained by leveling up challenges";
   }
   return (<>

      <div className={css.bgImage} style={{
         backgroundImage: "url(https://cdn.darkintaqt.com/lol/static/challenges/_" + highestTier.toLowerCase() + "-full.webp)"
      }}></div>

      <section className={css.leaderboard}>

         <div className={css.head}>

            <Link className={css.getHelp} href="/social/faq/#ChallengePage" prefetch={false} target="_blank" rel="nofollow"> <FontAwesomeIcon icon={faCircleQuestion} /></Link>

            <Image src={challengeToken} height={100} width={100} alt={leaderboard.challenge.name} />

            <div className={css.text}>

               <h1>{challengeName} {/* TODO PIN */}</h1>

               <p className={css.description}>{challendeDescription}</p>

               <div className={css.tags}>

                  {titleAvailable ? <div className={`${css.tag} ${title.tier} ${css.title}`}>{title.name}</div> : null}

                  {leaderboard.parents.length === 0 ? null :
                     <div className={css.tag}>{leaderboard.parents.map((c, i) => {
                        let name = c.name;
                        if (c.id === 0) {
                           name = "Challenge Points Leaderboard";
                        }
                        return <span key={c.id}>{i > 0 ? " > " : <></>}
                           <Link href={"/challenges/" + c.id}>
                              <div className={css.svg}>
                                 <CapstoneIcon />
                              </div>
                              {/* REQUIRED WHITESPACE */} {name}
                           </Link>
                        </span>;
                     })}</div>}

               </div>

            </div>

         </div>

      </section>

   </>);

}

export const getServerSideProps = (async (context: NextPageContext) => {


   const challengeService = new ChallengeService();
   // @ts-ignore TODO
   const leaderboard = await challengeService.getById(context?.query.challengeId);

   return {
      props: {
         leaderboard
      }
   };
});