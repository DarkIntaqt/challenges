import type { Route } from "./+types/_index";
import Container from "@cgg/components/Container/Container";
import Heading from "@cgg/components/Heading/Heading";
import Searchbar from "@cgg/components/HomeSearch/Searchbar";
import { brandName } from "@cgg/config/config";
import { indexLoader } from "@cgg/loader/_index";
import css from "@cgg/styles/home.module.scss";

export function meta({}: Route.MetaArgs) {
   return [
      { title: `${brandName}` },
      { name: "description", content: "Welcome to React Router!" },
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

export default function Home({ loaderData }: Route.ComponentProps) {
   const splash = loaderData.splash;

   return (
      <section className={css.home}>
         <img className={css.bgSplash} src={splash} draggable={false} />
         <div className={css.overlay} />
         <Container className={css.content}>
            <Heading level={1}>{brandName}</Heading>
            <Heading level={2}>Challenge Leaderboards and Progress Tracker</Heading>
            <Searchbar />
         </Container>
      </section>
   );
}
