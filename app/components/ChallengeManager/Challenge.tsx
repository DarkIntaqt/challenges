import clsx from "clsx";
import { Link } from "react-router";
import { seasonalCapstones } from "@cgg/config/seasonalCapstones";
import { useStaticData } from "@cgg/hooks/useStaticData";
import variables from "@cgg/styles/variables.module.scss";
import { capitalize } from "@cgg/utils/capitalize";
import { getChallengeIcon, getGamemodeIcon } from "@cgg/utils/cdn";
import { getChallengeSourceIcon } from "@cgg/utils/challengeSource";
import type { IChallengeDTO } from "@cgg/utils/challenges";
import type { IApiChallenge } from "@cgg/utils/endpoints/types";
import { formatNumber } from "@cgg/utils/formatNumber";
import { getChallenge } from "@cgg/utils/getChallenge";
import { getParents } from "@cgg/utils/getParent";
import { getNextTier, getPosition, getTier } from "@cgg/utils/getTier";
import Heading from "../Heading/Heading";
import ProgressBar from "../ProgressBar/ProgressBar";
import css from "./challenge.module.scss";

export default function Challenge({
   challenge,
   user,
}: {
   challenge: IChallengeDTO;
   user?: IApiChallenge;
}) {
   const data = useStaticData();
   const tier = getTier(challenge, user);
   const parents = getParents(challenge, data.challenges);

   const isUser = typeof user !== "undefined";
   const nextTier = getNextTier(tier, challenge, true);
   let nextValue = challenge.thresholds[nextTier].points;
   let currentValue = user?.value;

   // Get the category of the challenge
   const category = parents[parents.length - 1];
   const gameMode = challenge.gameMode;
   const source = challenge.source;
   const isSeasonal = category === -1 && seasonalCapstones.includes(parents[0]);

   const isRetired = challenge.retired;
   const position = isUser ? getPosition(user, challenge) : 0;

   return (
      <Link
         className={clsx(
            css.challenge,
            isRetired && css.retired,
            isUser && css.user,
            variables[tier],
         )}
         to={`/challenges/${challenge.id}`}
      >
         <img
            src={getChallengeIcon(challenge.iconId, tier)}
            alt={challenge.name}
            className={css.icon}
            loading="lazy"
         />
         <div className={css.text}>
            <Heading level={3} className={css.title}>
               {challenge.name}
            </Heading>

            <p>
               {!isUser &&
                  parents
                     .map((parentId) => {
                        if (parentId === -1) return "Legacy";
                        if (parentId < 10 && parents.length > 1) return null;
                        return getChallenge(parentId, data)?.name;
                     })
                     .filter((n) => n !== null)
                     .join(" > ")}
               {isUser && (
                  <>
                     {/* Position is disabled until further notice */}
                     {position > 0 && `#${formatNumber(position)} - `}
                     {user.percentile !== undefined &&
                        `Top ${(user.percentile * 100).toFixed(1)}% - `}
                     {user.percentile === undefined &&
                        user.tier === "UNRANKED" &&
                        "Top 100.0% - "}
                     {formatNumber(currentValue ?? 0, "M")} /{" "}
                     {formatNumber(nextValue, "M")}
                  </>
               )}
            </p>
         </div>
         <div className={css.icons}>
            {isSeasonal && (
               <span>
                  '{challenge.id.toString().charAt(2) + challenge.id.toString().charAt(3)}
               </span>
            )}
            {category && !isSeasonal && (
               <img
                  src={getChallengeIcon(category)}
                  draggable={false}
                  title={getChallenge(category, data)?.name || "Legacy"}
               />
            )}
            {gameMode !== "none" && (
               <img
                  src={getGamemodeIcon(gameMode)}
                  draggable={false}
                  title={capitalize(gameMode)}
               />
            )}
            {source !== "EOGD" && getChallengeSourceIcon(source)}
         </div>
         <p className={css.description}>{challenge.descriptionShort}</p>

         {isUser && <p className={css.tier}>{capitalize(tier)}</p>}

         {isUser && (
            <ProgressBar
               current={currentValue}
               next={nextValue}
               pinned
               className={css.progress}
            />
         )}
      </Link>
   );
}
