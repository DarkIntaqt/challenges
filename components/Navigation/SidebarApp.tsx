"use client";

import { parseCookies, setCookie } from "nookies";
import { MouseEventHandler, ReactNode, useState } from "react";
import { faAnglesLeft, faAnglesRight, faHome, faList, faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Logo from "challenges/assets/logo.svg";
import { SidebarConfig } from "challenges/types/general.types";
import NavLinkApp from "./NavLinkApp";

import css from "./sidebar.module.scss";

export default function SidebarApp(): ReactNode {
   const cookies = parseCookies();
   const [sidebarState, setSidebar] = useState<SidebarConfig>((cookies.sidebar as SidebarConfig) || "VISIBLE");

   function toggleSidebar() {
      const setTo = sidebarState === "HIDDEN" ? "VISIBLE" : "HIDDEN";
      setSidebar(setTo);
      setCookie(null, "sidebar", setTo);
   }

   return (
      <div className={`${css.sidebar} ${sidebarState === "HIDDEN" ? null : css.ellapsed}`}>
         <div className={css.content}>
            <NavLinkApp href="/" ignore={true}>
               <Logo />
               <p className={css.title}>Challenges Tracker</p>
            </NavLinkApp>

            <NavLinkApp href="/">
               <FontAwesomeIcon icon={faHome} />
               <p>Home</p>
            </NavLinkApp>

            <NavLinkApp href="/challenges">
               <FontAwesomeIcon icon={faList} />
               <p>Challenges</p>
            </NavLinkApp>

            <NavLinkApp href="/challenges/0">
               <FontAwesomeIcon icon={faRankingStar} />
               <p>Challenges</p>
            </NavLinkApp>

            <button className={css.toggle} onClick={toggleSidebar as MouseEventHandler}>
               {sidebarState === "HIDDEN" ? (
                  <>
                     <FontAwesomeIcon icon={faAnglesRight} />
                     <p>Expand</p>
                  </>
               ) : (
                  <>
                     <FontAwesomeIcon icon={faAnglesLeft} />
                     <p>Collapse</p>
                  </>
               )}
            </button>
         </div>
      </div>
   );
}
