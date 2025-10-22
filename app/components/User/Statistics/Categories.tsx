import clsx from "clsx";
import { Link } from "react-router";
import ProgressBar from "@cgg/components/ProgressBar/ProgressBar";
import { useStaticData } from "@cgg/hooks/useStaticData";
import variables from "@cgg/styles/variables.module.scss";
import { getChallengeIcon } from "@cgg/utils/cdn";
import type { IApiChallengeResponse } from "@cgg/utils/endpoints/types";
import { formatNumber } from "@cgg/utils/formatNumber";
import { getChallenge } from "@cgg/utils/getChallenge";
import { getNextTier } from "@cgg/utils/getTier";
import css from "./userStatistics.module.scss";

// Total (0), Collection (5), Expertise (2), Veterancy (3), Imagination (1), Teamwork (4)
const categories = [0, 5, 2, 3, 1, 4];

export default function Categories({
   playerData,
}: {
   playerData: IApiChallengeResponse;
}) {
   const data = useStaticData();

   return (
      <div className={css.categories}>
         {categories.map((cat) => {
            const challenge = getChallenge(cat, data);
            const playerProgress = playerData.challenges.find(
               (c) => c.challengeId === cat,
            );

            if (!challenge) return null;
            if (!playerProgress) return null;

            const nextTier = getNextTier(playerProgress.tier, challenge, false);
            const nextPoints = challenge.thresholds[nextTier].points;
            const currentTierPoints = challenge.thresholds[playerProgress.tier].points;
            const currentPoints = playerProgress.value;

            if (challenge.id === 0) {
               challenge.name = "Total Points";
            }

            return (
               <Link
                  to={`/challenges/${challenge.id}`}
                  className={clsx(css.category, variables[playerProgress.tier])}
                  key={cat}
               >
                  <div className={css.head}>
                     <img
                        src={getChallengeIcon(challenge.id, playerProgress.tier)}
                        alt=""
                     />
                     <p className={css.title}>{challenge.name}</p>
                  </div>
                  <div className={css.progress}>
                     <span>
                        {formatNumber(currentPoints, false)} /{" "}
                        {formatNumber(nextPoints, false)}
                     </span>
                  </div>
                  <ProgressBar
                     tier={playerProgress.tier}
                     current={currentPoints}
                     next={nextPoints}
                     progress={
                        (currentPoints - currentTierPoints) /
                        (nextPoints - currentTierPoints)
                     }
                     pinned
                  />
               </Link>
            );
         })}
      </div>
   );
}
