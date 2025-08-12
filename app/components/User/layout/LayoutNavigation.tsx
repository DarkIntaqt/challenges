import clsx from "clsx";
import { Link, useLocation, useParams } from "react-router";
import css from "./layoutNavigation.module.scss";

const links = [
   {
      name: "Overview",
      relativePath: "",
   },
   {
      name: "Titles",
      relativePath: "/titles",
   },
   {
      name: "Statistics",
      relativePath: "/statistics",
   },
   {
      name: "History",
      relativePath: "/history",
   },
   {
      name: "Tracker",
      relativePath: "/tracker",
   },
];

export { links as profileNavigationLinks };

export default function LayoutNavigation() {
   const params = useParams<{ profile: string }>();

   const location = useLocation();

   return (
      <nav className={css.links}>
         {links.map((link) => {
            const to = `/profile/${encodeURI(params.profile || "")}${link.relativePath}`;
            return (
               <Link
                  to={to}
                  key={to}
                  className={clsx(css.link, location.pathname === to && css.active)}
               >
                  {link.name}
               </Link>
            );
         })}
      </nav>
   );
}
