import type { Route } from "./+types/_index";
import Container from "@cgg/components/Container/Container";
import Heading from "@cgg/components/Heading/Heading";
import Searchbar from "@cgg/components/HomeSearch/Searchbar";
import SplashBackground from "@cgg/components/SplashBackground/SplashBackground";
import { brandName } from "@cgg/config/config";
import { indexLoader } from "@cgg/loader/_index";
import css from "@cgg/styles/home.module.scss";

export function meta({}: Route.MetaArgs) {
   return [
      {
         title: `${brandName}`,
      },
      {
         name: "description",
         content:
            "Lookup and track your League of League of Legends Challenges Progress. Compare your Challenge stats with others in any region. ",
      },
      {
         name: "keywords",
         content:
            "league of legends challenges lookup, challenges overview, league of legends, challenge stats, league of legends challenge tracker, lol challenges, challenge progress checker, challenge stats checker, lol challenge tracker, darkintaqt challenges",
      },
   ];
}

export const handle = {
   transparentHeader: true,
};

export async function loader(data: Route.LoaderArgs) {
   return indexLoader();
}

export async function clientLoader(data: Route.LoaderArgs) {
   return indexLoader();
}

export const shouldRevalidate = () => false;

export default function Home({ loaderData }: Route.ComponentProps) {
   const { splash, logo } = loaderData;

   return (
      <section className={css.home}>
         <SplashBackground splash={splash} />
         <div className={css.overlay} />
         <Container className={css.content}>
            <Heading level={1}>
               <img src={logo} alt={brandName} />
            </Heading>
            <Heading level={2}>Challenge Leaderboards and Progress Tracker</Heading>
            <Searchbar />
         </Container>
      </section>
   );
}
