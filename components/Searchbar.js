import Image from "next/image";
import Link from "next/link";
import { Component, createRef } from "react";

import css from "challenges/styles/index.module.scss";

import ChallengeService from "challenges/services/ChallengeService";
import ContentService from "challenges/services/ContentService";
import UserService from "challenges/services/UserService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getStorage, setStorage, storageKeys } from "challenges/utils/localStorageFunctions";
import getPlatform from "challenges/utils/platform";
import { withRouter } from "next/router";

/**
 * @typedef CardProps
 * @type {Object}
 * @property {string} url - required
 * @property {string} title - required
 * @property {string} image - required
 * @property {boolean} round - default : true
 * @property {string} tag - default: ""
 * @property {boolean} imageAsBackground - default: false
 * @property {boolean} loader - default: false
 */


/**
 * Returns the corresponding card for the searchBar
 * @param {CardProps} props 
 * @returns 
 */
function Card({ url, title, image, round = false, tag = "", imageAsBackground = false, loader = false }) {
   return <Link href={url} className={css.card} prefetch={false}>
      <div className={css.inner}>
         {/* set a background */}
         {imageAsBackground === true ?
            <div className={css.bg} style={{
               backgroundImage: `url(${image})`
            }}></div>
            : <></>}
         <div className={css.content}>
            {/* Show a loader around the image */}
            {loader === true && title.length >= 3 ?
               <div className={css.loader} />
               : <></>}
            <Image
               src={image}
               height={60}
               width={60}
               alt=""
               unoptimized
               className={round === true ? css.round : ""}
            />
         </div>
      </div>
      <p>
         {title}
         {tag !== "" ?
            <span>{tag}</span>
            : <></>
         }
      </p>
   </Link>;
}


/**
 * fix a safari bug where the height of a backdrop-element 
 * needs to be at least 1. 
 * otherwise, the background is not shown
 */
const empty = <div style={{ height: "1px" }}></div>;


class Searchbar extends Component {
   constructor(props) {
      super(props);

      this.router = props.router;
      this.defaultRegion = "na"; // change within componentDidMount to localstorage.default


      this.searchbarInput = createRef(null); // .searchbar
      this.searchbarArea = createRef(null); // .searchbarWrapper
      this.select = createRef(null); // server selector

      this.contentService = new ContentService(); // serving challenge and profile images
      this.userService = new UserService();

      this.handleFocus = this.handleFocus.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.search = this.search.bind(this);
      this.change = this.change.bind(this);

      this.recentlySearched = [];
      this.focus = false; // searchbar is focussed
      this.visible = false; // component is rendered
      this.value = "";

      this.state = {
         challenges: [],
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
   async search(e) {

      const value = e.target.value.toLowerCase();
      if (e.key === "Enter") {
         this.router.push(`/profile/${getPlatform(this.defaultRegion)}/${value}`);
         return;
      }


      // nothing changed
      if (this.value === value) {
         return;
      }

      this.value = value;

      let state = empty;

      if (value.length === 0) {
         /**
          * set to default state, like last X users searched
          */
         this.setState({
            results: this.recentlySearched
         });
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
         state = <div className={css.category}>
            <p>Summoner</p>
            <div>
               <Card
                  title={value}
                  url={`/profile/${getPlatform(this.defaultRegion)}/${value}`}
                  round
                  loader
                  imageAsBackground
                  tag={this.defaultRegion}
                  image={this.contentService.getProfileIcon(29)}
               />
            </div>
         </div>;
      } else {

         if (challenges.length > 6) {
            challenges = challenges.slice(0, 6);
         }

         state = <>
            <div className={css.category}>
               <p>Summoner</p>
               <div>
                  <Card
                     title={value}
                     url={`/profile/${getPlatform(this.defaultRegion)}/${value}`}
                     round
                     loader
                     imageAsBackground
                     tag={this.defaultRegion}
                     image={this.contentService.getProfileIcon(29)}
                  />
               </div>
            </div>
            <div className={css.category}>
               <p>Challenges</p>
               <div>
                  {challenges}
               </div>
            </div>
         </>;

      }

      this.setState({ results: state });

      const notFound = () => {
         this.setState({
            results:
               <> <div className={css.category}>
                  <p>Summoner</p>
                  <div>
                     <Card
                        title={value}
                        url={`/profile/${getPlatform(this.defaultRegion)}/${value}`}
                        round
                        imageAsBackground
                        tag={`${this.defaultRegion}`}
                        image={this.contentService.getProfileIcon(29)}
                     />
                  </div>
               </div>
                  {
                     challenges.length > 0 ?
                        <div className={css.category}>
                           <p>Challenges</p>
                           <div>
                              {challenges}
                           </div>
                        </div> : <></>
                  }
               </>
         });
      };

      /**
       * Lookup (prelaod) the user:
       * if name entered has at least 3 characters
       * AND nothing new was entered in 500ms
       */
      if (value.length >= 3) {
         setTimeout(async () => {
            /**
             * check if value hasnt changed
             */
            if (value === e.target.value.toLowerCase()) {
               try {
                  /**
                   * fetch user and check again if nothing new was searched
                   */
                  const user = await this.userService.getUser(value, getPlatform(this.defaultRegion));

                  if (value === e.target.value.toLowerCase()) {
                     if (typeof user.name !== "undefined") {
                        this.setState({
                           results: <><div className={css.category}>
                              <p>Summoner</p>
                              <div>
                                 <Card
                                    title={user.name}
                                    url={`/profile/${getPlatform(this.defaultRegion)}/${value}`}
                                    round
                                    imageAsBackground
                                    tag={this.defaultRegion}
                                    image={this.contentService.getProfileIcon(user.icon)}
                                 />
                              </div>
                           </div>
                              {challenges.length > 0 ?
                                 <div className={css.category}>
                                    <p>Challenges</p>
                                    <div>
                                       {challenges}
                                    </div>
                                 </div> : <></>}
                           </>
                        });
                     } else {
                        if (value === e.target.value.toLowerCase()) {
                           notFound();
                        }
                     }
                  }
               } catch (e) {
                  /**
                   * Fetch failed. Most likely only a CORS issue due to local development
                   */
                  console.warn(e);
                  notFound();
               }
            }
         }, 500);
      }
   }


   /**
    * changes the region, simulate a content change
    * @param {Object} e - onChange event
    */
   change(e) {
      const region = e.currentTarget.options[e.currentTarget.selectedIndex].value;

      this.defaultRegion = region;
      setStorage(storageKeys.defaultRegion, region);
      this.value = "";

      this.search({
         target: this.searchbarInput.current,
         key: "Space"
      });
   }

   async componentDidMount() {

      this.visible = true;

      /**
       * get default region and set it
       */
      this.defaultRegion = getStorage(storageKeys.defaultRegion, this.defaultRegion);
      for (let i = 0; i < this.select.current.options.length; i++) {
         const element = this.select.current.options[i];
         if (element.value === this.defaultRegion) {
            element.selected = "selected";
            break;
         }
      }


      try {
         this.searchbarInput.current.addEventListener("focus", this.handleFocus);
         this.searchbarInput.current.addEventListener("blur", this.handleBlur);
         this.select.current.addEventListener("change", this.change);

         this.searchbarInput.current.addEventListener("keyup", this.search);
      } catch (e) {
         console.warn(e);
      }


      /**
       * Parses and generates the "recently searched object"
       */
      const recentlySearched = getStorage(storageKeys.recentlySearched, []);
      if (recentlySearched.length > 0) {
         let recentCards = [];

         for (let i = 0; i < recentlySearched.length; i++) {
            const user = recentlySearched[i];
            recentCards.push(<Card key={i}
               title={user[1]}
               url={`/profile/${getPlatform(user[0])}/${user[1]}`}
               round
               imageAsBackground
               tag={user[0]}
               image={this.contentService.getProfileIcon(user[2])}
            />);
         }

         this.recentlySearched = <div className={css.category}>
            <p>Recently searched</p>
            <div>
               {recentCards}
            </div>
         </div>;

         this.setState({
            results: this.recentlySearched
         });
      }

      const challengeService = new ChallengeService();

      const all = await challengeService.listAll(getPlatform(this.defaultRegion), "en_US");
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

            <select ref={this.select} id={css.select}>
               <option value="br">BR</option>
               <option value="euw">EUW</option>
               <option value="eune">EUNE</option>
               <option value="jp">JP</option>
               <option value="kr">KR</option>
               <option value="lan">LAN</option>
               <option value="las">LAS</option>
               <option value="na">NA</option>
               <option value="oc">OC</option>
               <option value="ph">PH</option>
               <option value="ru">RU</option>
               <option value="sg">SG</option>
               <option value="th">TH</option>
               <option value="tr">TR</option>
               <option value="tw">TW</option>
               <option value="vn">VN</option>
            </select>

            <FontAwesomeIcon
               onClick={() => this.search({
                  target: this.searchbarInput.current,
                  key: "Enter"
               })}
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

export default withRouter(Searchbar);