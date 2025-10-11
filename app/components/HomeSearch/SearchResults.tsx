import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getChallengeIcon, getProfileIcon } from "@cgg/utils/cdn";
import type { RecentChallenge, RecentSummoner } from "@cgg/utils/recents";
import css from "./searchresults.module.scss";

export interface SearchResults {
   recent: SearchResult[];
   challenges: SearchResultChallenge[];
   summoner: SearchResultSummoner[];
}

export type SearchResultChallenge = RecentChallenge;
export interface SearchResultSummoner extends RecentSummoner {
   draft?: boolean;
   loading?: boolean;
}

export type SearchResult = SearchResultChallenge | SearchResultSummoner;

export default function SearchResults({
   results,
   visible,
}: {
   results: SearchResults;
   visible: boolean;
}) {
   const [pointer, setPointer] = useState(0);
   const navigate = useNavigate();
   const showResults =
      results.recent.length > 0 ||
      results.challenges.length > 0 ||
      results.summoner.length > 0;

   /*
    * Listen to key events to change result selection
    */
   useEffect(() => {
      // Click the selected result when Enter is pressed
      function handleSubmit() {
         if (pointer !== 0) {
            const result = document.querySelectorAll(`.${css.result}`)[pointer - 1] as
               | HTMLAnchorElement
               | undefined;
            if (!result) return;

            result.click();
         } else {
            const searchResult = results.summoner.find((r) => r.draft);

            if (searchResult) {
               navigate(`/profile/${searchResult.name}-${searchResult.tagLine}`);
            }
         }
      }

      // Listen to key events to change result selection
      function listenToKeyEvents(e: KeyboardEvent) {
         if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter") return;
         if (!showResults || !visible) return;

         e.preventDefault();
         if (e.key === "ArrowDown") {
            setPointer((prev) => {
               if (
                  prev <
                  results.recent.length +
                     results.challenges.length +
                     results.summoner.length
               ) {
                  return prev + 1;
               }
               return prev;
            });
            return;
         }

         if (e.key === "ArrowUp") {
            setPointer((prev) => {
               if (prev > 0) {
                  return prev - 1;
               }
               return prev;
            });
            return;
         }

         handleSubmit();
      }

      document.addEventListener("keydown", listenToKeyEvents);

      // Reset pointer when pointer points into emptiness :/
      const resultLength = Object.values(results).flat().length;
      if (pointer > resultLength) {
         setPointer(0);
      }

      return () => {
         document.removeEventListener("keydown", listenToKeyEvents);
      };
   }, [results, visible, showResults, pointer]);

   return (
      <div className={clsx(css.results, visible && showResults && css.visible)}>
         {results.recent.length > 0 && (
            <div className={css.group}>
               <span className={css.namespace}>Recent Pages</span>
               {results.recent.map((result, i) => (
                  <Result key={i} result={result} active={pointer === i + 1} />
               ))}
            </div>
         )}
         {results.challenges.length > 0 && (
            <div className={css.group}>
               <span className={css.namespace}>Challenges</span>
               {results.challenges.map((result, i) => (
                  <Result
                     key={i}
                     result={result}
                     active={pointer === i + 1 + results.recent.length}
                  />
               ))}
            </div>
         )}
         {results.summoner.length > 0 && (
            <div className={css.group}>
               <span className={css.namespace}>Summoner</span>
               {results.summoner.map((result, i) => (
                  <Result
                     key={i}
                     result={result}
                     active={
                        pointer ===
                        i + 1 + results.recent.length + results.challenges.length
                     }
                  />
               ))}
            </div>
         )}
      </div>
   );
}

function Result({ result, active }: { result: SearchResult; active: boolean }) {
   const isSummoner = result.type === "summoner";
   const isLoading = isSummoner && result.loading;

   const icon = isSummoner
      ? getProfileIcon(result.icon)
      : getChallengeIcon(result.iconId, "MASTER");

   const link = isSummoner
      ? `/profile/${result.name}-${result.tagLine}`
      : `/challenges/${result.id}`;

   return (
      <Link className={clsx(css.result, active && css.active)} to={link}>
         {isLoading && <div className={css.loader} />}
         <img src={icon} alt={result.name} className={clsx(isSummoner && css.summoner)} />
         <p className={css.name}>
            {result.name}
            {isSummoner && <span className={css.tagLine}>{`#${result.tagLine}`}</span>}
         </p>
      </Link>
   );
}
