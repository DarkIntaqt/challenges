import clsx from "clsx";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useStaticData } from "@cgg/hooks/useStaticData";
import debounce from "@cgg/utils/debounce";
import { getProfile } from "@cgg/utils/endpoints/getProfile";
import { getProximityScore } from "@cgg/utils/getProximityScore";
import { type Recent, type RecentChallenge, getRecentSearches } from "@cgg/utils/recents";
import SearchResults, {
   type SearchResult,
   type SearchResultSummoner,
} from "./SearchResults";
import css from "./searchbar.module.scss";

type ChallengeIndex = {
   id: number;
   iconId: number;
   name: string;
}[];

export default function Searchbar() {
   const [focus, setFocus] = useState(false);
   const [search, setSearch] = useState("");
   const [summonerSearchResult, setSummonerSearchResult] = useState<
      SearchResultSummoner[]
   >([]);

   const [recentSearches, setRecentSearched] = useState<Recent[]>([]);

   const staticData = useStaticData();
   const challengeIndex: ChallengeIndex = useMemo(() => {
      return Object.values(staticData.challenges)
         .map((challenge) => {
            if (challenge.retired) return;

            return {
               id: challenge.id,
               iconId: challenge.iconId,
               name: challenge.name,
            };
         })
         .filter((x) => x !== undefined);
   }, [staticData.challenges]);

   const debounceInput = useMemo(() => {
      return debounce(() => {
         setFocus((prev) => {
            const searchbar = document.getElementById(css.input);
            if (!searchbar) {
               return prev;
            }

            if (document.activeElement === searchbar) {
               return true;
            }

            return false;
         });
      }, 350);
   }, []);

   const debounceSummonerLookup = useMemo(() => {
      return debounce(
         async ({
            gameName,
            tagLine,
            id,
         }: {
            gameName: string;
            tagLine: string;
            id: string;
         }) => {
            const profile = await getProfile(gameName, tagLine);

            setSummonerSearchResult((prev) => {
               // Check if the search changed during the API request
               if (prev.some((r) => r.type === "summoner" && r.id === id)) {
                  if (!profile)
                     return [
                        {
                           type: "summoner",
                           id: id,
                           name: gameName,
                           tagLine: tagLine || "",
                           icon: 29,
                           draft: true,
                           loading: false,
                        },
                     ];

                  const response = {
                     type: "summoner",
                     id: id,
                     name: profile.gameName,
                     tagLine: profile.tagLine,
                     icon: profile.summoner.profileIcon,
                     draft: true,
                  } as SearchResultSummoner;

                  return [response];
               }

               // If it did, keep previous results
               return [...prev];
            });
         },
         350,
      );
   }, []);

   useEffect(() => {
      setRecentSearched(getRecentSearches());
   }, []);

   function updateSearch(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      setSearch(value);
      if (value.length <= 0) {
         setSummonerSearchResult([]);
         return;
      }
      const [gameName, tagLine] = value.split("#");
      const id = nanoid();
      const summonerSearch: SearchResultSummoner[] = [
         {
            type: "summoner",
            id: id,
            name: gameName,
            tagLine: tagLine || "",
            icon: 29,
            draft: true,
            loading: !!tagLine,
         },
      ];

      setSummonerSearchResult(summonerSearch);
      if (!tagLine) return;
      debounceSummonerLookup({ gameName, tagLine: tagLine, id });
   }

   useEffect(() => {
      const input = document.getElementById(css.input) as HTMLInputElement | null;
      if (!input) return;
      input.focus();
   }, []);

   return (
      <>
         <div className={clsx(css.searchbar, focus && css.focus)}>
            <input
               id={css.input}
               placeholder="Search for a summoner or challenge"
               className={css.input}
               onFocus={() => setFocus(true)}
               onBlur={() => debounceInput()}
               onInput={updateSearch}
               onKeyDown={(e) => {
                  if (e.key === "Escape") {
                     e.preventDefault();
                     (e.target as HTMLInputElement).blur();
                  }
               }}
            />
            <button
               className={css.submit}
               type="submit"
               onClick={() => {
                  document.dispatchEvent(
                     new KeyboardEvent("keydown", {
                        code: "Enter",
                        key: "Enter",
                        charCode: 13,
                        keyCode: 13,
                     }),
                  );
               }}
            >
               <FaSearch />
            </button>
            <SearchResults
               visible={focus}
               results={{
                  recent: getRecents(recentSearches, search),
                  summoner: summonerSearchResult,
                  challenges: getChallenges(challengeIndex, search),
               }}
            />
         </div>
      </>
   );
}

function getRecents(recents: SearchResult[], input: string): SearchResult[] {
   const cleanedInput = input.toLowerCase().replace(/\s+/g, "");

   return recents.filter((recent) => {
      return (recent.name + (recent.type === "summoner" ? "#" + recent.tagLine : ""))
         .toLowerCase()
         .replace(/\s+/g, "")
         .startsWith(cleanedInput);
   });
}

function getChallenges(challenges: ChallengeIndex, input: string): RecentChallenge[] {
   const cleanedInput = input.toLowerCase().replace(/\s+/g, "");
   if (!cleanedInput || cleanedInput.length === 0) return [];

   return challenges
      .map((challenge) => {
         const cleanName = challenge.name.toLowerCase().replace(/\s+/g, "");
         const proximityScore = getProximityScore(cleanName, cleanedInput);

         return {
            challenge,
            proximityScore,
         };
      })
      .filter((challenge) => challenge.proximityScore > 0)
      .sort((a, b) => b.proximityScore - a.proximityScore)
      .slice(0, 3)
      .map(({ challenge }) => ({
         type: "challenge",
         id: challenge.id,
         iconId: challenge.iconId,
         name: challenge.name,
         description: "",
      }));
}
