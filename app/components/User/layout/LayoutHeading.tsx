import clsx from "clsx";
import Heading from "@cgg/components/Heading/Heading";
import { TitleIcon } from "@cgg/components/Icons";
import Tooltip from "@cgg/components/Tooltip/Tooltip";
import { useStaticData } from "@cgg/hooks/useStaticData";
import cssVariables from "@cgg/styles/variables.module.scss";
import { capitalize } from "@cgg/utils/capitalize";
import { getChallengeIcon, getProfileIcon } from "@cgg/utils/cdn";
import type { IApiChallengeResponse } from "@cgg/utils/endpoints/types";
import { formatNumber } from "@cgg/utils/formatNumber";
import { getChallenge, getUserChallenge } from "@cgg/utils/getChallenge";
import getTitle from "@cgg/utils/getTitle";
import { regionToString } from "@cgg/utils/regionToString";
import css from "./layoutHeading.module.scss";

export function LayoutHeading({
   playerData,
}: Readonly<{ playerData: IApiChallengeResponse }>) {
   const { summoner, gameName, tagLine, region } = playerData;
   const tier = summoner.tier;
   const data = useStaticData();

   const fullName = `${gameName}#${tagLine}`;
   const title = getTitle(summoner.title, data);

   return (
      <div className={css.head}>
         <div className={clsx(css.icon, cssVariables[tier])}>
            <img
               src={getProfileIcon(summoner.profileIcon)}
               alt={`${fullName}'s profile icon'`}
            />
            <span className={css.level}>{summoner.level}</span>
         </div>

         <div className={css.right}>
            <Heading>
               {gameName}
               <span className={css.tagLine}>#{tagLine}</span>
               <span className={css.region}> in {regionToString(region).name}</span>
            </Heading>
            <div className={css.achievements}>
               <Tooltip
                  tooltip={
                     <>
                        <Heading level={3}>{capitalize(tier)} tier</Heading>
                        <p>
                           This summoner has {formatNumber(summoner.totalPoints)} total
                           points.
                        </p>
                     </>
                  }
                  className={cssVariables[tier]}
               >
                  <span className={css.tier}>
                     {capitalize(tier)} ({formatNumber(summoner.totalPoints)})
                  </span>
               </Tooltip>

               {/* Title */}
               {title && (
                  <Tooltip
                     tooltip={
                        <>
                           <Heading level={3}>
                              {title.tier !== "NONCHALLENGE"
                                 ? capitalize(title.tier)
                                 : "Custom "}{" "}
                              Title
                           </Heading>
                           {title.challengeId && (
                              <p>{getChallenge(title.challengeId, data)?.description}</p>
                           )}
                        </>
                     }
                     className={cssVariables[title.tier]}
                  >
                     <span className={css.tier}>
                        <TitleIcon />
                        {title.name}
                     </span>
                  </Tooltip>
               )}
            </div>

            <div className={css.displayed}>
               {summoner.displayedChallenges
                  ?.filter((challenge) => challenge >= 0)
                  .map((challenge) => {
                     const challengeData = getChallenge(challenge, data);

                     if (!challengeData) return;

                     return (
                        <Tooltip
                           key={challenge}
                           tooltip={
                              <>
                                 <Heading level={3}>{challengeData.name}</Heading>
                                 <p>{challengeData.description}</p>
                              </>
                           }
                        >
                           <img
                              className={css.display}
                              src={getChallengeIcon(
                                 challengeData.iconId,
                                 getUserChallenge(challenge, playerData, data)?.tier,
                              )}
                              alt={String(challenge)}
                           />
                        </Tooltip>
                     );
                  })}
            </div>
         </div>
      </div>
   );
}
