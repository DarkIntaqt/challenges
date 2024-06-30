"use client";

import React, { useEffect, useState } from "react";
import css from "challenges/styles/index.module.scss";
import { useRouter } from "next/navigation";
import getPlatform, { serversBeautified } from "challenges/utils/platform";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getStorage, setStorage, storageKeys } from "challenges/utils/localStorageFunctions";
import ChallengeService from "challenges/services/ChallengeService";
import { ChallengeDTO } from "challenges/types/challenges.types";
import ChallengeCard from "./ChallengeCard";
import ContentService from "challenges/services/ContentService";
import UserCard from "./UserCard";


export default function Searchbar() {
   const router = useRouter();

   const [region, setRegion] = useState("na");
   const [focus, setFocus] = useState(false);
   const [challenges, setChallenges] = useState<ChallengeDTO[] | null>();
   const [searchValue, setSearchValue] = useState("");

   const contentService = new ContentService();

   useEffect(() => {
      const defaultRegion = getStorage(storageKeys.defaultRegion, region);
      setRegion(defaultRegion);

      /**
       * Fetch challenges in order to search stuff properly
       */
      async function fetchChallenges() {
         const challengeService = new ChallengeService();
         const challenges = await challengeService.list(getPlatform(defaultRegion), "en_US");
         if (challenges !== undefined) {
            setChallenges(Object.values(challenges));
         }
      }

      fetchChallenges();

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   function search(e: React.KeyboardEvent<HTMLInputElement>) {
      const value = (e.target as HTMLInputElement).value.toLowerCase();
      if (e.key === "Enter") {
         router.push(`/profile/${region}/${value.replace("#", "-")}`);
         return;
      }

      if (value === searchValue) return;

      setSearchValue(value);

   }

   return <div className={`${css.searchbarWrapper} ${focus ? css.active : ""}`}>

      <div className={css.searchbar}>
         <input
            placeholder="Search for a summoner, challenge, title"
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onKeyUp={search}
         ></input>

         <select className={css.select} defaultValue={region} onChange={(e) => {
            const selectedRegion = e.currentTarget.options[e.currentTarget.selectedIndex].value;
            setRegion(selectedRegion);
            setStorage(storageKeys.defaultRegion, selectedRegion);
         }}>
            {serversBeautified.map((server) => {
               return <option selected={server === region} value={server} key={server}>{server.toUpperCase()}</option>;
            })}
         </select>

         <FontAwesomeIcon
            onClick={() => { }}
            icon={faMagnifyingGlass}
         />

      </div>

      {/* Position absolute, does not interfere the initial layout*/}
      <div className={css.results}>
         {searchValue.length > 0 ?
            <>
               <UserCard
                  input={searchValue}
                  userRegion={region}
               />
            </>
            : null}
         {challenges && searchValue.length > 0 ?
            <>
               {challenges.map((challenge) => {
                  if (!challenge.name.toLowerCase().startsWith(searchValue)) {
                     return null;
                  }

                  return <ChallengeCard
                     key={challenge.id}
                     title={challenge.name}
                     url={"/challenges/" + challenge.id}
                     image={contentService.getChallengeTokenIcon(parseInt(challenge.id), "MASTER")} // TODO
                  />;
               }).filter(x => !!x).slice(0, 5)}
            </>
            : null}
      </div>

   </div>;
}
