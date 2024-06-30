"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useState } from "react";
import {
   faArrowDownAZ,
   faArrowDownZA,
   faArrowUpRightDots,
   faClock,
   faHashtag,
   faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ChallengeObject from "challenges/components/User/ChallengeObject";
import {
   ChallengeHydrated,
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
   const [filtersApplied, setFiltersApplied] = useState<FiltersApplied>({
      category: [],
      type: [],
      gamemode: [],
      hideCapstones: false,
      hideMaxedOut: false,
      masterThresholds: false,
   });
   const [sortingApplied, setSortingApplied] = useState<SortBy>("level");
   const [searchQuery, setSearchQuery] = useState<string>("");

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

   const switchSorting = (sorting: SortBy): void => {
      if (sorting === "az") {
         setSortingApplied(sortingApplied === "az" ? "za" : "az");
      } else if (sorting !== sortingApplied) {
         setSortingApplied(sorting);
      }
   };

   const switchBool = (prop: KeysOfType<FiltersApplied, boolean>): void => {
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
                  <button
                     onClick={() => switchBool("hideCapstones")}
                     className={filtersApplied.hideCapstones ? filterCss.selected : ""}
                  >
                     <Image width={16} height={16} src={filterGameModeIcon("c.png")} alt={"Hide Capstones"} />
                     {"Hide Capstones"}
                  </button>
                  <button
                     onClick={() => switchBool("hideMaxedOut")}
                     className={filtersApplied.hideMaxedOut ? filterCss.selected : ""}
                  >
                     <Image width={16} height={16} src={filterGameModeIcon("i.png")} alt={"Hide Maxed out"} />
                     {"Hide Maxed out"}
                  </button>
                  <button
                     onClick={() => switchBool("masterThresholds")}
                     className={filtersApplied.masterThresholds ? filterCss.selected : ""}
                  >
                     <Image width={16} height={16} src={filterGameModeIcon("m.png")} alt={"Set Master thresholds"} />
                     {"Set Master thresholds"}
                  </button>
               </div>

               <div className={filterCss.category}>
                  <p className={filterCss.cheading}>{capitalize("sort by")}</p>
                  <button
                     onClick={() => switchSorting("level")}
                     className={sortingApplied === "level" ? filterCss.selected : ""}
                  >
                     <FontAwesomeIcon icon={faRankingStar} />
                     {"Rank"}
                  </button>
                  <button
                     onClick={() => switchSorting("timestamp")}
                     className={sortingApplied === "timestamp" ? filterCss.selected : ""}
                  >
                     <FontAwesomeIcon icon={faClock} />
                     {"Last upgraded"}
                  </button>
                  <button
                     onClick={() => switchSorting("percentile")}
                     className={sortingApplied === "percentile" ? filterCss.selected : ""}
                  >
                     <FontAwesomeIcon icon={faHashtag} />
                     {"Leaderboard Position"}
                  </button>
                  <button
                     onClick={() => switchSorting("levelup")}
                     className={sortingApplied === "levelup" ? filterCss.selected : ""}
                  >
                     <FontAwesomeIcon icon={faArrowUpRightDots} />
                     {"Closest Level-up"}
                  </button>
                  <button
                     onClick={() => switchSorting("az")}
                     className={sortingApplied === "az" || sortingApplied === "za" ? filterCss.selected : ""}
                  >
                     <FontAwesomeIcon icon={sortingApplied === "za" ? faArrowDownZA : faArrowDownAZ} />
                     {sortingApplied === "za" ? "Z-A" : "A-Z"}
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
               sortingApplied,
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
