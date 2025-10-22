import type { Route } from "./+types/challenges.$challengeId";
import { useEffect } from "react";
import { Outlet, type ShouldRevalidateFunctionArgs } from "react-router";
import LeaderboardLayout from "@cgg/components/Leaderboard/Layout/LeaderboardLayout";
import { brandName } from "@cgg/config/config";
import { useStaticData } from "@cgg/hooks/useStaticData";
import { challengeLayoutLoader } from "@cgg/loader/challenge.layout";
import { type Recent, addRecentSearch } from "@cgg/utils/recents";

export default function Challenge({ params }: Route.ComponentProps) {
   const data = useStaticData();
   const challenge = data?.challenges[params.challengeId];
   if (!challenge) {
      return new Error("Challenge not found");
   }

   useEffect(() => {
      addRecentSearch({
         type: "challenge",
         id: challenge.id,
         iconId: challenge.iconId,
         name: challenge.name,
         description: challenge.description,
      } as Recent);
   }, []);

   return (
      <LeaderboardLayout>
         <title>{`${challenge.name} Leaderboard | ${brandName}`}</title>
         <Outlet />
      </LeaderboardLayout>
   );
}

export async function loader({ params }: Route.LoaderArgs) {
   return await challengeLayoutLoader({ params });
}

export async function clientLoader({ params }: Route.LoaderArgs) {
   return await challengeLayoutLoader({ params });
}

export const shouldRevalidate = ({
   currentParams,
   nextParams,
}: ShouldRevalidateFunctionArgs) => {
   return currentParams.challengeId !== nextParams.challengeId;
};
