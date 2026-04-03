import { ThemeProvider } from "@mui/material/styles";
import Heading from "@cgg/components/Heading/Heading";
import type { IApiChallengeResponse } from "@cgg/utils/endpoints/types";
import Categories from "./Categories";
import Distribution from "./Distribution";
import darkTheme from "./theme";
import css from "./userStatistics.module.scss";

export default function UserStatistics({
   playerData,
}: {
   playerData: IApiChallengeResponse;
}) {
   return (
      <ThemeProvider theme={darkTheme}>
         <div className={css.wrapper}>
            <div className={css.section} style={{ gridArea: "1 / 1 / 2 / 3" }}>
               <Heading level={2}>Categories</Heading>
               <Categories playerData={playerData} />
            </div>
            <div className={css.section} style={{ gridArea: "2 / 2 / 3 / 3" }}>
               <Heading level={2}>Distribution</Heading>
               <Distribution playerData={playerData} />
            </div>
         </div>
      </ThemeProvider>
   );
}
