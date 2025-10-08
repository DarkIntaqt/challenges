import type { Route } from "./+types/profile.$profile._index";
import UserStatistics from "@cgg/components/User/Statistics/UserStatistics";

export default function Profile({ matches }: Route.ComponentProps) {
   const playerData = matches[1].loaderData;

   return <UserStatistics playerData={playerData} />;
}
