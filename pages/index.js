import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "challenges/styles/index.module.scss";
import { Component, createRef } from "react";
import Head from "next/head";

export default class Start extends Component {
   constructor() {
      super();


      // SELECT EFFECT
      this.searchbarInput = createRef(null);
      this.searchbarArea = createRef(null);

      this.handleFocus = this.handleFocus.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
   }

   handleFocus() {
      this.searchbarArea.current.classList.add(css.active);
   }

   handleBlur() {
      this.searchbarArea.current.classList.remove(css.active);
   }

   componentDidMount() {



      try {
         this.searchbarInput.current.addEventListener("focus", this.handleFocus);
         this.searchbarInput.current.addEventListener("blur", this.handleBlur);
      } catch (e) {
         console.warn(e);
      }

   }


   render() {
      const images = [
         [131, "splashCentered", 47], /* anivia */
         [254, "splash", 29], /* arcane vi */
         [38, "splash", 14], /* arcane kassadin */
         [43, "splash", 7], /* red eye karma */
         [2, "splash", 25], /* olaf */
         [432, "splash", 8], /* astronaut bard */
         [104, "splash", 5], /* pool party graves */
         [114, "splash", 1], /* fiora */
         [131, "splash", 26], /* divine diana */
         [60, "splash", 6], /* halloween elise */
         [24, "splash", 13], /* jax */
         [78, "splash", 14] /* xmas poppy */
      ];

      // set the image based on the month
      const image = images[new Date().getMonth()];


      return <>

         <Head>
            <title>League of Legends Challenge Tracker and Progress Lookup</title>
         </Head>

         <div className={css.start}>

            <div className={css.bgwrapper} style={{
               backgroundImage: `url(https://lolcdn.darkintaqt.com/cdn/champion/${image[0]}/${image[2]}/${image[1]})`
            }}>
            </div>

            <div className={css.wrapper}>

               <div className={css.heading}>

                  <span>League of Legends</span>
                  <h1>Challenge Tracker</h1>

               </div>

               <div ref={this.searchbarArea} className={css.searchbarWrapper}>

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

               </div>

            </div>

         </div>
      </>;
   }
}