"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useState } from "react";
import {
   faArrowDownAZ,
   faArrowDownZA,
   faArrowUpRightDots,
   faClock,
   faGrip,
   faHashtag,
   faList,
   faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ChallengeObject from "challenges/components/User/ChallengeObject";
import {
   ChallengeHydrated,
   DisplayAs,
   FilterItem,
   FiltersApplied,
   FiltersMap,
   SortBy,
   UserChallengesMap,
} from "challenges/types/draft.types";
import { KeysOfType } from "challenges/types/general.types";
import { filterGameModeIcon } from "challenges/utils/cdnHelpers";
import { challengeFilter } from "challenges/utils/challengeFilter";
import { capitalize } from "challenges/utils/stringManipulation";

import css from "challenges/styles/challenges.module.scss";
import filterCss from "challenges/styles/filter.module.scss";

export default function UserChallenges({
   challenges,
   userChallenges,
   filters,
   seasonPrevious,
   seasonsRetired,
}: UserChallengesProps): ReactNode {
   const [displayAs, setDisplayAs] = useState<DisplayAs>("list");
   const [filtersApplied, setFiltersApplied] = useState<FiltersApplied>({
      category: [],
      type: [],
      gamemode: [],
      sortBy: "level",
      hideCapstones: false,
      hideMaxedOut: false,
      masterThresholds: false,
   });
   const [searchQuery, setSearchQuery] = useState<string>("");

   const toggleDisplayAs = (): void => {
      setDisplayAs(displayAs === "list" ? "grid" : "list");
   };

   const toggleFilter = (toggle: FilterItem): void => {
      const isApplied = filtersApplied[toggle.category].find((aid) => aid === toggle.id);
      let newGroup;
      if (isApplied) {
         newGroup = filtersApplied[toggle.category].filter((aid) => aid !== toggle.id);
      } else {
         newGroup = filtersApplied[toggle.category].slice();
         newGroup.push(toggle.id);
      }
      setFiltersApplied({ ...filtersApplied, [toggle.category]: newGroup });
   };

   const toggleSorting = (sorting: SortBy): void => {
      if (sorting === "az") {
         setFiltersApplied({ ...filtersApplied, sortBy: filtersApplied.sortBy === "az" ? "za" : "az" });
      } else if (sorting !== filtersApplied.sortBy) {
         setFiltersApplied({ ...filtersApplied, sortBy: sorting });
      }
   };

   const toggleBool = (prop: KeysOfType<FiltersApplied, boolean>): void => {
      setFiltersApplied({ ...filtersApplied, [prop]: !filtersApplied[prop] });
   };

   const debounce = (func: Function, delay: number) => {
      let timer: NodeJS.Timeout;
      return function (...args: unknown[]) {
         clearTimeout(timer);
         // @ts-ignore
         timer = setTimeout(() => func.apply(this, args), delay);
      };
   };

   const handleInputChange = (event: FormEvent) => {
      if (!("value" in event.target)) return;
      const query = event.target.value as string;
      debounce(setSearchQuery, 500)(query);
   };

   return (
      <section>
         <input
            type="search"
            placeholder="Search for a challenge"
            onInput={handleInputChange}
            className={filterCss.input}
         />

         <div className={filterCss.filter}>
            <div className={filterCss.selectors + " clearfix"}>
               <div className={filterCss.category}>
                  <button onClick={() => toggleDisplayAs()}>
                     <FontAwesomeIcon icon={displayAs === "list" ? faList : faGrip} />
                     {displayAs === "list" ? "List view" : "Grid view"}
                  </button>
                  <button
                     onClick={() => toggleBool("hideCapstones")}
                     className={filtersApplied.hideCapstones ? filterCss.selected : ""}
                  >
                     <Image width={16} height={16} src={filterGameModeIcon("c.png")} alt={"Hide Capstones"} />
                     {"Hide Capstones"}
                  </button>
                  <button
                     onClick={() => toggleBool("hideMaxedOut")}
                     className={filtersApplied.hideMaxedOut ? filterCss.selected : ""}
                  >
                     <Image width={16} height={16} src={filterGameModeIcon("i.png")} alt={"Hide Maxed out"} />
                     {"Hide Maxed out"}
                  </button>
                  <button
                     onClick={() => toggleBool("masterThresholds")}
                     className={filtersApplied.masterThresholds ? filterCss.selected : ""}
                  >
                     <Image width={16} height={16} src={filterGameModeIcon("m.png")} alt={"Set Master thresholds"} />
                     {"Set Master thresholds"}
                  </button>
               </div>

               <div className={filterCss.category}>
                  <p className={filterCss.cheading}>{capitalize("sort by")}</p>
                  <button
                     onClick={() => toggleSorting("level")}
                     className={filtersApplied.sortBy === "level" ? filterCss.selected : ""}
                  >
                     <FontAwesomeIcon icon={faRankingStar} />
                     {"Rank"}
                  </button>
                  <button
                     onClick={() => toggleSorting("timestamp")}
                     className={filtersApplied.sortBy === "timestamp" ? filterCss.selected : ""}
                  >
                     <FontAwesomeIcon icon={faClock} />
                     {"Last upgraded"}
                  </button>
                  <button
                     onClick={() => toggleSorting("percentile")}
                     className={filtersApplied.sortBy === "percentile" ? filterCss.selected : ""}
                  >
                     <FontAwesomeIcon icon={faHashtag} />
                     {"Leaderboard Position"}
                  </button>
                  <button
                     onClick={() => toggleSorting("levelup")}
                     className={filtersApplied.sortBy === "levelup" ? filterCss.selected : ""}
                  >
                     <FontAwesomeIcon icon={faArrowUpRightDots} />
                     {"Closest Level-up"}
                  </button>
                  <button
                     onClick={() => toggleSorting("az")}
                     className={
                        filtersApplied.sortBy === "az" || filtersApplied.sortBy === "za" ? filterCss.selected : ""
                     }
                  >
                     <FontAwesomeIcon icon={filtersApplied.sortBy === "za" ? faArrowDownZA : faArrowDownAZ} />
                     {filtersApplied.sortBy === "za" ? "Z-A" : "A-Z"}
                  </button>
               </div>

               <p className={filterCss.info}>Filter (multiple choices)</p>
               <div className={filterCss.category}>
                  <p className={filterCss.cheading}>{capitalize("category")}</p>
                  {filters.category.map((filter) => (
                     <button
                        key={`${filter.category}_${filter.id}`}
                        onClick={() => toggleFilter(filter)}
                        className={filtersApplied[filter.category].includes(filter.id) ? filterCss.selected : ""}
                     >
                        <Image width={16} height={16} src={filter.image} alt={filter.name} />
                        {capitalize(filter.name)}
                     </button>
                  ))}
               </div>
               {/*
               <div className={filterCss.category}>
                  <p className={filterCss.cheading}>{capitalize("type")}</p>
                  {filters.type.map((filter) => (
                     <button
                        key={`${filter.category}_${filter.id}`}
                        onClick={() => toggleFilter(filter)}
                        className={filtersApplied[filter.category].includes(filter.id) ? filterCss.selected : ""}
                     >
                        <Image width={16} height={16} src={filter.image} alt={filter.name} />
                        {capitalize(filter.name)}
                     </button>
                  ))}
               </div>
                */}
               <div className={filterCss.category}>
                  <p className={filterCss.cheading}>{capitalize("game mode")}</p>
                  {filters.gamemode.map((filter) => (
                     <button
                        key={`${filter.category}_${filter.id}`}
                        onClick={() => toggleFilter(filter)}
                        className={filtersApplied[filter.category].includes(filter.id) ? filterCss.selected : ""}
                     >
                        <Image width={16} height={16} src={filter.image} alt={filter.name} />
                        {filter.name}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className={css.parent + " " + css.flexWidth}>
            {challengeFilter(
               challenges,
               seasonPrevious,
               seasonsRetired,
               userChallenges,
               filtersApplied,
               searchQuery,
            ).map((challenge) => (
               <ChallengeObject
                  key={challenge.id}
                  {...challenge}
                  setToMaster={filtersApplied.masterThresholds}
               ></ChallengeObject>
            ))}
         </div>
      </section>
   );
}

interface UserChallengesProps {
   challenges: ChallengeHydrated[];
   userChallenges: UserChallengesMap;
   filters: FiltersMap;
   seasonPrevious: string;
   seasonsRetired: string[];
}
