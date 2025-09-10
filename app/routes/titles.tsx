import type { Route } from "./+types/titles";
import { useState } from "react";
import Buttons from "@cgg/components/Buttons/Buttons";
import Container from "@cgg/components/Container/Container";
import Heading from "@cgg/components/Heading/Heading";
import Searchbar from "@cgg/components/Searchbar/Searchbar";
import Title from "@cgg/components/Title/Title";
import { brandName } from "@cgg/config/config";
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

export async function loader({}: Route.LoaderArgs) {
   return await titleLoader();
}

export async function clientLoader({}: Route.LoaderArgs) {
   return await titleLoader();
}

type filter = "CHALLENGE" | "EVENT" | "CHAMPION";

export default function Titles({ loaderData }: Route.ComponentProps) {
   const data = useStaticData();
   const { championData } = loaderData;
   const champions = Object.values(championData.data);
   const titles = data.titles;

   const [filters, setFilter] = useState<filter[]>([]);
   const [search, setSearch] = useState("");

   return (
      <Container center headerPadding className={css.titlesContainer}>
         <div className={css.head}>
            <Heading>All Titles</Heading>
            <p>
               A list of all League of Legends Title Challenges and how to achieve them
            </p>
         </div>

         <div className={css.filters}>
            <Searchbar placeholder={"Search titles"} onChange={setSearch} />
            <Buttons<filter>
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
                  let type: filter = "EVENT";
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
