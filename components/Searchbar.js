import Image from "next/image";
import Link from "next/link";
import { Component, createRef } from "react";

import css from "challenges/styles/index.module.scss";

import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


/**
 * @typedef CardProps
 * @type {Object}
 * @property {string} url
 * @property {string} title
 * @property {string} image
 */


/**
 * Returns the corresponding card for the searchBar
 * @param {CardProps} props 
 * @returns 
 */
function Card({ url, title, image }) {
   return <Link href={url} className={css.card} prefetch={false}>
      <div className={css.inner}>
         <div className={css.content}>
            <Image
               src={image}
               height={60}
               width={60}
               alt=""
               unoptimized
            />
         </div>
      </div>
      <p>
         {title}
      </p>
   </Link>;
}


/**
 * fix a safari bug where the height of a backdrop-element 
 * needs to be at least 1. 
 * otherwise, the background is not shown
 */
const empty = <div style={{ height: "1px" }}></div>;


export default class Searchbar extends Component {
   constructor() {
      super();
      this.defaultRegion = "na1"; // change within componentDidMount to localstorage.default


      this.searchbarInput = createRef(null); // .searchbar
      this.searchbarArea = createRef(null); // .searchbarWrapper

      this.contentService = new ContentService(); // serving challenge and profile images

      this.handleFocus = this.handleFocus.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.search = this.search.bind(this);

      this.focus = false; // searchbar is focussed
      this.visible = false; // component is rendered

      this.state = {
         challenges: {},
         titles: {},
         results: empty
      };
   }


   /**
    * adds the "active" class if the searchbar is focussed
    */
   handleFocus() {
      this.focus = true;
      this.searchbarArea.current.classList.add(css.active);
   }


   /**
    * removes the "active" class if the searchbar is no longer focussed
    */
   handleBlur() {
      this.focus = false;

      setTimeout(() => {
         if (this.focus === false && this.visible === true) {
            this.searchbarArea.current.classList.remove(css.active);
         }
      }, 125);
   }


   /**
    * sets the state to the current search results
    * @param {Object} e - keyup event
    * @returns null
    */
   search(e) {
      const value = e.target.value.toLowerCase();

      if (value.length === 0) {
         /**
          * set to default state, like last X users searched
          */
         return;
      }

      var challenges = this.state.challenges.map((challenge) => {

         if (!challenge.name.toLowerCase().startsWith(value)) {
            return null;
         }

         return <Card
            key={challenge.id}
            title={challenge.name}
            url={"/challenges/" + challenge.id}
            image={this.contentService.getChallengeTokenIcon(challenge.id)}
         />;

      }).filter(x => !!x);

      if (challenges.length === 0) {
         this.setState({
            results: empty
         });
         return;
      }

      if (challenges.length > 6) {
         challenges = challenges.slice(0, 6);
      }


      this.setState({
         results:
            <div className={css.category}>
               <p>Challenges</p>
               <div>
                  {challenges}
               </div>
            </div>
      });
   }

   async componentDidMount() {

      this.visible = true;

      try {
         this.searchbarInput.current.addEventListener("focus", this.handleFocus);
         this.searchbarInput.current.addEventListener("blur", this.handleBlur);

         this.searchbarInput.current.addEventListener("keyup", this.search);
      } catch (e) {
         console.warn(e);
      }

      const challengeService = new ChallengeService();

      const all = await challengeService.listAll(this.defaultRegion, "en_US");
      // TODO: Error Handling is missing here

      this.setState({
         challenges: Object.keys(all.challenges).map((k) => all.challenges[k]),
         titles: all.titles
      });

   }

   componentWillUnmount() {
      this.visible = false;
   }


   render() {


      return <div ref={this.searchbarArea} className={css.searchbarWrapper}>

         <div className={css.searchbar}>

            <input ref={this.searchbarInput} placeholder="Search for a summoner, challenge, title"></input>

            <select>
               <option value="br">BR</option>
               <option value="euw">EUW</option>
               <option value="eune">EUNE</option>
               <option value="jp">JP</option>
               <option value="kr">KR</option>
               <option value="lan">LAN</option>
               <option value="las">LAS</option>
               <option value="na">NA</option>
               <option value="oc">OC</option>
               <option value="ru">RU</option>
               <option value="tr">TR</option>
            </select>

            <FontAwesomeIcon
               icon={faMagnifyingGlass}
            />

         </div>

         {/* Position absolute, does not interfere the initial layout*/}
         <div className={css.results}>
            {this.state.results}
         </div>

      </div>;
   }
}