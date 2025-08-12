import { useParams } from "react-router";
import Container from "@cgg/components/Container/Container";
import Loader from "@cgg/components/Loader/Loader";
import { usePageTransition } from "@cgg/hooks/usePageTransition";
import { profileNavigationLinks } from "./LayoutNavigation";
import css from "./layoutLoader.module.scss";

export default function LayoutLoader() {
   const { transition, to } = usePageTransition();
   const { profile } = useParams<{ profile: string }>();

   // Dont show loader if not transitioning
   if (!transition) return null;

   // Get target path for the loader text
   // e.g. /profile/username/titles -> /titles
   const basePath = `/profile/${encodeURIComponent(profile || "")}`;
   let target = to?.pathname?.replace(basePath, "") || "";

   // Get the link name from the navigation links to generate a text.
   // Fallback to "content" if not found
   const text = `Loading ${profileNavigationLinks.find((link) => link.relativePath === target)?.name || "content"}...`;

   return (
      <Container center flex column justify className={css.loaderSection}>
         <Loader />
         <p>{text}</p>
      </Container>
   );
}
