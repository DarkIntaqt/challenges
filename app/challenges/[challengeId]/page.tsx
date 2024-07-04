import { ReactNode } from "react";

import ChallengeService from "challenges/services/ChallengeService";
import Link from "next/link";
import css from "challenges/styles/leaderboard.module.scss";
import Image from "next/image";
import { LeaderboardDTO, ThresholdType } from "challenges/types/challenges.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import ContentService from "challenges/services/ContentService";
import CapstoneIcon from "challenges/assets/capstone.svg";
import TitleIcon from "challenges/assets/title.svg";

export default async function Leaderboard({ params }: Readonly<{ params: LeaderboardParams }>): Promise<ReactNode> {

   const leaderboard = await getData(params);
   const contentService = new ContentService();

   const highestTier: ThresholdType = "MASTER";
   const challengeToken = contentService.getChallengeTokenIcon(leaderboard.id, highestTier);

   const titleAvailable = leaderboard.title !== null;

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

                  {titleAvailable ? <div className={`${css.tag} ${leaderboard.title?.tier} ${css.title}`}>
                     <span>
                        <div className={css.svg}>
                           <TitleIcon />
                        </div>
                        {` ${leaderboard.title?.title}`}
                     </span>
                  </div> : null}

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
                              {` ${name}`}
                           </Link>
                        </span>;
                     })}</div>}

               </div>

            </div>

         </div>

      </section>

   </>);

}

async function getData({ challengeId }: LeaderboardParams): Promise<LeaderboardDTO> {
   const challengeService = new ChallengeService();
   const leaderboard = await challengeService.getById(parseInt(challengeId));

   if (!leaderboard) throw new Error("Error loading leaderboard");

   return leaderboard;
}


interface LeaderboardParams {
   challengeId: string;
}