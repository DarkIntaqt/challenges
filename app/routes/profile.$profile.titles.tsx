import type { Route } from "./+types/profile.$profile._index";

export default function Profile({ matches }: Route.ComponentProps) {
   const playerData = matches[1].loaderData;

   return "titles, " + playerData.gameName + " " + playerData.tagLine;
}
