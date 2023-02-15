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
      this.headerPlaceholder = createRef(null);
      this.buttonText = createRef(null);

      this.toggleWidth = this.toggleWidth.bind(this);

      /**
       * true = expanded
       * false = collapsed
       */
      this.width = true;
   }


   toggleWidth() {

      if (this.width === true) {
         this.header.current.classList.add(css.collapsed);
         this.headerPlaceholder.current.classList.add(css.collapsed);

         this.buttonText.current.innerText = "Ellapse";

         this.width = false;
      } else {
         this.header.current.classList.remove(css.collapsed);
         this.headerPlaceholder.current.classList.remove(css.collapsed);

         this.buttonText.current.innerText = "Collapse";

         this.width = true;
      }

   }


   render() {

      return <>
         <section className={css.headerPlaceholder} ref={this.headerPlaceholder}>
            <nav className={css.header} id="header" ref={this.header}>

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

                  <Link href="/challenges">
                     <FontAwesomeIcon
                        icon={faCompass}
                     />
                     <p>Challenges</p>
                  </Link>

                  <Link href="/challenges/0">
                     <FontAwesomeIcon
                        icon={faRankingStar}
                     />
                     <p>Leaderboards</p>
                  </Link>

                  <Link href="/titles">
                     <FontAwesomeIcon
                        icon={faAward}
                     />
                     <p>Titles</p>
                  </Link>

                  <Link href="/communities">
                     <FontAwesomeIcon
                        icon={faUserGroup}
                     />
                     <p>Communities</p>
                  </Link>

                  <Link href="/settings">
                     <FontAwesomeIcon
                        icon={faGear}
                     />
                     <p>Settings</p>
                  </Link>

               </div>

               <div className={css.footer}>

                  <button type="button" onClick={this.toggleWidth}>
                     <FontAwesomeIcon
                        icon={faChevronLeft}
                     />
                     <p ref={this.buttonText}>Collapse</p>
                  </button>

               </div>

            </nav>
         </section>
      </>;

   }
}