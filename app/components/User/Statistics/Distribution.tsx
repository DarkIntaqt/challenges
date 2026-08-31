import { BarChart } from "@mui/x-charts";
import { useStaticData } from "@cgg/hooks/useStaticData";
import cssVariables from "@cgg/styles/variables.module.scss";
import { capitalize } from "@cgg/utils/capitalize";
import type { IApiChallengeResponse } from "@cgg/utils/endpoints/types";
import { getChallenge } from "@cgg/utils/getChallenge";
import { tierList } from "@cgg/utils/getTier";
import type { Tier } from "@cgg/utils/tier";

const tiers = ["UNRANKED" as Tier, ...tierList];

const fallbackTierColors: Record<Tier, string> = {
   NONE: "hsl(0, 0%, 41%)",
   UNRANKED: "hsl(0, 0%, 41%)",
   IRON: "hsl(0, 0%, 41%)",
   BRONZE: "hsl(17, 42%, 39%)",
   SILVER: "hsl(189, 12%, 56%)",
   GOLD: "hsl(31, 60%, 52%)",
   PLATINUM: "hsl(171, 65%, 36%)",
   DIAMOND: "hsl(230, 55%, 57%)",
   MASTER: "hsl(286, 64%, 55%)",
   GRANDMASTER: "hsl(351, 65%, 66%)",
   CHALLENGER: "hsl(40, 85%, 70%)",
   NONCHALLENGE: "hsl(0, 0%, 41%)",
};

function getTierColor(tier: Tier): string {
   if (typeof document === "undefined") {
      return fallbackTierColors[tier];
   }

   const colorNode = document.createElement("div");
   colorNode.className = cssVariables[tier];
   colorNode.style.position = "absolute";
   colorNode.style.visibility = "hidden";
   colorNode.style.pointerEvents = "none";
   colorNode.style.opacity = "0";
   document.body.appendChild(colorNode);

   const color = getComputedStyle(colorNode).getPropertyValue("--tier").trim();
   colorNode.remove();

   return color || fallbackTierColors[tier];
}

export default function Distribution({
   playerData,
}: {
   playerData: IApiChallengeResponse;
}) {
   const data = useStaticData();
   const tierColors = tiers.reduce<Record<Tier, string>>(
      (acc, tier) => {
         acc[tier] = getTierColor(tier);
         return acc;
      },
      {} as Record<Tier, string>,
   );

   const values = tiers.map((t) => {
      let amount = playerData.challenges.filter((c) => {
         const challenge = getChallenge(c.challengeId, data);
         if (!challenge) return false;
         if (challenge.retired) return false;

         if (t === "UNRANKED") {
            return (["UNRANKED", "NONCHALLENGE", "NONE"] as Tier[]).includes(c.tier);
         }
         return c.tier === t;
      }).length;

      if (t === "UNRANKED") {
         amount += Object.keys(data.challenges).length - playerData.challenges.length;
      }

      return amount;
   });

   return (
      <BarChart
         xAxis={[
            {
               scaleType: "band",
               data: tiers.map((t) => capitalize(t)),
            },
         ]}
         series={[
            {
               data: values,
               label: "Challenges in tier",
               colorGetter: ({ dataIndex }) => tierColors[tiers[dataIndex]],
            },
         ]}
         hideLegend={true}
         height={300}
         borderRadius={4}
         grid={{ vertical: true, horizontal: true }}
      />
   );
}
