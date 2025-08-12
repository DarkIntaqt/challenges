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

   return {
      transition: isPageTransition,
      profileNavigation: isProfileTransition,
      from: location,
      to: navigation.location,
   };
}
