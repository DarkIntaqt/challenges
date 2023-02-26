import css from "../../styles/challenges.module.scss";
import userCss from "../../styles/user.module.scss";
import filterCss from "../../styles/filter.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";

export default function Challenges() {
   return <div className={"object1000"}>
      <Head>
         <title>All League of Legends Challenges Overview</title>
      </Head>
      <div className={css.heading}>
         <h1>List of all challenges</h1>
         <h2>Overview and how to obtain them</h2>
      </div>

      <section className={userCss.parent}>

      </section>

      <input 
         className={filterCss.input}
         type="search"
         placeholder="Search for a challenge"/>
      <div className={filterCss.filter}>
         <div className={filterCss.selectors + " clearfix"}>
            <div className={filterCss.displayMode}>
               <button id="compact" className={filterCss["cmode" + window.compactMode] + " " + filterCss.modetrue}>
                  <FontAwesomeIcon icon="fa-solid fa-list"/>
               </button>
               <button id="full" className={filterCss["cmode" + window.compactMode] + " " + filterCss.modefalse}>
                  <FontAwesomeIcon icon="fa-solid fa-table-cells"/>
               </button>
            </div>
            <p className={filterCss.info}>Filter (multiple choices)</p>
            <div className={filterCss.category} category="category">
               <p className={filterCss.cheading}>Category</p>
               {/* Add buttons here */}
            </div>

            <div className={filterCss.category} category="type">
               <p className={filterCss.cheading}>Type</p>
               {/* Add buttons here */}
            </div>

            <div className={filterCss.category} category="gamemode">
               <p className={filterCss.cheading}>Gamemode</p>
               {/* Add buttons here */}
            </div>
         </div>
      </div>

      <div className={userCss.parent + " " + userCss.flexWidth}>
         <p style={{
               color: "white",
               fontSize: "1rem",
               margin: "120px 0",
               textAlign: "center",
               width: "100%",
               float: "left"}}>
            <i>Is it a bug? Is it a feature?</i>
            <br/><br/>No! There are just no challenges within the current filters.
            <br/>Maybe the challenges aren&apos;t released yet? 
         </p>
      </div>
   </div>;
}