import type { Route } from "./+types/challenges.$challengeId._index";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import LeaderboardComponent from "@cgg/components/Leaderboard/Leaderboard";
import { useStaticData } from "@cgg/hooks/useStaticData";
import { challengeLoader } from "@cgg/loader/challenge";

export default function Leaderboard({ loaderData, params }: Route.ComponentProps) {
   const challenge = useStaticData().challenges[params.challengeId];
   return <LeaderboardComponent entries={loaderData.leaderboard} challenge={challenge} />;
}

export async function loader({ params, request }: Route.LoaderArgs) {
   return await challengeLoader({ params, url: request.url });
}

export async function clientLoader(args: Route.LoaderArgs) {
   return await challengeLoader({ params: args.params, url: args.request.url });
}

export const shouldRevalidate = ({
   currentParams,
   currentUrl,
   nextParams,
   nextUrl,
}: ShouldRevalidateFunctionArgs) => {
   return (
      currentParams.challengeId !== nextParams.challengeId ||
      currentUrl.searchParams.getAll("region").toString() !==
         nextUrl.searchParams.getAll("region").toString()
   );
};
