import Heading from "@cgg/components/Heading/Heading";
import { useStaticData } from "@cgg/hooks/useStaticData";
import type { IApiChallengeResponse } from "@cgg/utils/endpoints/types";
import Categories from "./Categories";
import css from "./userStatistics.module.scss";

export default function UserStatistics({
   playerData,
}: {
   playerData: IApiChallengeResponse;
}) {
   return (
      <div className={css.wrapper}>
         <div className={css.section}>
            <Heading level={2}>Categories</Heading>
            <Categories playerData={playerData} />
         </div>
      </div>
   );
}
