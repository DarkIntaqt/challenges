import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CapstoneIcon from "challenges/assets/capstone.svg";
import TitleIcon from "challenges/assets/title.svg";
import ContentService from "challenges/services/ContentService";
import { LeaderboardChallenge } from "challenges/types/leaderboard.types";

import css from "challenges/styles/leaderboard.module.scss";

export default function ChallengeHeading({ leaderboard }: ChallengeHeadingProps): ReactNode {
   const contentService = new ContentService();
   const challengeToken = contentService.getChallengeTokenIcon(leaderboard.id, "MASTER");

   return (
      <div className={css.head}>
         <Link
            className={css.getHelp}
            href="/social/faq/#ChallengePage"
            prefetch={false}
            target="_blank"
            rel="nofollow"
         >
            {" "}
            <FontAwesomeIcon icon={faCircleQuestion} />
         </Link>

         <Image src={challengeToken} height={100} width={100} alt={leaderboard.challenge.name} />

         <div className={css.text}>
            <h1>
               {leaderboard.challenge.name}
               {/* TODO PIN */}
            </h1>

            <p className={css.description}>{leaderboard.challenge.description}</p>

            <div className={css.tags}>
               {leaderboard.title === null ? null : (
                  <div className={`${css.tag} ${leaderboard.title?.tier} ${css.title}`}>
                     <span>
                        <div className={css.svg}>
                           <TitleIcon />
                        </div>
                        {` ${leaderboard.title?.title}`}
                     </span>
                  </div>
               )}

               {leaderboard.parents.length === 0 ? null : (
                  <div className={css.tag}>
                     {leaderboard.parents.map((parent, ix) => (
                        <span key={parent.id}>
                           {ix > 0 ? " > " : <></>}
                           <Link href={"/challenges/" + parent.id}>
                              <div className={css.svg}>
                                 <CapstoneIcon />
                              </div>
                              {` ${parent.id === 0 ? "Challenge Points Leaderboard" : parent.name}`}
                           </Link>
                        </span>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

interface ChallengeHeadingProps {
   leaderboard: LeaderboardChallenge;
}
