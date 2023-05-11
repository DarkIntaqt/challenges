"use client";

import { RefObject, createRef, useEffect } from "react";
import Link from "next/link";

import css from "challenges/styles/Sidebar.module.scss";

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

/**
 * Use the storage handler to store the position of the sidebar
 */
import { storageKeys, getStorage, setStorage } from "challenges/utils/localStorageFunctions";
import { usePathname } from "next/navigation";


export default function Sidebar() {

   const path = usePathname();

   let width = true;

   let header: RefObject<HTMLElement> = createRef();
   let headerPlaceholder: RefObject<HTMLDivElement> = createRef();
   let buttonText: RefObject<HTMLParagraphElement> = createRef();

   /**
     * changes the width of the sidebar
     * @param {boolean} forced if forces: don't change the users preference
     */
   function toggleWidth(forced = false) {

      if (!buttonText.current || !header.current || !headerPlaceholder.current) { return; }

      if (width === true) {
         header.current.classList.add(css.collapsed);
         headerPlaceholder.current.classList.add(css.collapsed);

         buttonText.current.innerText = "Ellapse";

         width = false;
      } else {
         header.current.classList.remove(css.collapsed);
         headerPlaceholder.current.classList.remove(css.collapsed);

         buttonText.current.innerText = "Collapse";

         width = true;
      }

      if (forced !== true) {
         setStorage(storageKeys.headerPosition, width.toString());
      }
   }


   /**
    * Highlights the current route by adding a the 
    * css.active class
    */
   function highlightActiveLink() {

      const pathname = path;

      const results = document.querySelectorAll(`.${css.scrollSection} a[href="${pathname}"]`);
      const oldRouteElements = document.querySelectorAll(`.${css.scrollSection} a.${css.active}`);

      for (let i = 0; i < oldRouteElements.length; i++) {
         const old = oldRouteElements[i];
         old.classList.remove(css.active);

      }

      for (let i = 0; i < results.length; i++) {
         const result = results[i];
         result.classList.add(css.active);
      }

   }

   useEffect(() => {


      highlightActiveLink();
      //router.events.on("routeChangeComplete", highlightActiveLink);
      //router.events.on("routeChangeError", highlightActiveLink);
      // router events aren't available in next13

      if (window) {

         if (getStorage(storageKeys.headerPosition, width.toString()) !== width.toString()) {
            toggleWidth(true);
         } else if (window.innerWidth < 1200 && width === true) {
            toggleWidth();
         }

         /**
          * Add a timeout to add the width-transition after the
          * page has loaded and the
          */
         setTimeout(() => {

            if (!header.current || !headerPlaceholder.current) { return; }
            header.current.classList.add(css.mounted);
            headerPlaceholder.current.classList.add(css.mounted);
         }, 250);
      }

   });

   return <>
      <section className={`${css.headerPlaceholder}`} ref={headerPlaceholder}>
         <nav className={`${css.header}`} id="header" ref={header}>

            <Link href="/" prefetch={false}>
               <Logo />
               <p>Challenge Tracker</p>
            </Link>

            <div className={css.scrollSection}>

               <Link href="/" prefetch={false}>
                  <FontAwesomeIcon
                     icon={faHouse}
                  />

                  <p>Home</p>
               </Link>

               <Link href="/challenges" prefetch={false}>
                  <FontAwesomeIcon
                     icon={faCompass}
                  />
                  <p>Challenges</p>
               </Link>

               <Link href="/challenges/0" prefetch={false}>
                  <FontAwesomeIcon
                     icon={faRankingStar}
                  />
                  <p>Leaderboards</p>
               </Link>

               <Link href="/titles" prefetch={false}>
                  <FontAwesomeIcon
                     icon={faAward}
                  />
                  <p>Titles</p>
               </Link>

               <Link href="/communities" prefetch={false}>
                  <FontAwesomeIcon
                     icon={faUserGroup}
                  />
                  <p>Communities</p>
               </Link>

               <Link href="/settings" prefetch={false}>
                  <FontAwesomeIcon
                     icon={faGear}
                  />
                  <p>Settings</p>
               </Link>

            </div>

            <div className={css.footer}>

               <button type="button" onClick={() => { toggleWidth(); }}>
                  <FontAwesomeIcon
                     icon={faChevronLeft}
                  />
                  <p ref={buttonText}>Ellapse</p>
               </button>

            </div>

         </nav>
      </section>
   </>;

}

