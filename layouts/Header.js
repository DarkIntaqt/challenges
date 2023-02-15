import { Component, createRef } from "react";
import css from "challenges/styles/header.module.scss";

import Link from "next/link";
import Logo from "challenges/assets/logo.svg";

export class Header extends Component {
   constructor() {
      super();

      this.header = createRef(null);
   }


   render() {

      return <nav className={css.header} id="header" ref={this.header}>

         <Link href="/" >
            <p>Challenge Tracker</p>
         </Link>

         <div className={css.scrollSection}>

            <Link href="/">
               <i className="fa-solid fa-house"></i>
               <p>Home</p>
            </Link>

            <Link href="/challe nges">
               <i className="fa-solid fa-compass"></i>
               <p>Challenges</p>
            </Link>

            <Link href="/">
               <i className="fa-solid fa-ranking-star"></i>
               <p>Leaderboards</p>
            </Link>

            <Link href="/">
               <i className="fa-solid fa-award"></i>
               <p>Titles</p>
            </Link>

            <Link href="/">
               <i className="fa-solid fa-user-group"></i>
               <p>Communities</p>
            </Link>

            <Link href="/">
               <i className="fa-solid fa-gear"></i>
               <p>Settings</p>
            </Link>

         </div>

         <div className={css.footer}>

            <button type="button">
               <i className="fa-solid fa-chevron-left"></i>
               <p>Collapse</p>
            </button>

         </div>

      </nav>;

   }
}