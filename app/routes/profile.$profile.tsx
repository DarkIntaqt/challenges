import type { Route } from "./+types/profile.$profile";
import { useEffect } from "react";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { Outlet } from "react-router";
import Container from "@cgg/components/Container/Container";
import { LayoutHeading, LayoutNavigation } from "@cgg/components/User/layout";
import LayoutLoader from "@cgg/components/User/layout/LayoutLoader";
import { brandName } from "@cgg/config/config";
import { usePageTransition } from "@cgg/hooks/usePageTransition";
import { profileLayoutLoader } from "@cgg/loader/profile.layout";
import css from "@cgg/styles/profile.layout.module.scss";
import { cdnAssets } from "@cgg/utils/cdn";
import { type Recent, addRecentSearch } from "@cgg/utils/recents";

export const shouldRevalidate = ({
   currentParams,
   nextParams,
}: ShouldRevalidateFunctionArgs) => {
   // TODO revalidate after x minutes
   return !(currentParams.profile === nextParams.profile);
};

export default function Layout({ loaderData }: Route.ComponentProps) {
   const { summoner, gameName, tagLine } = loaderData;
   const tier = summoner.tier;
   const { transition } = usePageTransition();

   useEffect(() => {
      addRecentSearch({
         type: "summoner",
         id: loaderData.id,
         name: gameName,
         tagLine: tagLine,
         icon: summoner.profileIcon,
      } as Recent);
   }, []);

   return (
      <>
         {/* <title>{`${gameName}#${tagLine} - Profile | ${brandName}`}</title> */}
         <meta
            name="description"
            content={`View and track the Challenge progress, titles and statistics of ${gameName}#${tagLine} on ${brandName}.`}
         />
         <img
            src={cdnAssets(`challenges/rows/${tier.toLowerCase()}`)}
            className={css.bg}
            draggable={false}
            alt={""}
         />
         <Container center className={css.layout} headerPadding>
            <LayoutHeading playerData={loaderData} />
            <LayoutNavigation />

            {/* 
               Need a content wrapper, maybe even in the <LayoutLoader/>. 
               Outlet is not hidden on transition, Loader is pos absolute
               */}
            <LayoutLoader />
            {!transition && <Outlet />}
         </Container>
      </>
   );
}

export async function clientLoader({ params }: Route.LoaderArgs) {
   return await profileLayoutLoader({ params });
}

export async function loader({ params }: Route.LoaderArgs) {
   return await profileLayoutLoader({ params });
}
