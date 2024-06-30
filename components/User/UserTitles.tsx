"use client";

import { FormEvent, ReactNode, useState } from "react";
import { faArrowDownAZ, faArrowDownZA, faArrowUpRightDots, faGrip, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TitleObject from "challenges/components/User/TitleObject";
import { ChallengeDTO, TitleDTO } from "challenges/types/challenges.types";
import { DisplayAs, TitlesFiltersApplied, TitlesSortBy, UserChallengesMap } from "challenges/types/draft.types";
import { capitalize } from "challenges/utils/stringManipulation";
import { titleFilter } from "challenges/utils/titleFilter";

import css from "challenges/styles/challenges.module.scss";
import filterCss from "challenges/styles/filter.module.scss";

export default function UserTitles({ challenges, titles, userChallenges }: UserTitlesProps): ReactNode {
   const [displayAs, setDisplayAs] = useState<DisplayAs>("list");
   const [filtersApplied, setFiltersApplied] = useState<TitlesFiltersApplied>({
      sortBy: "default",
   });
   const [searchQuery, setSearchQuery] = useState<string>("");

   const toggleDisplayAs = (): void => {
      setDisplayAs(displayAs === "list" ? "grid" : "list");
   };

   const toggleSorting = (sorting: TitlesSortBy): void => {
      if (sorting === "az") {
         setFiltersApplied({ ...filtersApplied, sortBy: filtersApplied.sortBy === "az" ? "za" : "az" });
      } else if (sorting !== filtersApplied.sortBy) {
         setFiltersApplied({ ...filtersApplied, sortBy: sorting });
      }
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
            placeholder="Search for a title"
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
               </div>

               <div className={filterCss.category}>
                  <p className={filterCss.cheading}>{capitalize("sort by")}</p>
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
            </div>
         </div>

         <div className={css.parent + " " + css.flexWidth}>
            {titleFilter(challenges, titles, userChallenges, filtersApplied, searchQuery).map((title) => (
               <TitleObject key={title.id} {...title}></TitleObject>
            ))}
         </div>
      </section>
   );
}

interface UserTitlesProps {
   challenges: ChallengeDTO[]; // ChallengeHydrated[];
   titles: TitleDTO[];
   userChallenges: UserChallengesMap;
   // filters: FiltersMap;
   // seasonPrevious: string;
   // seasonsRetired: string[];
}
