import { Component, createRef } from "react";
import { withRouter } from "next/router";
import Link from "next/link";

import css from "challenges/styles/header.module.scss";

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
import { getStorage, setStorage, storageKeys } from "challenges/utils/localStorageFunctions";


class Header extends Component {
   constructor(props) {
      super(props);

      this.props = props;

      this.header = createRef(null);
      this.headerPlaceholder = createRef(null);
      this.buttonText = createRef(null);

      /**
       * true = expanded
       * false = collapsed
      */
      this.width = true;


      this.toggleWidth = this.toggleWidth.bind(this);
      this.highlightActiveLink = this.highlightActiveLink.bind(this);
   }


   toggleWidth(forced = false) {

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

      if (forced !== true) {
         setStorage(storageKeys.headerPosition, this.width.toString());
      }
   }


   /**
    * Highlights the current route by adding a the 
    * css.active class
    */
   highlightActiveLink() {

      const pathname = this.props.router.asPath;

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


   componentDidMount() {

      this.props.router.events.on("routeChangeComplete", this.highlightActiveLink);
      this.props.router.events.on("routeChangeError", this.highlightActiveLink);
      this.highlightActiveLink();

      /**
       * Handle the default position of the sidebar
       * First, check if the sidebar position was already set
       * If not, check if the window width is smaller than 1200px
       */
      if (window) {

         if (getStorage(storageKeys.headerPosition, this.width.toString()) !== this.width.toString()) {
            this.toggleWidth(true);
         } else if (window.innerWidth < 1200 && this.width === true) {
            this.toggleWidth();
         }

         /**
          * Add a timeout to add the width-transition after the
          * page has loaded and the
          */
         setTimeout(() => {
            this.header.current.classList.add(css.mounted);
            this.headerPlaceholder.current.classList.add(css.mounted);
         }, 250);
      }
   }


   componentWillUnmount() {

      this.props.router.events.off("routeChangeComplete", this.highlightActiveLink);
      this.props.router.events.off("routeChangeError", this.highlightActiveLink);

   }


   render() {


      return <>
         <section className={`${css.headerPlaceholder}`} ref={this.headerPlaceholder}>
            <nav className={`${css.header}`} id="header" ref={this.header}>

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

                  <button type="button" onClick={this.toggleWidth}>
                     <FontAwesomeIcon
                        icon={faChevronLeft}
                     />
                     <p ref={this.buttonText}>Ellapse</p>
                  </button>

               </div>

            </nav>
         </section>
      </>;

   }
}

export default withRouter(Header);