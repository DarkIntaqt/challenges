import { Component, createRef } from "react";
import css from "challenges/styles/header.module.scss";

import Link from "next/link";
import Logo from "challenges/assets/logo.svg";


// FontAwesome
import {
   faHouse,
   faCompass,
   faRankingStar,
   faAward,
   faUserGroup,
   faGear,
   faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export class Header extends Component {
   constructor() {
      super();

      this.header = createRef(null);
   }


   render() {

      return <nav className={css.header} id="header" ref={this.header}>

         <Link href="/" >
            <Logo />
            <p>Challenge Tracker</p>
         </Link>

         <div className={css.scrollSection}>

            <Link href="/">
               <FontAwesomeIcon
                  icon={faHouse}
               />

               <p>Home</p>
            </Link>

            <Link href="/challe nges">
               <FontAwesomeIcon
                  icon={faCompass}
               />
               <p>Challenges</p>
            </Link>

            <Link href="/">
               <FontAwesomeIcon
                  icon={faRankingStar}
               />
               <p>Leaderboards</p>
            </Link>

            <Link href="/">
               <FontAwesomeIcon
                  icon={faAward}
               />
               <p>Titles</p>
            </Link>

            <Link href="/">
               <FontAwesomeIcon
                  icon={faUserGroup}
               />
               <p>Communities</p>
            </Link>

            <Link href="/">
               <FontAwesomeIcon
                  icon={faGear}
               />
               <p>Settings</p>
            </Link>

         </div>

         <div className={css.footer}>

            <button type="button">
               <FontAwesomeIcon
                  icon={faChevronLeft}
               />
               <p>Collapse</p>
            </button>

         </div>

      </nav>;

   }
}