import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import TitleIcon from "challenges/assets/title.svg";
import HoverObject from "challenges/components/HoverObject";
import VipBadge from "challenges/components/VipBadge";
import { ChallengeDTO, ThresholdType, TitleDTO } from "challenges/types/challenges.types";
import { UserInfo } from "challenges/types/user.types";
import { challengeTokenIcon, profileIcon, profileIconFrame } from "challenges/utils/cdnHelpers";
import { capitalize } from "challenges/utils/stringManipulation";

import css from "challenges/styles/user.heading.module.scss";
import css1 from "challenges/styles/user.module.scss";

export default function UserHeading({ user, verified, challenges, titles }: UserHeadingProps): ReactNode {
   const titleInfo = titles?.[user.preferences.title];
   const titleTier = titleInfo?.challengeId ? user.challenges.find((c) => c.id === +titleInfo.challengeId!) : undefined;

   const challengeToken = (challengeId: number): ReactNode => {
      const challengeInfo = challenges?.[challengeId];
      const challengeUser = user.challenges.find((c) => c.id === challengeId);
      if (!challengeInfo || !challengeUser) return <></>;

      return (
         <HoverObject
            key={challengeId}
            hover={
               <div className={`${css1.hover} ${challengeUser.tier}`}>
                  <p>{challengeInfo.name}</p>
                  <span>
                     <b>{capitalize(challengeUser.tier)}</b> rank token
                  </span>
                  <br />
                  <span>
                     <i>{challengeInfo.description}</i>
                  </span>
               </div>
            }
         >
            <Image
               src={challengeTokenIcon(challengeId, challengeUser.tier as ThresholdType)}
               width={35}
               height={35}
               alt={challengeInfo.name}
            />
         </HoverObject>
      );
   };

   return (
      <div className={css.head}>
         <Image src={profileIcon(user.icon)} height={100} width={100} className={user.points.tier} alt="" />
         <Image src={profileIconFrame(user.points.tier)} height={140} width={140} className={css.edge} alt="" />

         <div>
            <h1>
               {user.name}
               <Link href={verified ? "/social/faq" : "/verify"} prefetch={false}>
                  <VipBadge size={"2rem"} verified={verified} margin="0" />
               </Link>
            </h1>

            <div className={css.tags}>
               <div className={`${css.tag} ${css.tier} ${user.points.tier}`}>
                  <Link href={"/challenges/0"}>{capitalize(user.points.tier)}</Link>
               </div>
               {titleInfo ? (
                  <div className={`${css.tag} ${css.title} ${titleTier?.tier}`}>
                     <div className={css.svg}>
                        <TitleIcon />
                     </div>
                     <Link href={`/challenges/${user.preferences.title}`}>{titleInfo.name}</Link>
                  </div>
               ) : (
                  <></>
               )}
            </div>

            <div className={css.selections}>
               {user.preferences.displayed.map((challengeId) => challengeToken(challengeId))}
            </div>
         </div>
      </div>
   );
}

interface UserHeadingProps {
   user: UserInfo;
   verified: boolean;
   challenges?: Record<string, ChallengeDTO>;
   titles?: Record<string, TitleDTO>;
}
