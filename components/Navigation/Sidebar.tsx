export type SidebarConfig = "HIDDEN" | "VISIBLE";
import { MouseEventHandler } from "react";

import css from "./sidebar.module.scss";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight, faHome, faList, faRankingStar } from "@fortawesome/free-solid-svg-icons";
import NavLink from "./NavLink";
import Logo from "challenges/assets/logo.svg";

export default function Sidebar({
   toggleSidebar,
   view
}: Readonly<{
   toggleSidebar: Function,
   view: SidebarConfig
}>) {

   return <div className={`${css.sidebar} ${view === "HIDDEN" ? null : css.ellapsed}`}>

      <div className={css.content}>

         <NavLink href="/" ignore={true}>
            <Logo />
            <p className={css.title}>Challenges Tracker</p>
         </NavLink>

         <NavLink href="/">
            <FontAwesomeIcon icon={faHome} />
            <p>Home</p>
         </NavLink>

         <NavLink href="/challenges">
            <FontAwesomeIcon icon={faList} />
            <p>Challenges</p>
         </NavLink>

         <NavLink href="/challenges/0">
            <FontAwesomeIcon
               icon={faRankingStar}
            />
            <p>Leaderboard</p>
         </NavLink>

         <button className={css.toggle} onClick={toggleSidebar as MouseEventHandler}>
            {
               view === "HIDDEN" ? <>
                  <FontAwesomeIcon icon={faAnglesRight} />
                  <p>Ellapse</p>
               </> : <>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                  <p>Collapse</p>
               </>
            }
         </button>

      </div>

   </div>;

}