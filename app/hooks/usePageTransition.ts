import { useLocation, useNavigation } from "react-router";

export function usePageTransition() {
   const navigation = useNavigation();
   const location = useLocation();

   const isPageTransition =
      (navigation.state === "loading" || navigation.state === "submitting") &&
      navigation.location.key !== location.key;

   // TODO is not working when navigating away from a profile
   // apparently it does work now?
   const isProfileTransition =
      location.pathname.startsWith("/profile/") &&
      navigation.state === "loading" &&
      navigation.location.pathname.startsWith("/profile/");

   const isChallengeTransition =
      location.pathname.startsWith("/challenges/") &&
      navigation.state === "loading" &&
      navigation.location.pathname.startsWith("/challenges/") &&
      location.pathname === navigation.location.pathname;

   return {
      transition: isPageTransition,
      customLoader: isProfileTransition || isChallengeTransition,
      from: location,
      to: navigation.location,
   };
}
