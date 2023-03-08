import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChallengeService from "challenges/services/ChallengeService";
import css from "challenges/styles/index.module.scss";
import { Component, createRef } from "react";

export default class Searchbar extends Component {
   constructor() {
      super();

      this.defaultRegion = "na1";

      // SELECT EFFECT
      this.searchbarInput = createRef(null);
      this.searchbarArea = createRef(null);

      this.handleFocus = this.handleFocus.bind(this);
      this.handleBlur = this.handleBlur.bind(this);

      this.state = {
         challenges: {}
      };
   }

   handleFocus() {
      this.searchbarArea.current.classList.add(css.active);
   }

   handleBlur() {
      this.searchbarArea.current.classList.remove(css.active);
   }

   async componentDidMount() {

      try {
         this.searchbarInput.current.addEventListener("focus", this.handleFocus);
         this.searchbarInput.current.addEventListener("blur", this.handleBlur);
      } catch (e) {
         console.warn(e);
      }

      const challengeService = new ChallengeService();

      const all = await challengeService.listAll(this.defaultRegion, "en_US");
      // TODO: Error Handling is missing here

      this.setState({
         challenges: all.challenges,
         titles: all.titles
      });

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

      </div>;
   }
}