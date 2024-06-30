import { Metadata } from "next";
import { ReactNode } from "react";

import UserTitles from "challenges/components/User/UserTitles";
import ChallengeService from "challenges/services/ChallengeService";
import UserService from "challenges/services/UserService";
import { ChallengeDTO, TitleDTO } from "challenges/types/challenges.types";
import { UserChallengesMap } from "challenges/types/draft.types";
import { ProfileRouteParams } from "challenges/types/profile-navigation.types";
import getPlatform from "challenges/utils/platform";

export default async function ProfileTabTitles({ params }: { params: ProfileRouteParams }): Promise<ReactNode> {
   const { challenges, titles, userChallenges } = await getData(params);

   return <UserTitles challenges={challenges} titles={titles} userChallenges={userChallenges}></UserTitles>;
}

export async function generateMetadata({ params }: { params: ProfileRouteParams }): Promise<Metadata> {
   const userService = new UserService();
   const user = await userService.getUser(params.summoner, getPlatform(params.region));
   if (!user) {
      throw new Error("Error loading user");
   }

   return {
      title: `${user.name}#${user.tag}'s Title Overview`,
      description: `${user.name}#${user.tag}'s LoL Full challenge progress, titles and statistics | League of Legends Challenge Tracker`,
      keywords: [`league of legends challenges for ${user.name}#${user.tag}`, "lol challenges"],
      openGraph: {
         type: "website",
         title: `${user.name}#${user.tag}'s Title Overview`,
         description: `${user.name}#${user.tag}'s LoL Full challenge progress, titles and statistics | League of Legends Challenge Tracker`,
         siteName: "Challenge Tracker",
      },
   };
}

async function getData({ region, summoner }: ProfileRouteParams): Promise<ProfileTabTitlesData> {
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

   return {
      userChallenges,
      challenges: Object.values(challengesAll.challenges),
      titles: Object.values(challengesAll.titles),
   };
}

interface ProfileTabTitlesData {
   userChallenges: UserChallengesMap;
   challenges: ChallengeDTO[]; // ChallengeHydrated[];
   titles: TitleDTO[];
   // season: CurrentSeason;
   // seasonPrevious: string;
   // seasonsRetired: string[];
}
