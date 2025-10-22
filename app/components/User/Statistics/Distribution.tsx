import { LineChart } from "@mui/x-charts";
import { useStaticData } from "@cgg/hooks/useStaticData";
import { capitalize } from "@cgg/utils/capitalize";
import type { IApiChallengeResponse } from "@cgg/utils/endpoints/types";
import { getChallenge } from "@cgg/utils/getChallenge";
import { tierList } from "@cgg/utils/suffixToTier";
import type { Tier } from "@cgg/utils/tier";

const tiers = ["UNRANKED" as Tier, ...tierList];

export default function Distribution({
   playerData,
}: {
   playerData: IApiChallengeResponse;
}) {
   const data = useStaticData();

   return (
      <LineChart
         xAxis={[
            {
               scaleType: "band",
               data: tiers.map((t) => capitalize(t)),
            },
         ]}
         series={[
            {
               data: tiers.map((t) => {
                  let amount = playerData.challenges.filter((c) => {
                     const challenge = getChallenge(c.challengeId, data);
                     if (!challenge) return false;
                     if (challenge.retired) return false;

                     if (t === "UNRANKED") {
                        return (["UNRANKED", "NONCHALLENGE", "NONE"] as Tier[]).includes(
                           c.tier,
                        );
                     }
                     return c.tier === t;
                  }).length;
                  if (t === "UNRANKED") {
                     amount +=
                        Object.keys(data.challenges).length -
                        playerData.challenges.length;
                  }

                  return amount;
               }),
               label: "challenges in tier",
               color: "#0dbdff",
            },
         ]}
         hideLegend={true}
         height={300}
         grid={{ vertical: true, horizontal: true }}
      />
   );
}
