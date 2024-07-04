import { ReactNode } from "react";

import UserChallenges from "challenges/components/User/UserChallenges";
import ChallengeService from "challenges/services/ChallengeService";
import UserService from "challenges/services/UserService";
import { ChallengeDTO, ChallengesFullDTO } from "challenges/types/challenges.types";
import { ChallengeHydrated, CurrentSeason, FiltersMap, UserChallengesMap } from "challenges/types/draft.types";
import { ProfileRouteParams } from "challenges/types/profile-navigation.types";
import { challengeTokenIcon, filterCategoryIcon, filterGameModeIcon } from "challenges/utils/cdnHelpers";
import getPlatform from "challenges/utils/platform";

export default async function ProfileTabOverview({ params }: { params: ProfileRouteParams }): Promise<ReactNode> {
   const { userChallenges, challenges, season, seasonPrevious, seasonsRetired } = await getData(params);

   return (
      <UserChallenges
         challenges={challenges}
         userChallenges={userChallenges}
         filters={createFilters(season)}
         seasonPrevious={seasonPrevious}
         seasonsRetired={seasonsRetired}
      ></UserChallenges>
   );
}

async function getData({ region, summoner }: ProfileRouteParams): Promise<ProfileTabOverviewData> {
   const userService = new UserService();
   const user = await userService.getUser(summoner, getPlatform(region));
   if (!user) {
      throw new Error("Error loading user");
   }

   const challengeService = new ChallengeService();
   const challengesAll = await challengeService.listAll(getPlatform(region), "en_US");
   if (!challengesAll) {
      throw new Error("Error loading challenges");
   }

   const userChallenges = user.challenges.reduce((acc, challenge) => {
      acc[challenge.id.toString()] = challenge;
      return acc;
   }, {} as UserChallengesMap);

   const seasonsRetired = ["2022000", "2023000", "2024100"];

   return {
      userChallenges,
      challenges: hydrateChallenges(challengesAll.challenges, seasonsRetired),
      season: { name: "2024.2", id: "2024200", image: "2024-2seasonal.svg" },
      seasonPrevious: "2024100",
      seasonsRetired,
   };
}

function createFilters(season: CurrentSeason): FiltersMap {
   return {
      category: [
         { category: "category", name: "teamwork", id: "4", image: challengeTokenIcon(4) },
         { category: "category", name: "imagination", id: "1", image: challengeTokenIcon(1) },
         { category: "category", name: "veterancy", id: "3", image: challengeTokenIcon(2) },
         { category: "category", name: "collection", id: "5", image: challengeTokenIcon(5) },
         { category: "category", name: "expertise", id: "2", image: challengeTokenIcon(2) },
         { category: "category", name: "legacy", id: "600006", image: filterCategoryIcon("legacy.svg") },
         {
            category: "category",
            name: `seasonal ${season.name}`,
            id: season.id,
            image: filterCategoryIcon(season.image),
         },
         { category: "category", name: "seasonal retired", id: "retired", image: filterCategoryIcon("retired.svg") },
      ],
      // type: [
      //     { category: "type", name: "progress", id: "progress" },
      //     { category: "type", name: "in-game", id: "ingame" },
      //     { category: "type", name: "eternals", id: "eternals" },
      //     { category: "type", name: "clash", id: "clash" },
      //     { category: "type", name: "inventory", id: "inventory" },
      //     { category: "type", name: "ranked", id: "ranked" },
      //     { category: "type", name: "profile", id: "profile" },
      // ],
      gamemode: [
         { category: "gamemode", name: "summoners rift", id: "rift", image: filterGameModeIcon("sr.svg") },
         { category: "gamemode", name: "aram", id: "aram", image: filterGameModeIcon("ha.svg") },
         { category: "gamemode", name: "bot", id: "bot", image: filterGameModeIcon("bot.png") },
      ],
   };
}

function hydrateChallenges(challenges: ChallengesFullDTO["challenges"], seasonsRetired: string[]): ChallengeHydrated[] {
   const timeNow = new Date().getTime();

   function getParentId(challenge: ChallengeDTO): string {
      if (challenge.tags.parent) {
         let iterationCount = 0;
         let parentChallengeId = challenge.tags.parent.toString();
         while (iterationCount < 10) {
            let currentChallenge = challenges[parentChallengeId];
            if (currentChallenge.tags.parent && +currentChallenge.id > 10) {
               parentChallengeId = currentChallenge.tags.parent.toString();
            } else {
               iterationCount = 10;
            }
         }
         return parentChallengeId;
      }
      if (["600006", "600010", "600011", "600012", "0"].includes(challenge.id)) return "600006";
      if (challenge.tags.isCapstone === "Y") return challenge.id;
      return "0";
   }

   function getGameMode(challenge: ChallengeDTO): string {
      if ([450, 930, 860].some((qid) => challenge.queueIds.includes(qid))) return "aram";
      if ([400, 420, 430, 440].some((qid) => challenge.queueIds.includes(qid))) return "rift";
      if ([830, 840, 850, 870, 880, 890].some((qid) => challenge.queueIds.includes(qid))) return "bot";
      if ([1700, 1701, 1704].some((qid) => challenge.queueIds.includes(qid))) return "arena";
      if (["101000", "101300", "101200", "101100"].includes(challenge.id)) return "aram";
      return "none";
   }

   return Object.values(challenges).map((challenge) => {
      (challenge as ChallengeHydrated)._parentId = getParentId(challenge);
      (challenge as ChallengeHydrated)._gameMode = getGameMode(challenge);
      (challenge as ChallengeHydrated)._canProgress =
         !seasonsRetired.includes((challenge as ChallengeHydrated)._parentId) &&
         (!challenge.endTimestamp || challenge.endTimestamp > timeNow);
      return challenge as ChallengeHydrated;
   });
}

interface ProfileTabOverviewData {
   userChallenges: UserChallengesMap;
   challenges: ChallengeHydrated[];
   season: CurrentSeason;
   seasonPrevious: string;
   seasonsRetired: string[];
}