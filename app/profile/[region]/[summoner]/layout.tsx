import { ReactNode } from "react";

import ProfileTabs from "challenges/components/User/ProfileTabs";
import UserHeading from "challenges/components/User/UserHeading";
import ChallengeService from "challenges/services/ChallengeService";
import UserService from "challenges/services/UserService";
import { ChallengeDTO, TitleDTO } from "challenges/types/challenges.types";
import { ProfileRouteParams } from "challenges/types/profile-navigation.types";
import { UserInfo } from "challenges/types/user.types";
import { profileBackgroundImage } from "challenges/utils/cdnHelpers";
import getPlatform, { serversBeautified } from "challenges/utils/platform";

import css from "challenges/styles/user.module.scss";

export default async function ProfileLayout({
   children,
   params,
}: {
   children: ReactNode;
   params: ProfileRouteParams;
}): Promise<ReactNode> {
   const { user, verified, challenges, titles } = await getData(params);

   return (
      <>
         <div
            className={css.bgImage}
            style={{ backgroundImage: `url(${profileBackgroundImage(user.points.tier)})` }}
         ></div>

         <div className={css.user}>
            <UserHeading user={user} verified={verified} challenges={challenges} titles={titles} />

            <ProfileTabs params={params} />

            {children}
         </div>
      </>
   );
}

async function getData({ region, summoner }: ProfileRouteParams): Promise<ProfileLayoutData> {
   if (!serversBeautified.includes(region)) {
      throw new Error("Invalid region");
   }

   const userService = new UserService();

   const user = await userService.getUser(summoner, getPlatform(region));
   if (!user) {
      throw new Error("Error loading user");
   }

   const verified = await userService.getVerificationState(user.playerId);

   const challengeService = new ChallengeService();
   const challengesAll = await challengeService.listAll(getPlatform(region), "en_US");
   if (!challengesAll) {
      throw new Error("Error loading challenges");
   }

   return { user, verified, challenges: challengesAll.challenges, titles: challengesAll.titles };
}

interface ProfileLayoutData {
   user: UserInfo;
   verified: boolean;
   challenges: Record<string, ChallengeDTO>;
   titles: Record<string, TitleDTO>;
}
