import type { Route } from "./+types/titles";
import { serialize } from "cookie";
import { useEffect, useState } from "react";
import Buttons from "@cgg/components/Buttons/Buttons";
import Container from "@cgg/components/Container/Container";
import Heading from "@cgg/components/Heading/Heading";
import Searchbar from "@cgg/components/Searchbar/Searchbar";
import Title from "@cgg/components/Title/Title";
import { brandName, cookieNames } from "@cgg/config/config";
import { useStaticData } from "@cgg/hooks/useStaticData";
import { titleLoader } from "@cgg/loader/titles";
import css from "@cgg/styles/titles.module.scss";

export function meta({}: Route.MetaArgs) {
   return [
      { title: `Titles | ${brandName}` },
      {
         name: "description",
         content: "All obtainable titles in League of Legends and how to get them. ",
      },
   ];
}

export async function loader({ request }: Route.LoaderArgs) {
   return await titleLoader(request, false);
}

export async function clientLoader({ request }: Route.LoaderArgs) {
   return await titleLoader(request, true);
}

export type titleFilter = "CHALLENGE" | "EVENT" | "CHAMPION";

export default function Titles({ loaderData }: Route.ComponentProps) {
   const data = useStaticData();
   const { championData } = loaderData;
   const champions = Object.values(championData.data);
   const titles = data.titles;

   const [filters, setFilter] = useState<titleFilter[]>(loaderData.filter);
   const [search, setSearch] = useState(loaderData.search);

   useEffect(() => {
      document.cookie = serialize(
         cookieNames.titleFilter,
         btoa(JSON.stringify({ filters, search })),
         {
            path: "/",
         },
      );
   }, [filters, search]);

   return (
      <Container center headerPadding className={css.titlesContainer}>
         <div className={css.head}>
            <Heading>All Titles</Heading>
            <p>
               A list of all League of Legends Title Challenges and how to achieve them
            </p>
         </div>

         <div className={css.filters}>
            <Searchbar
               value={search} // this doesn't feel right
               placeholder={"Search titles"}
               onChange={setSearch}
               id={css.titlesContainer}
            />
            <Buttons<titleFilter>
               buttons={[
                  { name: "Challenges", id: "CHALLENGE" },
                  { name: "Champions", id: "CHAMPION" },
                  { name: "Events", id: "EVENT" },
               ]}
               state={filters}
               setState={setFilter}
            />
         </div>

         <div className={css.titles}>
            {Object.values(titles)
               .filter((title) => {
                  let type: titleFilter = "EVENT";
                  if (title.challengeId !== undefined) type = "CHALLENGE";
                  if (title.type === "CHAMPION_MASTERY" && title.requirement)
                     type = "CHAMPION";

                  const typeMatch = filters.length === 0 || filters.includes(type);
                  const searchMatch =
                     search.length === 0 ||
                     title.name.toLowerCase().includes(search.toLowerCase()) ||
                     title.requirement?.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                     title.requirement?.description
                        .toLowerCase()
                        .includes(search.toLowerCase());

                  return typeMatch && searchMatch;
               })
               .sort((a, b) => a.name.localeCompare(b.name))
               .map((title) => (
                  <Title title={title} key={title.id} champions={champions} />
               ))}
         </div>
      </Container>
   );
}

export const shouldRevalidate = () => false;
