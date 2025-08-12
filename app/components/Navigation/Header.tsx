import clsx from "clsx";
import { type ReactNode, useEffect, useState } from "react";
import { FaAward, FaCompass } from "react-icons/fa6";
import { Link, useMatch, useMatches } from "react-router";
import logo from "@cgg/assets/logo.svg?no-inline";
import { brandName } from "@cgg/config/config";
import Container from "../Container/Container";
import { CapstoneIcon, TitleIcon } from "../Icons";
import css from "./header.module.scss";

type HeaderLink = {
   to: string;
   label: string;
   icon?: ReactNode;
};

const links: HeaderLink[] = [
   {
      to: "/titles",
      label: "Titles",
      icon: <TitleIcon />,
   },
   {
      to: "/challenges",
      label: "Challenges",
      icon: <CapstoneIcon />,
   },
];

export default function Header() {
   const matches = useMatches();
   const [hideHeader, setHideHeader] = useState(true);

   const transparentHeader = matches.some(
      (match) => (match.handle as Record<string, any>)?.transparentHeader,
   );

   useEffect(() => {
      const handleScroll = () => {
         setHideHeader(window.scrollY < 125);
      };

      window.addEventListener("scroll", handleScroll);

      // Well this shouldnt happen, just in case
      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);

   return (
      <header
         className={clsx(css.header, transparentHeader && hideHeader && css.transparent)}
      >
         <Container center flex large className={css.content}>
            <Link to="/" className={clsx(css.link, css.logo)}>
               <img src={logo} alt={`${brandName} logo`} />
               <span>{brandName}</span>
            </Link>

            {links.map((link) => {
               const isActive = useMatch(link.to);
               return (
                  <Link
                     key={link.to}
                     to={link.to}
                     className={clsx(css.link, isActive && css.active)}
                  >
                     {link.icon && link.icon}
                     <span>{link.label}</span>
                  </Link>
               );
            })}
         </Container>
      </header>
   );
}
