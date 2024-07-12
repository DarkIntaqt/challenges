import { Metadata } from "next";
import { ReactNode } from "react";

import UserChallenges from "challenges/components/User/UserChallenges";
import ChallengeService from "challenges/services/ChallengeService";
import UserService from "challenges/services/UserService";
import { ChallengeDTO, ChallengesFullDTO } from "challenges/types/challenges.types";
import { CurrentSeason, ChallengesFiltersMap, UserChallengesMap } from "challenges/types/draft.types";
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

export async function generateMetadata({ params }: { params: ProfileRouteParams }): Promise<Metadata> {
   const userService = new UserService();
   const user = await userService.getUser(params.summoner, getPlatform(params.region));
   if (!user) {
      throw new Error("Error loading user");
   }

   return {
      title: `${user.name}#${user.tag}'s Challenge Progress Overview`,
      description: `${user.name}#${user.tag}'s LoL Full challenge progress, titles and statistics | League of Legends Challenge Tracker`,
      keywords: [`league of legends challenges for ${user.name}#${user.tag}`, "lol challenges"],
      openGraph: {
         type: "website",
         title: `${user.name}#${user.tag}'s Challenge Progress Overview`,
         description: `${user.name}#${user.tag}'s LoL Full challenge progress, titles and statistics | League of Legends Challenge Tracker`,
         siteName: "Challenge Tracker",
      },
   };
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

function createFilters(season: CurrentSeason): ChallengesFiltersMap {
   const tempIcon = "https://static.wikia.nocookie.net/leagueoflegends/images/a/a1/Challenge_Token_Iron.png";
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
      type: [
         { category: "type", name: "progress", id: "CHALLENGES", image: tempIcon },
         { category: "type", name: "in-game", id: "EOGD", image: tempIcon },
         { category: "type", name: "eternals", id: "ETERNALS", image: filterCategoryIcon("eternals.webp") },
         { category: "type", name: "clash", id: "CLASH", image: filterCategoryIcon("clash.webp") },
         { category: "type", name: "inventory", id: "CAP_INVENTORY", image: tempIcon },
         { category: "type", name: "ranked", id: "RANKED", image: tempIcon },
         { category: "type", name: "profile", id: "SUMMONER", image: tempIcon },
      ],
      gamemode: [
         { category: "gamemode", name: "Summoner's Rift", id: "rift", image: filterGameModeIcon("sr.svg") },
         { category: "gamemode", name: "ARAM", id: "aram", image: filterGameModeIcon("ha.svg") },
         { category: "gamemode", name: "Co-op vs AI", id: "bot", image: filterGameModeIcon("bot.png") },
         { category: "gamemode", name: "Arena", id: "arena", image: filterGameModeIcon("arena.png") },
      ],
   };
}

function hydrateChallenges(challenges: ChallengesFullDTO["challenges"], seasonsRetired: string[]): ChallengeDTO[] {
   const timeNow = new Date().getTime();

   function getCapstoneId(challenge: ChallengeDTO): string {
      if (challenge.capstoneId !== "0") return challenge.capstoneId;
      if (["600006", "600010", "600011", "600012", "0"].includes(challenge.id)) return "600006";
      if (challenge.tags.isCapstone === "Y") return challenge.id;
      return "0";
   }

   return Object.values(challenges).map((challenge) => {
      challenge.capstoneId = getCapstoneId(challenge);
      challenge.canProgress =
         challenge.canProgress &&
         !seasonsRetired.includes(challenge.capstoneId) &&
         (!challenge.endTimestamp || challenge.endTimestamp > timeNow) &&
         (challenge.capstoneId === "0" || challenges[challenge.capstoneId].canProgress);
      return challenge;
   });
}

interface ProfileTabOverviewData {
   userChallenges: UserChallengesMap;
   challenges: ChallengeDTO[];
   season: CurrentSeason;
   seasonPrevious: string;
   seasonsRetired: string[];
}
