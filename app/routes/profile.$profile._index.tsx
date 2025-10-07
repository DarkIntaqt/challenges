import type { Route } from "./+types/profile.$profile._index";
import ChallengeManager from "@cgg/components/ChallengeManager/ChallengeManager";
import { brandName } from "@cgg/config/config";
import { challengesLoader } from "@cgg/loader/challengesFilter";

export async function loader({ request }: Route.LoaderArgs) {
   return await challengesLoader(request, "profile", false);
}

export async function clientLoader({ request }: Route.LoaderArgs) {
   return await challengesLoader(request, "profile", true);
}

export default function Profile({ matches, loaderData }: Route.ComponentProps) {
   const playerData = matches[1].loaderData;
   const { gameName, tagLine } = playerData;

   return (
      <>
         <title>{`${gameName}#${tagLine} - Profile | ${brandName}`}</title>
         <ChallengeManager
            location="profile"
            defaultFilter={loaderData.filter}
            userData={playerData}
         />
      </>
   );
}
