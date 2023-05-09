import css from "../css/survey.module.css"
import { getCookie, setCookie } from "../func/cookiefunctions";

export default function Survey() {

   function close() {
      document.getElementById("survey").remove();
      setCookie("tookPartInSurvey", "yes");
   }

   if (getCookie("_CtookPartInSurvey") === "yes") {
      return <></>;
   } else {
      return <div className={css.survey} id="survey" data-nosnippet>
         <i className="fa-solid fa-xmark" onClick={close}></i>
         <p className={css.title}>Survey about challenges</p>
         <p className={css.description}>Take part in this quick and anonymous survey about the Challenge system. </p>
         <a href="https://docs.google.com/forms/d/e/1FAIpQLSeYZ4e_tx2HTf3_tN697Vp0bdcrCL6-yiqwUTP7eghVgOBFaw/viewform" target="_blank" rel="noreferrer">Survey (Google Forms)</a>
      </div>
   }
}