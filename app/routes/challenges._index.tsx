import type { Route } from "./+types/challenges._index";
import ChallengeManager from "@cgg/components/ChallengeManager/ChallengeManager";
import Container from "@cgg/components/Container/Container";
import Heading from "@cgg/components/Heading/Heading";
import { brandName } from "@cgg/config/config";
import { challengesLoader } from "@cgg/loader/challengesFilter";
import css from "@cgg/styles/challenges.module.scss";

export function meta({}: Route.MetaArgs) {
   return [
      { title: `Challenges | ${brandName}` },
      {
         name: "description",
         content: "All challenges in League of Legends and how to get them. ",
      },
   ];
}

export async function loader({ request }: Route.LoaderArgs) {
   return await challengesLoader(request, "overview", false);
}

export async function clientLoader({ request }: Route.LoaderArgs) {
   return await challengesLoader(request, "overview", true);
}

export default function Challenges({ loaderData }: Route.ComponentProps) {
   const { filter } = loaderData;

   return (
      <Container center headerPadding className={css.challengesContainer}>
         <div>
            <Heading>List of all Challenges</Heading>
            <p>Overview, stats and how to obtain them.</p>
         </div>

         <ChallengeManager location="overview" defaultFilter={filter} />
      </Container>
   );
}
