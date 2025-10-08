import { serialize } from "cookie";
import { useEffect, useMemo, useState } from "react";
import { FaSortAlphaDown } from "react-icons/fa";
import {
   FaArrowUpRightDots,
   FaHashtag,
   FaRankingStar,
   FaRegClock,
} from "react-icons/fa6";
import { Link } from "react-router";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Buttons from "@cgg/components/Buttons/Buttons";
import { cookieNames } from "@cgg/config/config";
import { useStaticData } from "@cgg/hooks/useStaticData";
import type { ChallengesLoaderLocation } from "@cgg/loader/challengesFilter";
import { cdnAssets, getChallengeIcon, getGamemodeIcon } from "@cgg/utils/cdn";
import {
   getChallengeSourceIcon,
   getChallengeSourceName,
} from "@cgg/utils/challengeSource";
import type { Category, GameMode, Source } from "@cgg/utils/challenges";
import { categories, gameModes, sources } from "@cgg/utils/challenges";
import type { IApiChallengeResponse } from "@cgg/utils/endpoints/types";
import { getChallenge } from "@cgg/utils/getChallenge";
import Radio from "../Buttons/Radio";
import Searchbar from "../Searchbar/Searchbar";
import Challenge from "./Challenge";
import css from "./challengeManager.module.scss";
import { type IChallengeFilter, filterChallenges } from "./filterChallenges";
import { type SortMode, sortChallenges } from "./sortChallenges";

export default function ChallengeManager({
   userData,
   location = "overview",
   defaultFilter = { search: "", category: [], source: [], gameMode: [] },
}: {
   userData?: IApiChallengeResponse;
   location?: ChallengesLoaderLocation;
   defaultFilter?: IChallengeFilter;
}) {
   const data = useStaticData();
   const isUserInterface = location === "profile";

   const challenges = useMemo(() => {
      return Object.values(data.challenges);
   }, [data]);

   const [search, setSearch] = useState(defaultFilter.search);
   const [categoryFilter, setCategoryFilter] = useState<Category[]>(
      defaultFilter.category,
   );
   const [sourceFilter, setSourceFilter] = useState<Source[]>(defaultFilter.source);
   const [gamemodeFilter, setGamemodeFilter] = useState<GameMode[]>(
      defaultFilter.gameMode,
   );

   const [sortMode, setSortMode] = useState<SortMode>(
      isUserInterface ? "Rank" : "Name-ASC",
   );

   const filter: IChallengeFilter = {
      search,
      category: categoryFilter,
      source: sourceFilter,
      gameMode: gamemodeFilter,
   };

   useEffect(() => {
      const cookiename =
         location === "overview"
            ? cookieNames.overviewChallengeFilter
            : cookieNames.profileChallengeFilter;

      document.cookie = serialize(cookiename, btoa(JSON.stringify(filter)), {
         path: "/",
      });
   }, [filter]);

   const results = sortChallenges(
      filterChallenges(challenges, filter),
      sortMode,
      userData?.challenges,
   );

   return (
      <>
         <div className={css.grid}>
            <div className={css.filters}>
               <SimpleBar style={{ height: "100%" }}>
                  <div className={css.innerScrollbar}>
                     <div className={css.options}>Options...</div>

                     {isUserInterface && (
                        <div className={css.group}>
                           <p className={css.heading}>Order By</p>
                           <Radio<SortMode>
                              values={[
                                 {
                                    name: (
                                       <div className={css.buttonText}>
                                          <FaRankingStar /> Rank
                                       </div>
                                    ),
                                    id: "Rank",
                                 },
                                 {
                                    name: (
                                       <div className={css.buttonText}>
                                          <FaRegClock /> Last Updated
                                       </div>
                                    ),
                                    id: "Last Updated",
                                 },
                                 {
                                    name: (
                                       <div className={css.buttonText}>
                                          <FaHashtag /> Position
                                       </div>
                                    ),
                                    id: "Position",
                                 },
                                 {
                                    name: (
                                       <div className={css.buttonText}>
                                          <FaArrowUpRightDots /> Closest Levelup
                                       </div>
                                    ),
                                    id: "Levelup",
                                 },
                                 {
                                    name: (
                                       <div className={css.buttonText}>
                                          <FaSortAlphaDown /> Name
                                       </div>
                                    ),
                                    id: "Name-ASC",
                                 },
                              ]}
                              setState={setSortMode}
                              state={sortMode}
                              column
                           />
                        </div>
                     )}

                     <div className={css.group}>
                        <p className={css.heading}>Category</p>
                        <Buttons<Category>
                           buttons={categories.map((category) => {
                              return {
                                 name: (
                                    <div className={css.buttonText}>
                                       <img
                                          src={getChallengeIcon(category)}
                                          alt=""
                                          loading="lazy"
                                       />
                                       {getChallenge(category, data)?.name || "Legacy"}
                                    </div>
                                 ),
                                 id: category,
                              };
                           })}
                           state={categoryFilter}
                           setState={setCategoryFilter}
                           column
                        ></Buttons>
                     </div>

                     <div className={css.group}>
                        <p className={css.heading}>Type</p>
                        <Buttons<Source>
                           buttons={sources.map((source) => {
                              return {
                                 name: (
                                    <div className={css.buttonText}>
                                       {getChallengeSourceIcon(source)}
                                       {getChallengeSourceName(source)}
                                    </div>
                                 ),
                                 id: source,
                              };
                           })}
                           state={sourceFilter}
                           setState={setSourceFilter}
                           column
                        ></Buttons>
                     </div>

                     {!isUserInterface && (
                        <div className={css.group}>
                           <p className={css.heading}>Gamemode</p>
                           <Buttons<GameMode>
                              buttons={gameModes.map((gameMode) => {
                                 if (gameMode === "none") return null;

                                 return {
                                    name: (
                                       <div className={css.buttonText}>
                                          <img
                                             src={getGamemodeIcon(gameMode)}
                                             alt=""
                                             loading="lazy"
                                          />
                                          {gameMode}
                                       </div>
                                    ),
                                    id: gameMode,
                                 };
                              })}
                              state={gamemodeFilter}
                              setState={setGamemodeFilter}
                              column
                           ></Buttons>
                        </div>
                     )}
                     <p className={css.disclaimer}>
                        Read the <Link to="/about/faq">FAQ</Link> to learn more about
                        filtering, searching and sorting.
                     </p>
                  </div>
               </SimpleBar>
            </div>
            <div className={css.challenges}>
               <div className={css.searchbar}>
                  <Searchbar
                     id={css.searchbar}
                     onChange={(value) => {
                        setSearch(value);
                     }}
                     placeholder="Search challenges"
                     value={search}
                  />
               </div>
               <div className={css.challengeList}>
                  {results.map((challenge) => {
                     let userChallenge = userData?.challenges.find(
                        (c) => c.challengeId === challenge.id,
                     );

                     if (isUserInterface && !userChallenge) {
                        userChallenge = {
                           challengeId: challenge.id,
                           tier: "UNRANKED",
                           value: 0,
                           percentile: 100,
                        };
                     }

                     return (
                        <Challenge
                           user={userChallenge}
                           key={challenge.id}
                           challenge={challenge}
                        />
                     );
                  })}
                  {results.length === 0 && (
                     <div className={css.noResults}>
                        <img src={cdnAssets("art/no-pk")} alt="" />
                        <p>Looks like here is... nothing.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </>
   );
}
